// src/core/hooks/usePerformance.js - React Hook for Performance Monitoring
import { useEffect, useRef, useCallback } from 'react';
import { 
    trackComponentRender, 
    trackUserInteraction, 
    trackApiCall,
    getPerformanceMetrics 
} from '../services/performance';

// Hook for tracking component render performance
export const usePerformanceTrace = (componentName) => {
    const traceRef = useRef(null);
    
    useEffect(() => {
        // Start trace on mount
        traceRef.current = trackComponentRender(componentName);
        
        // Complete trace on unmount
        return () => {
            if (traceRef.current) {
                traceRef.current.complete();
            }
        };
    }, [componentName]);
    
    return traceRef.current;
};

// Hook for tracking user interactions
export const useInteractionTracking = () => {
    const trackInteraction = useCallback((interactionName, element) => {
        return trackUserInteraction(interactionName, element);
    }, []);
    
    const trackClick = useCallback((element, customName) => {
        const interactionName = customName || 'click';
        return trackInteraction(interactionName, element);
    }, [trackInteraction]);
    
    const trackFormSubmit = useCallback((element, formName) => {
        const interactionName = formName ? `form_submit_${formName}` : 'form_submit';
        return trackInteraction(interactionName, element);
    }, [trackInteraction]);
    
    return {
        trackInteraction,
        trackClick,
        trackFormSubmit
    };
};

// Hook for tracking API calls
export const useApiTracking = () => {
    const trackApi = useCallback((endpoint, method = 'GET') => {
        return trackApiCall(endpoint, method);
    }, []);
    
    return { trackApi };
};

// Hook for getting performance metrics
export const usePerformanceMetrics = () => {
    const getMetrics = useCallback(() => {
        return getPerformanceMetrics();
    }, []);
    
    return { getMetrics };
};

// Hook for automatic page performance tracking
export const usePagePerformance = (pageName) => {
    useEffect(() => {
        const startTime = performance.now();
        
        // Track page load performance
        const trace = trackComponentRender(`page_${pageName}`);
        
        // Track when page is interactive
        const handleInteractive = () => {
            if (trace) {
                trace.complete();
            }
        };
        
        if (document.readyState === 'complete') {
            handleInteractive();
        } else {
            window.addEventListener('load', handleInteractive, { once: true });
        }
        
        return () => {
            if (trace) {
                trace.complete();
            }
        };
    }, [pageName]);
};