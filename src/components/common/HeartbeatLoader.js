import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const HeartbeatLoader = ({ size = 60, color }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const ripple1Anim = useRef(new Animated.Value(0)).current;
  const ripple2Anim = useRef(new Animated.Value(0)).current;

  // Pulse color
  const pulseColor = color || (isDark ? '#FF6B6B' : '#FF3B30');

  useEffect(() => {
    // Heartbeat scale animation (Lub-Dub pattern)
    const heartbeat = Animated.sequence([
      // Lub
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      // Dub
      Animated.timing(scaleAnim, {
        toValue: 1.15, // Slightly smaller second beat
        duration: 150,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 350, // Longer pause after dub
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.delay(400) // Rest period
    ]);

    // Ripple animations
    const ripple1 = Animated.timing(ripple1Anim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    });

    const ripple2 = Animated.sequence([
      Animated.delay(400),
      Animated.timing(ripple2Anim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      })
    ]);

    // Start loops
    Animated.loop(heartbeat).start();

    // Ripples loop continuously with the heartbeat cycle
    const startRipples = () => {
      ripple1Anim.setValue(0);
      ripple2Anim.setValue(0);
      Animated.parallel([ripple1, ripple2]).start(() => startRipples());
    };
    startRipples();

  }, []);

  return (
    <View style={styles.container}>
      {/* Ripple 1 */}
      <Animated.View
        style={[
          styles.ripple,
          {
            width: size * 2,
            height: size * 2,
            borderRadius: size,
            backgroundColor: pulseColor,
            opacity: ripple1Anim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0.3, 0.1, 0],
            }),
            transform: [
              {
                scale: ripple1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 2],
                }),
              },
            ],
          },
        ]}
      />

      {/* Ripple 2 */}
      <Animated.View
        style={[
          styles.ripple,
          {
            width: size * 2,
            height: size * 2,
            borderRadius: size,
            backgroundColor: pulseColor,
            opacity: ripple2Anim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0.3, 0.1, 0],
            }),
            transform: [
              {
                scale: ripple2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 2],
                }),
              },
            ],
          },
        ]}
      />

      {/* Heart Icon */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Ionicons name="heart" size={size} color={pulseColor} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  ripple: {
    position: 'absolute',
  },
});

export default HeartbeatLoader;
