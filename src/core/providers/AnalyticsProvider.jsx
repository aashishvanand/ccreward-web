// src/core/providers/AnalyticsProvider.jsx - Enhanced with Crashlytics
"use client";

import { useRef, useEffect, useState } from "react";
import { initTurnstile } from "../services/turnstile";
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
import { usePathname } from "next/navigation";
import { getSafePageUrl, getSafeReferrer } from "../utils/safeUrl";

// Point gtag at a URL without query string or fragment, so email-link codes and
// checkout ids never reach analytics. Applies to every later event.
const setSafePageLocation = () => {
  if (typeof window.gtag !== "function") return;
  window.gtag("set", {
    page_location: getSafePageUrl(),
    page_referrer: getSafeReferrer(),
  });
};

// Run analytics setup when the browser is idle, so it never competes with rendering
const whenIdle = (callback) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 4000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 1500);
  return () => clearTimeout(id);
};

export function AnalyticsProvider({ children }) {
  const initialized = useRef(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const currentPath = useRef("");

  // Initialize gtag early for Firebase Analytics
  useEffect(() => {
    if (typeof window !== "undefined" && !window.gtagInitialized) {
      window.gtagInitialized = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      setSafePageLocation();

      const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
      if (measurementId) {
        window.gtag("config", measurementId, {
          page_path: window.location.pathname,
          page_location: getSafePageUrl(),
          send_page_view: false, // We'll handle page views manually
          custom_map: {
            custom_error: "error_name",
            custom_user_id: "user_id",
            custom_session_id: "session_id",
          },
        });

        // Enhanced error tracking
        window.gtag("config", measurementId, {
          transport_type: "beacon",
          anonymize_ip: true,
        });
      }
    }
  }, []);

  // Initialize analytics services
  useEffect(() => {
    const initializeAllAnalytics = async () => {
      if (!initialized.current && typeof window !== "undefined") {
        try {
          // Firebase Analytics injects gtag.js itself (no separate <Script>), so
          // loading it here in idle time keeps it off the critical path.
          let firebaseAnalyticsReady = false;
          try {
            const { isSupported } = await import("firebase/analytics");
            firebaseAnalyticsReady = await isSupported();
          } catch (e) {
            console.warn("Firebase analytics import failed", e);
          }

          // Single entry point: initializeAnalytics() is idempotent and calls
          // getAnalytics(), sets up web-vitals and network observers once.
          const enhancedAnalyticsReady = firebaseAnalyticsReady
            ? await initializeAnalytics()
            : false;

          // Initialize Crashlytics-like error reporting
          const crashlyticsReady = await initializeCrashlytics();

          // Microsoft Clarity loads from /scripts/clarity.js in the root layout

          // Pre-load Turnstile for bot protection (non-blocking)
          initTurnstile();

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

    return whenIdle(initializeAllAnalytics);
  }, []);

  // Track user authentication changes
  useEffect(() => {
    if (analyticsReady && user && initialized.current) {
      try {
        // Set user ID for analytics
        setUserAnalytics(user.uid, {
          signupMethod: "google",
          emailVerified: user.emailVerified || false,
          creationTime: user.metadata?.creationTime,
          lastSignInTime: user.metadata?.lastSignInTime,
        });

        // Set user ID for crashlytics
        setCrashlyticsUserId(user.uid);

        // Log breadcrumb for user authentication
        logBreadcrumb("User authenticated", "user", {
          user_id: user.uid,
          email_verified: user.emailVerified || false,
        });
      } catch (error) {
        console.error("Error updating user analytics:", error);
      }
    }
  }, [user, analyticsReady]);

  // Track page views: initial load and every client-side navigation
  useEffect(() => {
    if (!analyticsReady || typeof window === "undefined") return;
    const newPath = window.location.pathname;
    const previousPath = currentPath.current;
    if (newPath === previousPath) return;
    currentPath.current = newPath;

    setSafePageLocation();
    logPageView(newPath, previousPath
      ? { previous_page: previousPath, navigation_type: "route_change" }
      : { navigation_type: "initial_load" });

    if (previousPath) {
      logBreadcrumb(`Navigated to ${newPath}`, "navigation", {
        from: previousPath,
        to: newPath,
      });
    }
  }, [analyticsReady, pathname]);

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
      {children}
    </>
  );
}
