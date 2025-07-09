import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import Button from '../components/common/Button';
import ECGPulseLoader from '../components/common/ECGPulseLoader';
import { useUser } from '../context/UserContext';

const PrivacyConsentScreen = ({ navigation }) => {
  const [consents, setConsents] = useState({
    dataProcessing: false,
    locationTracking: false,
    medicalData: false,
    notifications: false,
    analytics: false
  });
  const [loading, setLoading] = useState(false);
  const { recordConsent } = useUser();

  const handleConsentChange = (type, value) => {
    setConsents(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async () => {
    // Check required consents
    if (!consents.dataProcessing || !consents.medicalData) {
      Alert.alert(
        'Required Consents Missing',
        'Data processing and medical data consents are required to use LifePulse.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      // Record all consents
      for (const [type, granted] of Object.entries(consents)) {
        await recordConsent(type, granted);
      }

      Alert.alert(
        'Privacy Settings Saved',
        'Your privacy preferences have been securely stored.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Main')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save privacy settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🔒 Privacy & Consent</Text>
        <Text style={styles.subtitle}>
          Your privacy is important to us. Please review and accept our data usage policies.
        </Text>
      </View>

      <View style={styles.consentSection}>
        <View style={styles.consentItem}>
          <View style={styles.consentHeader}>
            <Text style={styles.consentTitle}>Data Processing (Required)</Text>
            <Switch
              value={consents.dataProcessing}
              onValueChange={(value) => handleConsentChange('dataProcessing', value)}
              trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              thumbColor={consents.dataProcessing ? '#FFF' : '#F4F3F4'}
            />
          </View>
          <Text style={styles.consentDescription}>
            We need to process your basic information (name, contact details) to provide blood donation services.
          </Text>
        </View>

        <View style={styles.consentItem}>
          <View style={styles.consentHeader}>
            <Text style={styles.consentTitle}>Medical Data (Required)</Text>
            <Switch
              value={consents.medicalData}
              onValueChange={(value) => handleConsentChange('medicalData', value)}
              trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              thumbColor={consents.medicalData ? '#FFF' : '#F4F3F4'}
            />
          </View>
          <Text style={styles.consentDescription}>
            Blood group and donation history are essential for matching donors with recipients safely.
          </Text>
        </View>

        <View style={styles.consentItem}>
          <View style={styles.consentHeader}>
            <Text style={styles.consentTitle}>Location Tracking</Text>
            <Switch
              value={consents.locationTracking}
              onValueChange={(value) => handleConsentChange('locationTracking', value)}
              trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              thumbColor={consents.locationTracking ? '#FFF' : '#F4F3F4'}
            />
          </View>
          <Text style={styles.consentDescription}>
            Your location helps us find nearby blood requests and donation centers. Location data is encrypted and anonymized.
          </Text>
        </View>

        <View style={styles.consentItem}>
          <View style={styles.consentHeader}>
            <Text style={styles.consentTitle}>Push Notifications</Text>
            <Switch
              value={consents.notifications}
              onValueChange={(value) => handleConsentChange('notifications', value)}
              trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              thumbColor={consents.notifications ? '#FFF' : '#F4F3F4'}
            />
          </View>
          <Text style={styles.consentDescription}>
            Receive notifications about urgent blood requests and donation reminders.
          </Text>
        </View>

        <View style={styles.consentItem}>
          <View style={styles.consentHeader}>
            <Text style={styles.consentTitle}>Anonymous Analytics</Text>
            <Switch
              value={consents.analytics}
              onValueChange={(value) => handleConsentChange('analytics', value)}
              trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              thumbColor={consents.analytics ? '#FFF' : '#F4F3F4'}
            />
          </View>
          <Text style={styles.consentDescription}>
            Help us improve the app with anonymized usage statistics. No personal data is shared.
          </Text>
        </View>
      </View>

      <View style={styles.securityInfo}>
        <Text style={styles.securityTitle}>🛡️ Your Data Security</Text>
        <Text style={styles.securityText}>
          • All personal data is encrypted using AES-256 encryption{'\n'}
          • Medical information is stored separately and encrypted{'\n'}
          • Location data is anonymized for privacy{'\n'}
          • You can export or delete your data anytime{'\n'}
          • We comply with GDPR and healthcare privacy standards
        </Text>
      </View>

      <Button
        title="Save Privacy Settings"
        onPress={handleSubmit}
        loading={loading}
        style={styles.saveButton}
        disabled={!consents.dataProcessing || !consents.medicalData}
      />

      <Button
        title="Read Full Privacy Policy"
        onPress={() => navigation.navigate('PrivacyPolicy')}
        variant="secondary"
        style={styles.policyButton}
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
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
    lineHeight: 24,
  },
  consentSection: {
    marginBottom: 30,
  },
  consentItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  consentDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  securityInfo: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  saveButton: {
    marginBottom: 12,
  },
  policyButton: {
    marginBottom: 20,
  },
});

export default PrivacyConsentScreen;
