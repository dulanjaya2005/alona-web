import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set) => ({
  admin: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('alona_admin_token');
      const admin = localStorage.getItem('alona_admin_user');
      if (token && admin) {
        set({ token, admin: JSON.parse(admin), isAuthenticated: true });
      }
    }
  },

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, admin } = res.data;
      localStorage.setItem('alona_admin_token', token);
      localStorage.setItem('alona_admin_user', JSON.stringify(admin));
      set({ token, admin, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('alona_admin_token');
    localStorage.removeItem('alona_admin_user');
    set({ admin: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
