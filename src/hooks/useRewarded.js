import {useEffect, useState} from 'react';
import {RewardedAd, RewardedAdEventType} from 'react-native-google-mobile-ads';

const adUnitIds = [
  'ca-app-pub-3087788483910829/5618980576',
  'ca-app-pub-3087788483910829/2198610312',
  'ca-app-pub-3087788483910829/1679735563',
  'ca-app-pub-3087788483910829/5772358974',
  'ca-app-pub-3087788483910829/5926102330',
  'ca-app-pub-3087788483910829/1603713945',
  'ca-app-pub-3087788483910829/7977550605',
];

export function useRewardedAd() {
  const [loaded, setLoaded] = useState(false);
  const [currentAdUnit, setCurrentAdUnit] = useState(adUnitIds[0]); // Initial ad unit
  const [rewardedAd, setRewardedAd] = useState(() =>
    RewardedAd.createForAdRequest(currentAdUnit),
  );

  useEffect(() => {
    const loadAd = () => {
      const ad = RewardedAd.createForAdRequest(currentAdUnit);
      setRewardedAd(ad);

      const unsubscribeLoaded = ad.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          setLoaded(true);
        },
      );

      const unsubscribeEarned = ad.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
          console.log('User earned reward:', reward);
        },
      );

      ad.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
      };
    };

    const cleanup = loadAd();
    return cleanup;
  }, [currentAdUnit]);

  const showAd = () => {
    if (loaded) {
      rewardedAd.show();
      setLoaded(false); // Reset loaded state

      // Select a new ad unit randomly for the next ad
      const newAdUnit = adUnitIds[Math.floor(Math.random() * adUnitIds.length)];
      setCurrentAdUnit(newAdUnit);
    } else {
      console.log('Ad not loaded');
    }
  };

  return {loaded, showAd};
}
