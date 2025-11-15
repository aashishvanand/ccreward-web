export const pageMetadata = {
  faq: {
    title: "Frequently Asked Questions - ccreward Credit Card Calculator",
    description: "Find answers to common questions about ccreward's credit card reward calculator, supported banks, features, and usage.",
    jsonLd: [{
      "@type": "FAQPage",
      "mainEntity": [] // Will be populated dynamically
    }]
  },
  calculator: {
    title: "Credit Card Reward Calculator - Calculate Your Rewards",
    description: "Calculate and maximize your credit card rewards with our comprehensive calculator. Compare cards from major banks in India.",
    jsonLd: [{
      "@type": "WebApplication",
      "name": "ccreward Calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Calculate and maximize your credit card rewards with our comprehensive calculator. Compare cards from major banks in India."
    }]
  },
  myCards: {
    title: "My Credit Cards - Manage Your Card Portfolio | ccreward",
    description: "Manage and organize your credit card portfolio. Track rewards and benefits across multiple cards from different banks.",
    jsonLd: [{
      "@type": "WebApplication",
      "name": "ccreward Card Management",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Manage and track your credit card portfolio with ccreward. Compare rewards and benefits across multiple cards."
    }]
  },
  topCards: {
    title: "Top Credit Cards in India - Compare Best Rewards Cards | ccreward",
    description: "Discover and compare the best credit cards in India. Find cards with the highest rewards, cashback, and benefits for your spending habits.",
    jsonLd: [{
      "@type": "CollectionPage",
      "name": "Top Credit Cards in India",
      "description": "Comprehensive list of best credit cards in India with detailed comparisons of rewards and benefits."
    }]
  },
  bestCard: {
    title: "Find Your Best Credit Card - Personalized Card Recommendations | ccreward",
    description: "Get personalized credit card recommendations based on your spending patterns. Compare and find the best card for your needs.",
    jsonLd: [{
      "@type": "WebApplication",
      "name": "ccreward Best Card Finder",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Personalized credit card recommendation engine that analyzes your spending patterns to suggest the best cards."
    }]
  },
  transferCalculator: {
    title: "Credit Card Transfer Partner Calculator | ccreward",
    description: "Calculate airline miles and hotel points conversions from your credit card rewards. Find the best transfer partners.",
    jsonLd: [{
      "@type": "WebApplication",
      "name": "ccreward Transfer Calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Calculate airline miles and hotel points conversions from your credit card rewards."
    }]
  }
};

// Common metadata values that can be reused
export const commonMetadata = {
  baseUrl: "https://ccreward.app",
  defaultTitle: "Credit Card Rewards Calculator - Maximize Your Benefits",
  defaultDescription: "Compare, calculate, and choose the best credit card rewards with ccreward.",
  defaultOgImage: "https://ccreward.app/og.png",
  keywords: "Credit Card Rewards, ccgeeks, Reward Calculator, Credit Card Points Calculator, AMEX, Axis Bank, BOB, HDFC, HSBC, ICICI, IDFC First, IndusInd, Kotak, OneCard, RBL, SBI, Standard Chartered, Yes Bank, AU Bank",
  appInfo: {
    name: "ccreward",
    iosAppId: "6736835206",
    playStoreUrl: "https://play.google.com/store/apps/details?id=app.ccreward",
    iosAppUrl: "https://apps.apple.com/in/app/ccreward/id6736835206"
  }
};