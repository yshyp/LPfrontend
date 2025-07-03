import apiService from './apiService';
import { ENDPOINTS } from '../config/api';

class RequestService {
  async getNearbyRequests(longitude, latitude, maxDistance = 50000, bloodGroup = null) {
    const params = {
      longitude,
      latitude,
      maxDistance
    };
    
    if (bloodGroup) {
      params.bloodGroup = bloodGroup;
    }

    const response = await apiService.get(ENDPOINTS.REQUESTS.LIST, { params });
    return response.data;
  }

  async createRequest(requestData) {
    const response = await apiService.post(ENDPOINTS.REQUESTS.CREATE, requestData);
    return response.data;
  }

  async acceptRequest(requestId) {
    const response = await apiService.post(ENDPOINTS.REQUESTS.ACCEPT(requestId), {});
    return response.data;
  }
}

export default new RequestService(); 