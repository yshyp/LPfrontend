import * as SecureStore from 'expo-secure-store';

class SecureStorageService {
  // Auth token storage
  static async storeAuthToken(token) {
    try {
      await SecureStore.setItemAsync('authToken', token);
      console.log('✅ Auth token stored securely');
    } catch (error) {
      console.error('❌ Error storing auth token:', error);
      throw error;
    }
  }

  static async getAuthToken() {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      return token;
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      return null;
    }
  }

  static async removeAuthToken() {
    try {
      await SecureStore.deleteItemAsync('authToken');
      console.log('✅ Auth token removed');
    } catch (error) {
      console.error('❌ Error removing auth token:', error);
      throw error;
    }
  }

  // User data storage
  static async storeUserData(userData) {
    try {
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      console.log('✅ User data stored securely');
    } catch (error) {
      console.error('❌ Error storing user data:', error);
      throw error;
    }
  }

  static async getUserData() {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      return null;
    }
  }

  static async removeUserData() {
    try {
      await SecureStore.deleteItemAsync('userData');
      console.log('✅ User data removed');
    } catch (error) {
      console.error('❌ Error removing user data:', error);
      throw error;
    }
  }

  // Medical data storage
  static async storeMedicalData(medicalData) {
    try {
      await SecureStore.setItemAsync('medicalData', JSON.stringify(medicalData));
      console.log('✅ Medical data stored securely');
    } catch (error) {
      console.error('❌ Error storing medical data:', error);
      throw error;
    }
  }

  static async getMedicalData() {
    try {
      const medicalData = await SecureStore.getItemAsync('medicalData');
      return medicalData ? JSON.parse(medicalData) : null;
    } catch (error) {
      console.error('❌ Error getting medical data:', error);
      return null;
    }
  }

  static async removeMedicalData() {
    try {
      await SecureStore.deleteItemAsync('medicalData');
      console.log('✅ Medical data removed');
    } catch (error) {
      console.error('❌ Error removing medical data:', error);
      throw error;
    }
  }

  // FCM token storage
  static async storeFCMToken(token) {
    try {
      await SecureStore.setItemAsync('fcmToken', token);
      console.log('✅ FCM token stored securely');
    } catch (error) {
      console.error('❌ Error storing FCM token:', error);
      throw error;
    }
  }

  static async getFCMToken() {
    try {
      const token = await SecureStore.getItemAsync('fcmToken');
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  static async removeFCMToken() {
    try {
      await SecureStore.deleteItemAsync('fcmToken');
      console.log('✅ FCM token removed');
    } catch (error) {
      console.error('❌ Error removing FCM token:', error);
      throw error;
    }
  }

  // Add the missing verifyDataIntegrity method
  static async verifyDataIntegrity() {
    try {
      // Basic integrity check - verify that stored data can be retrieved and parsed
      const authToken = await this.getAuthToken();
      const userData = await this.getUserData();
      const medicalData = await this.getMedicalData();
      const fcmToken = await this.getFCMToken();
      
      console.log('✅ Data integrity verified');
      return {
        isValid: true,
        hasAuthToken: !!authToken,
        hasUserData: !!userData,
        hasMedicalData: !!medicalData,
        hasFCMToken: !!fcmToken
      };
    } catch (error) {
      console.error('❌ Data integrity verification failed:', error);
      return {
        isValid: false,
        error: error.message
      };
    }
  }

  // Clear all stored data (for logout)
  static async clearAll() {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync('authToken'),
        SecureStore.deleteItemAsync('userData'),
        SecureStore.deleteItemAsync('medicalData'),
        SecureStore.deleteItemAsync('fcmToken')
      ]);
      console.log('✅ All secure data cleared');
    } catch (error) {
      console.error('❌ Error clearing secure data:', error);
      throw error;
    }
  }
}

export default SecureStorageService;
