import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
    id: string;
    email: string;
    address: string;
    firstName: string;
    lastName: string;
    role: string;
};

export interface AuthStore {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}


export const useAuthStore = create<AuthStore>()(devtools((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    logout: () => set({ user: null })
})));