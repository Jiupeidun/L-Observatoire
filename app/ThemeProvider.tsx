"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "auto";

/** 18:00–6:00 = 夜间，其余 = 日间 */
function isNightHour(): boolean {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

function getEffectiveTheme(theme: Theme): "light" | "dark" {
  if (theme === "auto") return isNightHour() ? "dark" : "light";
  return theme;
}

type ThemeContextValue = {
  theme: Theme;
  effectiveTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("auto");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const effective = getEffectiveTheme(theme);
    setEffectiveTheme(effective);
    document.documentElement.setAttribute("data-theme", effective);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || theme !== "auto") return;
    const interval = setInterval(() => {
      const next = getEffectiveTheme("auto");
      setEffectiveTheme((prev) => {
        if (prev !== next) {
          document.documentElement.setAttribute("data-theme", next);
          return next;
        }
        return prev;
      });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [theme, mounted]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
