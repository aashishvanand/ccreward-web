// src/core/services/analytics.js - Enhanced Analytics with Real-time tracking and Performance Monitoring
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { getPerformance, trace, connectPerformanceEmulator } from 'firebase/performance';
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
            
            // Connect to emulator in development (if needed)
            if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
                connectPerformanceEmulator(performance, 'localhost', 9000);
            }
            
            // Set up automatic performance monitoring
            setupAutomaticPerformanceMonitoring();
            
            console.log('✅ Firebase Performance Monitoring initialized');
        } catch (perfError) {
            console.warn('Performance monitoring not available:', perfError);
        }

        isInitialized = true;

        // Log initial app_open event with performance data
        logAnalyticsEvent('app_open', {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            platform: navigator.platform,
            language: navigator.language,
            // Add performance metrics
            ...getInitialPerformanceMetrics()
        });

        return true;
    } catch (error) {
        console.error('Error initializing analytics:', error);
        return false;
    }
};

// Enhanced event logging with automatic enrichment and performance data
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
    if (!analytics || typeof window === 'undefined' || !isInitialized) return;

    try {
        // Enrich all events with common context including performance data
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
            is_tablet: /iPad|Tablet/i.test(navigator.userAgent),
            // Add current performance metrics
            ...getCurrentPerformanceMetrics()
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

// Real-time page view tracking with enhanced data and performance metrics
export const logPageView = (path, additionalData = {}) => {
    if (typeof window === 'undefined') return;

    try {
        // Create performance trace for page view
        const pageViewTrace = startPerformanceTrace(`page_view_${path.replace(/[^a-zA-Z0-9]/g, '_')}`);
        
        if (pageViewTrace) {
            pageViewTrace.putAttribute('page_path', path);
            pageViewTrace.putAttribute('page_title', document.title);
        }

        // Google Analytics 4 page_view
        window.gtag?.('config', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, {
            page_path: path,
            page_title: document.title,
            transport_type: 'beacon'
        });

        // Enhanced page view event with performance data
        logAnalyticsEvent('page_view', {
            page_path: path,
            page_title: document.title,
            page_location: window.location.href,
            page_referrer: document.referrer || 'direct',
            engagement_time_msec: getPageEngagementTime(),
            scroll_percentage: getScrollPercentage(),
            // Add detailed performance metrics
            ...getDetailedPerformanceMetrics(),
            ...additionalData
        });

        // Stop the performance trace after a short delay (page should be interactive)
        setTimeout(() => {
            if (pageViewTrace) {
                stopPerformanceTrace(pageViewTrace, {
                    page_interactive: 'true',
                    scroll_position: getScrollPercentage().toString()
                });
            }
        }, 100);

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
            last_active: new Date().toISOString(),
            // Add performance context for user
            device_performance_class: getDevicePerformanceClass()
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

// Enhanced Performance tracing with better error handling
export const startPerformanceTrace = (traceName) => {
    if (!performance || typeof window === 'undefined') return null;

    try {
        const performanceTrace = trace(performance, traceName);
        performanceTrace.start();
        
        // Add default attributes
        performanceTrace.putAttribute('timestamp', new Date().toISOString());
        performanceTrace.putAttribute('session_id', getSessionId());
        performanceTrace.putAttribute('page_url', window.location.href);
        
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

        // Add performance metrics as attributes
        const metrics = getCurrentPerformanceMetrics();
        Object.entries(metrics).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                performanceTrace.putAttribute(key, String(value));
            }
        });

        performanceTrace.stop();
    } catch (error) {
        console.error('Error stopping performance trace:', error);
    }
};

// Enhanced specific event tracking functions with performance tracing
export const logButtonClick = (buttonName, additionalParams = {}) => {
    const clickTrace = startPerformanceTrace(`button_click_${buttonName}`);
    
    logAnalyticsEvent('button_click', {
        button_name: buttonName,
        click_timestamp: new Date().toISOString(),
        element_position: getElementPosition(additionalParams.element),
        interaction_delay: getInteractionDelay(),
        ...additionalParams
    });
    
    // Stop trace after click processing
    setTimeout(() => {
        if (clickTrace) {
            stopPerformanceTrace(clickTrace, {
                button_name: buttonName,
                interaction_type: 'click'
            });
        }
    }, 50);
};

