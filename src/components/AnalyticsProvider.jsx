'use client';

import { useEffect } from 'react';
import { getAnalytics } from "firebase/analytics";
import { firebaseApp } from '../../firebase';

export function AnalyticsProvider({ children }) {
  useEffect(() => {
    // Only initialize analytics on client side and in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      getAnalytics(firebaseApp);
    }
  }, []);

  return children;
}