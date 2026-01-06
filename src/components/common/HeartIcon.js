import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeartIcon = ({ 
  size = 24, 
  color = '#e74c3c', 
  style,
  showPulse = false,
  variant = 'filled' // 'filled', 'outline', 'pulse'
}) => {
  const getHeartSymbol = () => {
    switch (variant) {
      case 'outline':
        return '♡';
      case 'pulse':
        return '❤️';
      case 'filled':
      default:
        return '❤️';
    }
  };

  const fontSize = size * 0.8; // Scale font size relative to container

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Text style={[styles.heartText, { fontSize, color }]}>
        {getHeartSymbol()}
      </Text>
      
      {/* Optional pulse indicator */}
      {showPulse && (
        <View style={styles.pulseIndicator}>
          <Text style={styles.pulseText}>💓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heartText: {
    textAlign: 'center',
    lineHeight: 1,
  },
  pulseIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  pulseText: {
    fontSize: 8,
  },
});

export default HeartIcon; 