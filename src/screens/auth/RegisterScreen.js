import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ECGPulseOverlay from '../../components/common/ECGPulseOverlay';
import authService from '../../services/authService';
import { Ionicons } from '@expo/vector-icons';

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

  const getIdentifierLabel = () => {
    return formData.identifier.includes('@') ? 'Email Address' : 'Phone Number';
  };

  const getIdentifierPlaceholder = () => {
    return formData.identifier.includes('@') ? 'Enter your email address' : 'Enter your phone number';
  };

  const getKeyboardType = () => {
    return formData.identifier.includes('@') ? 'email-address' : 'phone-pad';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Ionicons name="person-add" size={48} color="#FF3B30" style={{ marginBottom: 8 }} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join LifePulse - Quick signup with OTP verification</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <Ionicons name="person" size={20} color="#8E8E93" style={styles.inputIcon} />
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            placeholder="Enter your full name"
            style={styles.input}
          />
        </View>
        <View style={styles.inputRow}>
          <Ionicons name="call" size={20} color="#8E8E93" style={styles.inputIcon} />
          <Input
            label="Phone Number or Email"
            value={formData.identifier}
            onChangeText={(value) => updateFormData('identifier', value)}
            placeholder="Enter phone (for WhatsApp) or email"
            keyboardType="default"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.role}
              onValueChange={(value) => updateFormData('role', value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Blood Donor" value="DONOR" color="#1C1C1E" />
              <Picker.Item label="Blood Requester" value="REQUESTER" color="#1C1C1E" />
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
                <Picker.Item key={group} label={group} value={group} color="#1C1C1E" />
              ))}
            </Picker>
          </View>
        </View>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
        
        {loading && (
          <View style={styles.loaderContainer}>
            <Text style={styles.loadingText}>Creating your account...</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.registerButton, loading && styles.buttonHidden]}
          onPress={handleSendVerification}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>Send Verification Code</Text>
        </TouchableOpacity>
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('Login')}
          variant="secondary"
        />
      </View>
      
      {/* ECG Pulse Overlay Loader */}
      <ECGPulseOverlay 
        visible={loading}
        text="Creating your account..."
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
    marginTop: 40,
    marginBottom: 30,
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
  },
  form: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  picker: {
    height: 50,
    color: '#1C1C1E',
  },
  pickerItem: {
    color: '#1C1C1E',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonHidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  error: {
    color: 'red',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default RegisterScreen; 