export const logCalculation = (params) => {
    const calculationTrace = startPerformanceTrace('reward_calculation');
    
    logAnalyticsEvent('reward_calculation', {
        calculation_timestamp: new Date().toISOString(),
        success: true,
        calculation_duration: params.duration || 0,
        user_region: localStorage.getItem('app-region') || 'unknown',
        cpu_usage: getCPUUsage(),
        memory_usage: getMemoryUsage(),
        ...params
    });
    
    if (calculationTrace) {
        stopPerformanceTrace(calculationTrace, {
            calculation_success: 'true',
            calculation_duration: String(params.duration || 0)
        });
    }
};

export const logCardAdd = (cardDetails) => {
    const cardAddTrace = startPerformanceTrace('card_add');
    
    logAnalyticsEvent('card_add', {
        timestamp: new Date().toISOString(),
        card_bank: cardDetails.bank,
        card_name: cardDetails.cardName,
        card_network: cardDetails.network || 'unknown',
        user_total_cards: getUserCardCount() + 1,
        operation_performance: getOperationPerformance(),
        ...cardDetails
    });
    
    if (cardAddTrace) {
        stopPerformanceTrace(cardAddTrace, {
            card_bank: cardDetails.bank,
            operation_type: 'add'
        });
    }
};

export const logCardDelete = (cardDetails) => {
    const cardDeleteTrace = startPerformanceTrace('card_delete');
    
    logAnalyticsEvent('card_delete', {
        timestamp: new Date().toISOString(),
        card_bank: cardDetails.bank,
        card_name: cardDetails.cardName,
        user_remaining_cards: getUserCardCount() - 1,
        operation_performance: getOperationPerformance(),
        ...cardDetails
    });
    
    if (cardDeleteTrace) {
        stopPerformanceTrace(cardDeleteTrace, {
            card_bank: cardDetails.bank,
            operation_type: 'delete'
        });
    }
};

export const logSearchQuery = (query, results = []) => {
    const searchTrace = startPerformanceTrace('search_query');
    
    logAnalyticsEvent('search', {
        search_term: query,
        search_timestamp: new Date().toISOString(),
        results_count: results.length,
        has_results: results.length > 0,
        search_type: 'mcc_search',
        search_performance: getSearchPerformance()
    });
    
    if (searchTrace) {
        stopPerformanceTrace(searchTrace, {
            search_term: query.substring(0, 50), // Limit length
            results_count: String(results.length)
        });
    }
};

export const logFeatureUsage = (featureName, additionalParams = {}) => {
    const featureTrace = startPerformanceTrace(`feature_${featureName}`);
    
    logAnalyticsEvent('feature_use', {
        feature_name: featureName,
        feature_timestamp: new Date().toISOString(),
        user_session_features: getSessionFeatures(),
        feature_performance: getFeaturePerformance(),
        ...additionalParams
    });
    
    addSessionFeature(featureName);
    
    if (featureTrace) {
        stopPerformanceTrace(featureTrace, {
            feature_name: featureName,
            session_feature_count: String(getSessionFeatures().length)
        });
    }
};

export const logError = (errorCode, errorMessage, additionalContext = {}) => {
    const errorTrace = startPerformanceTrace('error_occurred');
    
    logAnalyticsEvent('app_error', {
        error_code: errorCode,
        error_message: errorMessage,
        error_timestamp: new Date().toISOString(),
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        error_stack: additionalContext.stack || '',
        error_severity: additionalContext.severity || 'error',
        performance_at_error: getPerformanceAtError(),
        ...additionalContext
    });
    
    if (errorTrace) {
        stopPerformanceTrace(errorTrace, {
            error_code: errorCode,
            error_severity: additionalContext.severity || 'error'
        });
    }
};

export const logConversion = (conversionType, value = 0) => {
    const conversionTrace = startPerformanceTrace(`conversion_${conversionType}`);
    
    logAnalyticsEvent('conversion', {
        conversion_type: conversionType,
        conversion_value: value,
        conversion_timestamp: new Date().toISOString(),
        user_journey_step: getCurrentJourneyStep(),
        conversion_performance: getConversionPerformance()
    });
    
    if (conversionTrace) {
        stopPerformanceTrace(conversionTrace, {
            conversion_type: conversionType,
            conversion_value: String(value)
        });
    }
};

