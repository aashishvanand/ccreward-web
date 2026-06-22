// src/core/providers/ThemeRegistry.js
'use client';
import { useState, useMemo, createContext, use, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => { },
  setMode: () => { },
});

const STORAGE_KEY = 'app-theme';

const colorPalette = {
  light: {
    primary: {
      main: "#2563EB", // Vibrant Blue
      light: "#60A5FA",
      dark: "#1E40AF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#7C3AED", // Violet
      light: "#A78BFA",
      dark: "#5B21B6",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F3F4F6", // Cool Gray 100
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827", // Gray 900
      secondary: "#4B5563", // Gray 600
    },
    success: {
      main: "#059669",
      light: "#34D399",
      dark: "#047857",
    },
    error: {
      main: "#DC2626",
      light: "#F87171",
      dark: "#B91C1C",
    },
    warning: {
      main: "#D97706",
      light: "#FBBF24",
      dark: "#B45309",
    },
    info: {
      main: "#0EA5E9",
      light: "#38BDF8",
      dark: "#0369A1",
    },
  },
  dark: {
    primary: {
      main: "#3B82F6", // Blue 500
      light: "#60A5FA",
      dark: "#2563EB",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#8B5CF6", // Violet 500
      light: "#A78BFA",
      dark: "#7C3AED",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#0F172A", // Slate 900
      paper: "#1E293B", // Slate 800
    },
    text: {
      primary: "#F9FAFB", // Gray 50
      secondary: "#9CA3AF", // Gray 400
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    info: {
      main: "#0EA5E9",
      light: "#38BDF8",
      dark: "#0369A1",
    },
  },
};

// Hoisted: avoids recreating a default theme object on every pre-mount render.
const DEFAULT_THEME = createTheme();

function getInitialMode() {
  // Only return a default mode during server-side rendering to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedMode = localStorage.getItem(STORAGE_KEY);
  if (savedMode) {
    return savedMode;
  }
  return 'light';
}

export function ThemeRegistry({ children }) {
  // Initialize with null to avoid hydration mismatch
  const [mode, setMode] = useState(null);
  const [mounted, setMounted] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Only run once the component is mounted on client
  useEffect(() => {
    setMounted(true);
    // Set the actual mode once we're on the client
    const initialMode = getInitialMode();
    setMode(initialMode);

    // If no saved preference, use system preference
    if (!localStorage.getItem(STORAGE_KEY) && prefersDarkMode) {
      setMode('dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    }
  }, [prefersDarkMode]);

  const toggleTheme = useCallback(() => {
    if (!mode) return;
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, [mode]);

  const theme = useMemo(() => {
    if (!mode) return DEFAULT_THEME;

    return createTheme({
      palette: {
        mode,
        ...colorPalette[mode],
      },
      typography: {
        fontFamily: 'var(--font-inter), "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700 },
        h2: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700 },
        h3: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 },
        h4: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 },
        h5: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 500 },
        h6: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 500 },
        button: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, textTransform: 'none' },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            // Use ({ theme }) callback so mode-specific values are evaluated lazily
            // against the live theme, not captured in a stale closure.
            body: ({ theme }) => ({
              scrollbarColor: theme.palette.mode === 'dark' ? '#6b6b6b #2b2b2b' : '#959595 #f1f1f1',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: '8px',
                backgroundColor: theme.palette.mode === 'dark' ? '#6b6b6b' : '#959595',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#959595' : '#6b6b6b',
                },
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f1f1f1',
              },
            }),
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '50px', // Pill shape
              padding: '8px 24px',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transform: 'translateY(-1px)',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            },
            contained: ({ theme }) => ({
              background: theme.palette.mode === 'light'
                ? `linear-gradient(135deg, ${colorPalette.light.primary.main} 0%, ${colorPalette.light.primary.dark} 100%)`
                : `linear-gradient(135deg, ${colorPalette.dark.primary.main} 0%, ${colorPalette.dark.primary.dark} 100%)`,
            }),
          },
        },
        MuiCard: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: 16,
              boxShadow: theme.palette.mode === 'light'
                ? '0 4px 20px rgba(0,0,0,0.05)'
                : '0 4px 20px rgba(0,0,0,0.2)',
              border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
            }),
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: theme.spacing(2),
            }),
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    });
  }, [mode]);

  useEffect(() => {
    if (mounted && mode) {
      document.documentElement.setAttribute('data-mui-color-scheme', mode);
      // Sync the dark-mode class used by globals.css for body background/color
      document.documentElement.classList.toggle('dark-mode', mode === 'dark');
    }
  }, [mode, mounted]);

  // Render a "blank" theme on server so hydration works properly
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ mode: 'light', toggleTheme, setMode }}>
        <ThemeProvider theme={DEFAULT_THEME}>
          {children}
        </ThemeProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeRegistry');
  }
  return context;
}
