import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    successMessage: null,

    clearMessages: () => set({ error: null, successMessage: null }), // Clear messages

    register: async (username, email, password) => {
        set({ isLoading: true, error: null, successMessage: null }); // Reset previous errors before trying to register
        try {
            const response = await fetch('https://bookstuffs.onrender.com/api/auth/register', {
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

            set(
                {
                    isLoading: false,

                    error: error.message
                });
            console.error('Registration error:', error);
            return { success: false, message: error.message };
        }
    }
}));
