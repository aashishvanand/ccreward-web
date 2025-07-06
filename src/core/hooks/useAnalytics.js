// src/core/hooks/useAnalytics.js - Client-Side Compatible Analytics Hooks
import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../providers/AuthContext';
import { 
  logAnalyticsEvent, 
  logButtonClick, 
  logFeatureUsage,
  logSearchQuery,
  logConversion,
  logEngagementEvent,
  startPerformanceTrace,
  stopPerformanceTrace
} from '../services/analytics';
import { 
  logBreadcrumb, 
  recordNonFatalError,
  recordAPIError 
} from '../services/errorTracking';

// Main analytics hook
export const useAnalytics = () => {
  const { user } = useAuth();

  // Track button clicks with enhanced context
  const trackButtonClick = useCallback((buttonName, additionalData = {}) => {
    if (typeof window === 'undefined') return;

    logButtonClick(buttonName, {
      user_id: user?.uid || 'anonymous',
      page_path: window.location.pathname,
      ...additionalData
    });
    
    logBreadcrumb(`Button clicked: ${buttonName}`, 'user', {
      button_name: buttonName,
      ...additionalData
    });
  }, [user]);

  // Track feature usage
  const trackFeatureUsage = useCallback((featureName, additionalData = {}) => {
    if (typeof window === 'undefined') return;

    logFeatureUsage(featureName, {
      user_id: user?.uid || 'anonymous',
      page_path: window.location.pathname,
      feature_context: additionalData.context || 'unknown',
      ...additionalData
    });

    logBreadcrumb(`Feature used: ${featureName}`, 'user', {
      feature_name: featureName,
      ...additionalData
    });
  }, [user]);

  // Track search queries
  const trackSearch = useCallback((query, results = [], additionalData = {}) => {
    if (typeof window === 'undefined') return;

    logSearchQuery(query, results);
    
    logBreadcrumb(`Search performed: ${query}`, 'user', {
      query,
      results_count: results.length,
      ...additionalData
    });
  }, []);

  // Track conversions
  const trackConversion = useCallback((conversionType, value = 0, additionalData = {}) => {
    if (typeof window === 'undefined') return;

    logConversion(conversionType, value, additionalData);
    
    logBreadcrumb(`Conversion: ${conversionType}`, 'conversion', {
      conversion_type: conversionType,
      conversion_value: value,
      ...additionalData
    });
  }, []);

  // Track custom events
  const trackEvent = useCallback((eventName, eventData = {}) => {
    if (typeof window === 'undefined') return;

    logAnalyticsEvent(eventName, {
      user_id: user?.uid || 'anonymous',
      page_path: window.location.pathname,
      ...eventData
    });

    logBreadcrumb(`Custom event: ${eventName}`, 'user', eventData);
  }, [user]);

  // Track errors
  const trackError = useCallback((errorName, errorData = {}) => {
    if (typeof window === 'undefined') return;

    recordNonFatalError(errorName, {
      user_id: user?.uid || 'anonymous',
      page_path: window.location.pathname,
      ...errorData
    });
  }, [user]);

  // Track API errors
  const trackAPIError = useCallback((endpoint, statusCode, errorMessage, requestData = {}) => {
    if (typeof window === 'undefined') return;

    recordAPIError(endpoint, statusCode, errorMessage, {
      user_id: user?.uid || 'anonymous',
      ...requestData
    });
  }, [user]);

  // Track navigation
  const trackNavigation = useCallback((destination, method = 'click') => {
    if (typeof window === 'undefined') return;

    trackEvent('navigation', {
      destination,
      navigation_method: method,
      source_page: window.location.pathname
    });
  }, [trackEvent]);

  return {
    trackButtonClick,
    trackFeatureUsage,
    trackSearch,
    trackConversion,
    trackEvent,
    trackError,
    trackAPIError,
    trackNavigation
  };
};

