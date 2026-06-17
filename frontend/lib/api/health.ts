import apiClient from './client';

export const healthApi = {
  check: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
  
  ping: async () => {
    const response = await apiClient.get('/health/ping');
    return response.data;
  },
  
  info: async () => {
    const response = await apiClient.get('/health/info');
    return response.data;
  },
};
