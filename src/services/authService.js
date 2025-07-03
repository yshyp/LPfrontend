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
}

export default new AuthService(); 