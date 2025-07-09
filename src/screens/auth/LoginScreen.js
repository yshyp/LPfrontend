import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ECGPulseOverlay from '../../components/common/ECGPulseOverlay';
import authService from '../../services/authService';
import { UserContext } from '../../context/UserContext';

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { setUser } = useContext(UserContext);

  const handleSendOTP = async () => {
    if (!identifier.trim()) {
      Alert.alert('Error', 'Please enter your phone number or email');
      return;
    }

    setLoading(true);
    try {
      // Use the unified verification system
      await authService.sendVerification(identifier.trim(), 'LOGIN', 'AUTO', 'User');
      
      setOtpSent(true);
      setResendCooldown(30); // 30 second cooldown
      
      // Start countdown
      const countdown = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Alert.alert(
        'OTP Sent!',
        `We've sent a verification code to ${identifier.trim()}. Please check your messages.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Send OTP error:', error);
      
      if (error.response?.status === 404) {
        Alert.alert(
          'Account Not Found', 
          'No account found with this phone number or email. Would you like to create a new account?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Create Account', onPress: () => navigation.navigate('Register') }
          ]
        );
      } else if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || '15 minutes';
        Alert.alert(
          '⏰ Too Many Attempts',
          `Too many requests. Please wait ${retryAfter} before trying again.`,
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert('Error', error.response?.data?.error || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.verifyCode(identifier.trim(), otp.trim(), 'LOGIN');
      
      if (result.user && result.token) {
        setUser(result.user, result.token);
        
        // Determine which dashboard to navigate to based on user role
        const dashboardRoute = result.user.role === 'DONOR' ? 'DonorDashboard' : 'RequesterDashboard';
        
        Alert.alert(
          'Login Successful!',
          'Welcome back to LifePulse!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: dashboardRoute }],
              })
            }
          ]
        );
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      
      if (error.response?.status === 400) {
        Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      } else if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || '15 minutes';
        Alert.alert(
          '⏰ Too Many Attempts',
          `Too many verification attempts. Please wait ${retryAfter} before trying again.`,
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert('Error', error.response?.data?.error || 'Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    try {
      await authService.resendVerification(identifier.trim(), 'LOGIN', 'AUTO');
      
      setResendCooldown(30);
      const countdown = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Alert.alert('OTP Resent!', 'A new verification code has been sent.');
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOtpSent(false);
    setOtp('');
    setResendCooldown(0);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🩸 LifePulse</Text>
        <Text style={styles.subtitle}>Blood Donor Network</Text>
      </View>

      <View style={styles.form}>
        {!otpSent ? (
          // Step 1: Enter phone/email
          <>
            <Input
              label="Phone Number or Email"
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="Enter your phone number or email"
              keyboardType="default"
              autoCapitalize="none"
            />

            {loading ? (
              <View style={styles.loaderContainer}>
                <Text style={styles.loadingText}>Sending verification code...</Text>
              </View>
            ) : (
              <Button
                title="Send Verification Code"
                onPress={handleSendOTP}
                style={styles.sendButton}
              />
            )}
          </>
        ) : (
          // Step 2: Enter OTP
          <>
            <View style={styles.otpInfo}>
              <Text style={styles.otpInfoText}>
                We've sent a verification code to:
              </Text>
              <Text style={styles.identifierText}>{identifier}</Text>
            </View>

            <Input
              label="Verification Code"
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 6-digit code"
              keyboardType="numeric"
              maxLength={6}
            />

            <View style={styles.resendContainer}>
              <TouchableOpacity 
                onPress={handleResendOTP} 
                disabled={resendCooldown > 0}
                style={[styles.resendButton, resendCooldown > 0 && styles.resendButtonDisabled]}
              >
                <Text style={[styles.resendText, resendCooldown > 0 && styles.resendTextDisabled]}>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <Text style={styles.loadingText}>Verifying code...</Text>
              </View>
            ) : (
              <Button
                title="Verify & Login"
                onPress={handleVerifyOTP}
                style={styles.verifyButton}
              />
            )}

            <TouchableOpacity onPress={resetForm} style={styles.changeNumberButton}>
              <Text style={styles.changeNumberText}>Change Phone/Email</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.divider}>
          <Text style={styles.dividerText}>Don't have an account?</Text>
        </View>

        <Button
          title="Create New Account"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
        />
      </View>
      
      {/* ECG Pulse Overlay Loader */}
      <ECGPulseOverlay 
        visible={loading}
        text={otpSent ? "Verifying code..." : "Sending verification code..."}
      />
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
  otpInfo: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  otpInfoText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 4,
  },
  identifierText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    textAlign: 'center',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: '#8E8E93',
  },
  sendButton: {
    marginBottom: 24,
  },
  verifyButton: {
    marginBottom: 16,
  },
  changeNumberButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    marginBottom: 24,
  },
  changeNumberText: {
    color: '#8E8E93',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  divider: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default LoginScreen; 