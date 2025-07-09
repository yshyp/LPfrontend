import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import SecureStorageService from './secureStorageService';
import apiService from './apiService';
import { ENDPOINTS } from '../config/api';

class NotificationService {
  constructor() {
    // Check if we're in Expo Go or development build
    this.isExpoGo = Constants.appOwnership === 'expo';
    this.configureNotifications();
  }

  configureNotifications() {
    // Configure notifications for both Expo Go and development builds
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Notification permissions not granted');
        return false;
      }
    }
    
    return true;
  }

  async getExpoPushToken() {
    try {
      // Check if running on device (not simulator/emulator)
      if (!Device.isDevice) {
        console.log('⚠️ Must use physical device for Push Notifications');
        // For development/testing, return a mock token
        return 'SIMULATOR_TOKEN_' + Date.now();
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Failed to get push token for push notification!');
        return null;
      }

      // Get the Expo push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      console.log('✅ Expo push token:', token.data);
      return token.data; // This should be compatible with FCM
    } catch (error) {
      console.error('❌ Error getting push token:', error);
      return null;
    }
  }

  async registerFCMToken() {
    try {
      // Check if user is authenticated
      const authToken = await SecureStorageService.getAuthToken();
      if (!authToken) {
        console.log('⚠️ User not authenticated, skipping FCM token registration');
        return false;
      }

      console.log('🔐 Auth token found, length:', authToken.length);

      // Skip FCM registration on simulators
      if (!Device.isDevice) {
        console.log('⚠️ Simulator detected - skipping FCM token registration');
        console.log('📱 Use a physical device to test push notifications');
        return true;
      }

      const token = await this.getExpoPushToken();
      if (!token) {
        console.log('⚠️ No push token available');
        return false;
      }

      // Store the token locally
      await SecureStorageService.storeFCMToken(token);

      // Set auth token for API call - ensure it's set correctly
      apiService.setAuthToken(authToken);
      
      // Double-check that the auth token is actually set
      console.log('🔍 API Service auth header after setting:', apiService.hasAuthToken());
      console.log('🔍 Auth header value:', apiService.getAuthToken()?.substring(0, 30) + '...');

      // Add a small delay to ensure auth token is properly set
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Final check before making the request
      if (!apiService.hasAuthToken()) {
        console.error('❌ Auth token not set in API service - retrying...');
        apiService.setAuthToken(authToken);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Register token with backend
      console.log('📱 Attempting to register FCM token with backend...');
      console.log('📱 Token preview:', token.substring(0, 20) + '...');
      
      const response = await apiService.post('/api/users/fcm-token', {
        fcmToken: token
      });
      
      console.log('✅ FCM token registered with backend:', response.data);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        console.error('❌ User not found - auth token may be invalid or expired');
        console.error('❌ Response data:', error.response?.data);
      } else if (error.response?.status === 401) {
        console.error('❌ Unauthorized - auth token invalid or expired');
        console.error('❌ Response data:', error.response?.data);
      } else {
        console.error('❌ Error registering FCM token:', error.response?.data || error.message);
      }
      return false;
    }
  }

  async sendTestNotification(donorIds, title, body, data = {}) {
    try {
      const response = await apiService.post(ENDPOINTS.NOTIFICATIONS.PUSH, {
        donorIds,
        title,
        body,
        data
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      throw error;
    }
  }

  async testNotification(title, body, data = {}) {
    try {
      const response = await apiService.post(ENDPOINTS.NOTIFICATIONS.TEST, {
        title,
        body,
        data
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      throw error;
    }
  }

  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  addNotificationResponseReceivedListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Helper method to check if notifications are supported
  isNotificationsSupported() {
    return Device.isDevice;
  }

  // Helper method to show warning about Expo Go
  showExpoGoWarning() {
    if (this.isExpoGo) {
      console.log(`
⚠️  EXPO GO LIMITATION ⚠️
Push notifications may not work properly in Expo Go.
For best results, use a development build.

Learn more: https://docs.expo.dev/develop/development-builds/introduction/

The app will attempt to use push notifications anyway.
      `);
    }
  }

  // Initialize notifications for the app
  async initialize() {
    try {
      const hasPermission = await this.requestPermissions();
      if (hasPermission) {
        await this.registerFCMToken();
        console.log('✅ Notifications initialized successfully');
      } else {
        console.log('⚠️ Notification permissions not granted');
      }
    } catch (error) {
      console.error('❌ Error initializing notifications:', error);
    }
  }
}

export default new NotificationService();