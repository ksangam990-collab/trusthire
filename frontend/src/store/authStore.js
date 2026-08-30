// frontend/src/store/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('trusthire_user')) || null,
  token: localStorage.getItem('trusthire_token') || null,
  isAuthenticated: !!localStorage.getItem('trusthire_token'),

  setAuth: (user, token) => {
    localStorage.setItem('trusthire_user', JSON.stringify(user));
    localStorage.setItem('trusthire_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('trusthire_user');
    localStorage.removeItem('trusthire_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem('trusthire_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  }
}));

export default useAuthStore;