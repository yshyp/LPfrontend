import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FluidBackground from '../../components/common/FluidBackground';
import ECGPulseOverlay from '../../components/common/ECGPulseOverlay';
import authService from '../../services/authService';
import { UserContext } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
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
      await authService.sendVerification(identifier.trim(), 'LOGIN', 'AUTO', 'User');
      setOtpSent(true);
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
      Alert.alert('Error', error.response?.data?.error || 'Verification failed. Please try again.');
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
    <FluidBackground>
      <TouchableOpacity
        style={styles.themeToggle}
        onPress={toggleTheme}
      >
        <Ionicons
          name={isDark ? "sunny" : "moon"}
          size={24}
          color={isDark ? "#FFD700" : colors.text}
        />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary[0] }]}>🩸 LifePulse</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Sign in to continue managing your donations and requests.
        </Text>
      </View>

      <View style={[styles.formCard, { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
        {!otpSent ? (
          <>
            <Input
              label="Phone Number or Email"
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="e.g. +1234567890 or email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="person-outline"
            />
            {loading ? (
              <View style={styles.loaderContainer}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Sending verification code...</Text>
              </View>
            ) : (
              <Button
                title="Send Verification Code"
                onPress={handleSendOTP}
                style={styles.actionButton}
              />
            )}
          </>
        ) : (
          <>
            <View style={[styles.otpInfo, { backgroundColor: colors.background }]}>
              <Text style={[styles.otpInfoText, { color: colors.textSecondary }]}>
                Code sent to
              </Text>
              <Text style={[styles.identifierText, { color: colors.text }]}>{identifier}</Text>
            </View>

            <Input
              label="Verification Code"
              value={otp}
              onChangeText={setOtp}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              icon="key-outline"
              style={{ textAlign: 'center' }}
            />

            <View style={styles.resendContainer}>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resendCooldown > 0}
              >
                <Text style={[styles.resendText, { color: resendCooldown > 0 ? colors.textSecondary : colors.primary[0] }]}>
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Verifying code...</Text>
              </View>
            ) : (
              <Button
                title="Verify & Login"
                onPress={handleVerifyOTP}
                style={styles.actionButton}
              />
            )}

            <TouchableOpacity onPress={resetForm} style={styles.changeNumberButton}>
              <Text style={[styles.changeNumberText, { color: colors.textSecondary }]}>Change Phone/Email</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>New to LifePulse? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.linkText, { color: colors.primary[0] }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ECGPulseOverlay
        visible={loading}
        text={otpSent ? "Verifying..." : "Sending code..."}
      />
    </FluidBackground>
  );
};

const styles = StyleSheet.create({
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formCard: {
    borderRadius: 30,
    padding: 24,
    ...SHADOWS.medium,
  },
  actionButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  otpInfo: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 20,
  },
  otpInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  identifierText: {
    fontSize: 16,
    fontWeight: '700',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeNumberButton: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  changeNumberText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 15,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default LoginScreen;