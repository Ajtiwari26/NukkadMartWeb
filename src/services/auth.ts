import api from './api';
import { User, LoginRequest, RegisterRequest, QuickRegisterRequest } from '../types';

export const authService = {
  // Login
  async login(data: LoginRequest) {
    const response = await api.post('/users/login', data);
    return response.data;
  },

  // Register
  async register(data: RegisterRequest) {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  // Quick Register (Demo Mode)
  async quickRegister(data: QuickRegisterRequest) {
    const response = await api.post('/users/quick-register', data);
    return response.data;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update profile
  async updateProfile(data: Partial<User>) {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};
