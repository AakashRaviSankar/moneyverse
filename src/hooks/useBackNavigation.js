import {useEffect} from 'react';
import {BackHandler, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const useHandleBackButton = targetScreen => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(targetScreen); // Navigate to the target screen
      return true; // Prevent default behavior
    };

    // Handle hardware back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Handle navigation header back button
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={backAction} style={{padding: 10}}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });

    return () => backHandler.remove(); // Cleanup on unmount
  }, [navigation, targetScreen]);
};

export default useHandleBackButton;
