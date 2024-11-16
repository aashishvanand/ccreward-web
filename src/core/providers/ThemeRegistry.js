'use client';
import { useState, useMemo, createContext, useContext, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
// import { getInitColorSchemeScript } from '@mui/material/styles';

const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => { },
  setMode: () => { },
});

const STORAGE_KEY = 'app-theme';

const colorPalette = {
  light: {
    primary: {
      main: "#3A86FF",
      light: "#63A1FF",
      dark: "#2D6CCC",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FF006E",
      light: "#FF3D8C",
      dark: "#CC0058",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212529",
      secondary: "#6C757D",
    },
    success: {
      main: "#38B000",
      light: "#5FCC29",
      dark: "#2D8D00",
    },
    error: {
      main: "#FF595E",
      light: "#FF7A7E",
      dark: "#CC474B",
    },
    warning: {
      main: "#FFCA3A",
      light: "#FFD56A",
      dark: "#CCA22E",
    },
    info: {
      main: "#8AC926",
      light: "#A4D454",
      dark: "#6EA11E",
    },
  },
  dark: {
    primary: {
      main: "#4CC9F0",
      light: "#70D4F3",
      dark: "#3CA1C0",
      contrastText: "#000000",
    },
    secondary: {
      main: "#F72585",
      light: "#F85A9F",
      dark: "#C51E6A",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#A0A0A0",
    },
    success: {
      main: "#4CAF50",
      light: "#6FBF73",
      dark: "#3D8C40",
    },
    error: {
      main: "#F44336",
      light: "#F6685E",
      dark: "#C3352B",
    },
    warning: {
      main: "#FFA726",
      light: "#FFB851",
      dark: "#CC851E",
    },
    info: {
      main: "#29B6F6",
      light: "#53C4F7",
      dark: "#2191C5",
    },
  },
};

function getInitialMode() {
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem(STORAGE_KEY);
    if (savedMode) {
      return savedMode;
    }
  }
  return 'light';
}

export function ThemeRegistry({ children }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState(getInitialMode);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode]);

  const toggleTheme = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, [mode]);

  const theme = useMemo(() => {
    const themeOptions = {
      palette: {
        mode,
        ...colorPalette[mode],
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              scrollbarColor: mode === 'dark' ? '#6b6b6b #2b2b2b' : '#959595 #f1f1f1',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: '8px',
                backgroundColor: mode === 'dark' ? '#6b6b6b' : '#959595',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#959595' : '#6b6b6b',
                },
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: mode === 'dark' ? '#2b2b2b' : '#f1f1f1',
              },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
            },
          },
        },
      },
    };

    return createTheme(themeOptions);
  }, [mode]);

  // Prevent flash of wrong theme
  useEffect(() => {
    if (mounted && mode) {
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mounted, mode]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <InitColorSchemeScript/>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeRegistry');
  }
  return context;
}