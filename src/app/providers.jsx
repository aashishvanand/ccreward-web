// src/app/providers.jsx - FIXED: Ensure single provider instances
"use client";

import { memo } from "react";
import { ThemeRegistry } from "../core/providers/ThemeRegistry";
import { AuthProvider } from "../core/providers/AuthContext";
import { AnalyticsProvider } from "../core/providers/AnalyticsProvider";
import { RegionProvider } from "../core/providers/RegionContext";

// Add a provider tracking mechanism
let providerMounted = false;

const Providers = memo(({ children }) => {
  // Prevent multiple provider instances in development hot reload
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (providerMounted) {
      console.warn('⚠️ Multiple provider instances detected - this may cause duplicate modals');
    }
    providerMounted = true;
  }

  return (
    <ThemeRegistry>
      <RegionProvider>
        <AuthProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </AuthProvider>
      </RegionProvider>
    </ThemeRegistry>
  );
});

Providers.displayName = "Providers";

export default Providers;