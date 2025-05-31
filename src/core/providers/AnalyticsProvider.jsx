// src/core/providers/AnalyticsProvider.jsx - Enhanced with Crashlytics
"use client";

import { useRef, useEffect, useState } from "react";
import Script from "next/script";
import { getAnalytics, isSupported } from "firebase/analytics";
import { firebaseApp } from "../../../firebase";
import { initializeClarity } from '../services/clarity';
import { initializeAnalytics, setUserAnalytics, logPageView } from '../services/analytics';
import { initializeCrashlytics, setCrashlyticsUserId, logBreadcrumb } from '../services/crashlytics';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

export function AnalyticsProvider({ children }) {
  const initialized = useRef(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const currentPath = useRef('');

  // Initialize analytics services
  useEffect(() => {
    const initializeAllAnalytics = async () => {
      if (!initialized.current && typeof window !== 'undefined') {
        try {
          console.log('🚀 Initializing analytics services...');
          
          // Initialize Firebase Analytics
          let firebaseAnalyticsReady = false;
          if (await isSupported()) {
            getAnalytics(firebaseApp);
            firebaseAnalyticsReady = true;
            console.log('✅ Firebase Analytics initialized');
          }
          
          // Initialize enhanced analytics
          const enhancedAnalyticsReady = await initializeAnalytics();
          console.log('✅ Enhanced Analytics initialized:', enhancedAnalyticsReady);
          
          // Initialize Crashlytics-like error reporting
          const crashlyticsReady = await initializeCrashlytics();
          console.log('✅ Crashlytics initialized:', crashlyticsReady);
          
          // Initialize Microsoft Clarity
          try {
            initializeClarity();
            console.log('✅ Microsoft Clarity initialized');
          } catch (clarityError) {
            console.warn('⚠️ Microsoft Clarity initialization failed:', clarityError);
          }
          
          initialized.current = true;
          setAnalyticsReady(true);
          
          // Log initial breadcrumb
          logBreadcrumb('Analytics services initialized', 'info', {
            firebase_analytics: firebaseAnalyticsReady,
            enhanced_analytics: enhancedAnalyticsReady,
            crashlytics: crashlyticsReady
          });
          
          console.log('🎉 All analytics services initialized successfully');
          
        } catch (error) {
          console.error("❌ Failed to initialize analytics:", error);
          // Record this initialization error
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              import('../services/crashlytics').then(({ recordFatalError }) => {
                recordFatalError('analytics_initialization_failed', {
                  error_message: error.message,
                  error_stack: error.stack
                });
              });
            }, 1000);
          }
        }
      }
    };

    initializeAllAnalytics();
  }, []);

  // Track user authentication changes
  useEffect(() => {
    if (analyticsReady && user && initialized.current) {
      try {
        // Set user ID for analytics
        setUserAnalytics(user.uid, {
          isAnonymous: user.isAnonymous,
          signupMethod: user.isAnonymous ? 'anonymous' : 'google',
          emailVerified: user.emailVerified || false,
          creationTime: user.metadata?.creationTime,
          lastSignInTime: user.metadata?.lastSignInTime
        });

        // Set user ID for crashlytics
        setCrashlyticsUserId(user.uid);

        // Log breadcrumb for user authentication
        logBreadcrumb('User authenticated', 'user', {
          user_id: user.uid,
          is_anonymous: user.isAnonymous,
          email_verified: user.emailVerified || false
        });

        console.log('👤 User analytics updated for:', user.uid);
      } catch (error) {
        console.error('Error updating user analytics:', error);
      }
    }
  }, [user, analyticsReady]);

  // Track route changes
  useEffect(() => {
    if (analyticsReady && typeof window !== 'undefined') {
      const handleRouteChange = () => {
        const newPath = window.location.pathname;
        if (newPath !== currentPath.current) {
          currentPath.current = newPath;
          
          // Log page view
          logPageView(newPath, {
            previous_page: currentPath.current,
            navigation_type: 'route_change'
          });

          // Log breadcrumb for navigation
          logBreadcrumb(`Navigated to ${newPath}`, 'navigation', {
            from: currentPath.current,
            to: newPath
          });

          console.log('📱 Route change tracked:', newPath);
        }
      };

      // Initial page view
      if (currentPath.current === '') {
        currentPath.current = window.location.pathname;
        logPageView(currentPath.current, {
          navigation_type: 'initial_load'
        });
      }

      // Listen for route changes (for client-side navigation)
      window.addEventListener('popstate', handleRouteChange);
      
      // For Next.js router events
      if (router?.events) {
        router.events.on('routeChangeComplete', handleRouteChange);
      }

      return () => {
        window.removeEventListener('popstate', handleRouteChange);
        if (router?.events) {
          router.events.off('routeChangeComplete', handleRouteChange);
        }
      };
    }
  }, [analyticsReady, router]);

  // Track visibility changes for engagement
  useEffect(() => {
    if (analyticsReady && typeof window !== 'undefined') {
      let visibilityStartTime = Date.now();

      const handleVisibilityChange = () => {
        if (document.hidden) {
          // Page became hidden
          const engagementTime = Date.now() - visibilityStartTime;
          logBreadcrumb('Page hidden', 'user', {
            engagement_time: engagementTime,
            page: window.location.pathname
          });
        } else {
          // Page became visible
          visibilityStartTime = Date.now();
          logBreadcrumb('Page visible', 'user', {
            page: window.location.pathname
          });
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [analyticsReady]);

  return (
    <>
      {/* Load Firebase Analytics scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?l=dataLayer&id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('📊 Google Analytics script loaded');
        }}
        onError={(error) => {
          console.error('❌ Google Analytics script failed to load:', error);
        }}
      />
      
      <Script id="firebase-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: false, // We'll handle page views manually
            custom_map: {
              'custom_error': 'error_name',
              'custom_user_id': 'user_id',
              'custom_session_id': 'session_id'
            }
          });
          
          // Enhanced error tracking
          gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}', {
            transport_type: 'beacon',
            anonymize_ip: true
          });
          
          console.log('🔧 Google Analytics configured');
        `}
      </Script>

      {/* Load Microsoft Clarity script */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "ngsrwjccm4");
          
          console.log('🔍 Microsoft Clarity script loaded');
        `}
      </Script>

      {/* Performance monitoring script */}
      <Script id="performance-monitoring" strategy="afterInteractive">
        {`
          // Monitor Core Web Vitals
          function getCLS(onReport) {
            let clsValue = 0;
            let clsEntries = [];
            
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value;
                  clsEntries.push(entry);
                }
              }
              onReport({name: 'CLS', value: clsValue, entries: clsEntries});
            });
            
            observer.observe({entryTypes: ['layout-shift']});
          }
          
          function getFID(onReport) {
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                onReport({name: 'FID', value: entry.processingStart - entry.startTime, entries: [entry]});
              }
            });
            
            observer.observe({entryTypes: ['first-input']});
          }
          
          function getLCP(onReport) {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              onReport({name: 'LCP', value: lastEntry.startTime, entries: [lastEntry]});
            });
            
            observer.observe({entryTypes: ['largest-contentful-paint']});
          }
          
          // Report Web Vitals
          if (typeof PerformanceObserver !== 'undefined') {
            getCLS((metric) => {
              if (metric.value > 0.1) {
                gtag('event', 'web_vitals', {
                  metric_name: metric.name,
                  metric_value: Math.round(metric.value * 1000),
                  metric_rating: metric.value > 0.25 ? 'poor' : metric.value > 0.1 ? 'needs-improvement' : 'good'
                });
              }
            });
            
            getFID((metric) => {
              gtag('event', 'web_vitals', {
                metric_name: metric.name,
                metric_value: Math.round(metric.value),
                metric_rating: metric.value > 300 ? 'poor' : metric.value > 100 ? 'needs-improvement' : 'good'
              });
            });
            
            getLCP((metric) => {
              gtag('event', 'web_vitals', {
                metric_name: metric.name,
                metric_value: Math.round(metric.value),
                metric_rating: metric.value > 4000 ? 'poor' : metric.value > 2500 ? 'needs-improvement' : 'good'
              });
            });
          }
          
          console.log('⚡ Performance monitoring initialized');
        `}
      </Script>

      {children}
    </>
  );
}