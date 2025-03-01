import React, {useContext, useState} from 'react';
import {View, StyleSheet, Alert, SafeAreaView} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import Wallet from '../components/Wallet';
import AdBanner from '../components/AdBanner';
import axios from 'axios';
import config from '../config';
import {getUserData} from '../utils/helper';
import {fetchBalanceService} from '../services/walletService';
import {GameContext} from '../context/GameContext';
import {useRewardedAd} from '../hooks/useRewarded';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

const WithdrawPage = () => {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  const {updateBalance} = useContext(GameContext);
  const {showAd} = useRewardedAd();

  const isValidUpi = id => /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(id);
  const isAmountValid = amt =>
    /^\d+(\.\d{1,2})?$/.test(amt) && parseFloat(amt) > 0;

  const handleWithdraw = async () => {
    if (!isValidUpi(upiId)) {
      Alert.alert('Enter a valid UPI ID', 'example@upi');
      return;
    } else if (!isAmountValid(amount)) {
      Alert.alert('Enter a valid amount', 'Amount should be greater than 0');
      return;
    }

    setLoading(true); // Start loader

    try {
      showAd();
      const userData = await getUserData();

      const response = await axios.post(
        `${config.Base}/transactions`,
        {
          userId: userData?.userId,
          amount: Number(amount),
          status: 'PENDING',
          upiId: upiId,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );

      const data = response.data;

      if (data?.userId) {
        const res = await fetchBalanceService();
        updateBalance(res.balance);
        Alert.alert('Withdrawal Successful', 'Amount will be credited soon');
        setAmount('');
        setUpiId('');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        Alert.alert(
          'Withdrawal Failed',
          error.response.data.message || 'Unexpected Error Occurred',
        );
      }
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BannerAd
        unitId={'ca-app-pub-3087788483910829/2847104312'}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Ensure compliance with privacy policies
        }}
      />
      <Wallet />

      <Card style={styles.card}>
        <Card.Title title="Withdraw Funds" titleStyle={styles.title} />
        <Card.Content>
          <TextInput
            label="UPI ID"
            mode="outlined"
            placeholder="example@upi"
            value={upiId}
            onChangeText={setUpiId}
            style={styles.input}
            placeholderTextColor="#fff"
            textColor="white"
            theme={{
              colors: {
                primary: 'white',
                outline: 'white',
              },
            }}
          />
          <TextInput
            label="Amount"
            mode="outlined"
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={text => {
              const numericValue = text.replace(/[^0-9]/g, ''); // Allow only digits
              setAmount(numericValue);
            }}
            style={styles.input}
            placeholderTextColor="#fff"
            textColor="white"
            theme={{
              colors: {
                primary: 'white',
                outline: 'white',
              },
            }}
          />

          {!loading ? (
            <Button
              mode="contained"
              onPress={handleWithdraw}
              disabled={loading || !upiId || !amount}
              loading={loading} // Shows loader when true
              style={[
                styles.button,
                (!upiId || !amount) && styles.disabledButton,
              ]}
              buttonColor="black"
              textColor="white">
              {loading ? 'Processing...' : 'Withdraw'}
            </Button>
          ) : (
            <Text style={{textAlign: 'center', color: 'white'}}>
              <ActivityIndicator color="white" />
              {'Processing...'}
            </Text>
          )}
        </Card.Content>
      </Card>

      <BannerAd
        unitId={'ca-app-pub-3087788483910829/3547905918'}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Ensure compliance with privacy policies
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#3C3D37',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#1e1e1e',
    color: 'white',
  },
  button: {
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#333',
  },
});

export default WithdrawPage;
