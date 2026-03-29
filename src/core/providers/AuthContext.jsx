'use client';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getFirebaseAuth, firebaseApp, initAppCheck } from '@/firebase';
import { deleteUserData } from '../services/firebaseUtils';
import { resetUsageState } from '../services/usageLimitService';
import { useRouter } from "next/router";
import { Box, CircularProgress, Typography, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const AuthContext = createContext();

// Define which routes require authentication
const PROTECTED_ROUTES = ['/my-cards'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const authRef = useRef(null);
  const providerRef = useRef(null);
  const appleProviderRef = useRef(null);
  const router = useRouter();
  const pathname = router.asPath?.split('?')[0] || '';
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
    let unsubscribe;

    // Dynamically load firebase/auth, then set up the auth state listener
    (async () => {
      // Initialize App Check before any Firebase service call
      await initAppCheck();
      const { auth, googleProvider, appleProvider } = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');
      authRef.current = auth;
      providerRef.current = googleProvider;
      appleProviderRef.current = appleProvider;

      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const isNew = user.metadata.creationTime === user.metadata.lastSignInTime;
          setUser(user);
          setIsNewUser(isNew);
          // Log sign_up event if it's a new user
          if (isNew && typeof window !== 'undefined') {
            const signInMethod = user.providerData?.[0]?.providerId === 'apple.com' ? 'apple' : 'google';
            import("firebase/analytics").then(({ getAnalytics, logEvent }) => {
              const analytics = getAnalytics(firebaseApp);
              logEvent(analytics, 'sign_up', {
                method: signInMethod,
              });
            }).catch(e => console.warn("Analytics error", e));
          }
        } else {
          setUser(null);
          setIsNewUser(false);
        }
        setLoading(false);
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle route protection
  useEffect(() => {
    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Only redirect after authentication state is determined and if the route is protected
    if (!loading && !user && isProtectedRoute) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  const signInWithGoogle = async () => {
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(authRef.current, providerRef.current);
      if (typeof window !== 'undefined') {
        const { getAnalytics, logEvent } = await import("firebase/analytics");
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'login', {
          method: 'google',
        });
      }
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google", error);
      if (typeof window !== 'undefined') {
        try {
          const { getAnalytics, logEvent } = await import("firebase/analytics");
          const analytics = getAnalytics(firebaseApp);
          logEvent(analytics, 'error', {
            error_code: error.code,
            error_message: error.message,
          });
        } catch (e) { }
      }
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(authRef.current, appleProviderRef.current);
      if (typeof window !== 'undefined') {
        const { getAnalytics, logEvent } = await import("firebase/analytics");
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'login', {
          method: 'apple',
        });
      }
      return result.user;
    } catch (error) {
      console.error("Error signing in with Apple", error);
      if (typeof window !== 'undefined') {
        try {
          const { getAnalytics, logEvent } = await import("firebase/analytics");
          const analytics = getAnalytics(firebaseApp);
          logEvent(analytics, 'error', {
            error_code: error.code,
            error_message: error.message,
          });
        } catch (e) { }
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(authRef.current);
      if (typeof window !== 'undefined') {
        const { getAnalytics, logEvent } = await import("firebase/analytics");
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'logout');
      }
      setUser(null);
      setToken(null);
      setIsNewUser(false);
      resetUsageState();
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
        try {
          const { getAnalytics, logEvent } = await import("firebase/analytics");
          const analytics = getAnalytics(firebaseApp);
          logEvent(analytics, 'error', {
            error_code: error.code,
            error_message: error.message,
          });
        } catch (e) { }
      }
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!authRef.current?.currentUser) throw new Error("No user logged in");

      const uid = authRef.current.currentUser.uid;

      // 1. Delete user data from Firestore
      await deleteUserData(uid);

      // 2. Delete user from Firebase Auth
      const { deleteUser } = await import('firebase/auth');
      await deleteUser(authRef.current.currentUser);

      // 3. Analytics
      if (typeof window !== 'undefined') {
        const { getAnalytics, logEvent } = await import("firebase/analytics");
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'delete_account');
      }

      // 4. Cleanup local state
      setUser(null);
      setToken(null);
      setIsNewUser(false);
      resetUsageState();

      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('userCardsCache_') ||
            key.startsWith('userCardsCacheTimestamp_')) {
            localStorage.removeItem(key);
          }
        });
        localStorage.removeItem('calculationCount');
      }

      router.push('/');
    } catch (error) {
      console.error("Error deleting account", error);
      if (typeof window !== 'undefined') {
        try {
          const { getAnalytics, logEvent } = await import("firebase/analytics");
          const analytics = getAnalytics(firebaseApp);
          logEvent(analytics, 'error', {
            error_code: error.code,
            error_message: error.message,
          });
        } catch (e) { }
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
    signInWithApple,
    logout,
    isAuthenticated,
    loading,
    isNewUser,
    markUserAsNotNew,
    deleteAccount,
  };



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
