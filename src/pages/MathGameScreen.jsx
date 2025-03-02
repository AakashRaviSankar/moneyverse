import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {Button, Card, Divider} from 'react-native-paper';
import {GameContext} from '../context/GameContext';
import {lockGame} from '../utils/gameRules';
import {useNavigation} from '@react-navigation/native';
import {useRewardedAd} from '../hooks/useRewarded';

import axios from 'axios';
import config from '../config';
import {getUserData} from '../utils/helper';
import {fetchBalanceService} from '../services/walletService';
import useHandleBackButton from '../hooks/useBackNavigation';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import StartAppAd from '../utils/StartAppAds';
import StartAppBanner from '../utils/StartAppBanner';

const MathGamePage = () => {
  const navigation = useNavigation();
  const {setMathLocked} = useContext(GameContext);
  const [loading, setLoading] = useState(true); // Loader state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useHandleBackButton('Home');

  const {showAd} = useRewardedAd();

  useEffect(() => {
    (async () => {
      setLoading(true); // Start loading
      await fetchCooldowns();
      generateQuestions();
      fadeIn();
      setLoading(false); // Stop loading once API calls are done
    })();
  }, [fadeIn, fetchCooldowns]);

  const fetchCooldowns = useCallback(async () => {
    try {
      const userData = await getUserData();
      const response = await axios.get(
        `${config.Base}/cooldown/status?userId=${userData?.userId}&task=math`,
        {
          headers: {Authorization: `Bearer ${userData?.accessToken}`},
        },
      );

      if (response?.data?.numbers?.length) {
        setQuestionIndex(response?.data?.numbers?.length);
      }
    } catch (error) {
      console.error('Error fetching cooldowns:', error);
    }
  }, []);

  const updateTimer = async number => {
    const userData = await getUserData();

    try {
      const response = await axios.post(
        `${config.Base}/cooldown/add-number?userId=${userData?.userId}&number=${number}&task=math`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong',
      );
    }
  };

  const updateWallet = async () => {
    const userData = await getUserData();
    const walletBalance = await fetchBalanceService();

    try {
      const response = await axios.post(
        `${config.Base}/wallets/${userData?.userId}`,
        {
          balance: Number(walletBalance.balance) + 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong',
      );
    }
  };

  const generateQuestions = () => {
    let qList = [];
    for (let i = 0; i < 10; i++) {
      let num1 = Math.floor(Math.random() * 10) + 1;
      let num2 = Math.floor(Math.random() * 10) + 1;
      let correct = num1 + num2;
      let options = [correct, correct + 1, correct - 1, correct + 2].sort(
        () => Math.random() - 0.5,
      );
      qList.push({num1, num2, correct, options});
    }
    setQuestions(qList);
  };

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleAnswer = async answer => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[questionIndex].correct) {
      setTimeout(() => {
        nextQuestion();
      }, 800);
    } else {
      Alert.alert('Oops!', 'Wrong answer, try again!', [{text: 'OK'}]);
      setTimeout(() => setIsAnswered(false), 800);
    }
  };

  const nextQuestion = async () => {
    if (questionIndex < 9) {
      // showAd();

      StartAppAd.showRewarded();

      await updateTimer(questionIndex + 1);
      await updateWallet();
      setQuestionIndex(questionIndex + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
      fadeAnim.setValue(0);
      fadeIn();
    } else {
      StartAppAd.showRewarded();

      await updateTimer(questionIndex + 1);
      await updateWallet();
      lockGame('mathLocked');
      setMathLocked(true);
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StartAppBanner style={{width: '100%', height: 70}} />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : (
        <Card style={styles.card}>
          <Text style={{textAlign: 'center'}}>{questionIndex + 1}/10</Text>
          <Card.Title title="Math Challenge" titleStyle={styles.title} />
          <Divider />
          <Animated.View style={{opacity: fadeAnim}}>
            {questions.length > 0 && (
              <Text style={styles.question}>
                {questions[questionIndex].num1} +{' '}
                {questions[questionIndex].num2} = ?
              </Text>
            )}
          </Animated.View>

          <View style={styles.buttonContainer}>
            {questions.length > 0 &&
              questions[questionIndex].options.map((opt, idx) => (
                <Button
                  key={idx}
                  mode="contained"
                  style={[
                    styles.optionButton,
                    selectedAnswer === opt
                      ? opt === questions[questionIndex].correct
                        ? styles.correctAnswer
                        : styles.wrongAnswer
                      : null,
                  ]}
                  labelStyle={styles.optionText}
                  onPress={() => handleAnswer(opt)}
                  disabled={isAnswered}>
                  {opt}
                </Button>
              ))}
          </View>
        </Card>
      )}

      <StartAppBanner style={{width: '100%', height: 70}} />
    </SafeAreaView>
  );
};

export default MathGamePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C3D37',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loader: {
    marginTop: 50,
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  optionButton: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 10,
    paddingVertical: 8,
    backgroundColor: '#1A1A1D',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  correctAnswer: {
    backgroundColor: '#10B981',
  },
  wrongAnswer: {
    backgroundColor: '#EF4444',
  },
});
