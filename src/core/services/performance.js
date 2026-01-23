// src/core/services/performance.js - Enhanced Firebase Performance Monitoring
import { getPerformance, trace, connectPerformanceEmulator } from 'firebase/performance';
import { firebaseApp } from '@/firebase';

let firebasePerformance = null;
let isInitialized = false;

// Initialize Firebase Performance Monitoring
export const initializePerformanceMonitoring = async () => {
    if (typeof window === 'undefined') return false;

    try {
        // Initialize Performance Monitoring
        firebasePerformance = getPerformance(firebaseApp);

        // Connect to emulator in development
        if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
            connectPerformanceEmulator(firebasePerformance, 'localhost', 9000);
        }

        // Set up automatic page load tracking
        setupPageLoadTracking();

        // Set up network request monitoring
        setupNetworkMonitoring();

        // Set up custom performance observers
        setupPerformanceObservers();

        isInitialized = true;


        return true;
    } catch (error) {
        console.error('❌ Error initializing Firebase Performance Monitoring:', error);
        return false;
    }
};

// Create custom trace
export const createTrace = (traceName) => {
    if (!firebasePerformance || !isInitialized) {
        console.warn('Performance monitoring not initialized');
        return null;
    }

    try {
        return trace(firebasePerformance, traceName);
    } catch (error) {
        console.error('Error creating trace:', error);
        return null;
    }
};

// Track page navigation performance
export const trackPageNavigation = (pageName, startTime = window.performance.now()) => {
    if (!isInitialized) return;

    const navigationTrace = createTrace(`page_navigation_${pageName}`);
    if (!navigationTrace) return;

    navigationTrace.start();

    // Add custom attributes
    navigationTrace.putAttribute('page_name', pageName);
    navigationTrace.putAttribute('url', window.location.href);
    navigationTrace.putAttribute('referrer', document.referrer || 'direct');

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
        navigationTrace.stop();
    } else {
        window.addEventListener('load', () => {
            navigationTrace.stop();
        }, { once: true });
    }

    return navigationTrace;
};

// Track API call performance
export const trackApiCall = (endpoint, method = 'GET') => {
    if (!isInitialized) return null;

    const apiTrace = createTrace(`api_${method.toLowerCase()}_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`);
    if (!apiTrace) return null;

    apiTrace.start();
    apiTrace.putAttribute('endpoint', endpoint);
    apiTrace.putAttribute('method', method);
    apiTrace.putAttribute('timestamp', new Date().toISOString());

    return {
        trace: apiTrace,
        success: (statusCode) => {
            apiTrace.putAttribute('status_code', statusCode.toString());
            apiTrace.putAttribute('result', 'success');
            apiTrace.stop();
        },
        error: (error, statusCode) => {
            apiTrace.putAttribute('status_code', statusCode ? statusCode.toString() : 'unknown');
            apiTrace.putAttribute('result', 'error');
            apiTrace.putAttribute('error_message', error.message || 'unknown');
            apiTrace.stop();
        }
    };
};

// Track component render performance
export const trackComponentRender = (componentName) => {
    if (!isInitialized) return null;

    const renderTrace = createTrace(`component_render_${componentName}`);
    if (!renderTrace) return null;

    renderTrace.start();
    renderTrace.putAttribute('component_name', componentName);

    return {
        trace: renderTrace,
        complete: () => {
            renderTrace.stop();
        }
    };
};

// Track user interaction performance
export const trackUserInteraction = (interactionName, element) => {
    if (!isInitialized) return null;

    const interactionTrace = createTrace(`user_interaction_${interactionName}`);
    if (!interactionTrace) return null;

    interactionTrace.start();
    interactionTrace.putAttribute('interaction_type', interactionName);

    if (element) {
        interactionTrace.putAttribute('element_type', element.tagName.toLowerCase());
        interactionTrace.putAttribute('element_id', element.id || 'unknown');
        interactionTrace.putAttribute('element_class', element.className || 'unknown');
    }

    // Auto-stop after reasonable time
    setTimeout(() => {
        interactionTrace.stop();
    }, 5000);

    return interactionTrace;
};

