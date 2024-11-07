export function getInitialTheme() {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode');
      if (savedMode) {
        return savedMode;
      }
    }
    return 'light'; // Default to light theme on server side
  }