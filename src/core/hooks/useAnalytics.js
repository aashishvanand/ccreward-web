// src/core/hooks/useAnalytics.js - Custom Analytics Hooks
import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../providers/AuthContext';
import { useRouter } from 'next/navigation';
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
} from '../services/crashlytics';

// Main analytics hook
export const useAnalytics = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Track button clicks with enhanced context
  const trackButtonClick = useCallback((buttonName, additionalData = {}) => {
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
    logSearchQuery(query, results);
    
    logBreadcrumb(`Search performed: ${query}`, 'user', {
      query,
      results_count: results.length,
      ...additionalData
    });
  }, []);

  // Track conversions
  const trackConversion = useCallback((conversionType, value = 0, additionalData = {}) => {
    logConversion(conversionType, value);
    
    logBreadcrumb(`Conversion: ${conversionType}`, 'user', {
      conversion_type: conversionType,
      conversion_value: value,
      ...additionalData
    });
  }, []);

  // Track custom events
  const trackEvent = useCallback((eventName, eventData = {}) => {
    logAnalyticsEvent(eventName, {
      user_id: user?.uid || 'anonymous',
      page_path: window.location.pathname,
      ...eventData
    });

    logBreadcrumb(`Custom event: ${eventName}`, 'user', eventData);
  }, [user]);

  // Track errors
  const trackError = useCallback((errorName, errorData = {}) => {
    recordNonFatalError(errorName, {
      user_id: user?.uid || 'anonymous',
      page_path: window.location.pathname,
      ...errorData
    });
  }, [user]);

  // Track API errors
  const trackAPIError = useCallback((endpoint, statusCode, errorMessage, requestData = {}) => {
    recordAPIError(endpoint, statusCode, errorMessage, {
      user_id: user?.uid || 'anonymous',
      ...requestData
    });
  }, [user]);

  // Track navigation
  const trackNavigation = useCallback((destination, method = 'click') => {
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
    // Start performance trace when component mounts
    performanceTrace.current = startPerformanceTrace(`page_${pageName}`);
    pageLoadTime.current = performance.now();

    // Log page start
    logBreadcrumb(`Page load started: ${pageName}`, 'navigation', {
      page_name: pageName
    });

    return () => {
      // Stop performance trace when component unmounts
      if (performanceTrace.current) {
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
      }
    };
  }, [pageName]);

  return {
    recordCustomMetric: useCallback((metricName, value) => {
      if (performanceTrace.current) {
        performanceTrace.current.putAttribute(metricName, String(value));
      }
    }, [])
  };
};

// Hook for tracking user engagement
export const useEngagementTracking = () => {
  const engagementStartTime = useRef(null);
  const isEngaged = useRef(false);

  useEffect(() => {
    let engagementTimer;
    let idleTimer;

    const startEngagement = () => {
      if (!isEngaged.current) {
        engagementStartTime.current = Date.now();
        isEngaged.current = true;
        
        logBreadcrumb('User engagement started', 'user', {
          page: window.location.pathname
        });
      }
    };

    const endEngagement = () => {
      if (isEngaged.current && engagementStartTime.current) {
        const engagementDuration = Date.now() - engagementStartTime.current;
        
        if (engagementDuration > 1000) { // Only log if engaged for more than 1 second
          logEngagementEvent('page_engagement', engagementDuration);
          
          logBreadcrumb('User engagement ended', 'user', {
            page: window.location.pathname,
            duration: engagementDuration
          });
        }
        
        isEngaged.current = false;
        engagementStartTime.current = null;
      }
    };

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      startEngagement();
      
      idleTimer = setTimeout(() => {
        endEngagement();
      }, 30000); // 30 seconds of inactivity
    };

    // Track various user interactions
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    // Start initial engagement tracking
    resetIdleTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true);
      });
      
      clearTimeout(idleTimer);
      endEngagement();
    };
  }, []);

  return {
    trackCustomEngagement: useCallback((eventType, customData = {}) => {
      const currentEngagementTime = isEngaged.current && engagementStartTime.current 
        ? Date.now() - engagementStartTime.current 
        : 0;
        
      logEngagementEvent(eventType, currentEngagementTime);
      
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
    const formDuration = formStartTime.current ? Date.now() - formStartTime.current : 0;
    
    logAnalyticsEvent('form_abandon', {
      form_name: formName,
      form_duration: formDuration,
      last_field_interacted: lastFieldInteracted,
      field_interactions: Object.keys(fieldInteractions.current).length,
      timestamp: new Date().toISOString()
    });

    logBreadcrumb(`Form abandoned: ${formName}`, 'user', {
      form_name: formName,
      duration: formDuration,
      last_field: lastFieldInteracted
    });
  }, [formName]);

  return {
    trackFormStart,
    trackFieldInteraction,
    trackFormSubmission,
    trackFormAbandonment
  };
};

