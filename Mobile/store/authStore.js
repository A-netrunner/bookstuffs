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
            const response = await fetch(`http://localhost:8000/api/auth/register`, {
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
            const userJason = await AsyncStorage.getItem('user');
            const user = userJason ? JSON.parse(userJason) : null;

            set({ token, user });
        } catch (error) {
            console.error('Error checking authentication:', error);
            set({ error: error.message, user: null, token: null });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null, successMessage: null }); // Reset previous errors before trying to login
        try {
            const response = await fetch(`http://localhost:8000/api/auth/login`, {
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

    // uploadBook: async (bookData) => {
    //     const { token, user } = get();
        
    //     // Check if user is authenticated
    //     if (!token || !user) {
    //         set({ error: 'Please login to upload a book recommendation' });
    //         return { success: false, message: 'Authentication required' };
    //     }

    //     set({ uploadingBook: true, error: null, successMessage: null });
        
    //     try {
    //         // Validate required fields based on schema
    //         const { title, caption, image, rating } = bookData;
            
    //         if (!title?.trim()) {
    //             throw new Error('Book title is required');
    //         }
    //         if (!caption?.trim()) {
    //             throw new Error('Book description is required');
    //         }
    //         if (!image) {
    //             throw new Error('Book cover image is required');
    //         }
    //         if (!rating || rating < 1 || rating > 5) {
    //             throw new Error('Please provide a rating between 1-5 stars');
    //         }

    //         // Prepare the book data to match schema
    //         const bookPayload = {
    //             title: title.trim(),
    //             caption: caption.trim(),
    //             image: image, // This could be base64 string or file path
    //             rating: Number(rating),
    //             // user field will be set automatically on backend using token
    //         };

    //         const response = await fetch('http://localhost:8000/api/books/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(bookPayload),
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || 'Failed to upload book recommendation');
    //         }

    //         const data = await response.json();

    //         set({ 
    //             uploadingBook: false, 
    //             successMessage: 'Book recommendation uploaded successfully!' 
    //         });
            
    //         console.log('Book upload successful:', data);
    //         return { success: true, data };

    //     } catch (error) {
    //         set({
    //             uploadingBook: false,
    //             error: error.message
    //         });
    //         console.error('Book upload error:', error);
    //         return { success: false, message: error.message };
    //     }
    // },

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