export const baseJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "ccreward",
        "url": "https://ccreward.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ccreward.app/ccreward_light.png"
        }
      },
      {
        "@type": "WebSite",
        "url": "https://ccreward.app",
        "name": "ccreward",
        "description": "ccreward helps you find the best credit cards and maximize rewards in India and Singapore."
      }
    ]
  };

// App listings; rendered on the home page only
export const appsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "ccreward iOS",
        "operatingSystem": "iOS",
        "applicationCategory": "FinanceApplication",
        "description": "ccreward helps you calculate and maximize your credit card rewards. Compare cards from major banks in India and Singapore.",
        "downloadUrl": "https://apps.apple.com/in/app/ccreward/id6736835206"
      },
      {
        "@type": "SoftwareApplication",
        "name": "ccreward Android",
        "operatingSystem": "Android",
        "applicationCategory": "FinanceApplication",
        "description": "ccreward helps you calculate and maximize your credit card rewards. Compare cards from major banks in India and Singapore.",
        "downloadUrl": "https://play.google.com/store/apps/details?id=app.ccreward"
      }
    ]
  };
