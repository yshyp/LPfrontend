import React, { createContext, useState, useContext, useEffect } from 'react';
import SecureStorageService from '../services/secureStorageService';
import DataPrivacyService from '../services/dataPrivacyService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data securely on app start
  useEffect(() => {
    loadSecureUserData();
  }, []);

  const loadSecureUserData = async () => {
    try {
      setLoading(true);
      
      // Check data integrity
      const isDataValid = await SecureStorageService.verifyDataIntegrity();
      if (!isDataValid) {
        console.warn('Data integrity check failed, clearing data');
        await SecureStorageService.clearAllSecureData();
        setUser(null);
        return;
      }

      // Load user data from secure storage
      const userData = await SecureStorageService.getUserData();
      const authToken = await SecureStorageService.getAuthToken();

      if (userData && authToken) {
        // Sanitize data before setting in context
        const sanitizedUser = DataPrivacyService.sanitizeUserData(userData);
        setUser(sanitizedUser);
        
        // Log security event
        await DataPrivacyService.logSecurityEvent('USER_DATA_LOADED', {
          hasToken: !!authToken,
          dataAge: userData.timestamp ? Date.now() - userData.timestamp : 0
        });
      }
      
      // Cleanup expired data
      await DataPrivacyService.cleanupExpiredData();
      
    } catch (error) {
      console.error('Error loading secure user data:', error);
      await DataPrivacyService.logSecurityEvent('USER_DATA_LOAD_ERROR', { error: error.message });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const setSecureUser = async (userData, authToken = null) => {
    try {
      if (!userData) {
        // Logout - clear all data
        await SecureStorageService.clearAllSecureData();
        setUser(null);
        await DataPrivacyService.logSecurityEvent('USER_LOGOUT');
        return;
      }

      // Sanitize data before storing
      const sanitizedData = DataPrivacyService.sanitizeUserData(userData);
      
      // Store data securely
      await SecureStorageService.storeUserData(sanitizedData);
      
      if (authToken) {
        await SecureStorageService.storeAuthToken(authToken);
      }

      // Store medical data separately if present
      if (userData.bloodGroup || userData.medicalHistory) {
        await SecureStorageService.storeMedicalData({
          bloodGroup: userData.bloodGroup,
          donationHistory: userData.donationHistory,
          medicalConditions: userData.medicalConditions,
          lastDonationDate: userData.lastDonationDate,
          eligibilityStatus: userData.eligibilityStatus
        });
      }

      setUser(sanitizedData);
      
      await DataPrivacyService.logSecurityEvent('USER_DATA_STORED', {
        hasToken: !!authToken,
        dataFields: Object.keys(sanitizedData)
      });
      
    } catch (error) {
      console.error('Error storing secure user data:', error);
      await DataPrivacyService.logSecurityEvent('USER_DATA_STORE_ERROR', { error: error.message });
      throw error;
    }
  };

  const updateUserLocation = async (locationData) => {
    try {
      await SecureStorageService.storeLocationData(locationData);
      await DataPrivacyService.logSecurityEvent('LOCATION_UPDATED');
    } catch (error) {
      console.error('Error updating location:', error);
      await DataPrivacyService.logSecurityEvent('LOCATION_UPDATE_ERROR', { error: error.message });
    }
  };

  const recordConsent = async (consentType, granted = true) => {
    try {
      await DataPrivacyService.recordConsent(consentType, granted);
      await DataPrivacyService.logSecurityEvent('CONSENT_RECORDED', { 
        consentType, 
        granted 
      });
    } catch (error) {
      console.error('Error recording consent:', error);
    }
  };

  const exportUserData = async () => {
    try {
      const exportData = await DataPrivacyService.exportUserData();
      await DataPrivacyService.logSecurityEvent('DATA_EXPORT_REQUESTED');
      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      await DataPrivacyService.logSecurityEvent('DATA_EXPORT_ERROR', { error: error.message });
      return null;
    }
  };

  const deleteAllUserData = async () => {
    try {
      await DataPrivacyService.deleteAllUserData();
      setUser(null);
      await DataPrivacyService.logSecurityEvent('DATA_DELETION_REQUESTED');
      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: setSecureUser,
      loading,
      updateUserLocation,
      recordConsent,
      exportUserData,
      deleteAllUserData,
      refreshUserData: loadSecureUserData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export { UserContext }; 