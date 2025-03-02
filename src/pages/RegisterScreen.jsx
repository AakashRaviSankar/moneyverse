import axios from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import config from '../config';
import StartAppAd from '../utils/StartAppAds';

const RegisterPage = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${config.Base}/auth/create-user`, {
        username,
        email,
        password,
        roleId: 1,
      });

      const data = response.data;
      if (data.userId) {
        Alert.alert('Registration Successful', 'You can now log in.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error.response);
      Alert.alert(
        'Registration Error',
        error.response?.data?.message ||
          'Something went wrong. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg.webp')}
      style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#ccc"
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          onPress={handleRegister}
          style={styles.buttonContainer}
          disabled={loading}>
          <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.button}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
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
  linkText: {
    color: '#fff',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default RegisterPage;
