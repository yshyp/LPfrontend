import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ECGPulseLoader from './ECGPulseLoader';

const ECGPulseLoaderDemo = () => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🩺 ECG Pulse Loader Demo</Text>
      <Text style={styles.subtitle}>Realistic ECG monitor-style loading animations</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default ECG Loader</Text>
        <ECGPulseLoader text="Loading..." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Small ECG Loader</Text>
        <ECGPulseLoader size={120} text="Processing..." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Large ECG Loader</Text>
        <ECGPulseLoader size={280} text="Initializing..." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fast Pulse</Text>
        <ECGPulseLoader speed={2.5} text="Quick loading..." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Slow Pulse</Text>
        <ECGPulseLoader speed={0.8} text="Patient loading..." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Different Colors</Text>
        <View style={styles.colorRow}>
          <ECGPulseLoader size={100} color="#FF3B30" text="Red" />
          <ECGPulseLoader size={100} color="#007AFF" text="Blue" />
          <ECGPulseLoader size={100} color="#34C759" text="Green" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interactive Demo</Text>
        <TouchableOpacity style={styles.button} onPress={startLoading}>
          <Text style={styles.buttonText}>Start Loading Demo</Text>
        </TouchableOpacity>
        
        {loading && (
          <View style={styles.demoLoader}>
            <ECGPulseLoader text="Demo in progress..." />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.features}>
          <Text style={styles.feature}>• Realistic ECG waveform animation</Text>
          <Text style={styles.feature}>• Grid lines for monitor effect</Text>
          <Text style={styles.feature}>• Moving pulse dot</Text>
          <Text style={styles.feature}>• Heartbeat scale animation</Text>
          <Text style={styles.feature}>• Customizable size and speed</Text>
          <Text style={styles.feature}>• Heart icon overlay</Text>
          <Text style={styles.feature}>• Custom text support</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  demoLoader: {
    marginTop: 20,
    alignItems: 'center',
  },
  features: {
    marginTop: 10,
  },
  feature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 10,
  },
});

export default ECGPulseLoaderDemo; 