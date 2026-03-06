// src/core/services/errorTracking.js - Client-Side Error Tracking for Cloudflare Pages
import { logAnalyticsEvent } from './analytics';

let isInitialized = false;

/**
 * Initialize client-side error tracking
 * @returns {boolean} - Success status
 */
const initializeErrorTracking = () => {
    // Only run on client-side
    if (typeof window === 'undefined') {

        return false;
    }

    if (isInitialized) {

        return true;
    }

    try {
        // Set up global error handlers
        setupGlobalErrorHandlers();

        // Set up unhandled promise rejection handler
        setupUnhandledRejectionHandler();

        // Set up performance monitoring for errors
        setupPerformanceErrorMonitoring();

        isInitialized = true;


        return true;
    } catch (error) {
        console.error('❌ Error initializing error tracking:', error);
        return false;
    }
};

/**
 * Sanitize error payload to remove potential PII or sensitive data
 */
const sanitizeErrorInfo = (info) => {
    if (!info) return info;

    try {
        const sanitized = {};
        const sensitiveKeys = ['password', 'token', 'auth', 'secret', 'credential', 'credit_card', 'cvv', 'pin', 'email', 'phone'];

        const sanitizeValue = (val, currentKey) => {
            if (val === null || val === undefined) return val;

            if (typeof currentKey === 'string') {
                const lowerKey = currentKey.toLowerCase();
                if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
                    return '[REDACTED]';
                }
            }

            if (typeof val === 'object' && !Array.isArray(val)) {
                const newObj = {};
                for (const k in val) {
                    newObj[k] = sanitizeValue(val[k], k);
                }
                return newObj;
            }

            return val;
        };

        for (const key in info) {
            sanitized[key] = sanitizeValue(info[key], key);
        }

        return sanitized;
    } catch (e) {
        return { message: 'Failed to sanitize error info' };
    }
};

/**
 * Record a custom error
 * @param {string} errorName - Name/type of the error
 * @param {Object} errorInfo - Additional error information
 * @param {boolean} isFatal - Whether the error is fatal
 */
const recordError = (errorName, errorInfo = {}, isFatal = false) => {
    if (typeof window === 'undefined') return;

    try {
        const sanitizedInfo = sanitizeErrorInfo(errorInfo);

        // Categorize security events
        const isSecurityEvent = errorName.toLowerCase().includes('auth') ||
            errorName.toLowerCase().includes('security') ||
            errorName.toLowerCase().includes('validation');

        let categoryType = isFatal ? 'fatal' : 'non_fatal';
        if (isSecurityEvent) categoryType = 'security_event';

        const enhancedErrorInfo = {
            error_name: errorName,
            error_type: categoryType,
            timestamp: new Date().toISOString(),
            session_id: getOrCreateSessionId(),
            page_url: window.location.href,
            page_title: document.title,
            user_agent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            screen: `${screen.width}x${screen.height}`,
            connection: getConnectionInfo(),
            memory: getMemoryInfo(),
            app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV || 'production',
            deployment_platform: 'cloudflare_pages',
            ...sanitizedInfo
        };

        // Log to Firebase Analytics
        logAnalyticsEvent('error_occurred', enhancedErrorInfo);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('🚨 Error tracked:', errorName, enhancedErrorInfo);
        }

        // Store critical errors locally for later analysis
        if (isFatal) {
            storeCriticalError(errorName, enhancedErrorInfo);
        }

    } catch (error) {
        console.error('❌ Error recording error:', error);
    }
};

/**
 * Record a non-fatal error
 * @param {string} errorName - Name of the error
 * @param {Object} errorInfo - Error details
 */
const recordNonFatalError = (errorName, errorInfo = {}) => {
    recordError(errorName, errorInfo, false);
};

/**
 * Record a fatal error
 * @param {string} errorName - Name of the error
 * @param {Object} errorInfo - Error details
 */
const recordFatalError = (errorName, errorInfo = {}) => {
    recordError(errorName, errorInfo, true);
};

