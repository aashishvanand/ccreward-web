import './globals.css'
import Script from "next/script";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import Providers from './providers'
import { baseJsonLd } from '../shared/constants/jsonLd';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import SkipLink from '../shared/components/layout/SkipLink';
import { serializeJsonLd } from '@/core/utils/jsonLd';

// Root metadata — shared defaults. Pages override via generateMetadata().
// IMPORTANT: Do NOT put <meta> for title, description, canonical, OG, or twitter
// in the <head> below — those are managed by Next.js Metadata API per page.
export const metadata = {
  metadataBase: new URL('https://ccreward.app'),
  title: {
    default: 'ccreward - Maximize Your Credit Card Rewards',
    template: '%s | ccreward',
  },
  description: 'ccreward helps you compare, calculate, and choose the best credit card rewards. Optimize your spending across HDFC, ICICI, SBI, AMEX, Axis and more.',
  keywords: 'ccreward, Credit Card Rewards, Reward Calculator, AMEX, Axis Bank, BOB, HDFC, HSBC, ICICI, IDFC First, IndusInd, Kotak, OneCard, RBL, SBI, Scapia, Standard Chartered, Yes Bank, AU Bank, DBS, OCBC, UOB, CITI, MCC, Merchant Category Code',
  applicationName: 'ccreward',
  openGraph: {
    type: 'website',
    siteName: 'ccreward',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      type: 'image/png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
  verification: {
    other: {
      'google-adsense-account': 'ca-pub-3745126880980552',
    },
  },
  appleWebApp: {
    title: 'ccreward',
  },
  itunes: {
    appId: '6736835206',
  },
  formatDetection: {
    telephone: false,
  },
};

function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* MUI's pre-paint script: reads the stored choice ('light' | 'dark' |
            'system' under MUI's default 'mui-mode' key) and sets the
            data-light / data-dark attribute before first paint — the same
            attribute the theme's `colorSchemeSelector: 'data'` CSS and the
            provider's runtime effect use, so dark mode applies with no
            flash. */}
        <InitColorSchemeScript defaultMode="system" attribute="data" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#ffffff" />
        {/* Pre-paint sync for what MUI doesn't manage: the dark-mode class
            used by globals.css and the theme-color meta above. Runs AFTER the
            meta tag so querySelector finds it (it used to run before and
            silently never updated the meta). Reads MUI's 'mui-mode' key, with
            the legacy 'app-theme' value as a fallback on the first load after
            the migration. Stored 'dark' wins; 'light' is light; anything else
            (including 'system') follows the OS. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('mui-mode')||localStorage.getItem('app-theme');var isDark=t==='dark'||((t!=='light')&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(isDark){document.documentElement.classList.add('dark-mode')}var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=isDark?'#0F172A':'#ffffff'}catch(e){}})()`,
          }}
        />
        {/* Preconnect to critical external origins for faster resource loading.
            identitytoolkit.googleapis.com is deliberately absent: only
            signed-in visitors ever reach it, so a preconnect on every page
            wastes a connection for everyone else. */}
        <link rel="preconnect" href="https://files.ccreward.app" />
        <link rel="preconnect" href="https://imagedelivery.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(baseJsonLd) }}
          key="jsonld"
        />
      </head>
      <body suppressHydrationWarning>
        <SkipLink />
        <ErrorBoundary componentName="RootLayout">
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>

        {/* Load analytics scripts without inline JS for CSP compliance */}
        <Script src="/scripts/clarity.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}

export default RootLayout;
