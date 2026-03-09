import api from './api';
import { Store } from '../types';

export const storeService = {
  // Get nearby stores
  async getNearbyStores(lat: number, lng: number, radius: number = 10): Promise<Store[]> {
    const response = await api.get('/stores/nearby', {
      params: { lat, lng, radius_km: radius },
    });
    return response.data;
  },

  // Get demo stores
  async getDemoStores(): Promise<Store[]> {
    const response = await api.get('/stores/demo');
    return response.data;
  },

  // Get store details
  async getStoreDetails(storeId: string): Promise<Store> {
    const response = await api.get(`/stores/${storeId}`);
    return response.data;
  },
};
