import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import config from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem('savedCredentials');
        if (savedCredentials) {
          const {username, password} = JSON.parse(savedCredentials);
          setUsername(username);
          setPassword(password);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading saved credentials:', error);
      }
    };
    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!username) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(`${config.Base}/auth/login`, {
        username,
        password,
      });

      console.log(`${config.Base}/auth/login`);
      const data = response.data;
      if (data.success === true) {
        if (data?.data?.userId) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.data));

          if (rememberMe) {
            await AsyncStorage.setItem(
              'savedCredentials',
              JSON.stringify({username, password}),
            );
          } else {
            await AsyncStorage.removeItem('savedCredentials');
          }

          navigation.replace('Home');
          Alert.alert('Login Successful', 'Welcome!');
        }
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        Alert.alert(
          'Login Error',
          error.response?.data?.message ||
            'Something went wrong. Please try again later.',
        );
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg.webp')}
      style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Back</Text>
        <TextInput
          style={styles.input}
          value={username}
          placeholder="Username"
          placeholderTextColor="#ccc"
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          value={password}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={setPassword}
        />
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={[
              styles.checkbox,
              rememberMe ? styles.checkboxChecked : null,
            ]}
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.buttonContainer}
          disabled={loading} // Disable button when loading
        >
          <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.button}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 12,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    color: '#fff',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 5,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#ff7e5f',
    borderColor: '#ff7e5f',
  },
  rememberMeText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    width: '80%',
    borderRadius: 10,
  },
  button: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#fff',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default LoginPage;
