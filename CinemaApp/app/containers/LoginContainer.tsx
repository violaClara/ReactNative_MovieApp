// app/containers/LoginContainer.tsx
import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import LoginView from '../components/LoginView';

const LoginContainer: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLoginPress = () => {
    if (email && password) {
      Alert.alert('Login Success', `Email: ${email}`);
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <LoginView 
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        onLoginPress={handleLoginPress}
      />
    </View>
  );
};

export default LoginContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000', // or any background color you prefer for the container
  },
});
