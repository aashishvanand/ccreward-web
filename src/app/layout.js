import './globals.css'
import { Inter } from 'next/font/google'
import Script from "next/script";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeRegistry } from '../components/ThemeRegistry';
import { AuthProvider } from './providers/AuthContext';
import { AnalyticsProvider } from '../components/AnalyticsProvider';

const inter = Inter({ subsets: ['latin'] })

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "CCReward",
      "url": "https://ccreward.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ccreward.app/ccreward_light.png"
      }
    },
    {
      "@type": "WebSite",
      "url": "https://ccreward.app",
      "name": "CCReward",
      "description": "A comprehensive credit card rewards calculator for finding the best credit cards and maximizing rewards in India."
    },
    {
      "@type": "SoftwareApplication",
      "name": "CCReward iOS",
      "operatingSystem": "iOS",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate and maximize your credit card rewards with our comprehensive calculator. Compare cards from major banks in India.",
      "downloadUrl": "https://apps.apple.com/in/app/ccreward/id6736835206"
    },
    {
      "@type": "SoftwareApplication",
      "name": "CCReward Android",
      "operatingSystem": "Android",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate and maximize your credit card rewards with our comprehensive calculator. Compare cards from major banks in India.",
      "downloadUrl": "https://play.google.com/store/apps/details?id=app.ccreward"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is CCReward?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CCReward is a comprehensive tool designed to help users optimize their credit card rewards across multiple banks and credit cards in India. It helps calculate rewards based on specific Merchant Category Codes (MCCs) and finds the best card for various spending patterns."
          }
        },
        {
          "@type": "Question",
          "name": "Which banks are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CCReward supports major banks including AMEX, AU, Axis, BOB, Federal, Canara, DBS, HDFC, HSBC, ICICI, IDBI, IDFCFirst, IndusInd, Kotak, OneCard, SBI, SC, RBL, YesBank"
          }
        },
        {
          "@type": "Question",
          "name": "Is CCReward free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, CCReward is free for personal use. We offer both a web application and an iOS app that you can use to calculate and maximize your credit card rewards."
          }
        },
        {
          "@type": "Question",
          "name": "Does CCReward support Android?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, CCReward is available on both Android and iOS platforms, as well as a web application."
          }
        },
        {
          "@type": "Question",
          "name": "Can CCReward track my reward points?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not yet. At the moment, CCReward focuses on helping users find the best card for transactions and calculate rewards. Tracking accumulated reward points is a feature we may add in the future."
          }
        },
        {
          "@type": "Question",
          "name": "How does CCReward handle my data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CCReward values user privacy. If you use Google or Apple Sign-In, we collect only basic info like email."
          }
        },
        {
          "@type": "Question",
          "name": "How often is the data on rewards updated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We strive to keep reward data as accurate as possible and make regular updates to reflect changes in bank offers and terms."
          }
        },
        {
          "@type": "Question",
          "name": "Can CCReward suggest the best credit card to apply for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The 'Suggest Me a Card' feature is in development and will help users identify the top cards based on their spending habits and preferred rewards."
          }
        },
        {
          "@type": "Question",
          "name": "Is there an option to share my card portfolio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, there is no option to share your portfolio, but users can save and manage all their cards within the app. If there is demand, we may consider adding a secure sharing feature in the future."
          }
        },
        {
          "@type": "Question",
          "name": "Can I give feedback on the app?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, feedback is welcome! You can reach out via the web app or through social media channels to share your experience or suggestions."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a limit to how many cards I can add?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, you can add as many cards as you like in the app, allowing you to manage and track rewards for multiple credit cards in one place."
          }
        },
        {
          "@type": "Question",
          "name": "Does CCReward support international cards?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, CCReward focuses on Indian credit cards. Support for international cards may be added in future updates."
          }
        },
        {
          "@type": "Question",
          "name": "Can CCReward tell me the best card for each transaction?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the 'Find Best Card' feature helps you choose the ideal card based on transaction type, category, and amount to maximize your rewards."
          }
        },
        {
          "@type": "Question",
          "name": "Does CCReward offer reminders for payment due dates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not currently. CCReward is focused on rewards optimization and does not include payment reminders. This feature may be considered in the future."
          }
        }
      ]
    }
  ]
}

export default function RootLayout({ children }) {
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          key="jsonld"
        />

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
              <AnalyticsProvider>
                {children}
              </AnalyticsProvider>
            </AuthProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}