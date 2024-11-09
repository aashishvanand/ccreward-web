"use client";

import { memo } from "react";
import { ThemeRegistry } from "../core/providers/ThemeRegistry";
import { AuthProvider } from "../core/providers/AuthContext";
import { AnalyticsProvider } from "../core/providers/AnalyticsProvider";

const Providers = memo(({ children }) => {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </AuthProvider>
    </ThemeRegistry>
  );
});

Providers.displayName = "Providers";

export default Providers;
