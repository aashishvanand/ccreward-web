// src/core/services/crashlytics.js - Firebase Crashlytics Implementation
let crashlytics = null;
let isInitialized = false;

// Initialize Crashlytics (web version uses different approach)
export const initializeCrashlytics = async () => {
    if (typeof window === 'undefined') return false;

    try {
        // For web, we'll implement a custom crash reporting system
        // that integrates with Firebase Analytics for error tracking

        // Set up global error handlers
        setupGlobalErrorHandlers();

        // Set up unhandled promise rejection handler
        setupUnhandledRejectionHandler();

        // Set up performance observer for monitoring
        setupPerformanceMonitoring();

        isInitialized = true;

        console.log('✅ Crashlytics-like error reporting initialized');
        return true;
    } catch (error) {
        console.error('❌ Error initializing crashlytics:', error);
        return false;
    }
};

// Setup global error handlers
function setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
        const errorInfo = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            type: 'javascript_error'
        };

        recordError('global_javascript_error', errorInfo);
    });
}

// Setup unhandled promise rejection handler
function setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
        const errorInfo = {
            reason: event.reason?.toString() || 'Unknown promise rejection',
            stack: event.reason?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            type: 'unhandled_promise_rejection'
        };

        recordError('unhandled_promise_rejection', errorInfo);
    });
}

// Setup performance monitoring
function setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        // Monitor Long Tasks
        try {
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) { // Tasks longer than 50ms
                        recordPerformanceIssue('long_task', {
                            duration: entry.duration,
                            startTime: entry.startTime,
                            name: entry.name,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (error) {
            console.warn('Long task observer not supported');
        }

        // Monitor Layout Shifts
        try {
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.value > 0.1) { // Significant layout shift
                        recordPerformanceIssue('layout_shift', {
                            value: entry.value,
                            startTime: entry.startTime,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
            console.warn('Layout shift observer not supported');
        }
    }
}

// Record custom errors
export const recordError = (errorName, errorInfo = {}) => {
    if (!isInitialized) return;

    try {
        const enhancedErrorInfo = {
            ...errorInfo,
            error_name: errorName,
            timestamp: new Date().toISOString(),
            session_id: getSessionId(),
            user_id: getCurrentUserId(),
            page_url: window.location.href,
            page_title: document.title,
            user_agent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            screen: `${screen.width}x${screen.height}`,
            connection: getConnectionInfo(),
            memory: getMemoryInfo(),
            app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
            build_time: process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown',
            environment: process.env.NODE_ENV || 'unknown'
        };

        // Send to Firebase Analytics as a custom event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'exception', {
                description: errorName,
                fatal: errorInfo.fatal || false,
                custom_map: enhancedErrorInfo
            });
        }

        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('🚨 Crashlytics Error:', errorName, enhancedErrorInfo);
        }

        // Store critical errors locally for later analysis
        storeCriticalError(errorName, enhancedErrorInfo);

    } catch (error) {
        console.error('Error recording crash:', error);
    }
};

// Record non-fatal errors
export const recordNonFatalError = (errorName, errorInfo = {}) => {
    recordError(errorName, { ...errorInfo, fatal: false });
};

// Record fatal errors
export const recordFatalError = (errorName, errorInfo = {}) => {
    recordError(errorName, { ...errorInfo, fatal: true });
};

// Record performance issues
export const recordPerformanceIssue = (issueName, issueInfo = {}) => {
    if (!isInitialized) return;

    try {
        const performanceInfo = {
            issue_name: issueName,
            timestamp: new Date().toISOString(),
            session_id: getSessionId(),
            page_url: window.location.href,
            ...issueInfo
        };

        // Send to Firebase Analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'performance_issue', {
                event_category: 'Performance',
                event_label: issueName,
                custom_map: performanceInfo
            });
        }

        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Performance Issue:', issueName, performanceInfo);
        }
    } catch (error) {
        console.error('Error recording performance issue:', error);
    }
};

// Set user identifier for crash reports
export const setCrashlyticsUserId = (userId) => {
    try {
        sessionStorage.setItem('crashlytics_user_id', userId);

        // Also set in Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('config', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, {
                user_id: userId
            });
        }
    } catch (error) {
        console.error('Error setting crashlytics user ID:', error);
    }
};

