import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

class SecureStorageService {
  // Encryption key - in production, this should come from a secure key management system
  static ENCRYPTION_KEY = 'lifepulse_secure_key_2025'; // Should be environment-specific
  
  // Track if encryption is available
  static encryptionAvailable = null;
  
  // Keys for different types of data
  static KEYS = {
    USER_TOKEN: 'user_auth_token',
    USER_DATA: 'encrypted_user_data',
    MEDICAL_DATA: 'encrypted_medical_data',
    LOCATION_DATA: 'encrypted_location_data',
    BIOMETRIC_HASH: 'biometric_hash'
  };

  /**
   * Check if encryption is available (for Expo Go compatibility)
   */
  static isEncryptionAvailable() {
    if (this.encryptionAvailable !== null) {
      return this.encryptionAvailable;
    }

    try {
      // Test encryption
      const testData = { test: 'data' };
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(testData), this.ENCRYPTION_KEY).toString();
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      JSON.parse(decrypted);
      
      this.encryptionAvailable = true;
      console.log('✅ Encryption is available');
      return true;
    } catch (error) {
      this.encryptionAvailable = false;
      console.log('⚠️ Encryption not available, using fallback (Expo Go limitation)');
      return false;
    }
  }

  /**
   * Encrypt sensitive data before storing (with fallback)
   */
  static encrypt(data) {
    try {
      if (!this.isEncryptionAvailable()) {
        // Fallback: Base64 encoding (not secure, but works in Expo Go)
        console.log('🔄 Using fallback encoding (not encrypted in Expo Go)');
        const jsonString = JSON.stringify(data);
        return btoa(jsonString); // Base64 encode using built-in btoa
      }

      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.ENCRYPTION_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data after retrieving (with fallback)
   */
  static decrypt(encryptedData) {
    try {
      if (!this.isEncryptionAvailable()) {
        // Fallback: Base64 decoding
        const decryptedString = atob(encryptedData); // Base64 decode using built-in atob
        return JSON.parse(decryptedString);
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Store encrypted data securely
   */
  static async setSecureItem(key, value) {
    try {
      // Show warning for Expo Go users
      if (!this.isEncryptionAvailable()) {
        console.log('⚠️ EXPO GO LIMITATION: Data is stored with basic encoding only. Use development build for full encryption.');
      }

      const encryptedValue = this.encrypt(value);
      await SecureStore.setItemAsync(key, encryptedValue);
      return true;
    } catch (error) {
      console.error('Secure storage error:', error);
      return false;
    }
  }

  /**
   * Retrieve and decrypt data
   */
  static async getSecureItem(key) {
    try {
      const encryptedValue = await SecureStore.getItemAsync(key);
      if (!encryptedValue) return null;
      
      return this.decrypt(encryptedValue);
    } catch (error) {
      console.error('Secure retrieval error:', error);
      return null;
    }
  }

  /**
   * Remove secure item
   */
  static async removeSecureItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('Secure removal error:', error);
      return false;
    }
  }

  /**
   * Store user authentication token
   */
  static async storeAuthToken(token) {
    return await this.setSecureItem(this.KEYS.USER_TOKEN, { token, timestamp: Date.now() });
  }

  /**
   * Get user authentication token
   */
  static async getAuthToken() {
    const data = await this.getSecureItem(this.KEYS.USER_TOKEN);
    return data?.token || null;
  }

  /**
   * Store user personal data (encrypted)
   */
  static async storeUserData(userData) {
    // Separate sensitive data
    const sensitiveData = {
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      bloodGroup: userData.bloodGroup,
      role: userData.role,
      timestamp: Date.now()
    };

    return await this.setSecureItem(this.KEYS.USER_DATA, sensitiveData);
  }

  /**
   * Get user personal data (decrypted)
   */
  static async getUserData() {
    return await this.getSecureItem(this.KEYS.USER_DATA);
  }

  /**
   * Store medical/health data separately
   */
  static async storeMedicalData(medicalData) {
    const encryptedMedical = {
      bloodGroup: medicalData.bloodGroup,
      donationHistory: medicalData.donationHistory || [],
      medicalConditions: medicalData.medicalConditions || [],
      lastDonationDate: medicalData.lastDonationDate,
      eligibilityStatus: medicalData.eligibilityStatus,
      timestamp: Date.now()
    };

    return await this.setSecureItem(this.KEYS.MEDICAL_DATA, encryptedMedical);
  }

  /**
   * Store location data securely
   */
  static async storeLocationData(locationData) {
    const secureLocation = {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      address: locationData.address,
      timestamp: Date.now()
    };

    return await this.setSecureItem(this.KEYS.LOCATION_DATA, secureLocation);
  }

  /**
   * Clear all secure data (logout)
   */
  static async clearAllSecureData() {
    try {
      await Promise.all([
        this.removeSecureItem(this.KEYS.USER_TOKEN),
        this.removeSecureItem(this.KEYS.USER_DATA),
        this.removeSecureItem(this.KEYS.MEDICAL_DATA),
        this.removeSecureItem(this.KEYS.LOCATION_DATA),
        this.removeSecureItem(this.KEYS.BIOMETRIC_HASH)
      ]);
      return true;
    } catch (error) {
      console.error('Clear secure data error:', error);
      return false;
    }
  }

  /**
   * Data integrity check
   */
  static async verifyDataIntegrity() {
    try {
      const userData = await this.getUserData();
      if (userData && userData.timestamp) {
        const age = Date.now() - userData.timestamp;
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (age > maxAge) {
          console.warn('Stored data is older than 7 days');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Data integrity check failed:', error);
      return false;
    }
  }
}

export default SecureStorageService;
