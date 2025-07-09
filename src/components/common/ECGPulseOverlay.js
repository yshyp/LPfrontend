import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Modal } from 'react-native';

const { width, height } = Dimensions.get('window');

const ECGPulseOverlay = ({ 
  visible = false,
  size = 200, 
  color = '#FF3B30', 
  text = null, 
  speed = 1.5,
  backgroundColor = 'rgba(0, 0, 0, 0.7)'
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  useEffect(() => {
    if (visible) {
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
            toValue: 1.05,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(1200),
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
    }
  }, [visible, pulseAnim, scaleAnim, lineAnim, speed]);

  // Create realistic ECG waveform using multiple animated lines
  const createECGLines = () => {
    const lines = [];
    const lineWidth = size;
    const lineHeight = size * 0.6;
    const centerY = lineHeight / 2;
    
    // Base line (isoelectric line)
    lines.push(
      <Animated.View
        key="base"
        style={[
          styles.ecgLine,
          {
            width: lineWidth,
            height: 1,
            backgroundColor: color,
            opacity: 0.2,
            position: 'absolute',
            top: centerY,
          }
        ]}
      />
    );

    // P wave (small rounded bump)
    const pWaveOpacity = pulseAnim.interpolate({
      inputRange: [0, 0.1, 0.3, 0.4, 1],
      outputRange: [0, 1, 1, 0, 0],
    });
    
    lines.push(
      <Animated.View
        key="p-wave"
        style={[
          styles.ecgLine,
          {
            width: 12,
            height: 1,
            backgroundColor: color,
            opacity: pWaveOpacity,
            position: 'absolute',
            top: centerY - 3,
            left: lineWidth * 0.15,
            transform: [{ rotate: '20deg' }],
          }
        ]}
      />
    );

    lines.push(
      <Animated.View
        key="p-wave-2"
        style={[
          styles.ecgLine,
          {
            width: 12,
            height: 1,
            backgroundColor: color,
            opacity: pWaveOpacity,
            position: 'absolute',
            top: centerY - 3,
            left: lineWidth * 0.15 + 6,
            transform: [{ rotate: '-20deg' }],
          }
        ]}
      />
    );

    // Q wave (small downward deflection)
    const qWaveOpacity = pulseAnim.interpolate({
      inputRange: [0, 0.25, 0.35, 0.45, 1],
      outputRange: [0, 1, 1, 0, 0],
    });
    
    lines.push(
      <Animated.View
        key="q-wave"
        style={[
          styles.ecgLine,
          {
            width: 1,
            height: 8,
            backgroundColor: color,
            opacity: qWaveOpacity,
            position: 'absolute',
            top: centerY + 4,
            left: lineWidth * 0.28,
          }
        ]}
      />
    );

    // R wave (large upward spike)
    const rWaveOpacity = pulseAnim.interpolate({
      inputRange: [0, 0.3, 0.5, 0.6, 1],
      outputRange: [0, 1, 1, 0, 0],
    });
    
    lines.push(
      <Animated.View
        key="r-wave"
        style={[
          styles.ecgLine,
          {
            width: 2,
            height: 35,
            backgroundColor: color,
            opacity: rWaveOpacity,
            position: 'absolute',
            top: centerY - 17,
            left: lineWidth * 0.3,
          }
        ]}
      />
    );

    // S wave (downward deflection after R)
    const sWaveOpacity = pulseAnim.interpolate({
      inputRange: [0, 0.35, 0.55, 0.65, 1],
      outputRange: [0, 1, 1, 0, 0],
    });
    
    lines.push(
      <Animated.View
        key="s-wave"
        style={[
          styles.ecgLine,
          {
            width: 1,
            height: 12,
            backgroundColor: color,
            opacity: sWaveOpacity,
            position: 'absolute',
            top: centerY + 6,
            left: lineWidth * 0.32,
          }
        ]}
      />
    );

    // ST segment (flat line after S wave)
    const stOpacity = pulseAnim.interpolate({
      inputRange: [0, 0.4, 0.7, 0.8, 1],
      outputRange: [0, 1, 1, 0, 0],
    });
    
    lines.push(
      <Animated.View
        key="st-segment"
        style={[
          styles.ecgLine,
          {
            width: lineWidth * 0.15,
            height: 1,
            backgroundColor: color,
            opacity: stOpacity,
            position: 'absolute',
            top: centerY + 1,
            left: lineWidth * 0.33,
          }
        ]}
      />
    );

    // T wave (rounded bump)
    const tWaveOpacity = pulseAnim.interpolate({
      inputRange: [0, 0.6, 0.8, 0.9, 1],
      outputRange: [0, 1, 1, 0, 0],
    });
    
    lines.push(
      <Animated.View
        key="t-wave"
        style={[
          styles.ecgLine,
          {
            width: 10,
            height: 1,
            backgroundColor: color,
            opacity: tWaveOpacity,
            position: 'absolute',
            top: centerY - 4,
            left: lineWidth * 0.48,
            transform: [{ rotate: '15deg' }],
          }
        ]}
      />
    );

    lines.push(
      <Animated.View
        key="t-wave-2"
        style={[
          styles.ecgLine,
          {
            width: 10,
            height: 1,
            backgroundColor: color,
            opacity: tWaveOpacity,
            position: 'absolute',
            top: centerY - 4,
            left: lineWidth * 0.48 + 5,
            transform: [{ rotate: '-15deg' }],
          }
        ]}
      />
    );

    // Moving dot (cursor)
    const dotPosition = lineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, lineWidth - 6],
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

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      statusBarTranslucent={true}
    >
      <Animated.View 
        style={[
          styles.overlay,
          { 
            backgroundColor,
            opacity: fadeAnim
          }
        ]}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.ecgContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.ecgMonitor, { width: size, height: size * 0.6 }]}>
              {/* Grid lines for ECG monitor effect */}
              {[...Array(6)].map((_, i) => (
                <View
                  key={`h-${i}`}
                  style={[
                    styles.gridLine,
                    {
                      top: (size * 0.6 / 6) * i,
                      width: size,
                      height: 0.5,
                    }
                  ]}
                />
              ))}
              {[...Array(6)].map((_, i) => (
                <View
                  key={`v-${i}`}
                  style={[
                    styles.gridLine,
                    {
                      left: (size / 6) * i,
                      width: 0.5,
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
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
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
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333333',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#1a1a1a',
    opacity: 0.4,
  },
  ecgLine: {
    borderRadius: 0.5,
  },
  movingDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    top: '50%',
    marginTop: -3,
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
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ECGPulseOverlay; 