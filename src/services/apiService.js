import axios from 'axios';
import { API_CONFIG } from '../config/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log(`🔗 Full URL: ${config.baseURL}${config.url}`);
        console.log(`📦 Request Data:`, config.data);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.response?.data);
        
        // Enhanced error logging for network issues
        if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          console.error('🚫 NETWORK ERROR DETAILS:');
          console.error('- Trying to connect to:', error.config?.baseURL + error.config?.url);
          console.error('- Error code:', error.code);
          console.error('- Error message:', error.message);
          console.error('- Check if backend server is running on the specified address');
        }
        
        if (error.code === 'ECONNREFUSED') {
          console.error('🚫 CONNECTION REFUSED:');
          console.error('- Backend server is not running or not accessible');
          console.error('- Check if server is running on:', error.config?.baseURL);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Set authorization token
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Generic request methods
  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

export default new ApiService(); 