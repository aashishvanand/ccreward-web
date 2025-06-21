// src/app/providers.jsx
"use client";

import { memo } from "react";
import { ThemeRegistry } from "../core/providers/ThemeRegistry";
import { AuthProvider } from "../core/providers/AuthContext";
import { AnalyticsProvider } from "../core/providers/AnalyticsProvider";
import { RegionProvider } from "../core/providers/RegionContext";

const Providers = memo(({ children }) => {
  return (
    <ThemeRegistry>
      <RegionProvider>
        <AuthProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </AuthProvider>
      </RegionProvider>
    </ThemeRegistry>
  );
});

Providers.displayName = "Providers";

export default Providers;
