import React, {useEffect} from 'react';
import {View} from 'react-native';

import MobileAds, {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

export default function AdBanner() {
  function getRandomAdUnit() {
    const adUnits = [
      'ca-app-pub-3087788483910829/2052757772',
      'ca-app-pub-3087788483910829/6365640942',
      'ca-app-pub-3087788483910829/6596741086',
      'ca-app-pub-3087788483910829/1468537485',
      'ca-app-pub-3087788483910829/8963884128',
      'ca-app-pub-3087788483910829/8205336227',
      'ca-app-pub-3087788483910829/4860987587',
      'ca-app-pub-3087788483910829/7768258508',
      'ca-app-pub-3087788483910829/2847104312',
      'ca-app-pub-3087788483910829/3547905918',
      'ca-app-pub-3087788483910829/7576686812',
      'ca-app-pub-3087788483910829/1639927874',
      'ca-app-pub-3087788483910829/8698196794',
      'ca-app-pub-3087788483910829/2244469086',
    ];

    return adUnits[Math.floor(Math.random() * adUnits.length)];
  }

  const adUnitId = getRandomAdUnit();
  console.log(adUnitId);
  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized');
      })
      .catch(error => {
        console.error('AdMob init error:', error);
      });
  }, []);
  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Ensure compliance with privacy policies
        }}
      />
    </View>
  );
}
