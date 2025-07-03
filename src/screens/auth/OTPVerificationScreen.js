import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import authService from '../../services/authService';
import notificationService from '../../services/notificationService';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { identifier, type, method, userData } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const { setUser } = useUser();
  const [otpError, setOtpError] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (value, index) => {
    // Only allow numeric and single character
    const digit = value.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError('');
    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (!/^[0-9]{6}$/.test(otpString)) {
      setOtpError('Please enter the complete 6-digit verification code');
      return;
    }
    setOtpError('');
    setLoading(true);
    try {
      // Get push token for notifications
      let fcmToken = null;
      try {
        await notificationService.requestPermissions();
        fcmToken = await notificationService.getExpoPushToken();
      } catch (error) {
        console.log('Push notification setup failed:', error);
      }

      // Use new unified verification method
      const result = await authService.verifyCode(identifier, otpString, type);
      
      console.log('Verification successful:', result);
      
      // For LOGIN type, we get user and token directly
      if (type === 'LOGIN' && result.user && result.token) {
        setUser(result.user);
        navigation.replace('LocationPermission', { 
          user: result.user,
          token: result.token 
        });
      } else if (type === 'EMAIL_VERIFICATION' && result.verified) {
        // For registration, we need to complete the registration process
        if (userData) {
          // Add the verified identifier to userData
          const finalUserData = {
            ...userData,
            [identifier.includes('@') ? 'email' : 'phone']: identifier,
            ...(typeof fcmToken === 'string' ? { fcmToken } : {})
          };

          console.log('🔍 Final user data being sent:', finalUserData);

          try {
            // Register the user with the verified identifier
            const registrationResult = await authService.registerVerified(finalUserData);
            setUser(registrationResult.user);
            Alert.alert(
              'Registration Successful!',
              'Your account has been created successfully.',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.replace('LocationPermission', {
                    user: registrationResult.user,
                    token: registrationResult.token
                  })
                }
              ]
            );
          } catch (registrationError) {
            console.error('Registration error:', registrationError);
            Alert.alert('Error', registrationError.response?.data?.error || 'Registration failed');
          }
        } else {
          Alert.alert('Success', result.message || 'Verification successful!');
          navigation.goBack();
        }
      } else {
        // For other types, handle accordingly
        Alert.alert('Success', result.message || 'Verification successful!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Verification failed');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await authService.resendVerification(identifier, type, method);
      setCountdown(60); // 60 seconds cooldown
      Alert.alert('Success', 'Verification code sent successfully!');
    } catch (error) {
      console.error('Resend verification error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const getMethodText = () => {
    if (method === 'EMAIL') return 'email';
    if (method === 'SMS') return 'SMS/WhatsApp';
    // Auto-detect based on identifier
    return identifier.includes('@') ? 'email' : 'SMS/WhatsApp';
  };

  const renderOTPInputs = () => {
    return (
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <View
            key={index}
            style={[
              styles.otpBoxMaterial,
              focusedIndex === index && styles.otpBoxMaterialFocused,
              digit ? styles.otpBoxMaterialFilled : styles.otpBoxMaterialEmpty,
            ]}
          >
            <Input
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              style={styles.otpInputMaterial}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              placeholder="-"
              selectTextOnFocus
              autoFocus={index === 0}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📱 Verify Code</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your {getMethodText()}
          </Text>
          <Text style={styles.identifier}>
            {identifier.replace(/\w(?=\w{2})/g, '*')}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.otpLabel}>Enter Verification Code</Text>
          {otpError ? (
            <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{otpError}</Text>
          ) : null}
          {renderOTPInputs()}

          <Button
            title="Verify Code"
            onPress={handleVerifyOTP}
            loading={loading}
            style={styles.verifyButton}
            disabled={otp.join('').length !== 6}
          />

          <View style={styles.resendSection}>
            <Text style={styles.resendText}>
              Didn't receive the code?
            </Text>
            <Button
              title={countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              onPress={handleResendOTP}
              loading={resendLoading}
              variant="secondary"
              disabled={countdown > 0 || resendLoading}
              style={styles.resendButton}
            />
          </View>

          <Button
            title="Back to Login"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={styles.backButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  identifier: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  form: {
    flex: 1,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  otpBoxMaterial: {
    width: 52,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: '#FFF',
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  otpBoxMaterialFocused: {
    borderColor: '#1976d2',
    backgroundColor: '#F3F7FD',
  },
  otpBoxMaterialFilled: {
    borderColor: '#1976d2',
    backgroundColor: '#E3F2FD',
  },
  otpBoxMaterialEmpty: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  otpInputMaterial: {
    fontSize: 30,
    color: '#1C1C1E',
    textAlign: 'center',
    padding: 0,
    margin: 0,
    width: 44,
    height: 44,
    backgroundColor: 'transparent',
    fontWeight: '500',
    letterSpacing: 2,
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  resendButton: {
    minWidth: 120,
  },
  backButton: {
    marginTop: 'auto',
  },
});

export default OTPVerificationScreen; 