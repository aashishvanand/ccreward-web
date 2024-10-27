import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { firebaseApp } from '../../firebase';

let analytics = null;

// Initialize analytics
export const initializeAnalytics = async () => {
    try {
        if (await isSupported()) {
            analytics = getAnalytics(firebaseApp);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error initializing analytics:', error);
        return false;
    }
};

// Generic event logging function
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
    try {
        if (analytics) {
            logEvent(analytics, eventName, eventParams);
        }
    } catch (error) {
        console.error('Error logging analytics event:', error);
    }
};

// Common events
export const logPageView = (pageName) => {
    logAnalyticsEvent('page_view', { page_name: pageName });
};

export const logButtonClick = (buttonName) => {
    logAnalyticsEvent('button_click', { button_name: buttonName });
};

export const logCalculation = (params) => {
    logAnalyticsEvent('reward_calculation', params);
};

export const logCardAdd = (cardDetails) => {
    logAnalyticsEvent('card_add', cardDetails);
};

export const logCardDelete = (cardDetails) => {
    logAnalyticsEvent('card_delete', cardDetails);
};

export const logSignIn = (method) => {
    logAnalyticsEvent('login', { method });
};

export const logSignOut = () => {
    logAnalyticsEvent('logout');
};

export const logError = (errorCode, errorMessage) => {
    logAnalyticsEvent('app_error', {
        error_code: errorCode,
        error_message: errorMessage,
    });
};

export const logFeatureUsage = (featureName) => {
    logAnalyticsEvent('feature_use', { feature_name: featureName });
};