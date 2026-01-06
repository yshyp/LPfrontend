import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SHADOWS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary' // primary, secondary, danger, outline
}) => {
  const { colors } = useTheme();
  const animatedScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const getGradientColors = () => {
    if (disabled) return ['#E5E5EA', '#E5E5EA']; // Fallback for lightGray
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'danger': return ['#FF3B30', '#FF3B30'];
      case 'outline': return ['transparent', 'transparent'];
      default: return colors.primary;
    }
  };

  const renderContent = () => (
    <>
      {loading ? (
        <Text style={[
          styles.text,
          variant === 'outline' ? { color: colors.primary[0] } : { color: colors.white },
          textStyle
        ]}>
          Loading...
        </Text>
      ) : (
        <Text style={[
          styles.text,
          variant === 'outline' ? { color: colors.primary[0] } : { color: colors.white },
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </>
  );

  if (variant === 'outline') {
    return (
      <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.outline,
            { borderColor: colors.primary[0] },
            disabled && styles.disabled,
            style
          ]}
          onPress={onPress}
          disabled={disabled || loading}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          {renderContent()}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[styles.containerShadow, variant === 'primary' && SHADOWS.primary, style]}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, disabled && styles.disabled]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  containerShadow: {
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 55,
  },
  outline: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default Button; 