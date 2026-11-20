'use client';
import PropTypes from 'prop-types';
import { createContext, use, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { getFirebaseAuth, firebaseApp } from '@/firebase';
import { resetUsageState } from '../services/usageLimitService';
import { whenIdle } from '@/core/utils/scheduler';
import { useRouter, usePathname } from "next/navigation";
import SignInDialog from '@/shared/components/auth/SignInDialog';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const AuthContext = createContext();

// Define which routes require authentication
const PROTECTED_ROUTES = ['/my-cards'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const authRef = useRef(null);
  const providerRef = useRef(null);
  const appleProviderRef = useRef(null);

  useEffect(() => {
    let unsubscribe;
    let cancelled = false;

    // Auth startup is deferred to idle time so it never competes with the
    // initial render: anonymous visitors on landing/SEO pages don't wait for
    // Firebase Auth, and the Turnstile script (pulled in by App Check) stays
    // off the critical path. App Check itself is initialized by the first
    // API call instead (see getAppCheckHeaderToken in api.js), so it only
    // loads for visitors who actually use the API.
    const cancelIdle = whenIdle(() => {
      (async () => {
        const { auth, googleProvider, appleProvider } = await getFirebaseAuth();
        const { onAuthStateChanged } = await import('firebase/auth');
        if (cancelled) return;
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
    });

    return () => {
      cancelled = true;
      cancelIdle();
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
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
  }, []);

  const signInWithApple = useCallback(async () => {
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
  }, []);

  const logout = useCallback(async () => {
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(authRef.current);
      if (typeof window !== 'undefined') {
        const { getAnalytics, logEvent } = await import("firebase/analytics");
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'logout');
      }
      setUser(null);
      setIsNewUser(false);
      resetUsageState();
      if (typeof window !== 'undefined') {
        const keysToRemove = Object.keys(localStorage).filter(key =>
          key.startsWith('userCardsCache_') || key.startsWith('userCardsCacheTimestamp_')
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
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
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      if (!authRef.current?.currentUser) throw new Error("No user logged in");

      // 1. Delete user from Firebase Auth. This triggers ccreward-api /webhook/user-deleted,
      //    which deletes the user's cards from D1 and revokes the MCP key (which also ends
      //    any OAuth access, since OAuth tokens run on the same mcp:<uid> credentials).
      const { deleteUser } = await import('firebase/auth');
      await deleteUser(authRef.current.currentUser);

      // 2. Analytics
      if (typeof window !== 'undefined') {
        const { getAnalytics, logEvent } = await import("firebase/analytics");
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'delete_account');
      }

      // 3. Cleanup local state
      setUser(null);
      setIsNewUser(false);
      resetUsageState();

      if (typeof window !== 'undefined') {
        const keysToRemove = Object.keys(localStorage).filter(key =>
          key.startsWith('userCardsCache_') || key.startsWith('userCardsCacheTimestamp_')
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
        localStorage.removeItem('calculationCount');
      }

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
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  const markUserAsNotNew = useCallback(() => {
    setIsNewUser(false);
  }, []);

  // Memoized value: consumers only re-render when the auth state actually
  // changes, not on every provider render.
  const value = useMemo(() => ({
    user,
    signInWithGoogle,
    signInWithApple,
    logout,
    isAuthenticated,
    loading,
    isNewUser,
    markUserAsNotNew,
    deleteAccount,
  }), [user, loading, isNewUser, signInWithGoogle, signInWithApple, logout, isAuthenticated, markUserAsNotNew, deleteAccount]);

  return (
    <AuthContext.Provider value={value}>
      <RouteGuard>
        {children}
      </RouteGuard>
    </AuthContext.Provider>
  );
}

// Route protection lives in this child component so the AuthProvider itself
// doesn't depend on usePathname/useRouter and re-render on every navigation.
// Only RouteGuard re-renders when the route changes. Signed-out visitors on
// a protected route get the sign-in dialog on the page itself — not a silent
// redirect to / with no explanation.
function RouteGuard({ children }) {
  const { user, loading, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const needsSignIn = !loading && !user && isProtectedRoute;

  return (
    <>
      {needsSignIn && (
        <SignInDialog
          open
          onGoogleSignIn={signInWithGoogle}
          onAppleSignIn={signInWithApple}
          title="Sign in to see your cards"
          message="Your saved cards belong to your account. Sign in to view and manage them."
          icon={<CreditCardIcon color="primary" sx={{ fontSize: 40 }} />}
          cancelLabel="Go home"
          onCancel={() => router.push('/')}
        />
      )}
      {children}
    </>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export function useAuth() {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
