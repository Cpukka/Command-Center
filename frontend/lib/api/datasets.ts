import apiClient from './client';

export interface Dataset {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  rowCount?: number;
  fileType?: string;
}

export const datasetsApi = {
  getAll: async (): Promise<Dataset[]> => {
    const response = await apiClient.get('/datasets');
    return response.data;
  },
  
  upload: async (name: string, description: string): Promise<any> => {
    const response = await apiClient.post('/datasets/upload', { name, description });
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(/datasets/);
  },
};
