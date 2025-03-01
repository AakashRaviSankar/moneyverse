import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserData = async () => {
  try {
    const storedUserData = await AsyncStorage.getItem('userData');

    if (!storedUserData) {
      console.error('No user data found in AsyncStorage.');
      return null;
    }

    const userData = JSON.parse(storedUserData);

    if (!userData?.userId || !userData?.accessToken) {
      console.error('Invalid user data structure:', userData);
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error retrieving or parsing userData:', error);
    return null;
  }
};

export {getUserData};
