// firebase.js - Enhanced configuration with lazy-loaded auth and app-check
// Only firebase/app is statically imported to minimize initial bundle size.
// firebase/auth and firebase/app-check are loaded on first use.
import { initializeApp, getApps, getApp } from 'firebase/app';

import { validateEnvVars } from './envValidator';
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

if (typeof window !== 'undefined') {
    validateEnvVars();
}

// Initialize Firebase App (lightweight - only firebase/app)
let app;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// Lazy-loaded auth and provider instances (ESM live bindings)
export let auth = null;
export let googleProvider = null;
let _authInitPromise = null;

/**
 * Get auth and googleProvider instances. Initializes firebase/auth and
 * firebase/app-check on first call, then caches the result.
 * @returns {Promise<{auth: import('firebase/auth').Auth, googleProvider: import('firebase/auth').GoogleAuthProvider}>}
 */
export const getFirebaseAuth = () => {
    if (auth) return Promise.resolve({ auth, googleProvider });

    if (!_authInitPromise) {
        _authInitPromise = (async () => {
            const { getAuth, GoogleAuthProvider } = await import('firebase/auth');
            auth = getAuth(app);
            googleProvider = new GoogleAuthProvider();

            // Initialize App Check for security (optional)
            if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
                try {
                    const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
                    initializeAppCheck(app, {
                        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
                        isTokenAutoRefreshEnabled: true
                    });
                } catch (error) {
                    console.warn('App Check initialization failed:', error);
                }
            }

            return { auth, googleProvider };
        })();
    }

    return _authInitPromise;
};

// Firestore is initialized where needed to avoid server-side evaluation errors
export const db = null;
export const firebaseApp = app;

// Initialize Analytics only on client side
export const initializeFirebaseAnalytics = async () => {
    if (typeof window !== 'undefined') {
        try {
            const { getAnalytics, isSupported } = await import('firebase/analytics');
            if (await isSupported()) {
                return getAnalytics(app);
            }
        } catch (e) {
            console.warn("Analytics import failed", e);
        }
    }
    return null;
};

export default app;
