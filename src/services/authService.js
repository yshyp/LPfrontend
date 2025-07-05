import apiService from './apiService';
import { ENDPOINTS } from '../config/api';

class AuthService {
  // Legacy OTP methods (for backward compatibility)
  async sendOTP(phone, type = 'LOGIN') {
    const response = await apiService.post(ENDPOINTS.AUTH.SEND_OTP, {
      phone: phone.trim(),
      type
    });
    return response.data;
  }

  async verifyOTP(phone, otp, type, userData = null, fcmToken = null) {
    const data = {
      phone: phone.trim(),
      otp,
      type
    };

    if (userData) {
      data.userData = userData;
    }

    if (fcmToken) {
      data.fcmToken = fcmToken;
    }

    const response = await apiService.post(ENDPOINTS.AUTH.VERIFY_OTP, data);
    const { token, user } = response.data;
    
    // Set auth token for future requests
    apiService.setAuthToken(token);
    
    return { token, user };
  }

  // New unified verification methods
  async sendVerification(identifier, type = 'LOGIN', method = 'AUTO', userName = 'User') {
    const response = await apiService.post(ENDPOINTS.VERIFICATION.SEND, {
      identifier: identifier.trim(),
      type,
      method,
      userName
    });
    return response.data;
  }

  async verifyCode(identifier, code, type) {
    const response = await apiService.post(ENDPOINTS.VERIFICATION.VERIFY, {
      identifier: identifier.trim(),
      code,
      type
    });
    
    const { token, user } = response.data;
    
    // Set auth token for future requests
    if (token) {
      apiService.setAuthToken(token);
    }
    
    return response.data;
  }

  async resendVerification(identifier, type, method = 'AUTO') {
    const response = await apiService.post(ENDPOINTS.VERIFICATION.RESEND, {
      identifier: identifier.trim(),
      type,
      method
    });
    return response.data;
  }

  async getVerificationMethod() {
    const response = await apiService.get(ENDPOINTS.VERIFICATION.METHOD);
    return response.data;
  }

  async login(phone, fcmToken = null) {
    const data = { phone: phone.trim() };
    if (fcmToken) {
      data.fcmToken = fcmToken;
    }

    const response = await apiService.post(ENDPOINTS.AUTH.LOGIN, data);
    const { token, user } = response.data;
    
    // Set auth token for future requests
    apiService.setAuthToken(token);
    
    return { token, user };
  }

  async register(userData) {
    const response = await apiService.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  }

  async registerVerified(userData) {
    const response = await apiService.post(ENDPOINTS.AUTH.REGISTER_VERIFIED, userData);
    const { token, user } = response.data;
    
    // Set auth token for future requests
    if (token) {
      apiService.setAuthToken(token);
    }
    
    return response.data;
  }

  logout() {
    // Clear auth token
    apiService.setAuthToken(null);
  }

  setToken(token) {
    apiService.setAuthToken(token);
  }

  async checkUserExists(identifier) {
    try {
      // Try to send verification to see if user exists
      // If user doesn't exist, this will return 404
      const response = await apiService.post(ENDPOINTS.VERIFICATION.SEND, {
        identifier: identifier.trim(),
        type: 'LOGIN',
        method: 'AUTO',
        userName: 'Guest'
      });
      return { exists: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { exists: false, error: error.response.data };
      }
      // Re-throw other errors
      throw error;
    }
  }

  async loginWithPassword(identifier, password, fcmToken = null) {
    // Determine if it's email or phone login and structure request accordingly
    const isEmailLogin = identifier.includes('@');
    
    let data;
    
    if (isEmailLogin) {
      // For email login, try without phone field first
      data = { 
        email: identifier.trim(),
        password: password
      };
    } else {
      // Phone login - ensure phone format is correct
      let cleanPhone = identifier.trim().replace(/\D/g, ''); // Remove non-digits
      
      // Add country code if not present
      if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
      }
      
      data = {
        phone: cleanPhone,
        password: password
      };
    }

    if (fcmToken) {
      data.fcmToken = fcmToken;
    }

    console.log('🔐 Login attempt:', {
      type: isEmailLogin ? 'EMAIL' : 'PHONE',
      identifier: identifier,
      data: { ...data, password: '[HIDDEN]' }
    });

    try {
      const response = await apiService.post(ENDPOINTS.AUTH.LOGIN, data);
      const { token, user } = response.data;
      
      // Set auth token for future requests
      apiService.setAuthToken(token);
      
      console.log('✅ Login successful');
      return { token, user };
    } catch (error) {
      console.error('❌ Login failed:', {
        status: error.response?.status,
        data: error.response?.data,
        sentData: { ...data, password: '[HIDDEN]' }
      });
      
      // If email login fails due to phone validation, try with a minimal phone
      if (isEmailLogin && error.response?.status === 400 && 
          error.response?.data?.details?.some(d => d.path === 'phone')) {
        
        console.log('🔄 Retrying email login with phone placeholder...');
        
        const retryData = {
          email: identifier.trim(),
          phone: '9999999999', // Minimal valid phone number
          password: password
        };
        
        if (fcmToken) {
          retryData.fcmToken = fcmToken;
        }
        
        try {
          const retryResponse = await apiService.post(ENDPOINTS.AUTH.LOGIN, retryData);
          const { token, user } = retryResponse.data;
          
          apiService.setAuthToken(token);
          console.log('✅ Email login successful with phone placeholder');
          return { token, user };
        } catch (retryError) {
          console.error('❌ Retry also failed:', retryError.response?.data);
          throw retryError;
        }
      }
      
      throw error;
    }
  }
}

export default new AuthService();