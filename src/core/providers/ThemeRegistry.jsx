// src/core/providers/ThemeRegistry.jsx
'use client';
import { createContext, use, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext({
  mode: 'system',
  resolvedMode: 'light',
  toggleTheme: () => { },
  setMode: () => { },
});

// MUI's ThemeProvider hardcodes 'mui-mode' as its mode storage key, so the
// InitColorSchemeScript and this bridge use it too. 'app-theme' is the legacy
// key of the previous two-mode implementation; it is migrated on first mount.
const STORAGE_KEY = 'mui-mode';
const LEGACY_STORAGE_KEY = 'app-theme'; // 'light' | 'dark' written by the old toggle
const VALID_MODES = ['light', 'dark', 'system'];

const colorPalette = {
  light: {
    mode: 'light',
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
    mode: 'dark',
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

// One theme for both color schemes, hoisted and created once. With
// `cssVariables: true` every palette slot becomes a CSS variable scoped by
// `data-mui-color-scheme`, so the server and the first client render use the
// same stylesheet: no theme swap after hydration, no flash, and switching
// modes never re-creates the theme.
const theme = createTheme({
  // `colorSchemeSelector: 'data'` scopes each scheme's CSS variables to
  // [data-mui-color-scheme="…"], so setMode()/InitColorSchemeScript drive
  // the attribute and switching modes never regenerates styles. The default
  // ('media') would pin the scheme to the OS and ignore the user's choice.
  cssVariables: { colorSchemeSelector: 'data' },
  colorSchemes: {
    light: { palette: colorPalette.light },
    dark: { palette: colorPalette.dark },
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
        body: ({ theme }) => ({
          scrollbarColor: '#959595 #f1f1f1',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            backgroundColor: '#959595',
            '&:hover': {
              backgroundColor: '#6b6b6b',
            },
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          // Scheme-scoped rules: no runtime mode checks, no restyle on switch
          ...theme.applyStyles('dark', {
            scrollbarColor: '#6b6b6b #2b2b2b',
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#6b6b6b',
              '&:hover': {
                backgroundColor: '#959595',
              },
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#2b2b2b',
            },
          }),
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
        // Gradient only while enabled: a disabled button keeps MUI's
        // disabled text colour, which is unreadable on the blue gradient
        // (grey-on-blue in light mode), so it falls back to the standard
        // disabled background instead.
        contained: ({ theme }) => ({
          '&:not(.Mui-disabled)': {
            background: `linear-gradient(135deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.primary.dark} 100%)`,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.05)',
          ...theme.applyStyles('dark', {
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.05)',
          }),
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

export function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeContextBridge>
        {children}
      </ThemeContextBridge>
    </ThemeProvider>
  );
}

/**
 * Bridges MUI's color-scheme state to the app's useAppTheme() context.
 * `mode` is the user's choice ('light' | 'dark' | 'system');
 * `resolvedMode` is the scheme actually applied after system resolution.
 */
function ThemeContextBridge({ children }) {
  // `mode` and `systemMode` are undefined until mounted — SSR renders with
  // the default scheme, and the pre-paint InitColorSchemeScript in layout.jsx
  // has already applied the right attribute for the browser.
  const { mode, setMode, systemMode } = useColorScheme();

  const resolvedMode = mode === 'system' || !mode ? (systemMode ?? 'light') : mode;

  // Validate the stored mode and migrate the legacy 'app-theme' value so
  // existing users keep the choice their old toggle made.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && !VALID_MODES.includes(stored)) {
        setMode('system');
        return;
      }
      if (!stored) {
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy === 'light' || legacy === 'dark') {
          setMode(legacy);
        }
      }
    } catch {
      // localStorage throws when site data is blocked; the default
      // (system) applies, nothing to persist.
    }
  }, [setMode]);

  // Keep the non-MUI integrations in sync: the dark-mode class used by
  // globals.css and the theme-color meta for mobile browser chrome. (The
  // data-mui-color-scheme attribute itself is managed by MUI's provider.)
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', resolvedMode === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = resolvedMode === 'dark' ? '#0F172A' : '#ffffff';
  }, [resolvedMode]);

  const value = useMemo(() => ({
    mode: mode && VALID_MODES.includes(mode) ? mode : 'system',
    resolvedMode,
    setMode,
    // Cycle light → dark → system so every choice is reachable from one button
    toggleTheme: () => {
      const current = mode && VALID_MODES.includes(mode) ? mode : 'system';
      setMode({ light: 'dark', dark: 'system', system: 'light' }[current]);
    },
  }), [mode, resolvedMode, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeRegistry');
  }
  return context;
}
