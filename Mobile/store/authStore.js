import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { API_URL } from '../constants/api.js'
const urAPI = 'http://localhost:8000/api/auth/'; // Base URL for API requests

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    successMessage: null,
    uploadingBook: false,


    clearMessages: () => set({ error: null, successMessage: null }), // Clear messages

    register: async (username, email, password) => {
        set({ isLoading: true, error: null, successMessage: null }); // Reset previous errors before trying to register
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                // Handle server-side errors
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register');
            }

            const data = await response.json();

            // Save to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            // Update state with the new user and token
            set({ user: data.user, token: data.token, isLoading: false, successMessage: 'Registration successful!' });
            console.log(' Registration successful!! ');
            return { success: true }
        } catch (error) {
            set({
                isLoading: false,
                error: error.message
            });
            console.error('Registration error:', error);
            return { success: false, message: error.message };
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;

            set({ token, user });
        } catch (error) {
            console.error('Error checking authentication:', error);
            set({ error: error.message, user: null, token: null });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null, successMessage: null }); // Reset previous errors before trying to login
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                // Handle server-side errors
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to login');
            }

            const data = await response.json();

            // Save to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            // Update state with the new user and token
            set({ user: data.user, token: data.token, isLoading: false, successMessage: 'Login successful!' });
            console.log(' Login successful!! ');
            return { success: true }
        } catch (error) {
            set({
                isLoading: false,
                error: error.message
            });
            console.error('Login error:', error);
            return { success: false, message: error.message };
        }
    },

   
    logout: async () => {
        try {
            // Clear AsyncStorage
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');

            // Reset state
            set({ 
                user: null, 
                token: null, 
                isLoading: false, 
                error: null, 
                successMessage: 'Logout successful!',
                uploadingBook: false 
            });
            console.log(' Logout successful!! ');
        } catch (error) {
            console.error('Logout error:', error);
            set({ error: error.message });
        }
    },
}));