import './globals.css'
import PropTypes from 'prop-types';

import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import Providers from './providers'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { baseJsonLd } from '../shared/constants/jsonLd';
import ErrorBoundary from '../shared/components/ErrorBoundary';

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
});

function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      <body className={`${inter.variable} ${outfit.variable} `} suppressHydrationWarning>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ErrorBoundary componentName="RootLayout">
            <Providers>
              {children}
            </Providers>
          </ErrorBoundary>
        </AppRouterCacheProvider>

        {/* Load analytics script with proper strategy */}
        <Script id="network-monitoring" strategy="beforeInteractive">
          {`
// First Input Delay polyfill (required for FID measurement)
!function (n, e) { var t, o, i, c = [], f = { passive: !0, capture: !0 }, r = new Date, a = "pointerup", u = "pointercancel"; function p(n, c) { t || (t = c, o = n, i = new Date, w(e), s()) } function s() { o >= 0 && o < i - r && (c.forEach(function (n) { n(o, t) }), c = []) } function l(t) { if (t.cancelable) { var o = (t.timeStamp || new Date) - r; o < 0 || (t.type == a ? p(o, t) : t.type == u && (o = -1, p(o, t))) } } function w(n) { ["click", "mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (e) { n(e, l, f) }) } w(n), self.perfMetrics = self.perfMetrics || {}, self.perfMetrics.onFID = function (n) { c.push(n) } }(document, document.addEventListener);

// Network monitoring wrapper
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function () {
    // This will be set up by the analytics service
    window.networkMonitoringEnabled = true;
  });
}
`}
        </Script>

        {/* Load analytics script with proper strategy */}
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
        >
          {`
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", "ngsrwjccm4");
`}
        </Script>
      </body>
    </html>
  )
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RootLayout;