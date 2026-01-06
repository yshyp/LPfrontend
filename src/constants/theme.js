export const COLORS = {
    // Brand Gradients
    primary: ['#FF6B6B', '#FF8E8E'], // Soft Red/Pink
    secondary: ['#4ECDC4', '#6EE7DF'], // Teal/Cyan
    accent: ['#45B7D1', '#67C9E3'], // Blue

    // Static Colors
    white: '#FFFFFF',
    black: '#000000',
    success: '#4CAF50',
    error: '#FF3B30',
    warning: '#FFCC00',
    info: '#007AFF',
};

export const SIZES = {
    // Global Sizing
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // Font Sizes
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,

    // App Dimensions
    width: '100%',
    height: '100%',
};

export const SHADOWS = {
    light: {
        shadowColor: '#8E8E93',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    medium: {
        shadowColor: '#8E8E93',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    dark: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 10,
    },
    primary: {
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
};

export const lightTheme = {
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#8E8E93',
    textLight: '#FFFFFF',
    inputBackground: '#F5F7FA',
    inputBorder: 'transparent',
    blob1: COLORS.secondary[1] + '40',
    blob2: COLORS.primary[1] + '30',
    shadowOpacity: 0.1,
    ...COLORS
};

export const darkTheme = {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textLight: '#1A1A1A',
    inputBackground: '#2C2C2E',
    inputBorder: '#3A3A3C',
    blob1: COLORS.secondary[1] + '20', // Lower opacity for dark mode
    blob2: COLORS.primary[1] + '15',
    shadowOpacity: 0.3,
    ...COLORS
};

const appTheme = { COLORS, SIZES, SHADOWS, lightTheme, darkTheme };

export default appTheme;
