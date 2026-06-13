import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDark: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('avora_theme') as Theme;
    return saved || 'dark';
  });

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    localStorage.setItem('avora_theme', theme);
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(media.matches);
      const listener = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      <div style={{ minHeight: '100vh', background: isDark ? '#050816' : '#F8F7FF', transition: 'background 0.3s ease' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export const getTheme = (isDark: boolean) => ({
  bg: isDark ? '#050816' : '#F8F7FF',
  surface: isDark ? '#0F172A' : '#FFFFFF',
  surface2: isDark ? '#1E293B' : '#F1F0FF',
  glass: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
  glassBg: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)',
  border: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.18)',
  borderSubtle: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  secondary: '#6366F1',
  accent: '#A855F7',
  text: isDark ? '#E2E8F0' : '#1E1B4B',
  textMuted: isDark ? '#94A3B8' : '#6B7280',
  textDim: isDark ? '#64748B' : '#9CA3AF',
  cardBg: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)',
  sidebarBg: isDark ? '#0A0F1E' : '#FFFFFF',
  navBg: isDark ? 'rgba(5, 8, 22, 0.85)' : 'rgba(255, 255, 255, 0.92)',
  inputBg: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 240, 255, 0.8)',
  glow: isDark ? '0 0 40px rgba(139, 92, 246, 0.25)' : '0 4px 24px rgba(139, 92, 246, 0.12)',
  glowStrong: isDark ? '0 0 60px rgba(139, 92, 246, 0.45)' : '0 8px 32px rgba(139, 92, 246, 0.22)',
  shadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.08)',
  tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
});

export type AppTheme = ReturnType<typeof getTheme>;
