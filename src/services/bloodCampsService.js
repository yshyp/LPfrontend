import apiService from './apiService';
import { ENDPOINTS } from '../config/api';

const bloodCampsService = {
  async getAll(params = {}) {
    const response = await apiService.get(ENDPOINTS.BLOOD_CAMPS.LIST, { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiService.get(ENDPOINTS.BLOOD_CAMPS.DETAIL(id));
    return response.data;
  },
};

export default bloodCampsService; 