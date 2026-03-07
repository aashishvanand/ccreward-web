import './globals.css'
import Script from "next/script";
import Providers from './providers'
import { baseJsonLd } from '../shared/constants/jsonLd';
import ErrorBoundary from '../shared/components/ErrorBoundary';

function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme FOUC - must run before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('app-theme');if(t==='dark'||((!t)&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark-mode')}}catch(e){}})()`,
          }}
        />
        {/* Preconnect to critical external origins for faster resource loading */}
        <link rel="preconnect" href="https://files.ccreward.app" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <meta property="og:title" content="Credit Card Rewards Calculator - Maximize Your Benefits" />
        <meta name="description" content="Compare, calculate, and choose the best credit card rewards with ccreward." />
        <meta property="og:description" content="Compare, calculate, and choose the best credit card rewards with ccreward." />
        <meta property="og:url" content="https://ccreward.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ccreward.app/og.png" />
        <meta property="og:image:secure_url" content="https://ccreward.app/og.png" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:logo" content="your value" />
        <meta name="twitter:title" content="ccreward - Maximize Your Credit Card Rewards" />
        <meta property="twitter:domain" content="https://ccreward.app" />
        <meta property="twitter:url" content="https://ccreward.app" />
        <meta name="twitter:description" content="Compare, calculate, and choose the best credit card rewards with ccreward." />
        <meta name="twitter:image" content="https://ccreward.app/og.png" />
        <meta name="keywords" content="Credit Card Rewards, ccgeeks, Reward Calculator, Credit Card Points Calculator, AMEX, Axis Bank, BOB, HDFC, HSBC, ICICI, IDFC First, IndusInd, Kotak, OneCard, RBL, SBI, Scapia, Standard Chartered, Yes Bank, Kiwi, AU Bank, Platinum, Atlas, Diners Club, Infinia, Regalia, Swiggy, AmazonPay, Emeralde, Sapphiro, Vistara, BPCL, Cashback, Forex Card, RuPay, MCC, Merchant Category Code" />
        <meta name="google-adsense-account" content="ca-pub-3745126880980552" />
        <meta name="apple-itunes-app" content="app-id=6736835206" />

        <link rel="canonical" href="https://ccreward.app" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="ccreward" />
        <meta name="application-name" content="ccreward" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(baseJsonLd) }}
          key="jsonld"
        />
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary componentName="RootLayout">
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>

        {/* Load analytics scripts without inline JS for CSP compliance */}
        <Script src="/scripts/network-monitoring.js" strategy="afterInteractive" />
        <Script src="/scripts/clarity.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}

export default RootLayout;
