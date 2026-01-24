// src/core/providers/AnalyticsProvider.jsx - Enhanced with Crashlytics
"use client";

import { useRef, useEffect, useState } from "react";
import Script from "next/script";
// import { getAnalytics, isSupported } from "firebase/analytics"; // Removed dynamic import
import { firebaseApp } from "@/firebase";
import { initializeClarity } from "../services/clarity";
import {
  initializeAnalytics,
  setUserAnalytics,
  logPageView,
} from "../services/analytics";
import {
  initializeCrashlytics,
  setCrashlyticsUserId,
  logBreadcrumb,
} from "../services/crashlytics";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export function AnalyticsProvider({ children }) {
  const initialized = useRef(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const currentPath = useRef("");

  // Initialize analytics services
  useEffect(() => {
    const initializeAllAnalytics = async () => {
      if (!initialized.current && typeof window !== "undefined") {
        try {
          // Initialize Firebase Analytics
          let firebaseAnalyticsReady = false;
          
          try {
             const { getAnalytics, isSupported } = await import("firebase/analytics");
             if (await isSupported()) {
                getAnalytics(firebaseApp);
                firebaseAnalyticsReady = true;
             }
          } catch (e) {
             console.warn("Firebase analytics import failed", e);
          }

          // Initialize enhanced analytics
          const enhancedAnalyticsReady = await initializeAnalytics();

          // Initialize Crashlytics-like error reporting
          const crashlyticsReady = await initializeCrashlytics();

          // Initialize Microsoft Clarity
          try {
            initializeClarity();
          } catch (clarityError) {
            console.warn(
              "⚠️ Microsoft Clarity initialization failed:",
              clarityError
            );
          }

          initialized.current = true;
          setAnalyticsReady(true);

          // Log initial breadcrumb
          logBreadcrumb("Analytics services initialized", "info", {
            firebase_analytics: firebaseAnalyticsReady,
            enhanced_analytics: enhancedAnalyticsReady,
            crashlytics: crashlyticsReady,
          });

        } catch (error) {
          console.error("❌ Failed to initialize analytics:", error);
          // Record this initialization error
          if (typeof window !== "undefined") {
            setTimeout(() => {
              import("../services/crashlytics").then(({ recordFatalError }) => {
                recordFatalError("analytics_initialization_failed", {
                  error_message: error.message,
                  error_stack: error.stack,
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
          signupMethod: user.isAnonymous ? "anonymous" : "google",
          emailVerified: user.emailVerified || false,
          creationTime: user.metadata?.creationTime,
          lastSignInTime: user.metadata?.lastSignInTime,
        });

        // Set user ID for crashlytics
        setCrashlyticsUserId(user.uid);

        // Log breadcrumb for user authentication
        logBreadcrumb("User authenticated", "user", {
          user_id: user.uid,
          is_anonymous: user.isAnonymous,
          email_verified: user.emailVerified || false,
        });
      } catch (error) {
        console.error("Error updating user analytics:", error);
      }
    }
  }, [user, analyticsReady]);

  // Track route changes
  useEffect(() => {
    if (analyticsReady && typeof window !== "undefined") {
      const handleRouteChange = () => {
        const newPath = window.location.pathname;
        if (newPath !== currentPath.current) {
          currentPath.current = newPath;

          // Log page view
          logPageView(newPath, {
            previous_page: currentPath.current,
            navigation_type: "route_change",
          });

          // Log breadcrumb for navigation
          logBreadcrumb(`Navigated to ${newPath}`, "navigation", {
            from: currentPath.current,
            to: newPath,
          });
        }
      };

      // Initial page view
      if (currentPath.current === "") {
        currentPath.current = window.location.pathname;
        logPageView(currentPath.current, {
          navigation_type: "initial_load",
        });
      }

      // Listen for route changes (for client-side navigation)
      window.addEventListener("popstate", handleRouteChange);

      // For Next.js router events
      if (router?.events) {
        router.events.on("routeChangeComplete", handleRouteChange);
      }

      return () => {
        window.removeEventListener("popstate", handleRouteChange);
        if (router?.events) {
          router.events.off("routeChangeComplete", handleRouteChange);
        }
      };
    }
  }, [analyticsReady, router]);

  // Track visibility changes for engagement
  useEffect(() => {
    if (analyticsReady && typeof window !== "undefined") {
      let visibilityStartTime = Date.now();

      const handleVisibilityChange = () => {
        if (document.hidden) {
          // Page became hidden
          const engagementTime = Date.now() - visibilityStartTime;
          logBreadcrumb("Page hidden", "user", {
            engagement_time: engagementTime,
            page: window.location.pathname,
          });
        } else {
          // Page became visible
          visibilityStartTime = Date.now();
          logBreadcrumb("Page visible", "user", {
            page: window.location.pathname,
          });
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [analyticsReady]);

  return (
    <>
      {/* Load Firebase Analytics scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?l=dataLayer&id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onError={(error) => {
          console.error("❌ Google Analytics script failed to load:", error);
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
        `}
      </Script>



      {children}
    </>
  );
}