// Setup automatic page load tracking
function setupPageLoadTracking() {
    // Track initial page load
    const pageLoadTrace = createTrace('page_load_initial');
    if (pageLoadTrace) {
        pageLoadTrace.start();
        pageLoadTrace.putAttribute('page_url', window.location.href);
        pageLoadTrace.putAttribute('page_title', document.title);

        window.addEventListener('load', () => {
            pageLoadTrace.stop();
        }, { once: true });
    }

    // Track subsequent navigation (for SPAs)
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            trackPageNavigation(document.title);
        }
    });

    observer.observe(document, { subtree: true, childList: true });
}

// Setup network request monitoring
function setupNetworkMonitoring() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const url = args[0];
        const options = args[1] || {};
        const method = options.method || 'GET';

        const apiTracker = trackApiCall(url, method);

        try {
            const response = await originalFetch(...args);

            if (apiTracker) {
                apiTracker.success(response.status);
            }

            return response;
        } catch (error) {
            if (apiTracker) {
                apiTracker.error(error);
            }
            throw error;
        }
    };

    // Monitor XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        this._performanceTracker = trackApiCall(url, method);
        return originalXHROpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        const tracker = this._performanceTracker;

        if (tracker) {
            this.addEventListener('load', () => {
                tracker.success(this.status);
            });

            this.addEventListener('error', () => {
                tracker.error(new Error('XMLHttpRequest failed'), this.status);
            });
        }

        return originalXHRSend.call(this, ...args);
    };
}

// Setup performance observers for Web Vitals
function setupPerformanceObservers() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lcpTrace = createTrace('web_vital_lcp');

                if (lcpTrace) {
                    lcpTrace.start();
                    lcpTrace.putAttribute('value', entries[entries.length - 1].startTime.toString());
                    lcpTrace.putAttribute('element', entries[entries.length - 1].element?.tagName || 'unknown');
                    lcpTrace.stop();
                }
            });

            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
            console.warn('LCP observer not supported:', error);
        }

        // First Input Delay (FID)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const fidTrace = createTrace('web_vital_fid');

                if (fidTrace) {
                    fidTrace.start();
                    fidTrace.putAttribute('value', entries[0].processingStart - entries[0].startTime);
                    fidTrace.putAttribute('name', entries[0].name);
                    fidTrace.stop();
                }
            });

            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (error) {
            console.warn('FID observer not supported:', error);
        }

        // Cumulative Layout Shift (CLS)
        try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }

                const clsTrace = createTrace('web_vital_cls');
                if (clsTrace) {
                    clsTrace.start();
                    clsTrace.putAttribute('value', clsValue.toString());
                    clsTrace.stop();
                }
            });

            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
            console.warn('CLS observer not supported:', error);
        }

        // Long Tasks
        try {
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const longTaskTrace = createTrace('long_task');
                    if (longTaskTrace) {
                        longTaskTrace.start();
                        longTaskTrace.putAttribute('duration', entry.duration.toString());
                        longTaskTrace.putAttribute('start_time', entry.startTime.toString());
                        longTaskTrace.stop();
                    }
                }
            });

            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (error) {
            console.warn('Long task observer not supported:', error);
        }
    }
}

// Get performance metrics
export const getPerformanceMetrics = () => {
    if (!window.performance) return null;

    const navigation = window.performance.getEntriesByType('navigation')[0];
    const paint = window.performance.getEntriesByType('paint');

    return {
        // Navigation timing
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,

        // Paint timing
        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,

        // Resource timing
        resourceCount: window.performance.getEntriesByType('resource').length,

        // Memory (if available)
        memory: window.performance.memory ? {
            usedJSHeapSize: window.performance.memory.usedJSHeapSize,
            totalJSHeapSize: window.performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit
        } : null
    };
};

// Export performance instance for advanced usage
export const getPerformanceInstance = () => firebasePerformance;