// src/core/hooks/usePerformance.js - Client-Side Performance Hook
import { useEffect, useRef, useCallback } from 'react';
import { 
    startPerformanceTrace, 
    stopPerformanceTrace, 
    logAnalyticsEvent 
} from '../services/analytics';

/**
 * Hook for tracking page performance (client-side only)
 * @param {string} pageName - Name of the page/component for tracking
 * @param {Object} options - Configuration options
 */
export const usePagePerformance = (pageName, options = {}) => {
    const traceRef = useRef(null);
    const startTimeRef = useRef(null);
    const {
        trackInteractions = true,
        trackScrollDepth = true,
        trackTimeOnPage = true
    } = options;

    useEffect(() => {
        // Only run on client-side
        if (typeof window === 'undefined') return;

        // Start performance trace for this page
        startTimeRef.current = performance.now();
        traceRef.current = startPerformanceTrace(`page_${pageName}`, {
            page_name: pageName,
            page_url: window.location.href,
            user_agent: navigator.userAgent
        });

        // Track page mount
        logAnalyticsEvent('page_mount', {
            page_name: pageName,
            mount_time: performance.now()
        });

        // Cleanup function
        return () => {
            if (traceRef.current) {
                const timeOnPage = performance.now() - startTimeRef.current;
                stopPerformanceTrace(traceRef.current, {
                    time_on_page: Math.round(timeOnPage),
                    scroll_depth: getMaxScrollDepth()
                });
            }

            // Track page unmount
            if (startTimeRef.current) {
                const timeOnPage = performance.now() - startTimeRef.current;
                logAnalyticsEvent('page_unmount', {
                    page_name: pageName,
                    time_on_page: Math.round(timeOnPage),
                    max_scroll_depth: getMaxScrollDepth()
                });
            }
        };
    }, [pageName]);

    // Track scroll depth
    useEffect(() => {
        if (!trackScrollDepth || typeof window === 'undefined') return;

        let maxScrollDepth = 0;
        const milestones = [25, 50, 75, 90, 100];
        const reachedMilestones = new Set();

        const handleScroll = () => {
            const scrollPercentage = getScrollPercentage();
            maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);

            // Track milestone scrolls
            milestones.forEach(milestone => {
                if (scrollPercentage >= milestone && !reachedMilestones.has(milestone)) {
                    reachedMilestones.add(milestone);
                    logAnalyticsEvent('scroll_milestone', {
                        page_name: pageName,
                        milestone: milestone,
                        time_to_milestone: Math.round(performance.now() - startTimeRef.current)
                    });
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pageName, trackScrollDepth]);

    return {
        trackCustomEvent: useCallback((eventName, eventData = {}) => {
            logAnalyticsEvent(eventName, {
                page_name: pageName,
                ...eventData
            });
        }, [pageName]),

        trackUserInteraction: useCallback((interactionType, element = null) => {
            if (!trackInteractions) return;

            logAnalyticsEvent('user_interaction', {
                page_name: pageName,
                interaction_type: interactionType,
                element_tag: element?.tagName,
                element_id: element?.id,
                element_class: element?.className,
                timestamp: performance.now()
            });
        }, [pageName, trackInteractions])
    };
};

/**
 * Hook for tracking component performance
 * @param {string} componentName - Name of the component
 */
export const useComponentPerformance = (componentName) => {
    const renderStartRef = useRef(null);
    const traceRef = useRef(null);

    useEffect(() => {
        // Only run on client-side
        if (typeof window === 'undefined') return;

        renderStartRef.current = performance.now();
        
        // Track component mount performance
        const mountTime = performance.now() - renderStartRef.current;
        logAnalyticsEvent('component_mount', {
            component_name: componentName,
            mount_time: Math.round(mountTime)
        });

        return () => {
            // Track component unmount
            logAnalyticsEvent('component_unmount', {
                component_name: componentName,
                lifetime: Math.round(performance.now() - renderStartRef.current)
            });
        };
    }, [componentName]);

    const trackComponentAction = useCallback((actionName, actionData = {}) => {
        logAnalyticsEvent('component_action', {
            component_name: componentName,
            action_name: actionName,
            ...actionData
        });
    }, [componentName]);

    return { trackComponentAction };
};

/**
 * Hook for tracking form performance
 * @param {string} formName - Name of the form
 */
export const useFormPerformance = (formName) => {
    const formStartRef = useRef(null);
    const interactionCountRef = useRef(0);

    const trackFormStart = useCallback(() => {
        if (typeof window === 'undefined') return;

        formStartRef.current = performance.now();
        logAnalyticsEvent('form_start', {
            form_name: formName,
            start_time: performance.now()
        });
    }, [formName]);

    const trackFormInteraction = useCallback((fieldName, interactionType = 'focus') => {
        if (typeof window === 'undefined') return;

        interactionCountRef.current += 1;
        logAnalyticsEvent('form_interaction', {
            form_name: formName,
            field_name: fieldName,
            interaction_type: interactionType,
            interaction_count: interactionCountRef.current,
            time_since_start: formStartRef.current ? Math.round(performance.now() - formStartRef.current) : 0
        });
    }, [formName]);

    const trackFormSubmit = useCallback((isSuccess = true, errorMessage = null) => {
        if (typeof window === 'undefined') return;

        const completionTime = formStartRef.current ? Math.round(performance.now() - formStartRef.current) : 0;
        
        logAnalyticsEvent('form_submit', {
            form_name: formName,
            success: isSuccess,
            completion_time: completionTime,
            interaction_count: interactionCountRef.current,
            error_message: errorMessage
        });
    }, [formName]);

    const trackFormAbandon = useCallback((lastFieldTouched = null) => {
        if (typeof window === 'undefined') return;

        const timeSpent = formStartRef.current ? Math.round(performance.now() - formStartRef.current) : 0;
        
        logAnalyticsEvent('form_abandon', {
            form_name: formName,
            time_spent: timeSpent,
            interaction_count: interactionCountRef.current,
            last_field_touched: lastFieldTouched
        });
    }, [formName]);

    return {
        trackFormStart,
        trackFormInteraction,
        trackFormSubmit,
        trackFormAbandon
    };
};

/**
 * Hook for tracking API call performance
 * @param {string} apiName - Name of the API endpoint
 */
export const useApiPerformance = (apiName) => {
    const trackApiCall = useCallback(async (apiCall, options = {}) => {
        if (typeof window === 'undefined') return apiCall();

        const startTime = performance.now();
        const { trackPayloadSize = false, expectedDuration = 1000 } = options;

        try {
            const result = await apiCall();
            const duration = performance.now() - startTime;

            logAnalyticsEvent('api_call_success', {
                api_name: apiName,
                duration: Math.round(duration),
                is_slow: duration > expectedDuration,
                payload_size: trackPayloadSize ? JSON.stringify(result).length : undefined
            });

            return result;
        } catch (error) {
            const duration = performance.now() - startTime;

            logAnalyticsEvent('api_call_error', {
                api_name: apiName,
                duration: Math.round(duration),
                error_message: error.message,
                error_type: error.name
            });

            throw error;
        }
    }, [apiName]);

    return { trackApiCall };
};

// Utility functions
function getScrollPercentage() {
    if (typeof window === 'undefined') return 0;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
}

function getMaxScrollDepth() {
    if (typeof window === 'undefined') return 0;
    return getScrollPercentage();
}

// Export hooks
export {
    usePagePerformance,
    useComponentPerformance,
    useFormPerformance,
    useApiPerformance
};