import {useEffect, useState} from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-3087788483910829/5707365081';

export function useRewardedAd() {
  const [loaded, setLoaded] = useState(false);
  const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
  });

  useEffect(() => {
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward:', reward);
      },
    );

    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [rewardedAd]);

  const showAd = () => {
    if (loaded) {
      rewardedAd.show();
    } else {
      console.log('Ad not loaded');
    }
  };

  return {loaded, showAd};
}