// Real-time engagement tracking with performance context
export const logEngagementEvent = (eventType, duration = 0) => {
    logAnalyticsEvent('engagement', {
        engagement_type: eventType,
        engagement_duration: duration,
        engagement_timestamp: new Date().toISOString(),
        session_duration: getSessionDuration(),
        page_views_in_session: getSessionPageViews(),
        engagement_performance: getEngagementPerformance()
    });
};

// NEW: Setup automatic performance monitoring
function setupAutomaticPerformanceMonitoring() {
    if (!performance || typeof window === 'undefined') return;

    // Monitor page load performance
    window.addEventListener('load', () => {
        const pageLoadTrace = startPerformanceTrace('page_load_complete');
        if (pageLoadTrace) {
            stopPerformanceTrace(pageLoadTrace, {
                load_type: 'initial',
                page_title: document.title
            });
        }
    });

    // Monitor navigation performance
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                logAnalyticsEvent('web_vital_lcp', {
                    value: lastEntry.startTime,
                    element: lastEntry.element?.tagName || 'unknown',
                    url: window.location.href
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP observer not supported');
        }

        // First Input Delay
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const firstEntry = entries[0];
                
                logAnalyticsEvent('web_vital_fid', {
                    value: firstEntry.processingStart - firstEntry.startTime,
                    name: firstEntry.name,
                    url: window.location.href
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID observer not supported');
        }

        // Cumulative Layout Shift
        try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                logAnalyticsEvent('web_vital_cls', {
                    value: clsValue,
                    url: window.location.href
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS observer not supported');
        }
    }
}

// NEW: Enhanced performance metrics functions
function getInitialPerformanceMetrics() {
    if (!window.performance) return {};
    
    return {
        performance_now: performance.now(),
        memory_used: performance.memory?.usedJSHeapSize || null,
        memory_total: performance.memory?.totalJSHeapSize || null,
        cpu_cores: navigator.hardwareConcurrency || null
    };
}

function getCurrentPerformanceMetrics() {
    if (!window.performance) return {};
    
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
        // Timing metrics
        dom_content_loaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || null,
        load_complete: navigation?.loadEventEnd - navigation?.loadEventStart || null,
        first_paint: paint.find(entry => entry.name === 'first-paint')?.startTime || null,
        first_contentful_paint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || null,
        
        // Resource metrics
        resource_count: performance.getEntriesByType('resource').length,
        
        // Memory metrics (if available)
        memory_used: performance.memory?.usedJSHeapSize || null,
        memory_total: performance.memory?.totalJSHeapSize || null,
        memory_limit: performance.memory?.jsHeapSizeLimit || null
    };
}

function getDetailedPerformanceMetrics() {
    const base = getCurrentPerformanceMetrics();
    
    return {
        ...base,
        // Additional detailed metrics
        performance_now: performance.now(),
        connection_rtt: navigator.connection?.rtt || null,
        connection_downlink: navigator.connection?.downlink || null,
        device_memory: navigator.deviceMemory || null,
        hardware_concurrency: navigator.hardwareConcurrency || null
    };
}

function getDevicePerformanceClass() {
    const memory = navigator.deviceMemory || 4; // Default to 4GB
    const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores
    
    if (memory >= 8 && cores >= 8) return 'high';
    if (memory >= 4 && cores >= 4) return 'medium';
    return 'low';
}

function getInteractionDelay() {
    // Measure time since last user interaction
    if (window.lastInteractionTime) {
        return performance.now() - window.lastInteractionTime;
    }
    return null;
}

function getCPUUsage() {
    // Simplified CPU usage estimation
    if (performance.memory) {
        const used = performance.memory.usedJSHeapSize;
        const total = performance.memory.totalJSHeapSize;
        return Math.round((used / total) * 100);
    }
    return null;
}

function getMemoryUsage() {
    if (performance.memory) {
        return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            percentage: Math.round((performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100)
        };
    }
    return null;
}

function getOperationPerformance() {
    return {
        timestamp: performance.now(),
        memory_used: performance.memory?.usedJSHeapSize || null,
        resources_loaded: performance.getEntriesByType('resource').length
    };
}

function getSearchPerformance() {
    return {
        dom_nodes: document.querySelectorAll('*').length,
        memory_used: performance.memory?.usedJSHeapSize || null,
        search_timestamp: performance.now()
    };
}

function getFeaturePerformance() {
    return {
        memory_usage: getMemoryUsage(),
        performance_now: performance.now(),
        active_timers: 0 // Would need custom tracking
    };
}

function getPerformanceAtError() {
    return {
        memory_at_error: performance.memory?.usedJSHeapSize || null,
        time_since_load: performance.now(),
        resource_count: performance.getEntriesByType('resource').length
    };
}

function getConversionPerformance() {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
        page_load_time: navigation?.loadEventEnd - navigation?.navigationStart || null,
        memory_efficiency: getMemoryUsage(),
        conversion_timestamp: performance.now()
    };
}

