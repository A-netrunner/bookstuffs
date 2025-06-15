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
            // This catches 4xx/5xx and returns a meaningful object
            set({ isLoading: false });
            return { success: false, message: data.message || 'Failed to register' };
        }

        // Save to AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('token', data.token);

        // Update state
        set({ user: data.user, token: data.token, isLoading: false });

        return { success: true }; // ✅ Important: return a success object

    } catch (error) {
        set({ isLoading: false, error: error.message });
        console.error('Registration error:', error);
        return { success: false, message: error.message || 'Something went wrong' }; // ✅ Always return a result
    }
}
