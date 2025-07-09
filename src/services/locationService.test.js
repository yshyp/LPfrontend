import locationService from './locationService';

// Simple test to verify location service methods
const testLocationService = async () => {
  console.log('🧪 Testing Location Service...');
  
  try {
    // Test permission request
    console.log('Testing permission request...');
    const hasPermission = await locationService.requestPermission();
    console.log('Permission granted:', hasPermission);
    
    // Test getting current location
    console.log('Testing getCurrentLocation...');
    const coords = await locationService.getCurrentLocation();
    console.log('Coordinates:', coords);
    
    // Test location validation
    console.log('Testing location validation...');
    const isValid = locationService.isValidLocation(coords);
    console.log('Location is valid:', isValid);
    
    // Test distance calculation
    console.log('Testing distance calculation...');
    const distance = locationService.calculateDistance(0, 0, 1, 1);
    console.log('Distance (0,0 to 1,1):', distance);
    
    // Test distance formatting
    console.log('Testing distance formatting...');
    const formatted = locationService.formatDistance(0.5);
    console.log('Formatted distance:', formatted);
    
    console.log('✅ Location service tests completed');
    
  } catch (error) {
    console.error('❌ Location service test failed:', error);
  }
};

export default testLocationService; 