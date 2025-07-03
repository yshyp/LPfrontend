import apiService from './apiService';
import { ENDPOINTS } from '../config/api';

class UserService {
  async updateLocation(longitude, latitude) {
    const response = await apiService.put(ENDPOINTS.USERS.LOCATION, {
      longitude,
      latitude
    });
    return response.data;
  }

  async toggleAvailability() {
    const response = await apiService.put(ENDPOINTS.USERS.AVAILABILITY, {});
    return response.data;
  }

  async getMyDonations() {
    const response = await apiService.get(ENDPOINTS.USERS.DONATIONS);
    return response.data;
  }

  async getProfile() {
    const response = await apiService.get(ENDPOINTS.USERS.ME);
    return response.data;
  }

  async getEligibility(userId) {
    const response = await apiService.get(ENDPOINTS.USERS.ELIGIBILITY(userId));
    return response.data;
  }

  async getLeaderboard() {
    const response = await apiService.get(ENDPOINTS.USERS.LEADERBOARD);
    return response.data;
  }
}

export default new UserService(); 