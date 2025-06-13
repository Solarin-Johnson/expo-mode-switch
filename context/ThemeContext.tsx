import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "theme-mode";
type Theme = "light" | "dark";

type ThemeContextType = {
  colorScheme: Theme;
  setColorScheme: (theme: Theme) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const system = useSystemColorScheme() ?? "light";
  const [mode, setMode] = useState<Theme>(system);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        setMode(stored as Theme);
      } else {
        setMode(system);
        AsyncStorage.setItem(STORAGE_KEY, system);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!stored || stored !== mode) {
        setMode(system);
        AsyncStorage.setItem(STORAGE_KEY, system);
      }
    });
  }, [system]);

  const setColorScheme = (theme: Theme) => {
    setMode(theme);
    AsyncStorage.setItem(STORAGE_KEY, theme);
  };

  const toggleColorScheme = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider
      value={{ colorScheme: mode, setColorScheme, toggleColorScheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
