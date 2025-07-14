import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "./types";

export interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    logout: () => set({ user: null }),
  }))
);
