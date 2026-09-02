import { create } from 'zustand';
import { authApi } from '../api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: !!user,
      error: null
    });
  },

  updateUser: (partialUser) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...partialUser } });
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const response = await authApi.refreshToken();
      if (response?.data?.user && response?.data?.token) {
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false
        });
        return;
      }
    } catch {
      // Unauthenticated visitor session
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false
    });
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const { user, token } = response.data;
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return { success: true, user };
    } catch (err) {
      const message = err.message || 'Login failed.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(payload);
      const { user, token } = response.data;
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return { success: true };
    } catch (err) {
      const message = err.message || 'Registration failed.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors during logout teardown
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  },

  isEmployer: () => get().user?.role === 'employer',
  isJobSeeker: () => get().user?.role === 'jobseeker',
  isAdmin: () => get().user?.role === 'admin'
}));