import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import apiService from './apiService';
import { ENDPOINTS } from '../config/api';

class NotificationService {
  constructor() {
    this.isExpoGo = Constants.appOwnership === 'expo';
    this.configureNotifications();
  }

  configureNotifications() {
    // Only configure if not in Expo Go
    if (!this.isExpoGo) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  }

  async requestPermissions() {
    // Skip permission request in Expo Go
    if (this.isExpoGo) {
      console.log('⚠️ Push notifications not supported in Expo Go. Use development build for full functionality.');
      return false;
    }

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
    // Return null in Expo Go
    if (this.isExpoGo) {
      console.log('⚠️ Push tokens not available in Expo Go. Use development build for push notifications.');
      return null;
    }

    if (!Device.isDevice) {
      return null;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId || 'your-expo-project-id',
      });
      console.log('✅ Push token obtained:', token.data);
      return token.data;
    } catch (error) {
      console.error('❌ Error getting push token:', error);
      return null;
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

  addNotificationReceivedListener(callback) {
    if (this.isExpoGo) {
      console.log('⚠️ Notification listeners not supported in Expo Go');
      return null;
    }
    return Notifications.addNotificationReceivedListener(callback);
  }

  addNotificationResponseReceivedListener(callback) {
    if (this.isExpoGo) {
      console.log('⚠️ Notification response listeners not supported in Expo Go');
      return null;
    }
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Helper method to check if notifications are supported
  isNotificationsSupported() {
    return !this.isExpoGo;
  }

  // Helper method to show warning about Expo Go
  showExpoGoWarning() {
    if (this.isExpoGo) {
      console.log(`
⚠️  EXPO GO LIMITATION ⚠️
Push notifications are not supported in Expo Go (SDK 53+).
To use push notifications, you need to create a development build.

Learn more: https://docs.expo.dev/develop/development-builds/introduction/

For now, the app will work without push notifications.
      `);
    }
  }
}

export default new NotificationService(); 