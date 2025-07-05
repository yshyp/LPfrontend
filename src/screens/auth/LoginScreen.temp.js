import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import HeartbeatLoader from '../../components/common/HeartbeatLoader';
import authService from '../../services/authService';
import { UserContext } from '../../context/UserContext';

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  const handlePasswordLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both your email/phone and password');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.loginWithPassword(identifier.trim(), password);
      
      if (result.user && result.token) {
        setUser(result.user, result.token);
        Alert.alert(
          'Login Successful!',
          'Welcome back to LifePulse!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              })
            }
          ]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🩸 LifePulse</Text>
        <Text style={styles.subtitle}>Blood Donor Network</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Phone Number or Email"
          value={identifier}
          onChangeText={setIdentifier}
          placeholder="Enter your phone number or email"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={true}
        />

        {loading ? (
          <HeartbeatLoader text="Logging you in..." />
        ) : (
          <Button
            title="Login"
            onPress={handlePasswordLogin}
          />
        )}

        <Button
          title="Create New Account"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
});

export default LoginScreen;
