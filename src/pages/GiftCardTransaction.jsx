import React, {useState, useEffect} from 'react';
import {View, FlatList, Alert, ScrollView} from 'react-native';
import {Card, Button, Text} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Wallet from '../components/Wallet';

const giftCards = [
  {id: '1', name: 'Amazon ₹500', points: 5000, icon: 'shopping'},
  {id: '2', name: 'Flipkart ₹1000', points: 10000, icon: 'shopping'},
  {id: '3', name: 'Google Play ₹500', points: 5000, icon: 'google-play'},
];

const GiftCardTransaction = () => {
  const [points, setPoints] = useState(0); // Example: User's available points
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const redeemGiftCard = async giftCard => {
    if (points < giftCard.points) {
      Alert.alert(
        'Insufficient Points',
        'Earn more points to redeem this card.',
      );
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      name: giftCard.name,
      date: new Date().toLocaleDateString(),
      pointsUsed: giftCard.points,
      icon: giftCard.icon,
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    setPoints(points - giftCard.points);

    try {
      await AsyncStorage.setItem(
        'transactions',
        JSON.stringify(updatedTransactions),
      );
    } catch (error) {
      console.error('Error saving transaction:', error);
    }

    Alert.alert('Success', `You have redeemed ${giftCard.name}!`);
  };

  return (
    <ScrollView style={{padding: 20}}>
      <Wallet />
      {/* Available Gift Cards */}
      <FlatList
        data={giftCards}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            {item.icon === 'shopping' ? (
              <FontAwesome5
                name="shopping-cart"
                size={40}
                color="#007bff"
                style={{marginRight: 10}}
              />
            ) : (
              <Icon
                name={item.icon}
                size={40}
                color="#007bff"
                style={{marginRight: 10}}
              />
            )}
            <Card.Content style={{flex: 1}}>
              <Text variant="titleMedium">{item.name}</Text>
              <Text>Required Points: {item.points}</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => redeemGiftCard(item)}>
                Redeem
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </ScrollView>
  );
};

export default GiftCardTransaction;
