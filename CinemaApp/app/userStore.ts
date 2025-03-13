// userStore.ts
import { create } from 'zustand';

export type UserData = {
  email: string;
  phone: string;
  password: string;
};

type UserState = {
  user: UserData | null;
  registerUser: (user: UserData) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  registerUser: (user) => set({ user }),
}));
