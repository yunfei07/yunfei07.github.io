"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // 从 localStorage 读取保存的主题设置
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const updateActualTheme = () => {
      if (theme === "system") {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setActualTheme(systemDark ? "dark" : "light");
      } else {
        setActualTheme(theme);
      }
    };

    updateActualTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateActualTheme);
      return () => mediaQuery.removeEventListener("change", updateActualTheme);
    }
  }, [theme]);

  useEffect(() => {
    // 保存主题设置到 localStorage
    localStorage.setItem("theme", theme);

    // 更新 document 的 class
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);
  }, [theme, actualTheme]);

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}