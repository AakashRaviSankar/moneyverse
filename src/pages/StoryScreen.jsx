import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AdBanner from '../components/AdBanner';

import {getUserData} from '../utils/helper';
import axios from 'axios';
import config from '../config';
import {fetchBalanceService} from '../services/walletService';
import {useRewardedAd} from '../hooks/useRewarded';
import {ActivityIndicator} from 'react-native-paper';
import StartAppAd from '../utils/StartAppAds';
import StartAppBanner from '../utils/StartAppBanner';

const stories = [
  {
    title: 'The Echoing Cave',
    sections: [
      'Ethan, an adventurous explorer, stumbled upon a hidden cave deep in the forest.',
      'As he stepped inside, the cave whispered his name...',
      'The whispers told him of a treasure hidden deep within.',
      'Ethan found a golden chest, its lock shaped like a screaming mouth.',
      'When he touched it, the whispers screamed—now, his voice joined them forever.',
    ],
  },
  {
    title: 'The Clockmaker’s Gift',
    sections: [
      'An old clockmaker built a watch that could freeze time for one minute daily.',
      'He used this power to prevent accidents and save lives.',
      'One day, he saved a boy from a speeding carriage.',
      'That night, his watch ticked slower—running out of power.',
      'The next morning, he vanished. His watch stopped at midnight.',
    ],
  },
  {
    title: 'The Forgotten Library',
    sections: [
      'Emily discovered a hidden library under her school’s basement.',
      'The books inside had no titles, only whispers when opened.',
      'One book called out to her, showing glimpses of the future.',
      'She read her own fate: "One who reads this shall forget their past."',
      'She woke up outside the library, her memories erased.',
    ],
  },
  {
    title: 'The Painter’s Curse',
    sections: [
      'A painter named Luca could bring his paintings to life.',
      'One night, he painted a doorway to another world.',
      'The next morning, his room was empty, only the painting remained.',
      'A new figure appeared inside the painting—it was Luca.',
      'The door slowly closed, sealing him inside forever.',
    ],
  },
  {
    title: 'The Vanishing Village',
    sections: [
      'A traveler reached a village that was not on any map.',
      'The villagers warned him to leave before sunset.',
      'Curious, he stayed and watched as houses disappeared into mist.',
      'He ran, but the mist swallowed him too.',
      'In the morning, another traveler arrived, seeing the same village.',
    ],
  },
  {
    title: 'The Mirror’s Secret',
    sections: [
      'Sophie found an antique mirror in her attic.',
      'At night, her reflection moved on its own.',
      'It whispered, "Let me switch places with you."',
      'The next day, Sophie’s parents found a note: "I’m stuck inside."',
      'Her reflection smiled—it was free now.',
    ],
  },
  {
    title: 'The Midnight Train',
    sections: [
      'Jake missed the last train but saw an old steam train arrive.',
      'He boarded, finding passengers dressed from another century.',
      'The conductor asked for his ticket—he had none.',
      'The train sped up, vanishing into darkness.',
      'Jake’s missing poster appeared the next day.',
    ],
  },
  {
    title: 'The Whispering Doll',
    sections: [
      'Lily received an old doll from her grandmother.',
      'At night, the doll whispered secrets she had never told anyone.',
      'One night, it whispered, "Someone is coming for you."',
      'She locked the doll away, but the whispers grew louder.',
      'In the morning, the doll was gone—and so was Lily.',
    ],
  },
  {
    title: 'The Last Candle',
    sections: [
      'A castle held a room with a single burning candle.',
      'Legend said that when it went out, the kingdom would fall.',
      'One night, a storm raged, and the candle flickered.',
      'A shadowy figure appeared and blew it out.',
      'The next morning, the castle crumbled to ruins.',
    ],
  },
  {
    title: 'The Music Box',
    sections: [
      'An abandoned music box played on its own at midnight.',
      'A boy named Tom found it and took it home.',
      'Each night, the tune got slower, whispering his name.',
      'On the seventh night, he heard his own voice singing.',
      'The music stopped—Tom had vanished, but the box kept playing.',
    ],
  },
];

const StoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {index, setLinks, links} = route.params;
  const [timer, setTimer] = useState(30);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const story = stories[index];

  useEffect(() => {
    const disableBackButton = () => true; // Prevent back navigation

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      disableBackButton,
    );

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(countdown);
          setButtonEnabled(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      backHandler.remove();
      clearInterval(countdown);
    };
  }, []);

  const {showAd} = useRewardedAd();

  const updateTimer = async newSpinsLeft => {
    const userData = await getUserData();
    try {
      await axios.post(
        `${config.Base}/cooldown/add-number?userId=${userData?.userId}&number=${newSpinsLeft}&task=link`,
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

  const handleGoBack = async () => {
    setIsLoading(true);
    setButtonEnabled(false); // Disable button during processing

    try {
      let updatedLinks = [...links];
      updatedLinks[index] = true;
      setLinks(updatedLinks);
      StartAppAd.showRewarded();

      await updateTimer(index);
      await updateWallet(0.2);

      Alert.alert('Earned', '₹0.10');
      navigation.replace('LinkClicking');
    } catch (error) {
      console.error('Error during operation:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setButtonEnabled(true);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 20,
        }}>
        <StartAppBanner style={{width: '100%', height: 70}} />
      </View>
      <Text style={styles.timerText}>
        {buttonEnabled
          ? 'You can go back now, scroll down to add money'
          : `Back enabled in: ${timer}s`}
      </Text>

      <Text style={styles.title}>{story.title}</Text>

      <ScrollView style={styles.storyContainer}>
        {story.sections.map((section, i) => (
          <View key={i}>
            <Text style={styles.storyText}>{section}</Text>
            {i < story.sections.length - 1}
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 20,
              }}>
              <StartAppBanner style={{width: '100%', height: 70}} />
            </View>
          </View>
        ))}
        <Pressable
          onPress={handleGoBack}
          disabled={!buttonEnabled || isLoading}
          style={[
            styles.button,
            !buttonEnabled || isLoading
              ? styles.disabledButton
              : styles.enabledButton,
          ]}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Money</Text>
          )}
        </Pressable>
      </ScrollView>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 20,
        }}>
        <StartAppBanner style={{width: '100%', height: 70}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'red',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  storyContainer: {flex: 1, marginBottom: 20},
  storyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'justify',
    lineHeight: 24,
  },
  button: {
    borderRadius: 10,
    width: '50%',
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center',
  },
  enabledButton: {
    backgroundColor: 'red',
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default StoryScreen;
