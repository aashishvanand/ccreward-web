'use client';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, firebaseApp } from '../../../firebase';
import { onAuthStateChanged, signInWithPopup, signInAnonymously as firebaseSignInAnonymously, getIdToken, signOut } from 'firebase/auth';
import { getAnalytics, logEvent } from "firebase/analytics";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress, Typography, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const AuthContext = createContext();

// Define which routes require authentication
const PROTECTED_ROUTES = ['/my-cards', '/calculator', '/best-card', '/transfer-calculator'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme ? useTheme() : { zIndex: { modal: 1300 } };
  const [loadingDuration, setLoadingDuration] = useState(0);

  // Track loading duration
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const isNew = user.metadata.creationTime === user.metadata.lastSignInTime;
        setUser({
          ...user,
          isAnonymous: user.isAnonymous,
        });
        setIsNewUser(isNew);
        // Log sign_in event if it's a new user
        if (isNew && typeof window !== 'undefined') {
          const analytics = getAnalytics(firebaseApp);
          logEvent(analytics, 'sign_up', {
            method: user.isAnonymous ? 'anonymous' : 'google',
          });
        }
      } else {
        setUser(null);
        setIsNewUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle route protection
  useEffect(() => {
    // Only redirect after authentication state is determined and if the route is protected
    if (!loading && !user && PROTECTED_ROUTES.includes(pathname)) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (typeof window !== 'undefined') {
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'login', {
          method: 'google',
        });
      }
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google", error);
      if (typeof window !== 'undefined') {
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'error', {
          error_code: error.code,
          error_message: error.message,
        });
      }
      throw error;
    }
  };

  const signInAnonymously = async () => {
    try {
      const result = await firebaseSignInAnonymously(auth);
      if (typeof window !== 'undefined') {
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'login', {
          method: 'anonymous',
        });
      }
      return result.user;
    } catch (error) {
      console.error("Error signing in anonymously", error);
      if (typeof window !== 'undefined') {
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'error', {
          error_code: error.code,
          error_message: error.message,
        });
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      if (typeof window !== 'undefined') {
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'logout');
      }
      setUser(null);
      setToken(null);
      setIsNewUser(false);
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('userCardsCache_') ||
            key.startsWith('userCardsCacheTimestamp_')) {
            localStorage.removeItem(key);
          }
        });
        localStorage.removeItem('calculationCount');
      }

    } catch (error) {
      console.error("Error signing out", error);
      if (typeof window !== 'undefined') {
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'error', {
          error_code: error.code,
          error_message: error.message,
        });
      }
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const markUserAsNotNew = () => {
    setIsNewUser(false);
  };

  const value = {
    user,
    signInWithGoogle,
    signInAnonymously,
    logout,
    isAuthenticated,
    loading,
    isNewUser,
    markUserAsNotNew,
  };

  // If loading and on a protected route, show loading state
  if (loading && PROTECTED_ROUTES.includes(pathname)) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
          bgcolor: "background.default",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: theme.zIndex.modal,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={4}
            sx={{
              py: 6,
              px: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
              maxWidth: 360,
              textAlign: "center",
            }}
          >
            <Box mb={3}>
              <CircularProgress
                size={60}
                thickness={4}
                color="primary"
                variant="indeterminate"
              />
            </Box>

            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: 500,
              }}
            >
              Checking authentication
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {loadingDuration > 5
                ? "This is taking longer than expected..."
                : "Just a moment while we prepare your experience"}
            </Typography>

            {loadingDuration > 10 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 2, display: "block" }}
                >
                  If this persists, please try refreshing the page
                </Typography>
              </motion.div>
            )}
          </Paper>
        </motion.div>
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}