/**
 * Record a performance issue
 * @param {string} issueName - Name of the performance issue
 * @param {Object} issueInfo - Issue details
 */
const recordPerformanceIssue = (issueName, issueInfo = {}) => {
    if (typeof window === 'undefined') return;

    try {
        const performanceInfo = {
            issue_name: issueName,
            issue_type: 'performance',
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            ...getPerformanceContext(),
            ...issueInfo
        };

        logAnalyticsEvent('performance_issue', performanceInfo);

        if (process.env.NODE_ENV === 'development') {
            console.warn('🐌 Performance issue:', issueName, performanceInfo);
        }

    } catch (error) {
        console.error('❌ Error recording performance issue:', error);
    }
};

/**
 * Set custom attributes for error context
 * @param {Object} attributes - Custom attributes
 */
const setErrorAttributes = (attributes = {}) => {
    if (typeof window === 'undefined') return;

    try {
        const existingAttributes = getStorageItem('error_attributes');
        const currentAttributes = existingAttributes ? JSON.parse(existingAttributes) : {};

        const updatedAttributes = {
            ...currentAttributes,
            ...attributes,
            last_updated: new Date().toISOString()
        };

        setStorageItem('error_attributes', JSON.stringify(updatedAttributes));
    } catch (error) {
        console.error('❌ Error setting error attributes:', error);
    }
};

/**
 * Set user ID for error tracking
 * @param {string} userId - User identifier
 */
const setErrorUserId = (userId) => {
    if (typeof window === 'undefined') return;
    setStorageItem('error_user_id', userId);
};

// Setup global error handlers
function setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
        const errorInfo = {
            message: event.message,
            filename: event.filename,
            line_number: event.lineno,
            column_number: event.colno,
            stack: event.error?.stack,
            error_type: 'javascript_error',
            source: 'global_handler'
        };

        recordError('global_javascript_error', errorInfo, true);
    });
}

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

// Setup unhandled promise rejection handler
function setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
        const errorInfo = {
            reason: event.reason?.toString() || 'Unknown promise rejection',
            stack: event.reason?.stack,
            error_type: 'unhandled_promise_rejection',
            source: 'promise_handler'
        };

        recordError('unhandled_promise_rejection', errorInfo, true);
    });
}

// Setup performance error monitoring
function setupPerformanceErrorMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    try {
        // Monitor Long Tasks
        const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    recordPerformanceIssue('long_task', {
                        duration: Math.round(entry.duration),
                        start_time: Math.round(entry.startTime),
                        attribution: entry.attribution?.[0]?.name
                    });
                }
            }
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (error) {
        console.warn('⚠️ Long task monitoring not available:', error);
    }

    try {
        // Monitor Layout Shifts
        let cumulativeLayoutShift = 0;
        const layoutShiftObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    cumulativeLayoutShift += entry.value;
                }
            }

            // Report if CLS exceeds threshold
            if (cumulativeLayoutShift > 0.25) {
                recordPerformanceIssue('poor_cls', {
                    cls_value: Math.round(cumulativeLayoutShift * 1000) / 1000,
                    threshold_exceeded: 0.25
                });
            }
        });

        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
        console.warn('⚠️ Layout shift monitoring not available:', error);
    }
}

// Utility functions
function getOrCreateSessionId() {
    if (typeof window === 'undefined') return 'server_session';

    let sessionId = getStorageItem('error_session_id', 'session');
    if (!sessionId) {
        const timestamp = Date.now();
        const randomString = generateSecureRandomString(9);
        sessionId = `session_${timestamp}_${randomString}`;
        setStorageItem('error_session_id', sessionId, 'session');
    }
    return sessionId;
}

function getConnectionInfo() {
    if (typeof window === 'undefined') return {};

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection ? {
        effective_type: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        save_data: connection.saveData
    } : { effective_type: 'unknown' };
}

function getMemoryInfo() {
    if (typeof window === 'undefined') return {};

    const memory = performance.memory;
    return memory ? {
        used_heap_size: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total_heap_size: Math.round(memory.totalJSHeapSize / 1048576), // MB
        heap_size_limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    } : {};
}

