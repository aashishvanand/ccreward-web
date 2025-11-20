// src/core/services/analytics.js - Client-Side Only Firebase Analytics & Performance
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';
import { firebaseApp } from '../../../firebase';

let analytics = null;
let performance = null;
let isInitialized = false;

// Initialize analytics and performance monitoring (client-side only)
const initializeAnalytics = async () => {
    // Only run on client-side
    if (typeof window === 'undefined') {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔧 Analytics initialization skipped (server-side)');
        }
        return false;
    }

    // Wait a bit to ensure everything is ready
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        // Initialize Analytics
        analytics = getAnalytics(firebaseApp);
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Firebase Analytics initialized');
        }

        // Initialize Performance Monitoring
        try {
            performance = getPerformance(firebaseApp);

            // Set up automatic performance monitoring
            setupClientSidePerformanceMonitoring();

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Firebase Performance Monitoring initialized');
            }
        } catch (perfError) {
            console.warn('⚠️ Performance monitoring not available:', perfError);
        }

        isInitialized = true;

        // Log initial app_open event with client-side performance data (with safety checks)
        try {
            logAnalyticsEvent('app_open', {
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                viewport_size: `${window.innerWidth}x${window.innerHeight}`,
                platform: navigator.platform,
                language: navigator.language,
                referrer: document.referrer || 'direct',
                ...getClientPerformanceMetrics()
            });
        } catch (eventError) {
            console.warn('⚠️ Failed to log initial app_open event:', eventError);
        }

        return true;
    } catch (error) {
        console.error('❌ Error initializing analytics:', error);
        return false;
    }
};

function generateSecureRandomString(length = 9) {
    const randomBytes = new Uint8Array(length);

    // Use crypto.getRandomValues for cryptographically secure randomness
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(randomBytes);
    } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(randomBytes);
    } else {
        // Fallback for environments without crypto API (should be rare)
        throw new Error('Crypto API not available for secure random generation');
    }

    // Convert bytes to base36 string (0-9, a-z)
    return Array.from(randomBytes)
        .map(byte => (byte % 36).toString(36))
        .join('');
}

// Enhanced event logging (client-side only)
const logAnalyticsEvent = (eventName, eventParams = {}) => {
    // Only run on client-side
    if (!analytics || typeof window === 'undefined' || !isInitialized) {
        if (typeof window === 'undefined') {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔧 Analytics event skipped (server-side): ${eventName}`);
            }
        }
        return;
    }

    try {
        // Enrich all events with client-side context
        const enrichedParams = {
            ...eventParams,
            app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
            timestamp: new Date().toISOString(),
            session_id: getOrCreateSessionId(),
            page_url: window.location.href,
            page_title: document.title,
            referrer: document.referrer || 'direct',
            user_agent: navigator.userAgent,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            screen_width: screen.width,
            screen_height: screen.height,
            connection_type: getConnectionType(),
            device_memory: getDeviceMemory(),
            // Add client-side performance context
            ...getClientPerformanceMetrics()
        };

        // Log to Firebase Analytics
        logEvent(analytics, eventName, enrichedParams);

        // Development logging
        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 Analytics Event: ${eventName}`, enrichedParams);
        }

    } catch (error) {
        console.error('❌ Error logging analytics event:', error);
    }
};

// Create and manage performance traces (client-side only)
const createPerformanceTrace = (traceName) => {
    if (!performance || !isInitialized || typeof window === 'undefined') {
        return null;
    }

    try {
        const traceObj = trace(performance, traceName);
        return traceObj;
    } catch (error) {
        console.error('❌ Error creating performance trace:', error);
        return null;
    }
};

// Start performance trace
const startPerformanceTrace = (traceName, customAttributes = {}) => {
    const traceObj = createPerformanceTrace(traceName);
    if (!traceObj) return null;

    try {
        traceObj.start();

        // Add custom attributes with validation
        Object.entries(customAttributes).forEach(([key, value]) => {
            // Firebase Performance requires non-empty string values
            const stringValue = String(value || 'unknown').trim();
            if (stringValue && stringValue !== 'undefined' && stringValue !== 'null') {
                try {
                    traceObj.putAttribute(key, stringValue);
                } catch (attrError) {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`Failed to set attribute ${key}:`, attrError);
                    }
                }
            }
        });

        return traceObj;
    } catch (error) {
        console.error('❌ Error starting performance trace:', error);
        return null;
    }
};

