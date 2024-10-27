'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, firebaseApp } from '../../../firebase';
import { onAuthStateChanged, signInWithPopup, signInAnonymously as firebaseSignInAnonymously, getIdToken, signOut } from 'firebase/auth';
import { getAnalytics, logEvent } from "firebase/analytics";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}