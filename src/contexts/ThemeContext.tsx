"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load theme from localStorage or default to system preference
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTimeout(() => setThemeState(savedTheme), 0);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTimeout(() => setThemeState("dark"), 0);
    }
    setTimeout(() => setMounted(true), 0);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Pre-hydration, the HTML might not have the correct class. 
  // We just return children. 
  // To avoid hydration mismatch for Theme-dependent UI components,
  // `mounted` can be used by consuming components.

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted } as ThemeContextType & {mounted: boolean}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext) as ThemeContextType & {mounted: boolean};
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
