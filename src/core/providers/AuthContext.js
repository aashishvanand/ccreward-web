'use client';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, firebaseApp } from '../../../firebase';
import { onAuthStateChanged, signInWithPopup, getIdToken, signOut, deleteUser } from 'firebase/auth';
import { deleteUserData } from '../services/firebaseUtils';
import { getAnalytics, logEvent } from "firebase/analytics";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress, Typography, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const AuthContext = createContext();

// Define which routes require authentication
const PROTECTED_ROUTES = ['/my-cards', '/calculator', '/best-card', '/transfer-calculator', '/mcc-lookup'];

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

  const deleteAccount = async () => {
    try {
      if (!auth.currentUser) throw new Error("No user logged in");

      const uid = auth.currentUser.uid;

      // 1. Delete user data from Firestore
      await deleteUserData(uid);

      // 2. Delete user from Firebase Auth
      await deleteUser(auth.currentUser);

      // 3. Analytics
      if (typeof window !== 'undefined') {
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'delete_account');
      }

      // 4. Cleanup local state
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

      router.push('/');
    } catch (error) {
      console.error("Error deleting account", error);
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