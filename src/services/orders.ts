import api from './api';
import { Order } from '../types';

export const orderService = {
  // Create order
  async createOrder(orderData: any): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  async getUserOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get order details
  async getOrderDetails(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<void> {
    await api.post(`/orders/${orderId}/cancel`);
  },
};