// Hook for tracking page performance
export const usePagePerformance = (pageName) => {
  const performanceTrace = useRef(null);
  const pageLoadTime = useRef(null);

  useEffect(() => {
    // Only run on client-side with performance API available
    if (typeof window === 'undefined' || !window.performance || !window.performance.now) {
      return;
    }

    try {
      // Start performance trace when component mounts
      performanceTrace.current = startPerformanceTrace(`page_${pageName}`);
      pageLoadTime.current = performance.now();

      // Log page start
      logBreadcrumb(`Page load started: ${pageName}`, 'navigation', {
        page_name: pageName
      });
    } catch (error) {
      console.warn('Failed to start page performance tracking:', error);
    }

    return () => {
      // Stop performance trace when component unmounts
      if (performanceTrace.current && window.performance && window.performance.now && pageLoadTime.current) {
        try {
          const loadDuration = performance.now() - pageLoadTime.current;
          
          stopPerformanceTrace(performanceTrace.current, {
            page_name: pageName,
            load_duration: Math.round(loadDuration)
          });

          // Log page performance
          logAnalyticsEvent('page_performance', {
            page_name: pageName,
            load_duration: Math.round(loadDuration),
            timestamp: new Date().toISOString()
          });

          logBreadcrumb(`Page load completed: ${pageName}`, 'navigation', {
            page_name: pageName,
            load_duration: Math.round(loadDuration)
          });
        } catch (error) {
          console.warn('Failed to stop page performance tracking:', error);
        }
      }
    };
  }, [pageName]);

  return {
    recordCustomMetric: useCallback((metricName, value) => {
      if (performanceTrace.current && typeof window !== 'undefined') {
        try {
          performanceTrace.current.putAttribute(metricName, String(value));
        } catch (error) {
          console.warn('Failed to record custom metric:', error);
        }
      }
    }, [])
  };
};

// Hook for tracking user engagement
export const useEngagementTracking = () => {
  const engagementStartTime = useRef(null);
  const isEngaged = useRef(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    let engagementTimer;
    let idleTimer;

    const startEngagement = () => {
      if (!isEngaged.current) {
        engagementStartTime.current = Date.now();
        isEngaged.current = true;
        
        logBreadcrumb('User engagement started', 'user', {
          engagement_start: new Date().toISOString()
        });
      }
    };

    const endEngagement = () => {
      if (isEngaged.current && engagementStartTime.current) {
        const engagementDuration = Date.now() - engagementStartTime.current;
        
        logEngagementEvent('session_engagement', engagementDuration);
        
        logBreadcrumb('User engagement ended', 'user', {
          engagement_duration: engagementDuration
        });
        
        isEngaged.current = false;
      }
    };

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      startEngagement();
      
      idleTimer = setTimeout(() => {
        endEngagement();
      }, 30000); // 30 seconds of inactivity
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    // Start tracking immediately
    resetIdleTimer();

    return () => {
      // Cleanup
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      clearTimeout(idleTimer);
      endEngagement();
    };
  }, []);

  return {
    trackCustomEngagement: useCallback((eventType, customData = {}) => {
      if (typeof window === 'undefined') return;

      const currentEngagementTime = engagementStartTime.current 
        ? Date.now() - engagementStartTime.current 
        : 0;
        
      logEngagementEvent(eventType, currentEngagementTime, customData);
      
      logBreadcrumb(`Custom engagement: ${eventType}`, 'user', {
        engagement_duration: currentEngagementTime,
        ...customData
      });
    }, [])
  };
};

