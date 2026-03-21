import './globals.css'
import Script from "next/script";
import Providers from './providers'
import { baseJsonLd } from '../shared/constants/jsonLd';
import ErrorBoundary from '../shared/components/ErrorBoundary';

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
        <meta name="apple-itunes-app" content="app-id=6736835206" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />

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
