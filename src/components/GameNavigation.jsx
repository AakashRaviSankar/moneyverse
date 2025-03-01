import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import config from '../config';
import {getUserData} from '../utils/helper';

const GameNavigation = () => {
  const navigation = useNavigation();
  const [cooldowns, setCooldowns] = useState({});
  const [taskData, setTaskData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const initializeCooldowns = useCallback(async () => {
    setIsLoading(true); // Start loading
    try {
      const userData = await getUserData();
      const tasks = ['math', 'spin', 'link'];
      const responses = await Promise.all(
        tasks.map(task =>
          axios.get(
            `${config.Base}/cooldown/status?userId=${userData?.userId}&task=${task}`,
            {
              headers: {Authorization: `Bearer ${userData?.accessToken}`},
            },
          ),
        ),
      );

      const now = Date.now();
      const updatedCooldowns = {};
      const updatedTaskData = {};

      tasks.forEach((task, index) => {
        const {cooldownEnds, numbers} = responses[index].data;
        updatedCooldowns[task] = Math.max(
          Math.floor((cooldownEnds - now) / 1000),
          0,
        );
        updatedTaskData[task] = numbers || [];
      });

      setCooldowns(updatedCooldowns);
      setTaskData(updatedTaskData);
    } catch (error) {
      console.error('Error fetching cooldowns:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  }, []);

  useEffect(() => {
    initializeCooldowns();
    const interval = setInterval(() => {
      setCooldowns(prevCooldowns => {
        const updatedCooldowns = {};
        Object.keys(prevCooldowns).forEach(task => {
          updatedCooldowns[task] = Math.max(prevCooldowns[task] - 1, 0);
        });
        return updatedCooldowns;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [initializeCooldowns]);

  const formatTime = seconds => {
    if (seconds <= 0) return '00:00:00';
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const renderButton = (label, gameKey, navigateTo) => {
    const remainingTime = cooldowns[gameKey] || 0;
    const isLocked = remainingTime > 0;

    return (
      <Pressable
        style={({pressed}) => [
          styles.button,
          isLocked && styles.disabledButton,
          pressed && !isLocked && styles.pressedButton,
        ]}
        onPress={() =>
          navigation.replace(navigateTo, {numbers: taskData[gameKey]})
        }
        disabled={isLocked || isLoading}>
        <Text style={styles.buttonText}>{label}</Text>
        {isLocked && (
          <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFD700" />
      ) : (
        <>
          {renderButton('Math Game', 'math', 'MathGame')}
          {renderButton('Spinner', 'spin', 'SpinnerGame')}
          {renderButton('Link Clicking', 'link', 'LinkClicking')}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    backgroundColor: '#1A1A1D',
    paddingVertical: 10,
    height: 70,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  timerText: {
    color: '#FFD700',
    fontSize: 18,
    marginTop: 5,
  },
  pressedButton: {
    backgroundColor: '#b1b1b1',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
});

export default GameNavigation;
