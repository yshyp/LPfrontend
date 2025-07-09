import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const ECGPulseLoader = ({ size = 100, color = '#e74c3c', strokeWidth = 3 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulseAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          // Flat line
          Animated.timing(animatedValue, {
            toValue: 0.1,
            duration: 300,
            useNativeDriver: false,
          }),
          // Small rise
          Animated.timing(animatedValue, {
            toValue: 0.2,
            duration: 50,
            useNativeDriver: false,
          }),
          // Sharp spike up
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 80,
            useNativeDriver: false,
          }),
          // Sharp drop down
          Animated.timing(animatedValue, {
            toValue: -0.3,
            duration: 60,
            useNativeDriver: false,
          }),
          // Return to baseline
          Animated.timing(animatedValue, {
            toValue: 0.1,
            duration: 100,
            useNativeDriver: false,
          }),
          // Flat line pause
          Animated.timing(animatedValue, {
            toValue: 0.1,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      );
    };

    const animation = createPulseAnimation();
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  // Create multiple pulse points for ECG effect
  const renderPulseWave = () => {
    const points = [];
    const numPoints = 8;
    
    for (let i = 0; i < numPoints; i++) {
      const animatedHeight = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [size * 0.5, size * 0.1], // Inverted for ECG effect
        extrapolate: 'clamp',
      });

      const opacity = animatedValue.interpolate({
        inputRange: [0, 0.3, 0.7, 1],
        outputRange: [0.3, 1, 1, 0.3],
        extrapolate: 'clamp',
      });

      points.push(
        <Animated.View
          key={i}
          style={[
            styles.pulseLine,
            {
              height: i === 3 ? animatedHeight : size * 0.5, // Main spike at center
              width: strokeWidth,
              backgroundColor: color,
              opacity: i === 3 ? opacity : 0.4,
              marginHorizontal: 2,
              transform: [
                {
                  scaleY: i === 3 ? 1 : (i === 2 || i === 4 ? 0.3 : 0.1)
                }
              ]
            }
          ]}
        />
      );
    }
    return points;
  };

  return (
    <View style={[styles.container, { width: size * 1.5, height: size }]}>
      {/* Background ECG grid */}
      <View style={styles.gridBackground}>
        {/* Horizontal lines */}
        {[...Array(5)].map((_, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.gridLine,
              {
                top: (size / 5) * i,
                width: '100%',
                height: 1,
                backgroundColor: `${color}20`,
              }
            ]}
          />
        ))}
        {/* Vertical lines */}
        {[...Array(8)].map((_, i) => (
          <View
            key={`v-${i}`}
            style={[
              styles.gridLine,
              {
                left: (size * 1.5 / 8) * i,
                height: '100%',
                width: 1,
                backgroundColor: `${color}20`,
              }
            ]}
          />
        ))}
      </View>

      {/* Pulse wave */}
      <View style={styles.pulseContainer}>
        {renderPulseWave()}
      </View>

      {/* Animated scanning line */}
      <Animated.View
        style={[
          styles.scanLine,
          {
            backgroundColor: color,
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, size * 0.5],
                  extrapolate: 'clamp',
                })
              }
            ]
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 10,
  },
  gridBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
  },
  pulseLine: {
    borderRadius: 1,
  },
  scanLine: {
    position: 'absolute',
    width: 2,
    height: '80%',
    zIndex: 3,
  },
});

export default ECGPulseLoader;