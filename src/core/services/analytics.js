// src/core/services/analytics.js - Enhanced Analytics with Real-time tracking
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';
import { firebaseApp } from '../../../firebase';

let analytics = null;
let performance = null;
let isInitialized = false;

// Initialize analytics and performance monitoring
export const initializeAnalytics = async () => {
    if (typeof window === 'undefined') return false;

    try {
        // Initialize Analytics
        analytics = getAnalytics(firebaseApp);
        
        // Initialize Performance Monitoring
        try {
            performance = getPerformance(firebaseApp);
        } catch (perfError) {
            console.warn('Performance monitoring not available:', perfError);
        }
        
        isInitialized = true;
        
        // Log initial app_open event
        logAnalyticsEvent('app_open', {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            platform: navigator.platform,
            language: navigator.language
        });
        
        return true;
    } catch (error) {
        console.error('Error initializing analytics:', error);
        return false;
    }
};

// Enhanced event logging with automatic enrichment
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
    if (!analytics || typeof window === 'undefined' || !isInitialized) return;

    try {
        // Enrich all events with common context
        const enrichedParams = {
            ...eventParams,
            app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
            timestamp: new Date().toISOString(),
            session_id: getSessionId(),
            page_url: window.location.href,
            page_title: document.title,
            referrer: document.referrer || 'direct',
            user_agent: navigator.userAgent,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            screen_width: screen.width,
            screen_height: screen.height,
            color_depth: screen.colorDepth,
            pixel_ratio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform,
            connection_type: getConnectionType(),
            is_mobile: /Mobi|Android/i.test(navigator.userAgent),
            is_tablet: /iPad|Tablet/i.test(navigator.userAgent)
        };

        logEvent(analytics, eventName, enrichedParams);
        
        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics Event:', eventName, enrichedParams);
        }
    } catch (error) {
        console.error('Error logging analytics event:', error);
    }
};

// Real-time page view tracking with enhanced data
export const logPageView = (path, additionalData = {}) => {
    if (typeof window === 'undefined') return;

    try {
        // Google Analytics 4 page_view
        window.gtag?.('config', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, {
            page_path: path,
            page_title: document.title,
            transport_type: 'beacon'
        });

        // Enhanced page view event
        logAnalyticsEvent('page_view', {
            page_path: path,
            page_title: document.title,
            page_location: window.location.href,
            page_referrer: document.referrer || 'direct',
            engagement_time_msec: getPageEngagementTime(),
            scroll_percentage: getScrollPercentage(),
            ...additionalData
        });
    } catch (error) {
        console.error('Error logging page view:', error);
    }
};

// User identification and properties
export const setUserAnalytics = (userId, userProperties = {}) => {
    if (!analytics || typeof window === 'undefined') return;

    try {
        setUserId(analytics, userId);
        
        const enhancedProperties = {
            ...userProperties,
            first_visit: !localStorage.getItem('user_visited_before'),
            total_sessions: getTotalSessions(),
            user_type: userProperties.isAnonymous ? 'anonymous' : 'authenticated',
            signup_method: userProperties.signupMethod || 'unknown',
            region: localStorage.getItem('app-region') || 'unknown',
            last_active: new Date().toISOString()
        };
        
        setUserProperties(analytics, enhancedProperties);
        
        // Mark user as visited
        localStorage.setItem('user_visited_before', 'true');
        
        logAnalyticsEvent('user_identification', {
            user_id: userId,
            ...enhancedProperties
        });
    } catch (error) {
        console.error('Error setting user analytics:', error);
    }
};

// Performance tracing
export const startPerformanceTrace = (traceName) => {
    if (!performance || typeof window === 'undefined') return null;

    try {
        const performanceTrace = trace(performance, traceName);
        performanceTrace.start();
        return performanceTrace;
    } catch (error) {
        console.error('Error starting performance trace:', error);
        return null;
    }
};

export const stopPerformanceTrace = (performanceTrace, customAttributes = {}) => {
    if (!performanceTrace) return;

    try {
        // Add custom attributes
        Object.entries(customAttributes).forEach(([key, value]) => {
            performanceTrace.putAttribute(key, String(value));
        });
        
        performanceTrace.stop();
    } catch (error) {
        console.error('Error stopping performance trace:', error);
    }
};

// Specific event tracking functions with enhanced data
export const logButtonClick = (buttonName, additionalParams = {}) => {
    logAnalyticsEvent('button_click', {
        button_name: buttonName,
        click_timestamp: new Date().toISOString(),
        element_position: getElementPosition(additionalParams.element),
        ...additionalParams
    });
};

