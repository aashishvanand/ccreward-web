import './globals.css'
import { Inter } from 'next/font/google'
import Script from "next/script";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeRegistry } from '../components/ThemeRegistry';
import { AuthProvider } from './providers/AuthContext';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Credit Card Rewards Calculator - Maximize Your Benefits" />
        <meta property="og:description" content="Optimize your rewards across multiple banks and credit cards with our comprehensive Credit Card Rewards Calculator. Compare rewards based on specific Merchant Category Codes (MCCs) and find the best card for your spending patterns." />
        <meta property="og:url" content="https://ccrewards.aashishvanand.me/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ccrewards.aashishvanand.me/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CCReward - Maximize Your Credit Card Rewards" />
        <meta name="twitter:description" content="Compare, calculate, and choose the best credit card rewards with CCReward." />
        <meta name="twitter:image" content="https://ccrewards.aashishvanand.me/og.png" />
        <meta name="keywords" content="Credit Card Rewards, ccgeeks, Reward Calculator, Credit Card Points Calculator, AMEX, Axis Bank, BOB, HDFC, HSBC, ICICI, IDFC First, IndusInd, Kotak, OneCard, RBL, SBI, Scapia, Standard Chartered, Yes Bank, Kiwi, AU Bank, Platinum, Atlas, Diners Club, Infinia, Regalia, Swiggy, AmazonPay, Emeralde, Sapphiro, Vistara, BPCL, Cashback, Forex Card, RuPay, MCC, Merchant Category Code" />

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "ngsrwjccm4");
    `}
        </Script>
      </head>
      <body className={inter.className}>
      <AppRouterCacheProvider>
          <ThemeRegistry>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}