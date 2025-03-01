import React, {useContext} from 'react';
import {View, Text, Button} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const ProtectedRoute = ({children}) => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();

  if (!user) {
    return (
      <View>
        <Text>Unauthorized! Please log in.</Text>
        <Button
          title="Go to Login"
          onPress={() => navigation.replace('Login')}
        />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;
