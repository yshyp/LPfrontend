import * as Location from 'expo-location';

class LocationService {
  async requestPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Location permission request failed:', error);
      return false;
    }
  }

  async getCurrentLocation() {
    try {
      // First check if we have permission
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000, // Increased timeout
        maximumAge: 60000, // Accept location up to 1 minute old
      });
      
      if (!location || !location.coords) {
        throw new Error('No location data received');
      }

      return location.coords;
    } catch (error) {
      console.error('Failed to get current location:', error);
      
      // Return a fallback location (you can set this to a default city)
      // This prevents the app from crashing when location is unavailable
      return {
        latitude: 0,
        longitude: 0,
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      };
    }
  }

  async openSettings() {
    try {
      await Location.openSettingsAsync();
    } catch (error) {
      console.error('Failed to open location settings:', error);
    }
  }

  // Check if location is valid (not 0,0)
  isValidLocation(coords) {
    return coords && 
           coords.latitude !== 0 && 
           coords.longitude !== 0 &&
           coords.latitude !== null && 
           coords.longitude !== null;
  }

  // Get location with validation
  async getValidLocation() {
    const coords = await this.getCurrentLocation();
    if (!this.isValidLocation(coords)) {
      throw new Error('Invalid location coordinates');
    }
    return coords;
  }

  // Calculate distance between two points in kilometers
  calculateDistance(lat1, lon1, lat2, lon2) {
    // Check for valid coordinates
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return 0;
    }

    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Format distance for display
  formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  }
}

export default new LocationService(); 