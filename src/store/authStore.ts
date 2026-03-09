import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setDemoMode: (isDemoMode: boolean) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isDemoMode: false,

      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setDemoMode: (isDemoMode) => {
        set({ isDemoMode });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false, isDemoMode: false });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
