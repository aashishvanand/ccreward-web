// firebase.js - Enhanced configuration with lazy-loaded auth
// Only firebase/app is statically imported to minimize initial bundle size.
// firebase/auth is loaded on first use.
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

// Initialize Firebase App Check with Cloudflare Turnstile (custom provider).
// A Firebase Cloud Function verifies Turnstile tokens and mints App Check tokens.
// API-level bot protection is separately handled by Cloudflare Turnstile.
let _appCheckInitPromise = null;

export const initAppCheck = () => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    if (_appCheckInitPromise) return _appCheckInitPromise;

    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!turnstileSiteKey || !apiBaseUrl) {
        console.warn('[AppCheck] Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY or NEXT_PUBLIC_API_BASE_URL — App Check disabled.');
        return Promise.resolve(null);
    }

    _appCheckInitPromise = (async () => {
        const { initializeAppCheck, CustomProvider } = await import('firebase/app-check');
        const { getTurnstileToken } = await import('./core/services/turnstile');

        const provider = new CustomProvider({
            getToken: async () => {
                const turnstileToken = await getTurnstileToken();
                if (!turnstileToken) {
                    throw new Error('Failed to obtain Turnstile token');
                }

                const response = await fetch(`${apiBaseUrl}/appCheckToken`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ turnstileToken, platform: 'web' }),
                });

                if (!response.ok) {
                    throw new Error(`App Check token exchange failed: ${response.status}`);
                }

                const { token, expireTimeMillis } = await response.json();
                return { token, expireTimeMillis };
            },
        });

        return initializeAppCheck(app, {
            provider,
            isTokenAutoRefreshEnabled: true,
        });
    })();

    return _appCheckInitPromise;
};

// Lazy-loaded auth and provider instances (ESM live bindings)
export let auth = null;
export let googleProvider = null;
export let appleProvider = null;
let _authInitPromise = null;

/**
 * Get auth and provider instances. Initializes firebase/auth on first
 * call, then caches the result.
 *
 * Firebase App Check (Cloudflare Turnstile custom provider) protects Firebase services.
 * Cloudflare Turnstile also protects the API backend (see core/services/turnstile.js).
 *
 * @returns {Promise<{auth: import('firebase/auth').Auth, googleProvider: import('firebase/auth').GoogleAuthProvider, appleProvider: import('firebase/auth').OAuthProvider}>}
 */
export const getFirebaseAuth = () => {
    if (auth) return Promise.resolve({ auth, googleProvider, appleProvider });

    if (!_authInitPromise) {
        _authInitPromise = (async () => {
            const { getAuth, GoogleAuthProvider, OAuthProvider } = await import('firebase/auth');
            auth = getAuth(app);
            googleProvider = new GoogleAuthProvider();
            appleProvider = new OAuthProvider('apple.com');
            appleProvider.addScope('email');
            appleProvider.addScope('name');
            return { auth, googleProvider, appleProvider };
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
