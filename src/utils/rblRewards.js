export const rblCardRewards = {
  "BankBazaar SaveMax": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "BankBazaar SaveMax Pro": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Blockbuster": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Cookies": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Fun+": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "iGlobe": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Icon": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Insigna": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "LazyPay": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "MoCash": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "MoneyTap": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "MoneyTap Black": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Monthly Treats": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Movies and More": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Paisabazaar Duet": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Paisabazaar Duet Plus": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Play": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Platinum Delight": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Platinum Maxima": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Platinum Maxima Plus": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Popcorn": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Shoprite": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Titanium Delight": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "vCard": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "World Safari": {
    defaultRate: 1 / 100,
    mccRates: {}
  }
};

export const calculateRBLRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = rblCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      rewardText: "Card not found",
      uncappedPoints: 0,
      cappedPoints: 0,
      appliedCap: null
    };
  }

  let rate = cardReward.defaultRate;
  let rateType = "default";

  // Check for international rate
  if (additionalParams.isInternational && cardReward.internationalRate) {
    rate = cardReward.internationalRate;
    rateType = "international";
  }
  // Check for MCC-specific rate
  else if (mcc && cardReward.mccRates && cardReward.mccRates[mcc]) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
  }

  let points = Math.floor(amount * rate);
  let cappedPoints = points;
  let appliedCap = null;

  // Apply category-specific capping if available
  if (cardReward.capping && cardReward.capping.categories && mcc) {
    const mccName = mcc.toLowerCase();
    const cappingCategories = cardReward.capping.categories;
    
    const matchingCategory = Object.keys(cappingCategories).find(cat => 
      mccName.includes(cat.toLowerCase())
    );

    if (matchingCategory) {
      const { points: catPoints, maxSpent: catMaxSpent } = cappingCategories[matchingCategory];
      const cappedAmount = Math.min(amount, catMaxSpent);
      cappedPoints = Math.min(points, catPoints, Math.floor(cappedAmount * rate));
      
      if (cappedPoints < points) {
        appliedCap = {
          category: matchingCategory,
          maxPoints: catPoints,
          maxSpent: catMaxSpent
        };
      }
    }
  }

  // Default reward text
  let rewardText = `${cappedPoints} RBL Reward Points`;

  // Bank-specific logic (to be customized for each bank)
  switch (cardName) {
    default:
      // Default case if no specific logic is needed
      break;
  }

  return {
    points: cappedPoints,
    rewardText,
    uncappedPoints: points,
    cappedPoints,
    appliedCap,
    rateUsed: rate,
    rateType
  };
};