function getPerformanceContext() {
    if (typeof window === 'undefined') return {};

    const navigation = performance.getEntriesByType('navigation')[0];
    return {
        load_time: navigation ? Math.round(navigation.loadEventEnd - navigation.navigationStart) : 0,
        dom_interactive: navigation ? Math.round(navigation.domInteractive - navigation.navigationStart) : 0,
        memory_pressure: getMemoryPressure(),
        cpu_cores: navigator.hardwareConcurrency || 'unknown'
    };
}

function getMemoryPressure() {
    const memory = performance.memory;
    if (!memory) return 'unknown';

    const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    if (usageRatio > 0.9) return 'high';
    if (usageRatio > 0.7) return 'medium';
    return 'low';
}

function storeCriticalError(errorName, errorInfo) {
    try {
        const criticalErrors = JSON.parse(getStorageItem('critical_errors') || '[]');

        // Keep only last 10 critical errors
        if (criticalErrors.length >= 10) {
            criticalErrors.shift();
        }

        criticalErrors.push({
            error_name: errorName,
            timestamp: errorInfo.timestamp,
            page_url: errorInfo.page_url,
            message: errorInfo.message || errorInfo.reason,
            stack: errorInfo.stack
        });

        setStorageItem('critical_errors', JSON.stringify(criticalErrors));
    } catch (error) {
        console.error('❌ Error storing critical error:', error);
    }
}

// Safe storage functions
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

/**
 * Log a breadcrumb for debugging (client-side only)
 * @param {string} message - Breadcrumb message
 * @param {string} category - Category (user, navigation, debug, etc.)
 * @param {Object} data - Additional data
 */
const logBreadcrumb = (message, category = 'info', data = {}) => {
    if (typeof window === 'undefined') return;

    try {
        const breadcrumb = {
            message,
            category,
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            ...data
        };

        // Store breadcrumbs locally
        const breadcrumbs = JSON.parse(getStorageItem('breadcrumbs', 'session') || '[]');

        // Keep only last 50 breadcrumbs
        if (breadcrumbs.length >= 50) {
            breadcrumbs.shift();
        }

        breadcrumbs.push(breadcrumb);
        setStorageItem('breadcrumbs', JSON.stringify(breadcrumbs), 'session');

        // Log to analytics for important breadcrumbs
        if (['error', 'user', 'conversion'].includes(category)) {
            logAnalyticsEvent('breadcrumb', {
                breadcrumb_message: message,
                breadcrumb_category: category,
                ...data
            });
        }

        // Development logging
        if (process.env.NODE_ENV === 'development') {

        }

    } catch (error) {
        console.error('❌ Error logging breadcrumb:', error);
    }
};

/**
 * Record an API error (client-side only)
 * @param {string} endpoint - API endpoint
 * @param {number} statusCode - HTTP status code
 * @param {string} errorMessage - Error message
 * @param {Object} requestData - Request data
 */
const recordAPIError = (endpoint, statusCode, errorMessage, requestData = {}) => {
    if (typeof window === 'undefined') return;

    try {
        const apiErrorInfo = {
            endpoint,
            status_code: statusCode,
            error_message: errorMessage,
            request_method: requestData.method || 'unknown',
            request_data: requestData.data ? JSON.stringify(requestData.data).substring(0, 500) : '',
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            user_agent: navigator.userAgent
        };

        // Log to analytics
        logAnalyticsEvent('api_error', apiErrorInfo);

        // Also record as general error
        recordError(`api_error_${statusCode}`, apiErrorInfo, false);

        // Development logging
        if (process.env.NODE_ENV === 'development') {
            console.error(`🌐 API Error: ${endpoint} (${statusCode})`, apiErrorInfo);
        }

    } catch (error) {
        console.error('❌ Error recording API error:', error);
    }
};

// Export functions
export {
    initializeErrorTracking,
    recordError,
    recordNonFatalError,
    recordFatalError,
    recordPerformanceIssue,
    setErrorAttributes,
    setErrorUserId,
    logBreadcrumb,
    recordAPIError
};