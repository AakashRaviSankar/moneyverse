import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useRewardedAd} from '../hooks/useRewarded';
import AdBanner from '../components/AdBanner';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

const SettingsScreen = ({navigation}) => {
  // Logout function
  const {showAd} = useRewardedAd();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BannerAd
        unitId={'ca-app-pub-3087788483910829/8698196794'}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Ensure compliance with privacy policies
        }}
      />

      <Text style={styles.title}>Settings</Text>

      <SettingButton
        icon="money"
        text="Withdraw Money"
        onPress={() => {
          showAd();
          navigation.navigate('Withdraw');
        }}
      />
      <SettingButton
        icon="history"
        text="Transaction History"
        onPress={() => {
          showAd();
          navigation.navigate('Transactions');
        }}
      />
      <SettingButton
        icon="sign-out"
        text="Logout"
        onPress={handleLogout}
        color="red"
      />
      <BannerAd
        unitId={'ca-app-pub-3087788483910829/2244469086'}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Ensure compliance with privacy policies
        }}
      />
    </SafeAreaView>
  );
};

// Reusable button component
const SettingButton = ({icon, text, onPress, color = '#fff'}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <FontAwesome name={icon} size={20} color={color} style={styles.icon} />
    <Text style={[styles.buttonText, {color}]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3C3D37',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1D',
    padding: 15,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});

export default SettingsScreen;
