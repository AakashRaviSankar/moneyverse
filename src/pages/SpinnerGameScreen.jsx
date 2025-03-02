import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AdBanner from '../components/AdBanner';
import axios from 'axios';
import config from '../config';
import {getUserData} from '../utils/helper';
import {fetchBalanceService} from '../services/walletService';
import useHandleBackButton from '../hooks/useBackNavigation';
import {useRewardedAd} from '../hooks/useRewarded';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import StartAppAd from '../utils/StartAppAds';
import StartAppBanner from '../utils/StartAppBanner';

const FortuneSpinner = () => {
  useHandleBackButton('Home');
  const spinValue = useRef(new Animated.Value(0)).current;
  const [numOfSpinsLeft, setNumOfSpinsLeft] = useState(10);
  const navigation = useNavigation();
  const [disabler, setDisabler] = useState(false);
  const [loader, setLoader] = useState(false);

  const fetchCooldowns = useCallback(async () => {
    setLoader(true);
    try {
      const userData = await getUserData();
      const response = await axios.get(
        `${config.Base}/cooldown/status?userId=${userData?.userId}&task=spin`,
        {headers: {Authorization: `Bearer ${userData?.accessToken}`}},
      );
      if (response?.data?.numbers?.length) {
        setNumOfSpinsLeft(10 - response?.data?.numbers?.length);
      }
    } catch (error) {
      console.error('Error fetching cooldowns:', error);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    fetchCooldowns();
  }, [fetchCooldowns]);

  useEffect(() => {
    if (numOfSpinsLeft === 0) {
      Alert.alert('Limit Reached', 'You have used all your spins!', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
    }
  }, [numOfSpinsLeft, navigation]);

  const updateTimer = async newSpinsLeft => {
    const userData = await getUserData();
    try {
      await axios.post(
        `${config.Base}/cooldown/add-number?userId=${userData?.userId}&number=${newSpinsLeft}&task=spin`,
        {},
        {headers: {Authorization: `Bearer ${userData?.accessToken}`}},
      );
    } catch (error) {
      console.error('Error updating timer:', error);
    }
  };

  const updateWallet = async amount => {
    const userData = await getUserData();
    const walletBalance = await fetchBalanceService();
    try {
      await axios.post(
        `${config.Base}/wallets/${userData?.userId}`,
        {balance: Number(walletBalance.balance) + amount},
        {headers: {Authorization: `Bearer ${userData?.accessToken}`}},
      );
    } catch (error) {
      console.error('Error updating wallet:', error);
    }
  };

  const spinWheel = async () => {
    setDisabler(true);

    if (numOfSpinsLeft === 0) {
      return Alert.alert('No Spins Left', 'You have reached the limit.');
    }

    const randomSpin = Math.floor(Math.random() * 100 * 360) + 720; // Ensures multiple full spins
    Animated.timing(spinValue, {
      toValue: randomSpin,
      duration: 3000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(async () => {
      const finalAngle = randomSpin % 360;
      let reward = 0.02; // Default value

      if (finalAngle >= 0 && finalAngle < 90) {
        reward = 0.05;
      } else if (finalAngle >= 90 && finalAngle < 180) {
        reward = 0.1;
      } else if (finalAngle >= 180 && finalAngle < 270) {
        reward = 0.2;
      }

      Alert.alert('Congratulations!', `You won: ₹${reward.toFixed(2)}`);

      const newSpinsLeft = numOfSpinsLeft - 1;
      setNumOfSpinsLeft(newSpinsLeft);
      StartAppAd.showRewarded();

      await updateTimer(newSpinsLeft);
      await updateWallet(reward);

      setDisabler(false);

      if (newSpinsLeft === 0) {
        setTimeout(() => navigation.navigate('Home'), 1000);
      }
    });
  };

  const spinAnimation = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StartAppBanner style={{width: '100%', height: 70}} />

      {loader ? (
        <ActivityIndicator style={styles.spinCount} color={'white'} />
      ) : (
        <>
          <View style={{position: 'relative'}}>
            <View style={styles.arrow} />

            <Text style={styles.spinCount}>{numOfSpinsLeft} /10</Text>

            <Animated.View style={{transform: [{rotate: spinAnimation}]}}>
              <Image
                source={require('../assets/wheel.png')}
                style={styles.wheel}
              />
              <Text style={[styles.quadrantText, styles.topQuadrant]}>
                0.20
              </Text>
              <Text style={[styles.quadrantText, styles.rightQuadrant]}>
                0.10
              </Text>
              <Text style={[styles.quadrantText, styles.bottomQuadrant]}>
                0.05
              </Text>
              <Text style={[styles.quadrantText, styles.leftQuadrant]}>
                0.02
              </Text>
            </Animated.View>
          </View>

          <TouchableOpacity
            onPress={spinWheel}
            disabled={disabler}
            style={styles.spinButton}>
            {!disabler ? (
              <Text style={styles.spinText}>SPIN</Text>
            ) : (
              <>
                <ActivityIndicator color={'white'} />
                <Text style={styles.spinText}>{' Please Wait...'}</Text>
              </>
            )}
          </TouchableOpacity>
        </>
      )}

      <StartAppBanner style={{width: '100%', height: 70}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#3C3D37',
    alignItems: 'center',
  },
  arrow: {
    position: 'absolute',
    bottom: -4,
    zIndex: 1,
    width: 0,
    left: '35%',
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
  },
  wheel: {
    width: 300,
    height: 300,
  },
  quadrantText: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  topQuadrant: {
    top: '20%',
    left: '30%',
    transform: [{translateX: -15}],
  },
  rightQuadrant: {
    top: '25%',
    right: '25%',
    transform: [{translateY: -15}],
  },
  bottomQuadrant: {
    bottom: '25%',
    left: '65%',
    transform: [{translateX: -15}],
  },
  leftQuadrant: {
    top: '70%',
    left: '20%',
    transform: [{translateY: -15}],
  },
  spinButton: {
    marginTop: 20,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
  },
  spinText: {
    color: 'white',
    fontWeight: 'bold',
  },
  spinCount: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
});

export default FortuneSpinner;
