import {NativeModules, Platform} from 'react-native';

const {StartAppModule} = NativeModules;

const StartAppAd = {
  showInterstitial: () => {
    if (Platform.OS === 'android') StartAppModule.showInterstitialAd();
  },
  showRewarded: () => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        StartAppModule.showRewardedAd()
          .then(() => resolve(true))
          .catch(() => reject(false));
      } else {
        reject(false);
      }
    });
  },
};

export default StartAppAd;