// Hook for tracking form interactions
export const useFormTracking = (formName) => {
  const formStartTime = useRef(null);
  const fieldInteractions = useRef({});

  const trackFormStart = useCallback(() => {
    if (typeof window === 'undefined') return;

    formStartTime.current = Date.now();
    
    logAnalyticsEvent('form_start', {
      form_name: formName,
      timestamp: new Date().toISOString()
    });

    logBreadcrumb(`Form started: ${formName}`, 'user', {
      form_name: formName
    });
  }, [formName]);

  const trackFieldInteraction = useCallback((fieldName, interactionType = 'focus') => {
    if (typeof window === 'undefined') return;

    if (!fieldInteractions.current[fieldName]) {
      fieldInteractions.current[fieldName] = [];
    }
    
    fieldInteractions.current[fieldName].push({
      type: interactionType,
      timestamp: Date.now()
    });

    logBreadcrumb(`Form field interaction: ${fieldName}`, 'user', {
      form_name: formName,
      field_name: fieldName,
      interaction_type: interactionType
    });
  }, [formName]);

  const trackFormSubmission = useCallback((success = true, errorMessage = '') => {
    if (typeof window === 'undefined') return;

    const formDuration = formStartTime.current ? Date.now() - formStartTime.current : 0;
    
    logAnalyticsEvent('form_submit', {
      form_name: formName,
      success,
      form_duration: formDuration,
      error_message: errorMessage,
      field_interactions: Object.keys(fieldInteractions.current).length,
      timestamp: new Date().toISOString()
    });

    logBreadcrumb(`Form ${success ? 'submitted' : 'failed'}: ${formName}`, 'user', {
      form_name: formName,
      success,
      duration: formDuration,
      error_message: errorMessage
    });

    // Reset form tracking
    formStartTime.current = null;
    fieldInteractions.current = {};
  }, [formName]);

  const trackFormAbandonment = useCallback((lastFieldInteracted = '') => {
    if (typeof window === 'undefined') return;

    const formDuration = formStartTime.current ? Date.now() - formStartTime.current : 0;
    
    logAnalyticsEvent('form_abandon', {
      form_name: formName,
      form_duration: formDuration,
      last_field: lastFieldInteracted,
      field_interactions: Object.keys(fieldInteractions.current).length,
      timestamp: new Date().toISOString()
    });

    logBreadcrumb(`Form abandoned: ${formName}`, 'user', {
      form_name: formName,
      duration: formDuration,
      last_field: lastFieldInteracted
    });

    // Reset form tracking
    formStartTime.current = null;
    fieldInteractions.current = {};
  }, [formName]);

  return {
    trackFormStart,
    trackFieldInteraction,
    trackFormSubmission,
    trackFormAbandonment
  };
};

// Hook for tracking component-specific analytics
export const useComponentAnalytics = (componentName) => {
  const { trackEvent, trackError } = useAnalytics();
  const mountTime = useRef(Date.now());

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Track component mount
    trackEvent('component_mount', {
      component_name: componentName,
      mount_timestamp: new Date().toISOString()
    });

    logBreadcrumb(`Component mounted: ${componentName}`, 'debug', {
      component_name: componentName
    });

    return () => {
      // Track component unmount
      const componentLifetime = Date.now() - mountTime.current;
      
      trackEvent('component_unmount', {
        component_name: componentName,
        component_lifetime: componentLifetime,
        unmount_timestamp: new Date().toISOString()
      });

      logBreadcrumb(`Component unmounted: ${componentName}`, 'debug', {
        component_name: componentName,
        lifetime: componentLifetime
      });
    };
  }, [componentName, trackEvent]);

  const trackComponentError = useCallback((errorName, errorData = {}) => {
    trackError(`${componentName}_error`, {
      component_name: componentName,
      error_name: errorName,
      ...errorData
    });
  }, [componentName, trackError]);

  const trackComponentInteraction = useCallback((interactionType, interactionData = {}) => {
    trackEvent(`${componentName}_interaction`, {
      component_name: componentName,
      interaction_type: interactionType,
      timestamp: new Date().toISOString(),
      ...interactionData
    });
  }, [componentName, trackEvent]);

  return {
    trackComponentError,
    trackComponentInteraction
  };
};

