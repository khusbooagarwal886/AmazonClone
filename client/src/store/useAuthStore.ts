import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { useCartStore } from './useCartStore';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
        const userKey = user.id || user._id || user.email || 'guest';
        useCartStore.getState().setUser(userKey);
      },
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        useCartStore.getState().setUser(null);
      },
    }),
    {
      name: 'amazon-auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const userKey = state.user?.id || state.user?._id || state.user?.email || null;
          useCartStore.getState().setUser(userKey);
        }
      },
    }
  )
);
