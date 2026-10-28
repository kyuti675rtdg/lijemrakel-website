'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = 'lijemrakel-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved === 'dark' || saved === 'light') {
        setThemeState(saved);
        document.documentElement.classList.toggle('dark', saved === 'dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', mode === 'dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  showLabel = false,
  className = '',
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`inline-flex items-center gap-2 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
        isDark
          ? 'bg-brand-orange/15 border-brand-orange/40 text-brand-orange hover:bg-brand-orange hover:text-[#0B0E29]'
          : 'bg-white/10 border-white/20 text-white hover:bg-brand-orange hover:text-[#0B0E29] hover:border-brand-orange'
      } ${showLabel ? 'px-3.5 py-2' : 'p-2.5'} ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 shrink-0 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 shrink-0 transition-transform duration-300" />
      )}
      {showLabel && (
        <span className="text-xs font-heading font-bold tracking-wide">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