// Hook for tracking user journey/funnel
export const useJourneyTracking = (journeyName) => {
  const journeyStep = useRef(0);
  const journeyStartTime = useRef(null);

  const trackJourneyStep = useCallback((stepName, stepData = {}) => {
    if (typeof window === 'undefined') return;

    journeyStep.current += 1;
    
    if (!journeyStartTime.current) {
      journeyStartTime.current = Date.now();
    }

    const stepDuration = Date.now() - journeyStartTime.current;

    logAnalyticsEvent('journey_step', {
      journey_name: journeyName,
      step_name: stepName,
      step_number: journeyStep.current,
      step_duration: stepDuration,
      timestamp: new Date().toISOString(),
      ...stepData
    });

    logBreadcrumb(`Journey step: ${stepName}`, 'user', {
      journey_name: journeyName,
      step_number: journeyStep.current,
      step_duration: stepDuration
    });
  }, [journeyName]);

  const trackJourneyCompletion = useCallback((completionType = 'completed', finalData = {}) => {
    if (typeof window === 'undefined') return;

    const totalJourneyDuration = journeyStartTime.current ? Date.now() - journeyStartTime.current : 0;

    logAnalyticsEvent('journey_completion', {
      journey_name: journeyName,
      completion_type: completionType,
      total_steps: journeyStep.current,
      total_duration: totalJourneyDuration,
      timestamp: new Date().toISOString(),
      ...finalData
    });

    logBreadcrumb(`Journey completed: ${completionType}`, 'conversion', {
      journey_name: journeyName,
      completion_type: completionType,
      total_steps: journeyStep.current,
      total_duration: totalJourneyDuration
    });

    // Reset journey tracking
    journeyStep.current = 0;
    journeyStartTime.current = null;
  }, [journeyName]);

  return {
    trackJourneyStep,
    trackJourneyCompletion
  };
};

// Hook for tracking API calls
export const useAPITracking = () => {
  const trackAPICall = useCallback(async (apiCall, options = {}) => {
    if (typeof window === 'undefined') return apiCall();

    const {
      endpoint = 'unknown',
      method = 'GET',
      trackPayloadSize = false,
      expectedDuration = 2000
    } = options;

    // Use Date.now() instead of performance.now() for better compatibility
    const startTime = Date.now();

    try {
      const result = await apiCall();
      const duration = Date.now() - startTime;

      logAnalyticsEvent('api_call_success', {
        endpoint,
        method,
        duration: Math.round(duration),
        is_slow: duration > expectedDuration,
        payload_size: trackPayloadSize && result ? JSON.stringify(result).length : undefined,
        timestamp: new Date().toISOString()
      });

      logBreadcrumb(`API call successful: ${endpoint}`, 'info', {
        method,
        duration: Math.round(duration)
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      logAnalyticsEvent('api_call_error', {
        endpoint,
        method,
        duration: Math.round(duration),
        error_message: error.message,
        error_type: error.name,
        timestamp: new Date().toISOString()
      });

      logBreadcrumb(`API call failed: ${endpoint}`, 'error', {
        method,
        duration: Math.round(duration),
        error: error.message
      });

      throw error;
    }
  }, []);

  return { trackAPICall };
};

// Hook for tracking experiments/A-B tests
export const useExperimentTracking = () => {
  const trackExperimentExposure = useCallback((experimentName, variantName, additionalData = {}) => {
    if (typeof window === 'undefined') return;

    logAnalyticsEvent('experiment_exposure', {
      experiment_name: experimentName,
      variant_name: variantName,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      ...additionalData
    });

    logBreadcrumb(`Experiment exposure: ${experimentName}`, 'user', {
      experiment_name: experimentName,
      variant_name: variantName,
      ...additionalData
    });
  }, []);

  const trackExperimentConversion = useCallback((experimentName, variantName, conversionType, additionalData = {}) => {
    if (typeof window === 'undefined') return;

    logAnalyticsEvent('experiment_conversion', {
      experiment_name: experimentName,
      variant_name: variantName,
      conversion_type: conversionType,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      ...additionalData
    });

    logBreadcrumb(`Experiment conversion: ${experimentName}`, 'conversion', {
      experiment_name: experimentName,
      variant_name: variantName,
      conversion_type: conversionType,
      ...additionalData
    });
  }, []);

  return {
    trackExperimentExposure,
    trackExperimentConversion
  };
};

// Export all hooks
export {
  useAnalytics,
  usePagePerformance,
  useEngagementTracking,
  useFormTracking,
  useComponentAnalytics,
  useJourneyTracking,
  useAPITracking,
  useExperimentTracking
};