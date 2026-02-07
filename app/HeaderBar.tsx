"use client";

import { useTheme } from "./ThemeProvider";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const THEME_CYCLE: Array<"auto" | "light" | "dark"> = ["auto", "light", "dark"];

function getNextTheme(current: "auto" | "light" | "dark"): "auto" | "light" | "dark" {
  const i = THEME_CYCLE.indexOf(current);
  return THEME_CYCLE[(i + 1) % THEME_CYCLE.length];
}

function getThemeButtonTitle(theme: "auto" | "light" | "dark", effectiveIsDark: boolean): string {
  if (theme === "auto") {
    return effectiveIsDark
      ? "Mode auto (nuit). Cliquer pour changer"
      : "Mode auto (jour). Cliquer pour changer";
  }
  if (theme === "dark") return "Mode nuit. Cliquer : mode auto";
  return "Mode jour. Cliquer : mode nuit";
}

export default function HeaderBar() {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const effectiveIsDark = effectiveTheme === "dark";

  const handleCycle = () => {
    setTheme(getNextTheme(theme as "auto" | "light" | "dark"));
  };

  return (
    <header className="header">
      <h1 className="headerTitle">L&apos;Observatoire</h1>
      <button
        type="button"
        className="themeToggle"
        onClick={handleCycle}
        title={getThemeButtonTitle(theme as "auto" | "light" | "dark", effectiveIsDark)}
        aria-label={getThemeButtonTitle(theme as "auto" | "light" | "dark", effectiveIsDark)}
      >
        {effectiveIsDark ? (
          <SunIcon className="themeToggleIcon" />
        ) : (
          <MoonIcon className="themeToggleIcon" />
        )}
      </button>
    </header>
  );
}
