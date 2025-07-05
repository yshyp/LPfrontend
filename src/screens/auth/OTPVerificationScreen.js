import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
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
  
  // Heartbeat animation
  const heartbeatAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading || resendLoading) {
      const heartbeat = () => {
        Animated.sequence([
          Animated.timing(heartbeatAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(heartbeatAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (loading || resendLoading) {
            heartbeat();
          }
        });
      };
      heartbeat();
    }
  }, [loading, resendLoading, heartbeatAnim]);

  const HeartbeatLoader = () => (
    <Animated.View style={[styles.heartbeatLoader, { transform: [{ scale: heartbeatAnim }] }]}>
      <Text style={styles.heartIcon}>💗</Text>
    </Animated.View>
  );

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

      // Use LOGIN type for backend verification for all flows except pure LOGIN
      const verifyType = 'LOGIN';
      const result = await authService.verifyCode(identifier, otpString, verifyType);
      
      console.log('Verification successful:', result);
      
      // For LOGIN type, we get user and token directly
      if (type === 'LOGIN' && result.user && result.token) {
        setUser(result.user);
        navigation.replace('LocationPermission', { 
          user: result.user,
          token: result.token 
        });
      } else if ((type === 'REGISTRATION' || type === 'REGISTRATION_VERIFY') && result.user && result.token) {
        // For new registration verification, user already exists and just got verified
        setUser(result.user);
        Alert.alert(
          'Registration Successful!',
          'Your account has been verified successfully! Welcome to LifePulse.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('LocationPermission', {
                user: result.user,
                token: result.token
              })
            }
          ]
        );
      } else if (type === 'REGISTRATION' && result.verified) {
        // Legacy registration flow - for backward compatibility
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
      // Use LOGIN type for backend verification for all flows
      const resendType = 'LOGIN';
      await authService.resendVerification(identifier, resendType, method);
      setCountdown(60); // 60 seconds cooldown
      Alert.alert('Success', 'Verification code sent successfully!');
    } catch (error) {
      console.error('Resend verification error:', error);
      
      // Handle rate limiting with user-friendly message
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || '15 minutes';
        Alert.alert(
          '⏰ Too Many Requests',
          `You've sent too many verification requests. Please wait ${retryAfter} before trying again.\n\nThis helps protect your account and prevent spam.`,
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert('Error', error.response?.data?.error || 'Failed to resend verification code');
      }
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
        <Input
          ref={(ref) => (inputRefs.current[0] = ref)}
          value={otp.join('')}
          onChangeText={(value) => {
            const digits = value.replace(/[^0-9]/g, '').slice(0, 6);
            const newOtp = [...Array(6)].map((_, i) => digits[i] || '');
            setOtp(newOtp);
            setOtpError('');
          }}
          style={styles.otpInputField}
          keyboardType="numeric"
          maxLength={6}
          placeholder="Enter 6-digit code"
          placeholderTextColor="#C7C7CC"
          secureTextEntry={true}
          autoFocus={true}
          textAlign="center"
        />
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
            title={loading ? '' : "Verify Code"}
            onPress={handleVerifyOTP}
            loading={false}
            style={[styles.verifyButton, loading && styles.loadingButton]}
            disabled={otp.join('').length !== 6}
            customContent={loading ? <HeartbeatLoader /> : null}
          />

          <View style={styles.resendSection}>
            <Text style={styles.resendText}>
              Didn't receive the code?
            </Text>
            <Button
              title={resendLoading ? '' : (countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code')}
              onPress={handleResendOTP}
              loading={false}
              variant="secondary"
              disabled={countdown > 0 || resendLoading}
              style={[styles.resendButton, resendLoading && styles.loadingButton]}
              customContent={resendLoading ? <HeartbeatLoader /> : null}
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
    alignItems: 'center',
    marginVertical: 32,
    paddingHorizontal: 20,
  },
  otpInputField: {
    width: '100%',
    height: 56,
    fontSize: 24,
    color: '#1C1C1E',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    paddingHorizontal: 20,
    letterSpacing: 8,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartbeatLoader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 20,
    color: '#FF6B6B',
  },
  loadingButton: {
    justifyContent: 'center',
    alignItems: 'center',
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