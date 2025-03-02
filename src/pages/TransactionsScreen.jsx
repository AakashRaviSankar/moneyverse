import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import config from '../config';
import {getUserData} from '../utils/helper';

import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import StartAppAd from '../utils/StartAppAds';
import StartAppBanner from '../utils/StartAppBanner';

// Function to format the date
const formatDate = date => {
  const options = {day: 'numeric', month: 'short', year: 'numeric'};
  return new Date(date).toLocaleDateString('en-GB', options);
};

const WithdrawTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    const userData = await getUserData();
    try {
      const response = await axios.get(
        `${config.Base}/transactions/user/${userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );
      setTransactions(response.data);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch transactions',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusStyles = status => {
    switch (status) {
      case 'PENDING':
        return {color: 'orange', icon: 'clock-outline'};
      case 'COMPLETED':
        return {color: 'green', icon: 'check-circle-outline'};
      case 'FAILED':
        return {color: 'red', icon: 'alert-circle-outline'};
      default:
        return {color: 'gray', icon: 'help-circle-outline'};
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 20,
        }}>
        <StartAppBanner style={{width: '100%', height: 70}} />
      </View>
      <Text style={styles.header}>Transaction History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : transactions?.length ? (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const {color, icon} = getStatusStyles(item.status);
            return (
              <View style={styles.transactionCard}>
                <View style={styles.row}>
                  <MaterialCommunityIcons name={icon} size={26} color={color} />
                  <View style={styles.detailsContainer}>
                    <Text style={styles.amount}>₹{item.amount}</Text>
                    <Text style={styles.details}>UPI ID: {item.upiId}</Text>
                    <Text style={styles.details}>
                      Date: {formatDate(item.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.status, {color}]}>{item.status}</Text>
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.details}>No Transaction Made Yet.</Text>
      )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#3C3D37',
  },
  header: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  transactionCard: {
    backgroundColor: '#1A1A1D',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsContainer: {
    marginLeft: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  details: {
    fontSize: 14,
    color: '#d1d1d1',
  },
  status: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default WithdrawTransactionsPage;
