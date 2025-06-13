import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username,email,password) => {
        
        set({ isLoading: true });
        try {
            const response = await fetch('https://localhost:300/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }
            await asyncStorage.setItem('user', JSON.stringify(data.user));
            
            await asyncStorage.setItem('token', data.token);
            Set({ token: data.token, user: data.user, isLoading: false });

        } catch (error) {
            set({ isLoading: false });
            console.error('Registration error:', error);
        }
    }
}));