export const logCalculation = (params) => {
    logAnalyticsEvent('reward_calculation', {
        calculation_timestamp: new Date().toISOString(),
        success: true,
        calculation_duration: params.duration || 0,
        user_region: localStorage.getItem('app-region') || 'unknown',
        ...params
    });
};

export const logCardAdd = (cardDetails) => {
    logAnalyticsEvent('card_add', {
        timestamp: new Date().toISOString(),
        card_bank: cardDetails.bank,
        card_name: cardDetails.cardName,
        card_network: cardDetails.network || 'unknown',
        user_total_cards: getUserCardCount() + 1,
        ...cardDetails
    });
};

export const logCardDelete = (cardDetails) => {
    logAnalyticsEvent('card_delete', {
        timestamp: new Date().toISOString(),
        card_bank: cardDetails.bank,
        card_name: cardDetails.cardName,
        user_remaining_cards: getUserCardCount() - 1,
        ...cardDetails
    });
};

export const logSearchQuery = (query, results = []) => {
    logAnalyticsEvent('search', {
        search_term: query,
        search_timestamp: new Date().toISOString(),
        results_count: results.length,
        has_results: results.length > 0,
        search_type: 'mcc_search'
    });
};

export const logFeatureUsage = (featureName, additionalParams = {}) => {
    logAnalyticsEvent('feature_use', {
        feature_name: featureName,
        feature_timestamp: new Date().toISOString(),
        user_session_features: getSessionFeatures(),
        ...additionalParams
    });
};

export const logError = (errorCode, errorMessage, additionalContext = {}) => {
    logAnalyticsEvent('app_error', {
        error_code: errorCode,
        error_message: errorMessage,
        error_timestamp: new Date().toISOString(),
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        error_stack: additionalContext.stack || '',
        error_severity: additionalContext.severity || 'error',
        ...additionalContext
    });
};

export const logConversion = (conversionType, value = 0) => {
    logAnalyticsEvent('conversion', {
        conversion_type: conversionType,
        conversion_value: value,
        conversion_timestamp: new Date().toISOString(),
        user_journey_step: getCurrentJourneyStep()
    });
};

// Real-time engagement tracking
export const logEngagementEvent = (eventType, duration = 0) => {
    logAnalyticsEvent('engagement', {
        engagement_type: eventType,
        engagement_duration: duration,
        engagement_timestamp: new Date().toISOString(),
        session_duration: getSessionDuration(),
        page_views_in_session: getSessionPageViews()
    });
};

// Helper functions
function getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
        sessionStorage.setItem('session_start_time', Date.now().toString());
    }
    return sessionId;
}

function getTotalSessions() {
    const sessions = parseInt(localStorage.getItem('total_sessions') || '0') + 1;
    localStorage.setItem('total_sessions', sessions.toString());
    return sessions;
}

function getSessionDuration() {
    const startTime = sessionStorage.getItem('session_start_time');
    return startTime ? Date.now() - parseInt(startTime) : 0;
}

function getSessionPageViews() {
    const pageViews = parseInt(sessionStorage.getItem('session_page_views') || '0') + 1;
    sessionStorage.setItem('session_page_views', pageViews.toString());
    return pageViews;
}

function getSessionFeatures() {
    const features = JSON.parse(sessionStorage.getItem('session_features') || '[]');
    return features;
}

function addSessionFeature(featureName) {
    const features = getSessionFeatures();
    if (!features.includes(featureName)) {
        features.push(featureName);
        sessionStorage.setItem('session_features', JSON.stringify(features));
    }
}

function getPageEngagementTime() {
    const startTime = performance.now();
    return Math.round(startTime);
}

function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
}

function getConnectionType() {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
}

function getElementPosition(element) {
    if (!element) return 'unknown';
    
    try {
        const rect = element.getBoundingClientRect();
        return {
            x: Math.round(rect.left),
            y: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
        };
    } catch {
        return 'unknown';
    }
}

function getUserCardCount() {
    // This would need to be implemented based on your user data structure
    return 0; // Placeholder
}

function getCurrentJourneyStep() {
    // Track user journey through the app
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path === '/') return 'landing';
    if (path === '/calculator') return 'calculator';
    if (path === '/my-cards') return 'card_management';
    if (path === '/best-card') return 'card_comparison';
    return 'other';
}

// Session end tracking
export const logSessionEnd = () => {
    const duration = getSessionDuration();
    const pageViews = getSessionPageViews();
    const features = getSessionFeatures();
    
    logAnalyticsEvent('session_end', {
        session_duration: duration,
        page_views: pageViews,
        features_used: features,
        session_timestamp: new Date().toISOString(),
        bounce_rate: pageViews === 1 ? 1 : 0
    });
};

// Initialize session end tracking
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', logSessionEnd);
    window.addEventListener('pagehide', logSessionEnd);
}