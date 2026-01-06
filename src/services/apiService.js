import axios from 'axios';

class ApiService {
  constructor() {
    // Use the same configuration as api.js
    const isDevelopment = true; // Use local server
    const PRODUCTION_URL = 'https://lpbackend-w3g7.onrender.com';
    const LOCAL_URL = 'http://10.0.2.2:5000'; // Android emulator special IP for host machine

    this.baseURL = isDevelopment ? LOCAL_URL : PRODUCTION_URL;
    this.isProduction = !isDevelopment;

    console.log('🔧 API Service initialized with:', {
      baseURL: this.baseURL,
      isProduction: this.isProduction,
      isDevelopment: !this.isProduction
    });

    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Add interceptors for logging (only in development)
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (!this.isProduction) {
          console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
          console.log('🔗 Full URL:', this.baseURL + config.url);
          if (config.data) {
            console.log('📦 Request Data:', config.data);
          }
          if (config.params) {
            console.log('🔍 Query Params:', config.params);
          }
          console.log('🔐 Has Auth Header:', !!config.headers.Authorization);
        }
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        if (!this.isProduction) {
          console.log('✅ API Response:', response.status, response.config.url);
        }
        return response;
      },
      (error) => {
        // Always log errors, even in production
        // Use console.warn for client errors (4xx) to avoid RedBox in RN
        if (error.response?.status >= 400 && error.response?.status < 500) {
          console.warn('⚠️ API Client Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
          });
        } else {
          // Log other errors as errors
          console.error('❌ API Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
          });
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      // Set the authorization header
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (!this.isProduction) {
        console.log('🔐 Auth token set in API service');
        console.log('🔐 Token preview:', token.substring(0, 20) + '...');
      }
    } else {
      delete this.instance.defaults.headers.common['Authorization'];
      if (!this.isProduction) {
        console.log('🔐 Auth token removed from API service');
      }
    }
  }

  // Add method to check if auth token is set
  hasAuthToken() {
    return !!this.instance.defaults.headers.common['Authorization'];
  }

  // Method to get current auth token
  getAuthToken() {
    return this.instance.defaults.headers.common['Authorization'];
  }

  async get(endpoint, config = {}) {
    try {
      const response = await this.instance.get(endpoint, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async post(endpoint, data, config = {}) {
    try {
      const response = await this.instance.post(endpoint, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async put(endpoint, data, config = {}) {
    try {
      const response = await this.instance.put(endpoint, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async delete(endpoint, config = {}) {
    try {
      const response = await this.instance.delete(endpoint, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async patch(endpoint, data, config = {}) {
    try {
      const response = await this.instance.patch(endpoint, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiService();