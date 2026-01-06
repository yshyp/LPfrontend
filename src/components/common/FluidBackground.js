import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const FluidBackground = ({ children }) => {
    const { colors } = useTheme();
    const blob1Anim = useRef(new Animated.Value(0)).current;
    const blob2Anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blob1Anim, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: false, // Changed to false for better compatibility with background color changes if needed
                }),
                Animated.timing(blob1Anim, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: false,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(blob2Anim, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: false,
                }),
                Animated.timing(blob2Anim, {
                    toValue: 0,
                    duration: 5000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    const blob1TranslateY = blob1Anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    const blob2TranslateY = blob2Anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 30],
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={[colors.card, colors.background]}
                style={styles.background}
            />

            {/* Animated Blobs */}
            <Animated.View
                style={[
                    styles.blob,
                    styles.blob1,
                    {
                        backgroundColor: colors.blob1,
                        transform: [{ translateY: blob1TranslateY }]
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.blob,
                    styles.blob2,
                    {
                        backgroundColor: colors.blob2,
                        transform: [{ translateY: blob2TranslateY }]
                    },
                ]}
            />

            {/* Glass Overlay/Content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    blob: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.5,
    },
    blob1: {
        width: width * 0.8,
        height: width * 0.8,
        top: -width * 0.2,
        right: -width * 0.2,
    },
    blob2: {
        width: width * 0.9,
        height: width * 0.9,
        bottom: -width * 0.2,
        left: -width * 0.2,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
        minHeight: height,
    },
});

export default FluidBackground;
