import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {ActivityIndicator} from 'react-native-paper';
import {fetchBalanceService} from '../services/walletService';
import {GameContext} from '../context/GameContext';

const Wallet = () => {
  // const [balance, setBalance] = useState(0);
  const {balance, updateBalance} = useContext(GameContext);

  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    setLoading(false);
    const data = await fetchBalanceService();
    updateBalance(data.balance);
    setLoading(true);
  }, [updateBalance]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Wallet:{' '}
        {loading ? (
          `₹${Math.round(balance * 100) / 100}`
        ) : (
          <ActivityIndicator size={30} color="black" />
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    backgroundColor: '#b1b1b1',
    alignItems: 'center',
    margin: '10%',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0)',
  },
  text: {
    fontSize: 30,
    marginVertical: 'auto',
  },
});

export default Wallet;
