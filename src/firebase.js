// firebase.js - Enhanced configuration with Crashlytics
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

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

validateEnvVars();

// Initialize Firebase
let app;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);

    // Initialize App Check for security (optional but recommended)
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        try {
            initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
                isTokenAutoRefreshEnabled: true
            });
        } catch (error) {
            console.warn('App Check initialization failed:', error);
        }
    }
} else {
    app = getApp();
}

export const auth = getAuth(app);
// Firestore is now initialized where needed to avoid server-side evaluation errors
export const db = null;
export const googleProvider = new GoogleAuthProvider();
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