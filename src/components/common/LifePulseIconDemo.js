import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LifePulseIcon from './LifePulseIcon';

const LifePulseIconDemo = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>LifePulse Icon Variations</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default Icon</Text>
        <LifePulseIcon size={120} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Small Icon</Text>
        <LifePulseIcon size={60} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Large Icon</Text>
        <LifePulseIcon size={200} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Colors</Text>
        <View style={styles.colorRow}>
          <LifePulseIcon size={80} heartColor="#ff6b6b" />
          <LifePulseIcon size={80} heartColor="#4ecdc4" />
          <LifePulseIcon size={80} heartColor="#45b7d1" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dark Background</Text>
        <View style={styles.darkContainer}>
          <LifePulseIcon 
            size={100} 
            backgroundColor="#2c3e50"
            pulseColor="#ecf0f1"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>No Shadow</Text>
        <LifePulseIcon size={100} showShadow={false} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Pulse Color</Text>
        <LifePulseIcon 
          size={100} 
          pulseColor="#f39c12"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#34495e',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  darkContainer: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
  },
});

export default LifePulseIconDemo; 