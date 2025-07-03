import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const IntroScreen = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heartBeatAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      title: '🩸 LifePulse',
      subtitle: 'Connecting Hearts, Saving Lives',
      description: 'Join our community of blood donors and recipients to make a difference in someone\'s life.',
      icon: '❤️',
      color: ['#FF6B6B', '#FF8E8E']
    },
    {
      title: 'Quick & Easy',
      subtitle: 'Find Donors Nearby',
      description: 'Locate blood donors in your area instantly. Our smart matching system connects you with compatible donors.',
      icon: '📍',
      color: ['#4ECDC4', '#6EE7DF']
    },
    {
      title: 'Real-time Updates',
      subtitle: 'Stay Connected',
      description: 'Get instant notifications when someone needs blood or when your request is accepted.',
      icon: '🔔',
      color: ['#45B7D1', '#67C9E3']
    },
    {
      title: 'Safe & Secure',
      subtitle: 'Your Privacy Matters',
      description: 'Your personal information is protected. We ensure secure and confidential blood donation matching.',
      icon: '🔒',
      color: ['#96CEB4', '#B8E0C8']
    }
  ];

  // Heart beat animation
  useEffect(() => {
    const heartBeat = () => {
      Animated.sequence([
        Animated.timing(heartBeatAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeatAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(heartBeat, 1000);
      });
    };
    heartBeat();
  }, [heartBeatAnim]);

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Slide animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentSlide,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentSlide, slideAnim]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Navigate to login screen
      navigation.replace('Login');
    }
  };

  const skipIntro = () => {
    navigation.replace('Login');
  };

  const renderHeartBeat = () => (
    <Animated.View
      style={[
        styles.heartContainer,
        {
          transform: [{ scale: heartBeatAnim }],
        },
      ]}
    >
      <Text style={styles.heartIcon}>❤️</Text>
    </Animated.View>
  );

  const renderSlide = (slide, index) => (
    <Animated.View
      key={index}
      style={[
        styles.slide,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [width, 0, -width],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={slide.color}
        style={styles.slideGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.slideContent}>
          <Text style={styles.slideIcon}>{slide.icon}</Text>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          <Text style={styles.slideDescription}>{slide.description}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentSlide ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
              width: index === currentSlide ? 20 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background with floating hearts */}
      <View style={styles.background}>
        {[...Array(20)].map((_, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.floatingHeart,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            ❤️
          </Animated.Text>
        ))}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Header with heart beat */}
        <View style={styles.header}>
          {renderHeartBeat()}
          <Text style={styles.appName}>LifePulse</Text>
          <TouchableOpacity onPress={skipIntro} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Slides */}
        <View style={styles.slidesContainer}>
          {slides.map((slide, index) => renderSlide(slide, index))}
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          {renderDots()}
          
          <TouchableOpacity onPress={nextSlide} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Text style={styles.nextButtonIcon}>
              {currentSlide === slides.length - 1 ? '🚀' : '→'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingHeart: {
    position: 'absolute',
    fontSize: 20,
    color: 'rgba(255, 107, 107, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  skipButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  slidesContainer: {
    flex: 1,
    position: 'relative',
  },
  slide: {
    position: 'absolute',
    width: width - 40,
    height: height * 0.5,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  slideGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 280,
  },
  slideIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  slideSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.9,
  },
  slideDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginRight: 10,
  },
  nextButtonIcon: {
    fontSize: 20,
  },
});

export default IntroScreen; 