function getEngagementPerformance() {
    return {
        scroll_performance: getScrollPercentage(),
        interaction_count: getSessionInteractionCount(),
        memory_stability: getMemoryUsage()
    };
}

function getSessionInteractionCount() {
    const count = parseInt(sessionStorage.getItem('interaction_count') || '0') + 1;
    sessionStorage.setItem('interaction_count', count.toString());
    return count;
}

// Track last interaction time for delay measurements
if (typeof window !== 'undefined') {
    ['click', 'keydown', 'touchstart'].forEach(eventType => {
        window.addEventListener(eventType, () => {
            window.lastInteractionTime = performance.now();
        });
    });
}

// Helper function to generate cryptographically secure random string
function generateSecureRandomString(length = 9) {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        // Browser environment - use crypto.getRandomValues
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(36)).join('').substr(0, length);
    } else if (typeof require !== 'undefined') {
        // Node.js environment - use crypto module
        try {
            const crypto = require('crypto');
            return crypto.randomBytes(Math.ceil(length * 3 / 4)).toString('base64').substr(0, length);
        } catch (error) {
            console.warn('Crypto module not available, falling back to timestamp-based ID');
        }
    }

    // Fallback for environments without crypto support
    console.warn('Using fallback session ID generation - not cryptographically secure');
    return `fallback_${Date.now()}_${performance.now()}`;
}

// Helper functions (keeping existing implementations)
function getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        const secureRandom = generateSecureRandomString(12);
        sessionId = `session_${Date.now()}_${secureRandom}`;
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

// Session end tracking with performance summary
export const logSessionEnd = () => {
    const duration = getSessionDuration();
    const pageViews = getSessionPageViews();
    const features = getSessionFeatures();
    const finalPerformance = getCurrentPerformanceMetrics();

    logAnalyticsEvent('session_end', {
        session_duration: duration,
        page_views: pageViews,
        features_used: features,
        session_timestamp: new Date().toISOString(),
        bounce_rate: pageViews === 1 ? 1 : 0,
        // Add performance summary
        final_memory_used: finalPerformance.memory_used,
        avg_page_load_time: finalPerformance.load_complete,
        total_interactions: getSessionInteractionCount()
    });
};

// Initialize session end tracking
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', logSessionEnd);
    window.addEventListener('pagehide', logSessionEnd);
}

// Network Request Monitoring Setup
export const setupNetworkMonitoring = () => {
    if (typeof window === 'undefined' || window.fetchMonitoringSetup) return;
    
    // Mark as setup to prevent double initialization
    window.fetchMonitoringSetup = true;
    
    // Wrap fetch for automatic monitoring
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const url = args[0];
        const method = args[1]?.method || 'GET';
        const trace = startPerformanceTrace(`api_${method.toLowerCase()}`);
        
        try {
            const response = await originalFetch(...args);
            if (trace) {
                stopPerformanceTrace(trace, {
                    status: response.status.toString(),
                    url: url.toString().substring(0, 100),
                    method: method
                });
            }
            return response;
        } catch (error) {
            if (trace) {
                stopPerformanceTrace(trace, {
                    status: 'error',
                    error: error.message.substring(0, 100),
                    method: method
                });
            }
            throw error;
        }
    };
    
    console.log('🌐 Network monitoring enabled');
};