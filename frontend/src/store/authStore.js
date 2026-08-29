import { create } from 'zustand';
import { authAPI } from '../api';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),

  initialize: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    try {
      const res = await authAPI.getMe();
      set({ user: res.data.user, accessToken: token, isInitialized: true });
    } catch {
      localStorage.removeItem('accessToken');
      set({ user: null, accessToken: null, isInitialized: true });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.login(credentials);
      const { accessToken, user } = res.data;
      localStorage.setItem('accessToken', accessToken);
      set({ user, accessToken, isLoading: false });
      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.register(data);
      const { accessToken, user } = res.data;
      localStorage.setItem('accessToken', accessToken);
      set({ user, accessToken, isLoading: false });
      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (_) {}
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  },

  isAuthenticated: () => !!get().user,
  isEmployer: () => get().user?.role === 'employer',
  isJobSeeker: () => get().user?.role === 'jobseeker',
  isAdmin: () => get().user?.role === 'admin',
}));

export default useAuthStore;
