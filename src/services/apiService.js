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

// Enhanced error logging in API service
export const makeRequest = async (method, endpoint, data = null, headers = {}) => {
  console.log('API Request:', method, endpoint);
  console.log('Full URL:', API_CONFIG.BASE_URL + endpoint);
  console.log('Request Data:', data);
  console.log('Request Headers:', headers);
  console.log('Timestamp:', new Date().toISOString());

  try {
    const config = {
      method,
      url: API_CONFIG.BASE_URL + endpoint,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        ...API_CONFIG.HEADERS,
        ...headers,
      },
    };

    if (data) {
      config.data = data;
    }

    console.log('Making axios request with config:', config);
    const response = await axios(config);
    
    console.log('API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
    return response;
  } catch (error) {
    console.error('API Response Error:', error.response?.status, error.response?.statusText);
    console.error('NETWORK ERROR DETAILS:');
    console.error('- Trying to connect to:', API_CONFIG.BASE_URL + endpoint);
    console.error('- Error code:', error.code);
    console.error('- Error message:', error.message);
    console.error('- Response data:', error.response?.data);
    console.error('- Response status:', error.response?.status);
    console.error('- Response headers:', error.response?.headers);
    console.error('- Request config:', error.config);
    console.error('- Check if backend server is running on the specified address');
    console.error('- Full error object:', error);
    console.error('- Timestamp:', new Date().toISOString());
    
    throw error;
  }
};

export default new ApiService();