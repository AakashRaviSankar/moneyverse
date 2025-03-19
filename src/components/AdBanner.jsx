import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import MobileAds, {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

const adUnitIds = [
  'ca-app-pub-3087788483910829/8931777309',
  'ca-app-pub-3087788483910829/7618695635',
  'ca-app-pub-3087788483910829/2062878944',
  'ca-app-pub-3087788483910829/3416560897',
  'ca-app-pub-3087788483910829/5019348806',
  'ca-app-pub-3087788483910829/4977054573',
  'ca-app-pub-3087788483910829/8698196794',
  'ca-app-pub-3087788483910829/2350891232',
  'ca-app-pub-3087788483910829/8245143918',
  'ca-app-pub-3087788483910829/2024685653',
  'ca-app-pub-3087788483910829/7642508680',
  'ca-app-pub-3087788483910829/7572557623',
  'ca-app-pub-3087788483910829/3033417511',
  'ca-app-pub-3087788483910829/1720335840',
];

export default function AdBanner() {
  const [adLoaded, setAdLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [adUnitId, setAdUnitId] = useState('');

  // Select a random ad unit ID
  const getRandomAdUnitId = () => {
    return adUnitIds[Math.floor(Math.random() * adUnitIds.length)];
  };

  const loadAd = () => {
    setAdUnitId(getRandomAdUnitId()); // Randomly select an ad unit
    setAdLoaded(false); // Reset ad loading state
  };

  const handleAdLoaded = () => {
    setAdLoaded(true); // Set the ad as loaded successfully
  };

  const handleAdFailedToLoad = error => {
    console.error('Ad failed to load:', error);
    setAdLoaded(false); // Set ad loading state to false
    if (retryCount < 5) {
      // Retry loading the ad a few times
      setRetryCount(prev => prev + 1);
      setTimeout(() => loadAd(), 3000); // Retry after 3 seconds
    } else {
      setRetryCount(0); // Reset retry count after 5 attempts
    }
  };

  useEffect(() => {
    // Initialize the MobileAds SDK
    MobileAds()
      .initialize()
      .then(() => {
        console.log('Google Mobile Ads SDK Initialized');
        loadAd(); // Load the first ad after SDK initialization
      })
      .catch(error => {
        console.log('Error initializing Mobile Ads SDK:', error);
      });
  }, []);

  return (
    <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
      {!adLoaded ? (
        retryCount < 5 ? (
          <Text>Loading Ad... ({retryCount})</Text> // Show loading or retry count
        ) : (
          <Text>
            Failed to load ad after multiple attempts. Please try again later.
          </Text> // Show failure message
        )
      ) : (
        <BannerAd
          unitId={adUnitId} // Dynamically load the ad with the selected ad unit
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true, // Compliant with privacy policies
          }}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailedToLoad}
        />
      )}
    </View>
  );
}
