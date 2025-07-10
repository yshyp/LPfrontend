import axios from 'axios';

class ApiService {
  constructor() {
    // Get the correct base URL based on environment
    const getBaseURL = () => {
      // Check if we're in production
      if (process.env.REACT_APP_ENV === 'production') {
        // Use production URL
        return process.env.REACT_APP_API_URL || 'https://lpbackend-w3g7.onrender.com';
      } else {
        // Use development URL
        return process.env.REACT_APP_API_URL || 'http://192.168.1.6:5000';
      }
    };

    this.baseURL = getBaseURL();
    this.isProduction = process.env.REACT_APP_ENV === 'production';
    
    console.log('🔧 API Service initialized with:', {
      baseURL: this.baseURL,
      isProduction: this.isProduction,
      env: process.env.REACT_APP_ENV,
      apiUrl: process.env.REACT_APP_API_URL
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
        console.error('❌ API Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url
        });
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