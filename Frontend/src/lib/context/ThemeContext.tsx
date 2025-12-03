"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  currentThemeId: string;
  setCurrentTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState<string>("dawn");

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("currentThemeId");
    if (savedTheme) {
      setCurrentThemeId(savedTheme);
    }
  }, []);

  const setCurrentTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    localStorage.setItem("currentThemeId", themeId);
  };

  return (
    <ThemeContext.Provider value={{ currentThemeId, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
