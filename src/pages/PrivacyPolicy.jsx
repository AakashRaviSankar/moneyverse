import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrivacyPolicy = ({navigation}) => {
  const handleAccept = async () => {
    await AsyncStorage.setItem('userConsent', 'true');
    Alert.alert('Thank You', 'You have accepted our Privacy Policy.');
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.text}>
        Welcome to <Text style={styles.bold}>MoneyVerse</Text>, a mobile
        application that offers interactive activities and ad-based earnings. We
        value your privacy and ensure transparency in how we handle your data.
      </Text>

      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.text}>
        We collect the following data to improve the app experience:
      </Text>
      <Text style={styles.listItem}>
        🔹 <Text style={styles.bold}>Personal Data</Text>: We do not collect
        personally identifiable data.
      </Text>
      <Text style={styles.listItem}>
        🔹 <Text style={styles.bold}>Device Data</Text>: Device type, OS
        version, and advertising IDs.
      </Text>
      <Text style={styles.listItem}>
        🔹 <Text style={styles.bold}>Usage Data</Text>: App interactions, ad
        views, and task completion history.
      </Text>
      <Text style={styles.listItem}>
        🔹 <Text style={styles.bold}>Location Data</Text>: Approximate location
        (for ad targeting, not stored).
      </Text>

      <Text style={styles.sectionTitle}>3. How We Use Your Data</Text>
      <Text style={styles.text}>We use your data to:</Text>
      <Text style={styles.listItem}>✅ Improve app performance.</Text>
      <Text style={styles.listItem}>
        ✅ Display relevant advertisements via Google AdMob.
      </Text>
      <Text style={styles.listItem}>✅ Prevent fraudulent activities.</Text>

      <Text style={styles.sectionTitle}>4. Third-Party Services</Text>
      <Text style={styles.text}>
        We use third-party tools to enhance functionality. These providers may
        collect your data under their policies:
      </Text>
      <Text style={styles.listItem}>
        📌 <Text style={styles.bold}>Google AdMob</Text> (for ads) –{' '}
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://policies.google.com/privacy')
          }>
          Google Privacy Policy
        </Text>
      </Text>
      <Text style={styles.listItem}>
        📌 <Text style={styles.bold}>Google Analytics</Text> (for performance
        tracking)
      </Text>
      <Text style={styles.listItem}>
        📌 <Text style={styles.bold}>Cloud Storage</Text> (for game data backup)
      </Text>

      <Text style={styles.sectionTitle}>5. Ad Preferences & Opt-Out</Text>
      <Text style={styles.text}>You have control over personalized ads:</Text>
      <Text style={styles.listItem}>
        🚫 <Text style={styles.bold}>Disable personalized ads</Text> via{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://adssettings.google.com/')}>
          Google Ads Settings
        </Text>
      </Text>
      <Text style={styles.listItem}>
        🚫 <Text style={styles.bold}>Limit ad tracking</Text> in your device
        settings.
      </Text>

      <Text style={styles.sectionTitle}>6. Data Security</Text>
      <Text style={styles.text}>
        We take reasonable steps to secure your data. However, no online service
        is 100% secure.
      </Text>

      <Text style={styles.sectionTitle}>7. Your Rights</Text>
      <Text style={styles.text}>
        Depending on your location, you have the right to:
      </Text>
      <Text style={styles.listItem}>
        📍 <Text style={styles.bold}>Access or delete your data</Text> (GDPR -
        EU Users).
      </Text>
      <Text style={styles.listItem}>
        📍 <Text>Opt out of data sale</Text> (CCPA - California Users).
      </Text>
      <Text style={styles.listItem}>
        📍{' '}
        <Text style={styles.bold} t>
          Request corrections
        </Text>{' '}
        to your stored data.
      </Text>
      <Text style={styles.listItem}>
        📍 Contact us: moneyverse412@gmail.com
      </Text>

      <Text style={styles.sectionTitle}>8. Updates to this Policy</Text>
      <Text style={styles.text}>
        We may update this Privacy Policy periodically. Please review this page
        for any changes.
      </Text>

      <Text style={styles.sectionTitle}>9. Contact Information</Text>
      <Text style={styles.text}>
        If you have questions, please email us at:
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('mailto:moneyverse412@gmail.com')}>
          moneyverse412@gmail.com
        </Text>
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept & Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginTop: 15},
  text: {fontSize: 14, marginVertical: 5, lineHeight: 20},
  listItem: {fontSize: 14, marginVertical: 3, paddingLeft: 10},
  link: {color: 'blue', textDecorationLine: 'underline'},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#007bff',

    padding: 4,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#d9534f',
    padding: 4,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  bold: {
    fontWeight: '900',
  },
});

export default PrivacyPolicy;
