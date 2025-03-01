import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AdBanner from '../components/AdBanner';
import axios from 'axios';
import config from '../config';
import {getUserData} from '../utils/helper';

import {useRewardedAd} from '../hooks/useRewarded';
import useHandleBackButton from '../hooks/useBackNavigation';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

const LinkClickingScreen = () => {
  useHandleBackButton('Home');
  const navigation = useNavigation();
  const [links, setLinks] = useState(Array(10).fill(false));
  const [storiesCompleted, setStoriesCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const {showAd} = useRewardedAd();

  const handleClick = index => {
    showAd();
    navigation.replace('StoryScreen', {index, setLinks, links});
  };

  const fetchCooldowns = useCallback(async () => {
    try {
      const userData = await getUserData();
      const response = await axios.get(
        `${config.Base}/cooldown/status?userId=${userData?.userId}&task=link`,
        {headers: {Authorization: `Bearer ${userData?.accessToken}`}},
      );
      if (response?.data?.numbers?.length) {
        setStoriesCompleted(response?.data?.numbers);
      }
    } catch (error) {
      console.error('Error fetching cooldowns:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCooldowns();
    if (storiesCompleted?.length === 10) {
      navigation.replace('Home');
    }
  }, [fetchCooldowns, navigation, storiesCompleted.length]);

  return (
    <SafeAreaView style={styles.container}>
      <BannerAd
        unitId={'ca-app-pub-3087788483910829/6596741086'}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Ensure compliance with privacy policies
        }}
      />
      <Text style={styles.title}>Select a Story</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : (
        <FlatList
          data={links}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Creates a 2-column grid
          columnWrapperStyle={styles.row} // Styling for even spacing
          renderItem={({item, index}) => {
            const isDisabled = storiesCompleted.includes(index); // Check if the index is in storiesCompleted
            return (
              <TouchableOpacity
                style={[styles.linkButton, isDisabled && styles.disabledButton]}
                onPress={() => handleClick(index)}
                disabled={isDisabled}>
                <Text style={[styles.linkText, isDisabled && {color: '#999'}]}>
                  Story {index + 1}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <BannerAd
        unitId={'ca-app-pub-3087788483910829/1468537485'}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Ensure compliance with privacy policies
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3C3D37',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'white',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  linkButton: {
    backgroundColor: '#1A1A1D',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '45%', // Makes it fit in 2-column layout
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  linkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
});

export default LinkClickingScreen;