// Stop performance trace
const stopPerformanceTrace = (traceObj, customMetrics = {}) => {
    if (!traceObj) return;

    try {
        // Add custom metrics before stopping with validation
        Object.entries(customMetrics).forEach(([key, value]) => {
            // Firebase Performance requires positive numbers for metrics
            const numericValue = Number(value);
            if (!isNaN(numericValue) && numericValue >= 0) {
                try {
                    traceObj.putMetric(key, numericValue);
                } catch (metricError) {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`Failed to set metric ${key}:`, metricError);
                    }
                }
            }
        });

        traceObj.stop();
    } catch (error) {
        console.error('❌ Error stopping performance trace:', error);
    }
};

// Setup client-side performance monitoring
function setupClientSidePerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor page load performance
    window.addEventListener('load', () => {
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                logAnalyticsEvent('page_load_performance', {
                    load_time: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                    dom_interactive: Math.round(navigation.domInteractive - navigation.navigationStart),
                    dom_complete: Math.round(navigation.domComplete - navigation.navigationStart),
                    first_paint: getFirstPaint(),
                    first_contentful_paint: getFirstContentfulPaint(),
                    largest_contentful_paint: getLargestContentfulPaint()
                });
            }
        }, 1000);
    });

    // Monitor Core Web Vitals (client-side only)
    if ('PerformanceObserver' in window) {
        setupCoreWebVitals();
    }

    // Monitor page visibility changes
    setupVisibilityTracking();
}

// Setup Core Web Vitals monitoring (client-side only)
function setupCoreWebVitals() {
    if (typeof window === 'undefined') return;

    try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            logAnalyticsEvent('core_web_vital', {
                metric_name: 'largest_contentful_paint',
                value: Math.round(lastEntry.startTime),
                rating: getLCPRating(lastEntry.startTime)
            });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                const delay = entry.processingStart - entry.startTime;
                logAnalyticsEvent('core_web_vital', {
                    metric_name: 'first_input_delay',
                    value: Math.round(delay),
                    rating: getFIDRating(delay)
                });
            });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // Report CLS when page becomes hidden
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && clsValue > 0) {
                logAnalyticsEvent('core_web_vital', {
                    metric_name: 'cumulative_layout_shift',
                    value: Math.round(clsValue * 1000) / 1000,
                    rating: getCLSRating(clsValue)
                });
            }
        });

    } catch (error) {
        console.warn('⚠️ Core Web Vitals monitoring not available:', error);
    }
}

