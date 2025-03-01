import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {useEffect} from 'react';
import {BackHandler, Alert} from 'react-native';
import AdBanner from '../components/AdBanner';
import Wallet from '../components/Wallet';
import GameNavigation from '../components/GameNavigation';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const Home = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true; // Prevent default behavior (going back)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup event listener
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#3C3D37'}}>
      <BannerAd
        unitId={'ca-app-pub-3087788483910829/2052757772'}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Ensure compliance with privacy policies
        }}
      />
      <Wallet />
      <GameNavigation />
      <BannerAd
        unitId={
          __DEV__ ? TestIds.BANNER : 'ca-app-pub-3087788483910829/6365640942'
        }
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          networkExtras: {collapsible: 'bottom'},
        }}
      />
    </SafeAreaView>
  );
};

export default Home;
