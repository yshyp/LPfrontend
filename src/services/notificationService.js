import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
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
    if (!Device.isDevice) {
      console.log('⚠️ Push tokens not available on simulator');
      return null;
    }

    try {
      // Get the project ID from app config
      const projectId = Constants.expoConfig?.extra?.eas?.projectId || 
                       Constants.expoConfig?.projectId ||
                       'your-expo-project-id';

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      
      console.log('✅ Push token obtained:', token.data);
      return token.data;
    } catch (error) {
      console.error('❌ Error getting push token:', error);
      return null;
    }
  }

  async registerFCMToken() {
    try {
      const token = await this.getExpoPushToken();
      if (!token) {
        console.log('⚠️ No push token available');
        return false;
      }

      // Register token with backend
      const response = await apiService.post('/api/users/fcm-token', {
        fcmToken: token
      });
      
      console.log('✅ FCM token registered with backend');
      return true;
    } catch (error) {
      console.error('❌ Error registering FCM token:', error);
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