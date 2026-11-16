// src/app/providers.jsx - FIXED: Ensure single provider instances
"use client";

import { memo } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { ThemeRegistry } from "../core/providers/ThemeRegistry";
import AmbientBackground from "../shared/components/layout/AmbientBackground";
import { RegionProvider } from "../core/providers/RegionContext";
// Rendered on the server so pages ship real HTML. Both providers only touch
// Firebase/analytics inside effects, which never run during SSR.
import { AuthProvider } from "../core/providers/AuthContext";
import { AnalyticsProvider } from "../core/providers/AnalyticsProvider";

// LazyMotion + `m` components ship only the animation features we use
// (no layout/drag), instead of the full `motion` bundle.
const Providers = memo(({ children }) => {
  return (
    <LazyMotion features={domAnimation}>
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
    </LazyMotion>
  );
});

Providers.displayName = "Providers";

export default Providers;