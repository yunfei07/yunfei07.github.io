"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 辅助函数：检测系统偏好支持
const isSystemPreferenceSupported = (): boolean => {
  try {
    return typeof window !== 'undefined' && 
           window.matchMedia && 
           typeof window.matchMedia === 'function';
  } catch (error) {
    console.warn("System preference detection not supported:", error);
    return false;
  }
};

// 辅助函数：获取系统主题偏好
const getSystemThemePreference = (): "light" | "dark" => {
  if (!isSystemPreferenceSupported()) {
    console.warn("System preference detection not available, defaulting to dark theme");
    return "dark";
  }

  try {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    return mediaQuery.matches ? "dark" : "light";
  } catch (error) {
    console.warn("Failed to detect system theme preference:", error);
    return "dark"; // 降级到深色主题
  }
};

// 辅助函数：确定实际主题
const getActualTheme = (theme: Theme): "light" | "dark" => {
  if (theme === "system") {
    return getSystemThemePreference();
  }
  return theme;
};

// 辅助函数：应用主题到 DOM
const applyThemeToDOM = (theme: "light" | "dark") => {
  try {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  } catch (error) {
    console.warn("Failed to apply theme to DOM:", error);
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化主题设置
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // 从 localStorage 读取保存的主题设置
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const themeToUse = savedTheme || "system";
        
        // 检查 ThemeScript 是否已经设置了主题
        const root = document.documentElement;
        const scriptLoaded = root.getAttribute('data-theme-script-loaded');

        if (scriptLoaded) {
          // 如果脚本已经运行，同步当前的实际主题
          const currentTheme = root.classList.contains('light') ? 'light' : 'dark';
          setActualTheme(currentTheme);
          setTheme(themeToUse);
        } else {
          // 如果脚本没有运行，手动设置主题
          setTheme(themeToUse);
          const actualTheme = getActualTheme(themeToUse);
          setActualTheme(actualTheme);
          applyThemeToDOM(actualTheme);
        }
      } catch (error) {
        console.warn("Failed to initialize theme:", error);
        // 降级到默认主题
        try {
          setTheme("system");
          const fallbackTheme = getSystemThemePreference();
          setActualTheme(fallbackTheme);
          applyThemeToDOM(fallbackTheme);
        } catch (fallbackError) {
          console.error("Critical theme initialization failure:", fallbackError);
          // 最后的降级方案
          setTheme("dark");
          setActualTheme("dark");
          applyThemeToDOM("dark");
        }
      } finally {
        setIsLoaded(true);
      }
    };

    initializeTheme();
  }, []);

  // 监听主题变化并更新实际主题
  useEffect(() => {
    if (!isLoaded) return;

    const updateActualTheme = () => {
      const newActualTheme = getActualTheme(theme);
      setActualTheme(newActualTheme);
    };

    updateActualTheme();

    // 如果是系统主题，监听系统偏好变化
    if (theme === "system") {
      if (!isSystemPreferenceSupported()) {
        console.warn("System preference monitoring not supported, theme will not update automatically");
        return;
      }

      let mediaQuery: MediaQueryList | null = null;
      let handleChange: (() => void) | null = null;

      try {
        mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        handleChange = () => {
          try {
            const newActualTheme = getActualTheme(theme);
            console.log("System theme preference changed to:", newActualTheme);
            setActualTheme(newActualTheme);
          } catch (error) {
            console.warn("Failed to handle system theme change:", error);
          }
        };

        // 检查是否支持 addEventListener (现代浏览器)
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener("change", handleChange);
        } else if (mediaQuery.addListener) {
          // 降级支持旧版浏览器
          mediaQuery.addListener(handleChange);
        } else {
          console.warn("MediaQueryList change events not supported");
        }

        // 返回清理函数
        return () => {
          if (mediaQuery && handleChange) {
            try {
              if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handleChange);
              } else if (mediaQuery.removeListener) {
                mediaQuery.removeListener(handleChange);
              }
            } catch (error) {
              console.warn("Failed to remove system theme listener:", error);
            }
          }
        };
      } catch (error) {
        console.warn("Failed to set up system theme listener:", error);
        return;
      }
    }
  }, [theme, isLoaded]);

  // 保存主题设置并应用到 DOM
  useEffect(() => {
    if (!isLoaded) return;

    try {
      // 保存主题设置到 localStorage
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
    }

    // 应用主题到 DOM
    applyThemeToDOM(actualTheme);
  }, [theme, actualTheme, isLoaded]);

  // 增强的主题设置函数
  const handleSetTheme = (newTheme: Theme) => {
    try {
      setTheme(newTheme);
      
      // 立即计算并应用新的实际主题，提供更好的用户体验
      const newActualTheme = getActualTheme(newTheme);
      setActualTheme(newActualTheme);
      applyThemeToDOM(newActualTheme);
      
      // 保存到 localStorage
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.warn("Failed to set theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      actualTheme, 
      setTheme: handleSetTheme, 
      isLoaded 
    }}>
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

// 导出用于调试的工具函数
export const themeUtils = {
  // 检测系统偏好支持
  isSystemPreferenceSupported: (): boolean => {
    try {
      return typeof window !== 'undefined' && 
             window.matchMedia && 
             typeof window.matchMedia === 'function';
    } catch (error) {
      return false;
    }
  },

  // 获取当前系统偏好
  getCurrentSystemPreference: (): "light" | "dark" | null => {
    try {
      if (!themeUtils.isSystemPreferenceSupported()) {
        return null;
      }
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      return mediaQuery.matches ? "dark" : "light";
    } catch (error) {
      console.warn("Failed to get system preference:", error);
      return null;
    }
  },

  // 测试系统偏好监听
  testSystemPreferenceListener: (callback: (theme: "light" | "dark") => void): (() => void) | null => {
    try {
      if (!themeUtils.isSystemPreferenceSupported()) {
        console.warn("System preference monitoring not supported");
        return null;
      }

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        callback(newTheme);
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      } else {
        console.warn("MediaQueryList change events not supported");
        return null;
      }
    } catch (error) {
      console.warn("Failed to set up test listener:", error);
      return null;
    }
  }
};