// Hook for tracking API calls
export const useAPITracking = () => {
  const { trackAPIError } = useAnalytics();

  const trackAPICall = useCallback(async (apiCall, endpoint, requestData = {}) => {
    const startTime = performance.now();
    let responseTime = 0;
    let success = false;
    let statusCode = 0;
    let errorMessage = '';

    logBreadcrumb(`API call started: ${endpoint}`, 'network', {
      endpoint,
      method: requestData.method || 'GET'
    });

    try {
      const result = await apiCall();
      responseTime = performance.now() - startTime;
      success = true;
      statusCode = 200; // Assume success
      
      // Log successful API call
      logAnalyticsEvent('api_call_success', {
        endpoint,
        response_time: Math.round(responseTime),
        timestamp: new Date().toISOString(),
        ...requestData
      });

      logBreadcrumb(`API call succeeded: ${endpoint}`, 'network', {
        endpoint,
        response_time: Math.round(responseTime)
      });

      return result;
    } catch (error) {
      responseTime = performance.now() - startTime;
      statusCode = error.response?.status || 0;
      errorMessage = error.message || 'Unknown error';
      
      // Track API error
      trackAPIError(endpoint, statusCode, errorMessage, {
        ...requestData,
        responseTime: Math.round(responseTime)
      });

      logBreadcrumb(`API call failed: ${endpoint}`, 'error', {
        endpoint,
        error_message: errorMessage,
        status_code: statusCode,
        response_time: Math.round(responseTime)
      });

      throw error;
    }
  }, [trackAPIError]);

  return { trackAPICall };
};

// Hook for tracking user journey
export const useJourneyTracking = () => {
  const journeyStep = useRef(0);
  const journeyStartTime = useRef(Date.now());

  const trackJourneyStep = useCallback((stepName, stepData = {}) => {
    journeyStep.current += 1;
    const journeyDuration = Date.now() - journeyStartTime.current;

    logAnalyticsEvent('user_journey_step', {
      step_name: stepName,
      step_number: journeyStep.current,
      journey_duration: journeyDuration,
      timestamp: new Date().toISOString(),
      ...stepData
    });

    logBreadcrumb(`Journey step: ${stepName}`, 'user', {
      step_name: stepName,
      step_number: journeyStep.current,
      journey_duration: journeyDuration,
      ...stepData
    });
  }, []);

  const trackJourneyCompletion = useCallback((completionType = 'success', finalData = {}) => {
    const totalJourneyDuration = Date.now() - journeyStartTime.current;

    logAnalyticsEvent('user_journey_complete', {
      completion_type: completionType,
      total_steps: journeyStep.current,
      total_duration: totalJourneyDuration,
      timestamp: new Date().toISOString(),
      ...finalData
    });

    logBreadcrumb(`Journey completed: ${completionType}`, 'user', {
      completion_type: completionType,
      total_steps: journeyStep.current,
      total_duration: totalJourneyDuration
    });

    // Reset journey tracking
    journeyStep.current = 0;
    journeyStartTime.current = Date.now();
  }, []);

  return {
    trackJourneyStep,
    trackJourneyCompletion
  };
};

// Hook for tracking experiments/A-B tests
export const useExperimentTracking = () => {
  const trackExperimentExposure = useCallback((experimentName, variantName, additionalData = {}) => {
    logAnalyticsEvent('experiment_exposure', {
      experiment_name: experimentName,
      variant_name: variantName,
      timestamp: new Date().toISOString(),
      ...additionalData
    });

    logBreadcrumb(`Experiment exposure: ${experimentName}`, 'user', {
      experiment_name: experimentName,
      variant_name: variantName,
      ...additionalData
    });
  }, []);

  const trackExperimentConversion = useCallback((experimentName, variantName, conversionType, additionalData = {}) => {
    logAnalyticsEvent('experiment_conversion', {
      experiment_name: experimentName,
      variant_name: variantName,
      conversion_type: conversionType,
      timestamp: new Date().toISOString(),
      ...additionalData
    });

    logBreadcrumb(`Experiment conversion: ${experimentName}`, 'user', {
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

// Hook for tracking component-specific analytics
export const useComponentAnalytics = (componentName) => {
  const { trackEvent, trackError } = useAnalytics();
  const mountTime = useRef(Date.now());

  useEffect(() => {
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