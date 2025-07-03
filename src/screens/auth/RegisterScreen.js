import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
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
    setLoading(true);
    try {
      // Auto-detect method based on identifier
      const method = formData.identifier.includes('@') ? 'EMAIL' : 'SMS';
      await authService.sendVerification(formData.identifier.trim(), 'EMAIL_VERIFICATION', method, formData.name.trim());
      const methodText = method === 'EMAIL' ? 'email' : 'SMS/WhatsApp';
      Alert.alert(
        'Verification Code Sent!',
        `A 6-digit verification code has been sent to your ${methodText}.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OTPVerification', {
              identifier: formData.identifier.trim(),
              type: 'EMAIL_VERIFICATION',
              method: method,
              userData: {
                name: formData.name.trim(),
                role: formData.role,
                bloodGroup: formData.bloodGroup,
                longitude: 0, // Will be updated with real location later
                latitude: 0   // Will be updated with real location later
              }
            })
          }
        ]
      );
    } catch (error) {
      console.error('Send verification error:', error);
      setError(error.response?.data?.error || 'Failed to send verification code');
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
        <Text style={styles.subtitle}>Join the LifePulse network</Text>
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
            placeholder="Enter your phone number or email"
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
            >
              <Picker.Item label="Blood Donor" value="DONOR" />
              <Picker.Item label="Blood Requester" value="REQUESTER" />
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
            >
              {bloodGroups.map(group => (
                <Picker.Item key={group} label={group} value={group} />
              ))}
            </Picker>
          </View>
        </View>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
        <TouchableOpacity
          style={[styles.registerButton, loading && styles.buttonDisabled]}
          onPress={handleSendVerification}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.registerButtonText}>Send Verification Code</Text>
          )}
        </TouchableOpacity>
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('Login')}
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
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
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
  error: {
    color: 'red',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default RegisterScreen; 