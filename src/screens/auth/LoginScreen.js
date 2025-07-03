import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import authService from '../../services/authService';

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    if (!identifier.trim()) {
      Alert.alert('Error', 'Please enter your phone number or email address');
      return;
    }

    setLoading(true);
    try {
      // Auto-detect method based on identifier
      const method = identifier.includes('@') ? 'EMAIL' : 'SMS';
      
      await authService.sendVerification(identifier.trim(), 'LOGIN', method);
      
      const methodText = method === 'EMAIL' ? 'email' : 'SMS/WhatsApp';
      Alert.alert(
        'Verification Code Sent!', 
        `A 6-digit verification code has been sent to your ${methodText}.`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('OTPVerification', { 
              identifier: identifier.trim(),
              type: 'LOGIN',
              method: method
            })
          }
        ]
      );
    } catch (error) {
      console.error('Send verification error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
          keyboardType="default"
          autoCapitalize="none"
        />

        <Button
          title="Send Verification Code"
          onPress={handleSendVerification}
          loading={loading}
          style={styles.sendButton}
        />

        <View style={styles.divider}>
          <Text style={styles.dividerText}>or</Text>
        </View>

        <Button
          title="Create New Account"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flexGrow: 1,
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
  sendButton: {
    marginTop: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerText: {
    flex: 1,
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
  },
});

export default LoginScreen; 