import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { Product } from '../types';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

export const productsService = {
  // Get products by store ID
  async getProductsByStore(storeId: string, page: number = 1, pageSize: number = 50): Promise<{ products: Product[]; total: number }> {
    const response = await api.get(`${API_CONFIG.API_VERSION}/inventory/stores/${storeId}/products`, {
      params: { page, page_size: pageSize }
    });
    return {
      products: response.data.products,
      total: response.data.total
    };
  },

  // Search products in a store
  async searchProducts(storeId: string, query: string): Promise<Product[]> {
    const response = await api.get(`${API_CONFIG.API_VERSION}/inventory/stores/${storeId}/search`, {
      params: { q: query }
    });
    return response.data.results;
  },

  // Get product by ID
  async getProductById(productId: string): Promise<Product> {
    const response = await api.get(`${API_CONFIG.API_VERSION}/inventory/products/${productId}`);
    return response.data;
  },
};
