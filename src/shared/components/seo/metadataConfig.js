export const pageMetadata = {
  faq: {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about ccreward, supported banks, features, and usage.",
    jsonLd: [{
      "@type": "FAQPage",
      "mainEntity": [] // Will be populated dynamically
    }]
  },
  calculator: {
    title: "Reward Calculator - Calculate Your Credit Card Rewards",
    description: "Calculate and maximize your credit card rewards with ccreward. Compare cards from major banks in India and Singapore.",
    jsonLd: [{
      "@type": "WebApplication",
      "name": "ccreward Calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Calculate and maximize your credit card rewards with ccreward. Compare cards from major banks in India and Singapore."
    }]
  },
  myCards: {
    title: "My Credit Cards - Manage Your Card Portfolio",
    description: "Manage and organize your credit card portfolio with ccreward. Track rewards and benefits across multiple cards from different banks.",
    jsonLd: [{
      "@type": "WebApplication",
      "name": "ccreward Card Management",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Manage and track your credit card portfolio with ccreward. Compare rewards and benefits across multiple cards."
    }]
  },
  topCards: {
    title: "Top Credit Cards - Compare Best Rewards Cards",
    description: "Discover and compare the best credit cards. Find cards with the highest rewards, cashback, and benefits for your spending habits.",
    jsonLd: [{
      "@type": "CollectionPage",
      "name": "Top Credit Cards",
      "description": "Comprehensive list of best credit cards with detailed comparisons of rewards and benefits."
    }]
  },
  bestCard: {
    title: "Find Your Best Credit Card - Personalized Recommendations",
    description: "Get personalized credit card recommendations based on your spending patterns. Compare and find the best card for your needs with ccreward.",
    jsonLd: [{
      "@type": "WebApplication",
      "name": "ccreward Best Card Finder",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Personalized credit card recommendation engine that analyzes your spending patterns to suggest the best cards."
    }]
  },
  transferCalculator: {
    title: "Transfer Partner Calculator",
    description: "Calculate airline miles and hotel points conversions from your credit card rewards. Find the best transfer partners with ccreward.",
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
  defaultTitle: "ccreward - Maximize Your Credit Card Rewards",
  defaultDescription: "ccreward helps you compare, calculate, and maximize your credit card rewards.",
  defaultOgImage: "https://ccreward.app/og.png",
  keywords: "ccreward, Credit Card Rewards, Reward Calculator, AMEX, Axis Bank, BOB, HDFC, HSBC, ICICI, IDFC First, IndusInd, Kotak, OneCard, RBL, SBI, Standard Chartered, Yes Bank, AU Bank, DBS, OCBC, UOB, CITI",
  appInfo: {
    name: "ccreward",
    iosAppId: "6736835206",
    playStoreUrl: "https://play.google.com/store/apps/details?id=app.ccreward",
    iosAppUrl: "https://apps.apple.com/in/app/ccreward/id6736835206"
  }
};