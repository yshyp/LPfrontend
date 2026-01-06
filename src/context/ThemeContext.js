import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === 'dark');
    const [colors, setColors] = useState(isDark ? darkTheme : lightTheme);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved theme preference
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme !== null) {
                    setIsDark(savedTheme === 'dark');
                }
            } catch (error) {
                console.log('Error loading theme:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTheme();
    }, []);

    // Update colors when isDark changes
    useEffect(() => {
        setColors(isDark ? darkTheme : lightTheme);
        saveTheme(isDark ? 'dark' : 'light');
    }, [isDark]);

    const saveTheme = async (theme) => {
        try {
            await AsyncStorage.setItem('theme', theme);
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const themeValues = {
        isDark,
        colors,
        toggleTheme,
        isLoading
    };

    return (
        <ThemeContext.Provider value={themeValues}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
