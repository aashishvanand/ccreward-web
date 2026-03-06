export const validateEnvVars = () => {
    const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID',
        'NEXT_PUBLIC_GOOGLE_CLIENT_ID'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}`;
        if (typeof window === 'undefined') {
            // Server-side: throw error in development/build to fail fast
            console.error(`[Security] ${errorMsg}`);
            throw new Error(errorMsg);
        } else {
            // Client-side: log securely, and throw to prevent initialization with missing configs
            console.error('[Security] Application configuration error. Missing critical variables.');
            throw new Error('Application configuration error. Please contact support.');
        }
    }
};
