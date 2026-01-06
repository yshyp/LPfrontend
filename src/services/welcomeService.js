import AsyncStorage from '@react-native-async-storage/async-storage';

const WELCOME_KEY = 'has_seen_welcome';

export const welcomeService = {
    /**
     * Check if the user has already seen the welcome screen
     * @returns {Promise<boolean>}
     */
    hasSeenWelcome: async () => {
        try {
            const value = await AsyncStorage.getItem(WELCOME_KEY);
            return value === 'true';
        } catch (error) {
            console.error('Error checking welcome status:', error);
            return false;
        }
    },

    /**
     * Mark the welcome screen as seen
     * @returns {Promise<void>}
     */
    markWelcomeAsSeen: async () => {
        try {
            await AsyncStorage.setItem(WELCOME_KEY, 'true');
        } catch (error) {
            console.error('Error marking welcome as seen:', error);
        }
    },

    /**
     * Reset the welcome screen status (for testing/debugging)
     * @returns {Promise<void>}
     */
    resetWelcome: async () => {
        try {
            await AsyncStorage.removeItem(WELCOME_KEY);
        } catch (error) {
            console.error('Error resetting welcome status:', error);
        }
    }
};

export default welcomeService;
