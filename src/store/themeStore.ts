import { Appearance } from "react-native";
import { create } from "zustand";

type ThemeState = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,
  toggleTheme: () => {
    const next = !get().isDark;
    set({ isDark: next });
    Appearance.setColorScheme(next ? "dark" : "light");
  },
}));
