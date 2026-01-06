import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import welcomeService from '../services/welcomeService';

const { width, height } = Dimensions.get('window');

const IntroScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Blob animations
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;
  const contentFadeAnim = useRef(new Animated.Value(1)).current;

  // Animation for blobs
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blob1Anim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: false,
        }),
        Animated.timing(blob1Anim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blob2Anim, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: false,
        }),
        Animated.timing(blob2Anim, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const slideTransition = (callback) => {
    Animated.sequence([
      Animated.timing(contentFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    // Execute state change in middle of fade
    setTimeout(callback, 200);
  };

  const blob1TranslateY = blob1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const blob2TranslateY = blob2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const blob1Scale = blob1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  const blob2Scale = blob2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  const slides = [
    {
      id: 1,
      title: 'Welcome to LifePulse',
      subtitle: 'Connecting Hearts, Saving Lives',
      description: 'Join our community of blood donors and recipients. Every drop counts in making a difference.',
      icon: 'heart-circle',
      iconColor: '#FF6B6B',
      blob1Color: isDark ? '#4A0E0E' : '#FFD6D6',
      blob2Color: isDark ? '#0E1F4A' : '#D6E4FF',
    },
    {
      id: 2,
      title: 'Find Donors Nearby',
      subtitle: 'Quick & Efficient',
      description: 'Locate compatible blood donors in your area instantly with our smart matching system.',
      icon: 'location',
      iconColor: '#4ECDC4',
      blob1Color: isDark ? '#0E4A45' : '#D6FFF9',
      blob2Color: isDark ? '#4A3B0E' : '#FFEFD6',
    },
    {
      id: 3,
      title: 'Real-time Updates',
      subtitle: 'Stay Informed',
      description: 'Get instant notifications for blood requests, acceptances, and urgent needs in your community.',
      icon: 'notifications',
      iconColor: '#FFD93D',
      blob1Color: isDark ? '#4A3B0E' : '#FFEFD6',
      blob2Color: isDark ? '#4A0E0E' : '#FFD6D6',
    },
    {
      id: 4,
      title: 'Safe & Secure',
      subtitle: 'Privacy First',
      description: 'Your data is protected with industry-standard security. Donate and request with confidence.',
      icon: 'shield-checkmark',
      iconColor: '#6C5CE7',
      blob1Color: isDark ? '#1F0E4A' : '#E0D6FF',
      blob2Color: isDark ? '#0E4A45' : '#D6FFF9',
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      slideTransition(() => setCurrentSlide(currentSlide + 1));
    } else {
      completeIntro();
    }
  };

  const completeIntro = async () => {
    await welcomeService.markWelcomeAsSeen();
    navigation.replace('Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Dynamic Background Blobs */}
      <Animated.View
        style={[
          styles.blob,
          styles.blob1,
          {
            backgroundColor: slides[currentSlide].blob1Color,
            transform: [
              { translateY: blob1TranslateY },
              { scale: blob1Scale }
            ]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          styles.blob2,
          {
            backgroundColor: slides[currentSlide].blob2Color,
            transform: [
              { translateY: blob2TranslateY },
              { scale: blob2Scale }
            ]
          }
        ]}
      />

      {/* Glassmorphism Content Card */}
      <View style={styles.contentContainer}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={completeIntro}
            style={styles.skipButton}
          >
            <Text style={[styles.skipText, { color: colors.subtext }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={[
          styles.cardContainer,
          {
            opacity: contentFadeAnim,
            transform: [{ scale: contentFadeAnim }]
          }
        ]}>
          <View style={[styles.glassCard, { backgroundColor: isDark ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.7)' }]}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? '#000' : '#FFF' }]}>
                <Ionicons
                  name={slides[currentSlide].icon}
                  size={60}
                  color={slides[currentSlide].iconColor}
                />
              </View>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              {slides[currentSlide].title}
            </Text>

            <Text style={[styles.subtitle, { color: colors.primary }]}>
              {slides[currentSlide].subtitle}
            </Text>

            <Text style={[styles.description, { color: colors.subtext }]}>
              {slides[currentSlide].description}
            </Text>

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: index === currentSlide ? colors.primary : colors.border,
                      width: index === currentSlide ? 24 : 8,
                    }
                  ]}
                />
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Bottom Action Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons
              name={currentSlide === slides.length - 1 ? "rocket-outline" : "arrow-forward"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
  },
  blob1: {
    width: width * 1.2,
    height: width * 1.2,
    top: -width * 0.4,
    right: -width * 0.3,
  },
  blob2: {
    width: width * 1.0,
    height: width * 1.0,
    bottom: -width * 0.4,
    left: -width * 0.3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    zIndex: 10,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: 20,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  glassCard: {
    width: '100%',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomContainer: {
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default IntroScreen;