// Setup visibility tracking
function setupVisibilityTracking() {
    if (typeof window === 'undefined') return;

    let pageStartTime = Date.now();
    let isPageVisible = !document.hidden;

    const handleVisibilityChange = () => {
        const now = Date.now();

        if (document.hidden && isPageVisible) {
            // Page became hidden
            const engagementTime = now - pageStartTime;
            logAnalyticsEvent('page_engagement', {
                engagement_time_ms: engagementTime,
                page_path: window.location.pathname,
                visibility_state: 'hidden'
            });
            isPageVisible = false;
        } else if (!document.hidden && !isPageVisible) {
            // Page became visible
            pageStartTime = now;
            isPageVisible = true;
            logAnalyticsEvent('page_engagement', {
                page_path: window.location.pathname,
                visibility_state: 'visible'
            });
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track before page unload
    window.addEventListener('beforeunload', () => {
        if (isPageVisible) {
            const engagementTime = Date.now() - pageStartTime;
            logAnalyticsEvent('page_engagement', {
                engagement_time_ms: engagementTime,
                page_path: window.location.pathname,
                visibility_state: 'unload'
            });
        }
    });
}

// Enhanced page view tracking (client-side only)
const trackPageView = (path, additionalData = {}) => {
    if (!analytics || typeof window === 'undefined') return;

    try {
        // Start page view performance trace
        const pageViewTrace = startPerformanceTrace('page_view', {
            page_path: path,
            page_title: document.title
        });

        // Enhanced page view event
        logAnalyticsEvent('page_view', {
            page_path: path,
            page_title: document.title,
            page_location: window.location.href,
            page_referrer: document.referrer || 'direct',
            scroll_percentage: getScrollPercentage(),
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            ...getClientPerformanceMetrics(),
            ...additionalData
        });

        // Stop the performance trace after a short delay
        setTimeout(() => {
            if (pageViewTrace) {
                stopPerformanceTrace(pageViewTrace, {
                    page_interactive: 1,
                    scroll_position: getScrollPercentage()
                });
            }
        }, 100);

    } catch (error) {
        console.error('❌ Error logging page view:', error);
    }
};

// User identification and properties (client-side only)
const setUserAnalytics = (userId, userProperties = {}) => {
    if (!analytics || typeof window === 'undefined') return;

    try {
        setUserId(analytics, userId);

        const enhancedProperties = {
            ...userProperties,
            first_visit: !getStorageItem('user_visited_before'),
            total_sessions: getTotalSessions(),
            user_type: userProperties.isAnonymous ? 'anonymous' : 'authenticated',
            signup_date: userProperties.createdAt || new Date().toISOString(),
            last_login: new Date().toISOString(),
            platform: 'web',
            device_type: getDeviceType(),
            browser: getBrowserInfo(),
            os: getOSInfo(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            connection_speed: getConnectionType(),
            device_memory: getDeviceMemory()
        };

        setUserProperties(analytics, enhancedProperties);

        // Mark user as visited
        setStorageItem('user_visited_before', 'true');

        // Log user identification event
        logAnalyticsEvent('user_identified', {
            user_id: userId,
            identification_method: 'manual',
            ...enhancedProperties
        });

    } catch (error) {
        console.error('❌ Error setting user analytics:', error);
    }
};

// Client-side utility functions
function getOrCreateSessionId() {
    if (typeof window === 'undefined') return 'server_session';

    let sessionId = getStorageItem('analytics_session_id', 'session');
    if (!sessionId) {
        const timestamp = Date.now();
        const randomString = generateSecureRandomString(9);
        sessionId = `session_${timestamp}_${randomString}`;
        setStorageItem('analytics_session_id', sessionId, 'session');
    }
    return sessionId;
}

function getClientPerformanceMetrics() {
    // Check if we're on client-side and performance is available
    if (typeof window === 'undefined' || !window.performance || !window.performance.now) {
        return {
            memory_used: 0,
            memory_total: 0,
            memory_limit: 0,
            timing_now: 0,
            page_visibility: 'visible'
        };
    }

    try {
        const memory = performance.memory;

        return {
            memory_used: memory ? Math.round(memory.usedJSHeapSize / 1048576) : 0, // MB
            memory_total: memory ? Math.round(memory.totalJSHeapSize / 1048576) : 0, // MB
            memory_limit: memory ? Math.round(memory.jsHeapSizeLimit / 1048576) : 0, // MB
            timing_now: Math.round(performance.now()),
            page_visibility: document ? document.visibilityState : 'visible'
        };
    } catch (error) {
        console.warn('Error getting performance metrics:', error);
        return {
            memory_used: 0,
            memory_total: 0,
            memory_limit: 0,
            timing_now: 0,
            page_visibility: 'visible'
        };
    }
}

function getTotalSessions() {
    const sessions = parseInt(getStorageItem('total_sessions') || '0') + 1;
    setStorageItem('total_sessions', sessions.toString());
    return sessions;
}

function getDeviceType() {
    if (typeof window === 'undefined') return 'unknown';

    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
}

function getBrowserInfo() {
    if (typeof window === 'undefined') return 'unknown';

    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
}

function getOSInfo() {
    if (typeof window === 'undefined') return 'unknown';

    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
}

function getConnectionType() {
    if (typeof window === 'undefined') return 'unknown';

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection ? connection.effectiveType : 'unknown';
}

function getDeviceMemory() {
    if (typeof window === 'undefined') return 0;
    return navigator.deviceMemory || 0;
}

function getScrollPercentage() {
    if (typeof window === 'undefined') return 0;

    try {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
    } catch (error) {
        return 0;
    }
}

function getFirstPaint() {
    if (typeof window === 'undefined' || !window.performance || !window.performance.getEntriesByType) return 0;

    try {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : 0;
    } catch (error) {
        return 0;
    }
}

function getFirstContentfulPaint() {
    if (typeof window === 'undefined' || !window.performance || !window.performance.getEntriesByType) return 0;

    try {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? Math.round(fcp.startTime) : 0;
    } catch (error) {
        return 0;
    }
}

function getLargestContentfulPaint() {
    if (typeof window === 'undefined' || !window.performance || !window.performance.getEntriesByType) return 0;

    try {
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        return lcpEntries.length > 0 ? Math.round(lcpEntries[lcpEntries.length - 1].startTime) : 0;
    } catch (error) {
        return 0;
    }
}

// Safe storage functions (client-side only)
function getStorageItem(key, storageType = 'local') {
    if (typeof window === 'undefined') return null;

    try {
        const storage = storageType === 'session' ? sessionStorage : localStorage;
        return storage.getItem(key);
    } catch (error) {
        console.warn(`Storage access failed for key: ${key}`, error);
        return null;
    }
}

function setStorageItem(key, value, storageType = 'local') {
    if (typeof window === 'undefined') return;

    try {
        const storage = storageType === 'session' ? sessionStorage : localStorage;
        storage.setItem(key, value);
    } catch (error) {
        console.warn(`Storage write failed for key: ${key}`, error);
    }
}

// Helper functions for performance ratings
function getLCPRating(value) {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs_improvement';
    return 'poor';
}

function getFIDRating(value) {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs_improvement';
    return 'poor';
}

function getCLSRating(value) {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs_improvement';
    return 'poor';
}

// Specific helper functions for backward compatibility
const logButtonClick = (buttonName, additionalData = {}) => {
    logAnalyticsEvent('button_click', {
        button_name: buttonName,
        click_timestamp: new Date().toISOString(),
        ...additionalData
    });
};

const logFeatureUsage = (featureName, additionalParams = {}) => {
    const featureTrace = startPerformanceTrace(`feature_${featureName}`);

    logAnalyticsEvent('feature_use', {
        feature_name: featureName,
        feature_timestamp: new Date().toISOString(),
        user_session_features: getSessionFeatures(),
        ...additionalParams
    });

    addSessionFeature(featureName);

    if (featureTrace) {
        setTimeout(() => {
            stopPerformanceTrace(featureTrace, {
                feature_name: featureName,
                session_feature_count: getSessionFeatures().length
            });
        }, 100);
    }
};

const logSearchQuery = (query, results = []) => {
    const searchTrace = startPerformanceTrace('search_query');

    logAnalyticsEvent('search', {
        search_term: query,
        search_timestamp: new Date().toISOString(),
        results_count: results.length,
        has_results: results.length > 0,
        search_type: 'general_search'
    });

    if (searchTrace) {
        setTimeout(() => {
            stopPerformanceTrace(searchTrace, {
                search_term: query.substring(0, 50),
                results_count: results.length
            });
        }, 100);
    }
};

const logConversion = (conversionType, value = 0, additionalData = {}) => {
    logAnalyticsEvent('conversion', {
        conversion_type: conversionType,
        conversion_value: value,
        conversion_timestamp: new Date().toISOString(),
        ...additionalData
    });
};

const logEngagementEvent = (eventType, engagementTime = 0, additionalData = {}) => {
    logAnalyticsEvent('engagement', {
        engagement_type: eventType,
        engagement_duration: engagementTime,
        engagement_timestamp: new Date().toISOString(),
        ...additionalData
    });
};

const logCalculation = (calculationData = {}) => {
    const calculationTrace = startPerformanceTrace('calculation_performed');

    logAnalyticsEvent('calculation', {
        calculation_type: calculationData.type || 'rewards_calculation',
        calculation_timestamp: new Date().toISOString(),
        amount: calculationData.amount,
        category: calculationData.category,
        card_count: calculationData.cardCount || 0,
        result_rewards: calculationData.totalRewards || 0,
        calculation_method: calculationData.method || 'standard',
        ...calculationData
    });

    if (calculationTrace) {
        setTimeout(() => {
            stopPerformanceTrace(calculationTrace, {
                calculation_type: calculationData.type || 'rewards_calculation',
                amount: calculationData.amount || 0,
                card_count: calculationData.cardCount || 0
            });
        }, 100);
    }
};

// Backward compatibility alias for logPageView
const logPageView = (path, additionalData = {}) => {
    trackPageView(path, additionalData);
};

// Setup network monitoring (client-side only)
const setupNetworkMonitoring = () => {
    // Only run on client-side
    if (typeof window === 'undefined') {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔧 Network monitoring setup skipped (server-side)');
        }
        return false;
    }

    try {
        // Monitor fetch requests with safe timing
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            // Use Date.now() instead of performance.now() for better compatibility
            const startTime = Date.now();
            const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || 'unknown';
            const method = args[1]?.method || 'GET';

            return originalFetch.apply(this, args).then(response => {
                const endTime = Date.now();
                const duration = endTime - startTime;

                // Only log if analytics is initialized
                if (isInitialized) {
                    try {
                        // Log network performance
                        logAnalyticsEvent('network_request', {
                            url: url.substring(0, 100), // Limit URL length
                            method,
                            status_code: response.status,
                            duration: Math.round(duration),
                            success: response.ok,
                            timestamp: new Date().toISOString()
                        });

                        // Log slow requests
                        if (duration > 2000) {
                            logAnalyticsEvent('slow_network_request', {
                                url: url.substring(0, 100),
                                method,
                                duration: Math.round(duration),
                                status_code: response.status
                            });

                            if (process.env.NODE_ENV === 'development') {
                                console.warn(`🐌 Slow network request: ${url} took ${Math.round(duration)}ms`);
                            }
                        }
                    } catch (analyticsError) {
                        // Silently fail analytics logging to avoid breaking fetch
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('Analytics logging failed for fetch:', analyticsError);
                        }
                    }
                }

                return response;
            }).catch(error => {
                const endTime = Date.now();
                const duration = endTime - startTime;

                // Only log if analytics is initialized
                if (isInitialized) {
                    try {
                        // Log network errors
                        logAnalyticsEvent('network_error', {
                            url: url.substring(0, 100),
                            method,
                            duration: Math.round(duration),
                            error_message: error.message,
                            timestamp: new Date().toISOString()
                        });
                    } catch (analyticsError) {
                        // Silently fail analytics logging
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('Analytics logging failed for fetch error:', analyticsError);
                        }
                    }
                }

                if (process.env.NODE_ENV === 'development') {
                    console.error(`🚨 Network error: ${url}`, error);
                }

                throw error;
            });
        };

        // Monitor XMLHttpRequest (for compatibility) with safe timing
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function (method, url, ...args) {
            this._method = method;
            this._url = url;
            this._startTime = Date.now(); // Use Date.now() instead of performance.now()
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.send = function (...args) {
            const xhr = this;

            xhr.addEventListener('loadend', function () {
                if (isInitialized && xhr._startTime) {
                    try {
                        const duration = Date.now() - xhr._startTime;

                        logAnalyticsEvent('xhr_request', {
                            url: (xhr._url || '').substring(0, 100),
                            method: xhr._method || 'GET',
                            status_code: xhr.status,
                            duration: Math.round(duration),
                            success: xhr.status >= 200 && xhr.status < 300,
                            timestamp: new Date().toISOString()
                        });
                    } catch (analyticsError) {
                        // Silently fail analytics logging
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('Analytics logging failed for XHR:', analyticsError);
                        }
                    }
                }
            });

            return originalXHRSend.apply(this, args);
        };

        // Monitor resource loading performance (only if PerformanceObserver is available)
        if ('PerformanceObserver' in window && window.performance && window.performance.getEntriesByType) {
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    if (!isInitialized) return;

                    for (const entry of list.getEntries()) {
                        // Only log slow or failed resources
                        if (entry.duration > 1000 || entry.transferSize === 0) {
                            try {
                                logAnalyticsEvent('resource_performance', {
                                    resource_name: entry.name.substring(0, 100),
                                    resource_type: entry.initiatorType,
                                    duration: Math.round(entry.duration),
                                    transfer_size: entry.transferSize || 0,
                                    timestamp: new Date().toISOString()
                                });
                            } catch (analyticsError) {
                                // Silently fail analytics logging
                            }
                        }
                    }
                });

                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (error) {
                console.warn('⚠️ Resource performance monitoring not available:', error);
            }
        }

        console.log('✅ Network monitoring setup complete');
        return true;

    } catch (error) {
        console.error('❌ Error setting up network monitoring:', error);
        return false;
    }
};

// Session feature tracking (client-side only)
function getSessionFeatures() {
    if (typeof window === 'undefined') return [];

    try {
        const features = getStorageItem('session_features', 'session');
        return features ? JSON.parse(features) : [];
    } catch (error) {
        return [];
    }
}

function addSessionFeature(featureName) {
    if (typeof window === 'undefined') return;

    try {
        const features = getSessionFeatures();
        if (!features.includes(featureName)) {
            features.push(featureName);
            setStorageItem('session_features', JSON.stringify(features), 'session');
        }
    } catch (error) {
        console.warn('Failed to add session feature:', error);
    }
}

// Export all functions
export {
    initializeAnalytics,
    logAnalyticsEvent,
    trackPageView,
    setUserAnalytics,
    createPerformanceTrace,
    startPerformanceTrace,
    stopPerformanceTrace,
    logButtonClick,
    logFeatureUsage,
    logSearchQuery,
    logConversion,
    logEngagementEvent,
    logCalculation,
    logPageView,
    setupNetworkMonitoring
};