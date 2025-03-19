import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  NativeAdView,
  NativeAd,
  NativeAsset,
  NativeMediaView,
  NativeAssetType,
} from 'react-native-google-mobile-ads';

const NativeAdComponent = () => {
  const [nativeAd, setNativeAd] = useState(null);

  useEffect(() => {
    // Load the Native Ad
    const loadNativeAd = async () => {
      try {
        const ad = await NativeAd.createForAdRequest(
          'ca-app-pub-3087788483910829/1560316066',
        ); // Use your own Ad Unit ID
        setNativeAd(ad);
      } catch (error) {
        console.error('Failed to load native ad:', error);
      }
    };

    loadNativeAd();

    // Cleanup the ad when the component unmounts
    return () => {
      if (nativeAd) {
        nativeAd.destroy();
      }
    };
  }, []);

  if (!nativeAd) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Ad...</Text>
      </View>
    );
  }

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.adContainer}>
      {/* Ad Headline */}
      <NativeAsset assetType={NativeAssetType.HEADLINE}>
        <Text style={styles.adHeadline}>{nativeAd.headline}</Text>
      </NativeAsset>

      {/* Ad Media (Image or Video) */}
      <NativeMediaView resizeMode="contain" style={styles.adMedia} />

      {/* Ad Body */}
      <NativeAsset assetType={NativeAssetType.BODY}>
        <Text style={styles.adBody}>{nativeAd.body}</Text>
      </NativeAsset>

      {/* Ad Call to Action */}
      <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => nativeAd.recordImpression()}>
          <Text style={styles.ctaButtonText}>{nativeAd.callToAction}</Text>
        </TouchableOpacity>
      </NativeAsset>

      {/* Ad Advertiser */}
      <NativeAsset assetType={NativeAssetType.ADVERTISER}>
        <Text style={styles.advertiser}>{nativeAd.advertiser}</Text>
      </NativeAsset>
    </NativeAdView>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  adHeadline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adBody: {
    fontSize: 14,
    marginBottom: 8,
  },
  adMedia: {
    height: 180,
    marginBottom: 8,
  },
  ctaButton: {
    backgroundColor: '#ff4500',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  advertiser: {
    fontSize: 12,
    color: '#555',
    marginTop: 8,
  },
  loadingContainer: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default NativeAdComponent;
