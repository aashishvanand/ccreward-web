'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { getAnalytics, isSupported } from "firebase/analytics";
import { firebaseApp } from '../../firebase';

export function AnalyticsProvider({ children }) {
  const initialized = useRef(false);

  const handleGtagLoad = () => {
    if (!initialized.current) {
      const initAnalytics = async () => {
        try {
          if (await isSupported()) {
            getAnalytics(firebaseApp);
            initialized.current = true;
          }
        } catch (error) {
          console.error('Failed to initialize Firebase Analytics:', error);
        }
      };

      initAnalytics();
    }
  };

  return (
    <>
      {/* Load Firebase Analytics scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?l=dataLayer&id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={handleGtagLoad}
      />
      <Script
        id="firebase-analytics-init"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      {children}
    </>
  );
}