// Set custom keys for additional context
export const setCrashlyticsCustomKey = (key, value) => {
    try {
        const customKeys = JSON.parse(sessionStorage.getItem('crashlytics_custom_keys') || '{}');
        customKeys[key] = value;
        sessionStorage.setItem('crashlytics_custom_keys', JSON.stringify(customKeys));
    } catch (error) {
        console.error('Error setting crashlytics custom key:', error);
    }
};

// Get custom keys
function getCustomKeys() {
    try {
        return JSON.parse(sessionStorage.getItem('crashlytics_custom_keys') || '{}');
    } catch {
        return {};
    }
}

// Log breadcrumb for debugging
export const logBreadcrumb = (message, category = 'info', data = {}) => {
    try {
        const breadcrumbs = JSON.parse(sessionStorage.getItem('crashlytics_breadcrumbs') || '[]');

        const breadcrumb = {
            message,
            category,
            timestamp: new Date().toISOString(),
            data,
            level: getBreadcrumbLevel(category)
        };

        breadcrumbs.push(breadcrumb);

        // Keep only last 50 breadcrumbs
        if (breadcrumbs.length > 50) {
            breadcrumbs.shift();
        }

        sessionStorage.setItem('crashlytics_breadcrumbs', JSON.stringify(breadcrumbs));

        if (process.env.NODE_ENV === 'development') {
            console.log('🍞 Breadcrumb:', breadcrumb);
        }
    } catch (error) {
        console.error('Error logging breadcrumb:', error);
    }
};

// React Error Boundary integration
export const handleReactError = (error, errorInfo) => {
    const reactErrorInfo = {
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
        error_boundary: true,
        fatal: true,
        react_version: React?.version || 'unknown'
    };

    recordFatalError('react_error_boundary', reactErrorInfo);
};

// API Error tracking
export const recordAPIError = (endpoint, statusCode, errorMessage, requestData = {}) => {
    const apiErrorInfo = {
        endpoint,
        status_code: statusCode,
        error_message: errorMessage,
        request_data: JSON.stringify(requestData).substring(0, 1000), // Limit size
        response_time: requestData.responseTime || 0,
        retry_count: requestData.retryCount || 0,
        api_error: true
    };

    recordNonFatalError('api_error', apiErrorInfo);
};

// Helper functions
function getSessionId() {
    return sessionStorage.getItem('analytics_session_id') || 'unknown';
}

function getCurrentUserId() {
    return sessionStorage.getItem('crashlytics_user_id') || 'anonymous';
}

function getConnectionInfo() {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        const conn = navigator.connection;
        return {
            effective_type: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
            save_data: conn.saveData
        };
    }
    return {};
}

function getMemoryInfo() {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
        return {
            used_js_heap_size: performance.memory.usedJSHeapSize,
            total_js_heap_size: performance.memory.totalJSHeapSize,
            js_heap_size_limit: performance.memory.jsHeapSizeLimit
        };
    }
    return {};
}

function getBreadcrumbLevel(category) {
    const levels = {
        error: 'error',
        warning: 'warning',
        info: 'info',
        debug: 'debug',
        navigation: 'info',
        user: 'info',
        network: 'info'
    };
    return levels[category] || 'info';
}

function storeCriticalError(errorName, errorInfo) {
    try {
        const criticalErrors = JSON.parse(localStorage.getItem('critical_errors') || '[]');

        criticalErrors.push({
            error_name: errorName,
            timestamp: new Date().toISOString(),
            ...errorInfo
        });

        // Keep only last 10 critical errors
        if (criticalErrors.length > 10) {
            criticalErrors.shift();
        }

        localStorage.setItem('critical_errors', JSON.stringify(criticalErrors));
    } catch (error) {
        console.error('Error storing critical error:', error);
    }
}

// Get stored critical errors (useful for debugging)
export const getCriticalErrors = () => {
    try {
        return JSON.parse(localStorage.getItem('critical_errors') || '[]');
    } catch {
        return [];
    }
};

// Clear stored errors
export const clearStoredErrors = () => {
    try {
        localStorage.removeItem('critical_errors');
        sessionStorage.removeItem('crashlytics_breadcrumbs');
    } catch (error) {
        console.error('Error clearing stored errors:', error);
    }
};