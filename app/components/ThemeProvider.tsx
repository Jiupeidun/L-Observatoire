"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark" | "auto";

/** 18h–6h = nuit, sinon = jour (pour le mode auto). */
function isNightHour(): boolean {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

function getEffectiveTheme(theme: Theme): "light" | "dark" {
  // On force le thème jour par défaut ; le mode auto reste disponible mais n’est pas utilisé par défaut.
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
  // Thème par défaut : jour (mode clair permanent tant que l’utilisateur ne change pas).
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  /** En mode auto, on force un re-render chaque minute pour recalculer jour/nuit. */
  const [autoTick, setAutoTick] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  /** effectiveTheme dérivé au render : un seul setState au clic, pas de double rendu. */
  const effectiveTheme = mounted ? getEffectiveTheme(theme) : "light";

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", effectiveTheme);
  }, [mounted, effectiveTheme]);

  useEffect(() => {
    if (!mounted || theme !== "auto") return;
    const interval = setInterval(() => setAutoTick((t) => t + 1), 60 * 1000);
    return () => clearInterval(interval);
  }, [theme, mounted]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const value = useMemo(
    () => ({ theme, effectiveTheme, setTheme }),
    [theme, effectiveTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  return ctx;
}
