import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('https://bookstuffs.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        set({ isLoading: false });
        return { success: false, message: data.message || 'Failed to register' };
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);

      // Update state
      set({ user: data.user, token: data.token, isLoading: false });

      return { success: true }; // ✅ Always return an object
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Something went wrong' };
    }
  }
}));
