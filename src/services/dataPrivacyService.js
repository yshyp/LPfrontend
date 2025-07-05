import SecureStorageService from './secureStorageService';

class DataPrivacyService {
  /**
   * GDPR/Privacy Compliance Functions
   */

  // Data minimization - only collect necessary data
  static sanitizeUserData(userData) {
    const allowedFields = [
      'name',
      'phone', 
      'email',
      'bloodGroup',
      'role',
      'location',
      'availability'
    ];

    const sanitized = {};
    allowedFields.forEach(field => {
      if (userData[field] !== undefined) {
        sanitized[field] = userData[field];
      }
    });

    return sanitized;
  }

  // Data masking for logs and display
  static maskSensitiveData(data) {
    if (!data) return data;

    const masked = { ...data };

    // Mask phone numbers
    if (masked.phone) {
      masked.phone = masked.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
    }

    // Mask email addresses
    if (masked.email) {
      const [username, domain] = masked.email.split('@');
      if (username && domain) {
        const maskedUsername = username.length > 2 
          ? username.substring(0, 2) + '*'.repeat(username.length - 2)
          : '*'.repeat(username.length);
        masked.email = `${maskedUsername}@${domain}`;
      }
    }

    // Mask name (show only first name)
    if (masked.name) {
      const names = masked.name.split(' ');
      masked.name = names[0] + (names.length > 1 ? ' ***' : '');
    }

    return masked;
  }

  // Data anonymization for analytics
  static anonymizeData(userData) {
    return {
      bloodGroup: userData.bloodGroup,
      role: userData.role,
      region: this.getRegionFromLocation(userData.location),
      ageGroup: this.getAgeGroup(userData.dateOfBirth),
      timestamp: Date.now()
    };
  }

  // Location generalization (privacy protection)
  static getRegionFromLocation(location) {
    if (!location || !location.latitude || !location.longitude) {
      return 'unknown';
    }

    // Generalize location to city/region level instead of exact coordinates
    const lat = Math.floor(location.latitude * 10) / 10; // Round to 1 decimal
    const lng = Math.floor(location.longitude * 10) / 10;
    
    return `region_${lat}_${lng}`;
  }

  static getAgeGroup(dateOfBirth) {
    if (!dateOfBirth) return 'unknown';
    
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    
    if (age < 18) return 'under_18';
    if (age < 25) return '18_24';
    if (age < 35) return '25_34';
    if (age < 45) return '35_44';
    if (age < 55) return '45_54';
    return '55_plus';
  }

  /**
   * Data Retention and Cleanup
   */
  static async cleanupExpiredData() {
    try {
      const expiryTime = 30 * 24 * 60 * 60 * 1000; // 30 days
      const now = Date.now();

      // Check and cleanup user data if expired
      const userData = await SecureStorageService.getUserData();
      if (userData && userData.timestamp && (now - userData.timestamp > expiryTime)) {
        console.log('Cleaning up expired user data');
        await SecureStorageService.removeSecureItem(SecureStorageService.KEYS.USER_DATA);
      }

      return true;
    } catch (error) {
      console.error('Data cleanup error:', error);
      return false;
    }
  }

  /**
   * Consent Management
   */
  static async recordConsent(consentType, granted = true) {
    try {
      const consentData = await SecureStorageService.getSecureItem('user_consent') || {};
      
      consentData[consentType] = {
        granted,
        timestamp: Date.now(),
        version: '1.0' // Privacy policy version
      };

      await SecureStorageService.setSecureItem('user_consent', consentData);
      return true;
    } catch (error) {
      console.error('Consent recording error:', error);
      return false;
    }
  }

  static async getConsent(consentType) {
    try {
      const consentData = await SecureStorageService.getSecureItem('user_consent') || {};
      return consentData[consentType] || null;
    } catch (error) {
      console.error('Consent retrieval error:', error);
      return null;
    }
  }

  /**
   * Data Export (GDPR Right to Data Portability)
   */
  static async exportUserData() {
    try {
      const userData = await SecureStorageService.getUserData();
      const medicalData = await SecureStorageService.getSecureItem(SecureStorageService.KEYS.MEDICAL_DATA);
      const locationData = await SecureStorageService.getSecureItem(SecureStorageService.KEYS.LOCATION_DATA);

      const exportData = {
        personal: userData,
        medical: medicalData,
        location: locationData,
        exportTimestamp: new Date().toISOString(),
        dataFormat: 'JSON',
        privacyVersion: '1.0'
      };

      return exportData;
    } catch (error) {
      console.error('Data export error:', error);
      return null;
    }
  }

  /**
   * Data Deletion (GDPR Right to be Forgotten)
   */
  static async deleteAllUserData() {
    try {
      // Clear all local secure storage
      await SecureStorageService.clearAllSecureData();
      
      // Note: In production, this should also trigger backend data deletion
      console.log('All user data deleted locally');
      
      return true;
    } catch (error) {
      console.error('Data deletion error:', error);
      return false;
    }
  }

  /**
   * Security Audit Logging
   */
  static async logSecurityEvent(eventType, details = {}) {
    try {
      const logEntry = {
        type: eventType,
        timestamp: Date.now(),
        details: this.maskSensitiveData(details),
        appVersion: '1.0.0' // Should come from app config
      };

      // In production, send to secure logging service
      console.log('Security Event:', logEntry);
      
      return true;
    } catch (error) {
      console.error('Security logging error:', error);
      return false;
    }
  }
}

export default DataPrivacyService;
