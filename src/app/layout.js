import './globals.css'
import PropTypes from 'prop-types';
import { Inter } from 'next/font/google'
import Script from "next/script";
import Providers from './providers'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';
import { AnalyticsProvider } from '../core/providers/AnalyticsProvider';
import { baseJsonLd } from '../shared/constants/jsonLd';

const inter = Inter({ subsets: ['latin'] })

function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Credit Card Rewards Calculator - Maximize Your Benefits" />
        <meta name="description" content="Compare, calculate, and choose the best credit card rewards with CCReward." />
        <meta property="og:description" content="Compare, calculate, and choose the best credit card rewards with CCReward." />
        <meta property="og:url" content="https://ccreward.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ccreward.app/og.png" />
        <meta property="og:image:secure_url" content="https://ccreward.app/og.png" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:logo" content="your value" />
        <meta name="twitter:title" content="CCReward - Maximize Your Credit Card Rewards" />
        <meta property="twitter:domain" content="https://ccreward.app" />
        <meta property="twitter:url" content="https://ccreward.app" />
        <meta name="twitter:description" content="Compare, calculate, and choose the best credit card rewards with CCReward." />
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
        <meta name="apple-mobile-web-app-title" content="CCReward" />
        <meta name="application-name" content="CCReward" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(baseJsonLd) }}
          key="jsonld"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>

        {/* Load analytics script with proper strategy */}
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
        >
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
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