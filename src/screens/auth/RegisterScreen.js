import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FluidBackground from '../../components/common/FluidBackground';
import ECGPulseOverlay from '../../components/common/ECGPulseOverlay';
import authService from '../../services/authService';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    identifier: '', // Can be phone or email
    role: 'DONOR',
    bloodGroup: 'A+'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSendVerification = async () => {
    setError('');
    if (!formData.name.trim() || !formData.identifier.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate phone number format
    if (!formData.identifier.includes('@')) {
      const phoneNumber = formData.identifier.trim();
      // Remove any non-digit characters for validation
      const digitsOnly = phoneNumber.replace(/\D/g, '');

      // Check if it's a valid phone number (should be 10-15 digits)
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        setError('Please enter a valid phone number (10-15 digits)');
        return;
      }
    }

    setLoading(true);
    try {
      const identifier = formData.identifier.trim();
      const isEmail = identifier.includes('@');
      const cleanedIdentifier = isEmail ? identifier : identifier.replace(/\D/g, '');

      console.log('🔍 Starting registration for:', cleanedIdentifier);

      // Step 1: Create user account first (backend requires user to exist before verification)
      const userRegistrationData = {
        name: formData.name.trim(),
        password: 'temp_password_123', // Temporary password since auth is OTP-based
        role: formData.role,
        bloodGroup: formData.bloodGroup,
        longitude: 0,
        latitude: 0,
        verified: false
      };

      // The backend seems to require both email and phone fields with valid formats
      // Let's provide both with valid formats that won't conflict with real users
      if (isEmail) {
        userRegistrationData.email = identifier;
        // Use a valid phone format that won't conflict (fake numbers starting with 0000)
        const timestamp = Date.now().toString().slice(-8); // Last 8 digits
        userRegistrationData.phone = `0000${timestamp}`; // Valid 12-digit phone starting with 0000
      } else {
        userRegistrationData.phone = cleanedIdentifier;
        // Create a unique email that won't conflict
        const timestamp = Date.now();
        userRegistrationData.email = `phone${cleanedIdentifier}_${timestamp}@placeholder.lifepulse`;
      }

      console.log('🔍 Creating user account:');
      console.log('📧 Is email registration?', isEmail);
      console.log('📋 Registration data:', JSON.stringify(userRegistrationData, null, 2));

      try {
        await authService.register(userRegistrationData);
        console.log('✅ User account created successfully');
      } catch (registerError) {
        if (registerError.response?.status === 409 ||
          (registerError.response?.status === 400 &&
            registerError.response?.data?.error?.includes('already exists'))) {
          // User already exists
          Alert.alert(
            'Account Already Exists',
            `An account with this ${isEmail ? 'email' : 'phone number'} already exists. Please login instead.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Go to Login', onPress: () => navigation.navigate('Login') }
            ]
          );
          return;
        }
        // Re-throw other registration errors
        throw registerError;
      }

      // Step 2: Send verification code to the created user
      const method = isEmail ? 'EMAIL' : 'SMS';
      await authService.sendVerification(cleanedIdentifier, 'LOGIN', method, formData.name.trim());

      const methodText = method === 'EMAIL' ? 'email' : 'WhatsApp/SMS';
      const destinationText = isEmail ? identifier : `WhatsApp number ${cleanedIdentifier}`;

      Alert.alert(
        'Verification Code Sent!',
        `Your account has been created successfully! A 6-digit verification code has been sent to your ${methodText} (${destinationText}) to complete the setup.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OTPVerification', {
              identifier: cleanedIdentifier,
              type: 'LOGIN', // Use LOGIN type since user exists now
              method: method,
              userData: userRegistrationData // Pass the created user data
            })
          }
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);

      // Handle rate limiting with user-friendly message
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || '15 minutes';
        Alert.alert(
          '⏰ Too Many Requests',
          `You've sent too many verification requests. Please wait ${retryAfter} before trying again.\n\nThis helps protect your account and prevent spam.`,
          [{ text: 'OK', style: 'default' }]
        );
        setError('');
      } else if (error.response?.status === 409 ||
        (error.response?.status === 400 &&
          error.response?.data?.error?.includes('already exists'))) {
        // User already exists
        Alert.alert(
          'Account Already Exists',
          'An account with this email or phone number already exists. Please try logging in instead.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Login', onPress: () => navigation.navigate('Login') }
          ]
        );
        setError('');
      } else {
        setError(error.response?.data?.error || 'Failed to create account or send verification code');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <FluidBackground>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join LifePulse Community</Text>
      </View>

      <View style={styles.formCard}>
        <Input
          label="Full Name"
          value={formData.name}
          onChangeText={(value) => updateFormData('name', value)}
          placeholder="Enter your full name"
          icon="person"
        />

        <Input
          label="Phone Number or Email"
          value={formData.identifier}
          onChangeText={(value) => updateFormData('identifier', value)}
          placeholder="Enter phone (for WhatsApp) or email"
          keyboardType="default"
          autoCapitalize="none"
          icon="call"
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.role}
              onValueChange={(value) => updateFormData('role', value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Blood Donor" value="DONOR" color={COLORS.text} />
              <Picker.Item label="Blood Requester" value="REQUESTER" color={COLORS.text} />
            </Picker>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Blood Group</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.bloodGroup}
              onValueChange={(value) => updateFormData('bloodGroup', value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {bloodGroups.map(group => (
                <Picker.Item key={group} label={group} value={group} color={COLORS.text} />
              ))}
            </Picker>
          </View>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={COLORS.error} />
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}

        {loading && (
          <View style={styles.loaderContainer}>
            <Text style={styles.loadingText}>Creating your account...</Text>
          </View>
        )}

        <Button
          title="Send Verification Code"
          onPress={handleSendVerification}
          loading={loading}
          style={styles.actionButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ECG Pulse Overlay Loader */}
      <ECGPulseOverlay
        visible={loading}
        text="Creating your account..."
      />
    </FluidBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary[0],
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    padding: 24,
    ...SHADOWS.medium,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 20,
    backgroundColor: COLORS.gray,
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    color: COLORS.text,
  },
  pickerItem: {
    fontSize: 16,
    color: COLORS.text,
  },
  actionButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#FFF0F0',
    padding: 10,
    borderRadius: 12,
  },
  error: {
    color: COLORS.error,
    marginLeft: 6,
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
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  linkText: {
    color: COLORS.primary[0],
    fontSize: 15,
    fontWeight: '700',
  },
});

export default RegisterScreen; 