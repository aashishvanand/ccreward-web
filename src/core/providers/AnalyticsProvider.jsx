"use client";

import { useRef, useEffect } from "react";
import Script from "next/script";
import { getAnalytics, isSupported } from "firebase/analytics";
import { firebaseApp } from "../../../firebase";
import { initializeClarity } from '../services/clarity';

export function AnalyticsProvider({ children }) {
  const initialized = useRef(false);

  useEffect(() => {
    const initializeAnalytics = async () => {
      if (!initialized.current && typeof window !== 'undefined') {
        try {
          // Initialize Firebase Analytics
          if (await isSupported()) {
            getAnalytics(firebaseApp);
          }
          
          // Initialize Clarity
          initializeClarity();
          
          initialized.current = true;
        } catch (error) {
          console.error("Failed to initialize analytics:", error);
        }
      }
    };

    initializeAnalytics();
  }, []);

  return (
    <>
      {/* Load Firebase Analytics scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?l=dataLayer&id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="firebase-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
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