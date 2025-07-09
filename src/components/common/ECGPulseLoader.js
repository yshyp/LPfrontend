import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ECGPulseLoader = ({ 
  size = 200, 
  color = '#FF3B30', 
  text = null, 
  style = {},
  speed = 1.5 
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous pulse animation
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000 / speed,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000 / speed,
          useNativeDriver: false,
        }),
      ]).start(() => pulseAnimation());
    };

    // Heartbeat scale animation
    const heartbeatAnimation = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ]).start(() => heartbeatAnimation());
    };

    // Moving line animation
    const lineAnimation = () => {
      Animated.timing(lineAnim, {
        toValue: 1,
        duration: 3000 / speed,
        useNativeDriver: false,
      }).start(() => {
        lineAnim.setValue(0);
        lineAnimation();
      });
    };

    pulseAnimation();
    heartbeatAnimation();
    lineAnimation();
  }, [pulseAnim, scaleAnim, lineAnim, speed]);

  // Create ECG waveform using multiple animated lines
  const createECGLines = () => {
    const lines = [];
    const lineWidth = size;
    const lineHeight = size * 0.6;
    const centerY = lineHeight / 2;
    
    // Base line
    lines.push(
      <Animated.View
        key="base"
        style={[
          styles.ecgLine,
          {
            width: lineWidth,
            height: 2,
            backgroundColor: color,
            opacity: 0.3,
            position: 'absolute',
            top: centerY,
          }
        ]}
      />
    );

    // P wave (small bump)
    const pWaveOpacity = pulseAnim.interpolate({
      inputRange: [0, 0.2, 0.4, 1],
      outputRange: [0, 1, 1, 0],
    });
    
    lines.push(
      <Animated.View
        key="p-wave"
        style={[
          styles.ecgLine,
          {
            width: 20,
            height: 2,
            backgroundColor: color,
            opacity: pWaveOpacity,
            position: 'absolute',
            top: centerY - 5,
            left: lineWidth * 0.1,
            transform: [{ rotate: '15deg' }],
          }
        ]}
      />
    );

    // QRS complex (sharp spike)
    const qrsOpacity = pulseAnim.interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: [0, 1, 1, 0],
    });
    
    lines.push(
      <Animated.View
        key="qrs"
        style={[
          styles.ecgLine,
          {
            width: 4,
            height: 40,
            backgroundColor: color,
            opacity: qrsOpacity,
            position: 'absolute',
            top: centerY - 20,
            left: lineWidth * 0.3,
          }
        ]}
      />
    );

    // T wave (rounded bump)
    const tWaveOpacity = pulseAnim.interpolate({
      inputRange: [0, 0.6, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    });
    
    lines.push(
      <Animated.View
        key="t-wave"
        style={[
          styles.ecgLine,
          {
            width: 15,
            height: 2,
            backgroundColor: color,
            opacity: tWaveOpacity,
            position: 'absolute',
            top: centerY - 8,
            left: lineWidth * 0.55,
            transform: [{ rotate: '-10deg' }],
          }
        ]}
      />
    );

    // Moving dot
    const dotPosition = lineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, lineWidth - 10],
    });

    lines.push(
      <Animated.View
        key="moving-dot"
        style={[
          styles.movingDot,
          {
            left: dotPosition,
            backgroundColor: color,
          }
        ]}
      />
    );

    return lines;
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.ecgContainer, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.ecgMonitor, { width: size, height: size * 0.6 }]}>
          {/* Grid lines for ECG monitor effect */}
          {[...Array(5)].map((_, i) => (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLine,
                {
                  top: (size * 0.6 / 5) * i,
                  width: size,
                  height: 1,
                }
              ]}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLine,
                {
                  left: (size / 5) * i,
                  width: 1,
                  height: size * 0.6,
                }
              ]}
            />
          ))}
          
          {/* ECG waveform lines */}
          {createECGLines()}
        </View>
        
        {/* Heart icon overlay */}
        <View style={styles.heartContainer}>
          <Text style={[styles.heartIcon, { color }]}>❤️</Text>
        </View>
      </Animated.View>
      
      {text && (
        <Text style={[styles.loadingText, { color }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  ecgContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecgMonitor: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#E5E5EA',
    opacity: 0.3,
  },
  ecgLine: {
    borderRadius: 1,
  },
  movingDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: '50%',
    marginTop: -4,
  },
  heartContainer: {
    position: 'absolute',
    top: -20,
    right: -20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heartIcon: {
    fontSize: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ECGPulseLoader; 