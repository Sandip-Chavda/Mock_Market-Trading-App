import { create } from "zustand";

type ThemeState = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,
  toggleTheme: () => set({ isDark: !get().isDark }),
}));
