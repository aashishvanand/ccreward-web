// Analytics consent (opt-out model).
//
// The choice is stored on the device under 'analytics-consent':
//   'granted'  — analytics may run
//   'denied'   — Google Analytics and Microsoft Clarity do not load
//   absent     — undecided: analytics run (opt-out), and the consent banner
//                offers a one-click decline
//
// Error and crash reports (crashlytics) are NOT gated: they are diagnostic
// data needed to keep the service working, and they contain no tracking IDs.

const STORAGE_KEY = 'analytics-consent';
const VALID_VALUES = ['granted', 'denied'];

/**
 * The stored consent value, or null when undecided (or when storage is
 * blocked / during SSR — both behave like undecided).
 */
export const getAnalyticsConsent = () => {
    if (typeof window === 'undefined') return null;
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return VALID_VALUES.includes(value) ? value : null;
    } catch {
        return null;
    }
};

/** True once the visitor has declined analytics. */
export const isAnalyticsDenied = () => getAnalyticsConsent() === 'denied';

/**
 * Store the choice. Declining also sets the GA4 disable flag so any gtag
 * collection in the current session stops immediately.
 */
export const setAnalyticsConsent = (value) => {
    if (!VALID_VALUES.includes(value)) return;
    try {
        localStorage.setItem(STORAGE_KEY, value);
    } catch {
        // Storage blocked: the choice holds for this session only.
    }
    if (value === 'denied' && typeof window !== 'undefined') {
        const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
        if (measurementId) {
            // GA4 checks this flag before every collect request
            window[`ga-disable-${measurementId}`] = true;
        }
    }
    window.dispatchEvent(new CustomEvent('analytics-consent-change', { detail: value }));
};

/**
 * Forget a stored choice (the footer's "Analytics choices" link): the banner
 * reappears on the next load, and analytics keep running until a new choice
 * is made — consistent with the opt-out model.
 */
export const resetAnalyticsConsent = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Storage blocked: nothing to clear.
    }
};

/** Listen for consent changes (e.g. the banner being answered). */
export const onAnalyticsConsentChange = (callback) => {
    window.addEventListener('analytics-consent-change', callback);
    return () => window.removeEventListener('analytics-consent-change', callback);
};
