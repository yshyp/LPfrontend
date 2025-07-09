import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ECGPulseOverlay from './common/ECGPulseOverlay';

const VerificationMethodSelector = ({
  onMethodSelect,
  selectedMethod = 'AUTO',
  identifier = '',
  onSendCode,
  loading = false,
  disabled = false
}) => {
  const [localMethod, setLocalMethod] = useState(selectedMethod);

  const methods = [
    {
      id: 'AUTO',
      title: 'Auto Detect',
      subtitle: 'Automatically choose based on your input',
      icon: 'scan-outline',
      color: '#667eea'
    },
    {
      id: 'SMS',
      title: 'SMS/WhatsApp',
      subtitle: 'Receive code via SMS or WhatsApp',
      icon: 'phone-portrait-outline',
      color: '#25d366'
    },
    {
      id: 'EMAIL',
      title: 'Email',
      subtitle: 'Receive code via email',
      icon: 'mail-outline',
      color: '#ea4335'
    }
  ];

  const handleMethodSelect = (method) => {
    setLocalMethod(method);
    
    // Validate method compatibility with identifier
    if (identifier) {
      const isEmail = identifier.includes('@');
      
      if (method === 'EMAIL' && !isEmail) {
        Alert.alert(
          'Invalid Selection',
          'Email verification requires a valid email address. Please enter an email address or choose SMS verification.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      if (method === 'SMS' && isEmail) {
        Alert.alert(
          'Invalid Selection',
          'SMS verification requires a valid phone number. Please enter a phone number or choose Email verification.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    onMethodSelect(method);
  };

  const handleSendCode = () => {
    if (!identifier) {
      Alert.alert('Error', 'Please enter your phone number or email address first.');
      return;
    }
    
    // Validate method compatibility
    const isEmail = identifier.includes('@');
    const effectiveMethod = localMethod === 'AUTO' ? (isEmail ? 'EMAIL' : 'SMS') : localMethod;
    
    if (effectiveMethod === 'EMAIL' && !isEmail) {
      Alert.alert('Error', 'Email verification requires a valid email address.');
      return;
    }
    
    if (effectiveMethod === 'SMS' && isEmail) {
      Alert.alert('Error', 'SMS verification requires a valid phone number.');
      return;
    }
    
    onSendCode(effectiveMethod);
  };

  const getEffectiveMethod = () => {
    if (localMethod === 'AUTO' && identifier) {
      return identifier.includes('@') ? 'EMAIL' : 'SMS';
    }
    return localMethod;
  };

  const effectiveMethod = getEffectiveMethod();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Verification Method</Text>
      <Text style={styles.subtitle}>
        How would you like to receive your verification code?
      </Text>

      <View style={styles.methodsContainer}>
        {methods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              localMethod === method.id && styles.selectedMethod,
              disabled && styles.disabledMethod
            ]}
            onPress={() => !disabled && handleMethodSelect(method.id)}
            disabled={disabled}
          >
            <View style={styles.methodHeader}>
              <View style={[styles.iconContainer, { backgroundColor: method.color }]}>
                <Ionicons name={method.icon} size={24} color="white" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </View>
              {localMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#667eea" />
              )}
            </View>
            
            {localMethod === method.id && method.id === 'AUTO' && identifier && (
              <View style={styles.autoDetectInfo}>
                <Text style={styles.autoDetectText}>
                  Will use: <Text style={styles.autoDetectMethod}>
                    {identifier.includes('@') ? 'Email' : 'SMS'}
                  </Text>
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {identifier && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Verification Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Identifier:</Text>
            <Text style={styles.summaryValue}>
              {identifier.replace(/\w(?=\w{2})/g, '*')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Method:</Text>
            <Text style={styles.summaryValue}>
              {effectiveMethod === 'EMAIL' ? 'Email' : 'SMS/WhatsApp'}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.sendButton,
          (!identifier || loading || disabled) && styles.sendButtonDisabled
        ]}
        onPress={handleSendCode}
        disabled={!identifier || loading || disabled}
      >
        {loading ? (
          <Text style={styles.sendButtonText}>Loading...</Text>
        ) : (
          <>
            <Ionicons name="send" size={20} color="white" />
            <Text style={styles.sendButtonText}>Send Verification Code</Text>
          </>
        )}
      </TouchableOpacity>
      
      {/* ECG Pulse Overlay Loader */}
      <ECGPulseOverlay 
        visible={loading}
        text="Sending verification code..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  methodsContainer: {
    gap: 12,
  },
  methodCard: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  selectedMethod: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  disabledMethod: {
    opacity: 0.6,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  autoDetectInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  autoDetectText: {
    fontSize: 14,
    color: '#333',
  },
  autoDetectMethod: {
    fontWeight: 'bold',
    color: '#667eea',
  },
  summaryContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerificationMethodSelector; 