import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeartIcon from './HeartIcon';

const HeartIconDemo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart Icon Examples</Text>
      
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <HeartIcon size={32} color="#e74c3c" />
          <Text style={styles.label}>Default</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <HeartIcon size={32} color="#e74c3c" variant="outline" />
          <Text style={styles.label}>Outline</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <HeartIcon size={32} color="#e74c3c" showPulse={true} />
          <Text style={styles.label}>With Pulse</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <HeartIcon size={48} color="#c0392b" />
          <Text style={styles.label}>Large</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <HeartIcon size={24} color="#e67e22" />
          <Text style={styles.label}>Orange</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <HeartIcon size={20} color="#9b59b6" />
          <Text style={styles.label}>Purple</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
});

export default HeartIconDemo; 