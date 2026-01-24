// src/app/providers.jsx - FIXED: Ensure single provider instances
"use client";

import { memo } from "react";
import dynamic from 'next/dynamic';
import { ThemeRegistry } from "../core/providers/ThemeRegistry";
import AmbientBackground from "../shared/components/layout/AmbientBackground";
import { RegionProvider } from "../core/providers/RegionContext";

// Dynamic imports to prevent server-side execution of Firebase dependencies (protobufjs eval error)
const AuthProvider = dynamic(
  () => import('../core/providers/AuthContext').then(mod => mod.AuthProvider),
  { ssr: false }
);

const AnalyticsProvider = dynamic(
  () => import('../core/providers/AnalyticsProvider').then(mod => mod.AnalyticsProvider),
  { ssr: false }
);

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
      <AmbientBackground />
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