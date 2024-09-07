'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../../../firebase';
import { onAuthStateChanged, signInWithPopup, signInAnonymously as firebaseSignInAnonymously, getIdToken, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const token = await getIdToken(user);
        setToken(token);
      } else {
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signInAnonymously = async () => {
    try {
      const result = await firebaseSignInAnonymously(auth);
      return result.user;
    } catch (error) {
      console.error("Error signing in anonymously", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    token,
    signInWithGoogle,
    signInAnonymously,
    logout,
    isAuthenticated,
    loading,
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