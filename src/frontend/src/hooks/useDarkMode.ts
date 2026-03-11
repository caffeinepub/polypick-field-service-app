import { useEffect, useState } from "react";

const DARK_MODE_KEY = "darkMode";

function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(DARK_MODE_KEY, String(isDark));
    } catch {
      // ignore
    }
  }, [isDark]);

  return { isDark, setIsDark };
}

// Initialize dark mode on app load (called once)
export function initDarkMode() {
  const dark = getInitialDark();
  if (dark) {
    document.documentElement.classList.add("dark");
  }
}
