import { getAnalytics, logEvent } from 'firebase/analytics';
import { firebaseApp } from '../../../firebase';

let analytics = null;

// Initialize analytics
export const initializeAnalytics = async () => {
    if (typeof window === 'undefined') return false;

    try {
        analytics = getAnalytics(firebaseApp);
        return true;
    } catch (error) {
        console.error('Error initializing analytics:', error);
        return false;
    }
};

// Generic event logging function with safety checks
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
    if (!analytics || typeof window === 'undefined') return;

    try {
        logEvent(analytics, eventName, eventParams);
    } catch (error) {
        console.error('Error logging analytics event:', error);
    }
};

export const logPageView = (path) => {
    if (typeof window === 'undefined') return;

    try {
        window.gtag?.('config', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, {
            page_path: path,
            transport_type: 'beacon'
        });

        logAnalyticsEvent('page_view', {
            page_path: path,
            page_title: document.title
        });
    } catch (error) {
        console.error('Error logging page view:', error);
    }
};

// Button click tracking
export const logButtonClick = (buttonName, additionalParams = {}) => {
    logAnalyticsEvent('button_click', {
        button_name: buttonName,
        timestamp: new Date().toISOString(),
        ...additionalParams
    });
};

// Reward calculation tracking
export const logCalculation = (params) => {
    logAnalyticsEvent('reward_calculation', {
        timestamp: new Date().toISOString(),
        ...params,
        success: true
    });
};

// Card management tracking
export const logCardAdd = (cardDetails) => {
    logAnalyticsEvent('card_add', {
        timestamp: new Date().toISOString(),
        card_bank: cardDetails.bank,
        card_name: cardDetails.cardName,
        ...cardDetails
    });
};

export const logCardDelete = (cardDetails) => {
    logAnalyticsEvent('card_delete', {
        timestamp: new Date().toISOString(),
        card_bank: cardDetails.bank,
        card_name: cardDetails.cardName,
        ...cardDetails
    });
};

// Authentication tracking
export const logSignIn = (method, additionalParams = {}) => {
    logAnalyticsEvent('login', {
        method,
        timestamp: new Date().toISOString(),
        success: true,
        ...additionalParams
    });
};

export const logSignOut = () => {
    logAnalyticsEvent('logout', {
        timestamp: new Date().toISOString(),
        success: true
    });
};

// Error tracking
export const logError = (errorCode, errorMessage, additionalContext = {}) => {
    logAnalyticsEvent('app_error', {
        error_code: errorCode,
        error_message: errorMessage,
        timestamp: new Date().toISOString(),
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        ...additionalContext
    });
};

// Feature usage tracking
export const logFeatureUsage = (featureName, additionalParams = {}) => {
    logAnalyticsEvent('feature_use', {
        feature_name: featureName,
        timestamp: new Date().toISOString(),
        ...additionalParams
    });
};

// Enhanced event logging for specific user actions
export const logUserAction = (actionName, actionDetails = {}) => {
    logAnalyticsEvent('user_action', {
        action_name: actionName,
        timestamp: new Date().toISOString(),
        ...actionDetails
    });
};

// Performance tracking
export const logPerformanceMetric = (metricName, value, additionalParams = {}) => {
    logAnalyticsEvent('performance_metric', {
        metric_name: metricName,
        metric_value: value,
        timestamp: new Date().toISOString(),
        ...additionalParams
    });
};

// Session tracking
export const logSessionStart = () => {
    logAnalyticsEvent('session_start', {
        timestamp: new Date().toISOString(),
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    });
};

export const logSessionEnd = (duration) => {
    logAnalyticsEvent('session_end', {
        timestamp: new Date().toISOString(),
        session_duration: duration
    });
};