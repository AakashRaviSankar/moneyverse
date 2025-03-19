import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MobileAds from 'react-native-google-mobile-ads';

// Context Providers
import {AuthProvider} from './src/context/AuthContext';
import {GameProvider} from './src/context/GameContext';

// Screens
import Home from './src/pages/Home';
import LoginScreen from './src/pages/LoginScreen';
import RegisterScreen from './src/pages/RegisterScreen';
import MathGameScreen from './src/pages/MathGameScreen';
import SpinnerGameScreen from './src/pages/SpinnerGameScreen';
import LinkClickingScreen from './src/pages/LinkClickingScreen';
import WithdrawScreen from './src/pages/WithdrawScreen';
import TransactionsScreen from './src/pages/TransactionsScreen';
import SettingsScreen from './src/pages/Settings';
import StoryScreen from './src/pages/StoryScreen';
import PrivacyPolicy from './src/pages/PrivacyPolicy';
import GiftCardTransaction from './src/pages/GiftCardTransaction';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Bottom Tabs Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = route.name === 'Home' ? 'home' : 'settings';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff7e5f',
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: {backgroundColor: '#222', paddingBottom: 5},
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerStyle: {backgroundColor: '#1A1A1D'},
          headerTintColor: 'white',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerStyle: {backgroundColor: '#1A1A1D'},
          headerTintColor: 'white',
        }}
      />
    </Tab.Navigator>
  );
};

// ✅ Main App Component
const App = () => {
  const [consentGiven, setConsentGiven] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize AdMob
  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => console.log('AdMob initialized'))
      .catch(error => console.error('AdMob init error:', error));
  }, []);

  // Check user consent from AsyncStorage
  useEffect(() => {
    const checkConsent = async () => {
      try {
        const storedConsent = await AsyncStorage.getItem('userConsent');
        setConsentGiven(storedConsent === 'true');
      } catch (error) {
        console.error('Error fetching consent:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkConsent();
  }, []);

  // Show loading screen while checking consent
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>
          <ActivityIndicator /> Loading...
        </Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <GameProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={consentGiven ? 'Login' : 'Privacy'}>
            <Stack.Screen
              name="Privacy"
              component={PrivacyPolicy}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={MainTabNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MathGame"
              component={MathGameScreen}
              options={{
                headerStyle: {backgroundColor: '#1A1A1D'},
                headerTintColor: 'white',
              }}
            />
            <Stack.Screen
              name="SpinnerGame"
              component={SpinnerGameScreen}
              options={{
                headerStyle: {backgroundColor: '#1A1A1D'},
                headerTintColor: 'white',
              }}
            />
            <Stack.Screen
              name="LinkClicking"
              component={LinkClickingScreen}
              options={{
                headerStyle: {backgroundColor: '#1A1A1D'},
                headerTintColor: 'white',
              }}
            />
            <Stack.Screen
              name="StoryScreen"
              component={StoryScreen}
              options={{
                headerStyle: {backgroundColor: '#1A1A1D'},
                headerTintColor: 'white',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Withdraw"
              component={WithdrawScreen}
              options={{
                headerStyle: {backgroundColor: '#1A1A1D'},
                headerTintColor: 'white',
              }}
            />
            <Stack.Screen
              name="Transactions"
              component={TransactionsScreen}
              options={{
                headerStyle: {backgroundColor: '#1A1A1D'},
                headerTintColor: 'white',
              }}
            />
            <Stack.Screen
              name="Gift"
              component={GiftCardTransaction}
              options={{
                headerStyle: {backgroundColor: '#1A1A1D'},
                headerTintColor: 'white',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
