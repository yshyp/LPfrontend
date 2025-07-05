import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const HeartbeatLoader = ({ size = 24, color = '#FF6B6B', text = null, style = {} }) => {
  const heartbeatAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const heartbeat = () => {
      Animated.sequence([
        Animated.timing(heartbeatAnim, {
          toValue: 1.3,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(800), // Pause before next heartbeat
      ]).start(() => {
        heartbeat(); // Loop the animation
      });
    };
    
    heartbeat();
  }, [heartbeatAnim]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.heartContainer, { transform: [{ scale: heartbeatAnim }] }]}>
        <Text style={[styles.heartIcon, { fontSize: size, color }]}>💗</Text>
      </Animated.View>
      {text && <Text style={[styles.loadingText, { color }]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HeartbeatLoader;
