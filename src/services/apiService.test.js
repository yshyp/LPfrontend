import apiService from './apiService';

// Test API service parameter handling
const testApiService = async () => {
  console.log('🧪 Testing API Service Parameter Handling...');
  
  try {
    // Test GET with parameters
    console.log('Testing GET with query parameters...');
    const testParams = {
      longitude: 76.9289399,
      latitude: 8.5540891,
      maxDistance: 20000,
      bloodGroup: 'A+'
    };
    
    console.log('Test parameters:', testParams);
    
    // This will fail since we don't have auth, but it will show the request
    try {
      await apiService.get('/api/requests', { params: testParams });
    } catch (error) {
      console.log('Expected error (no auth):', error.response?.status);
      console.log('Request was made with parameters:', testParams);
    }
    
    console.log('✅ API service parameter test completed');
    
  } catch (error) {
    console.error('❌ API service test failed:', error);
  }
};

export default testApiService; 