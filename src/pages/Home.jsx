import React from 'react';
import {requireNativeComponent, SafeAreaView, View} from 'react-native';
import {useEffect} from 'react';
import {BackHandler, Alert} from 'react-native';

import Wallet from '../components/Wallet';
import GameNavigation from '../components/GameNavigation';
import StartAppBanner from '../utils/StartAppBanner';

// const StartAppBanner = requireNativeComponent('StartAppBanner');
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
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 20,
        }}>
        <StartAppBanner style={{width: '100%', height: 70}} />
      </View>
      <Wallet />
      <GameNavigation />
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 20,
        }}>
        <StartAppBanner style={{width: '100%', height: 70}} />
      </View>
    </SafeAreaView>
  );
};

export default Home;
