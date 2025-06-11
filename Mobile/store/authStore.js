import {create} from 'zustand';

export const useAuthStore = create((set) => ({
    user:{
        name: '',
        sayHello: () => console.log('Hello from user!')
    }
}));