export const idbiCardRewards = {
  "Aspire Platinum": {
    defaultRate: 2 / 150,
    mccRates: {
      "5812": 2 / 150,
      "7832": 2 / 150,
      "4511": 2 / 150
    }
  },
  "Euphoria World": {
    defaultRate: 3 / 100,
    mccRates: {
      "7011": 6 / 100,
      "4511": 6 / 100,
      "4131": 6 / 100
    }
  },
  "Imperium Platinum": {
    defaultRate: 2 / 150,
    mccRates: {
      "5311": 2 / 150,
      "5812": 2 / 150,
      "4511": 2 / 150
    }
  },
  "Royale Signature": {
    defaultRate: 2 / 100,
    mccRates: {}
  },
  "Winnings": {
    defaultRate: 2 / 100,
    mccRates: {}
  }
};

export const calculateIDBIRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = idbiCardRewards[cardName];
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
  let rewardText = `${cappedPoints} IDBI Reward Points`;

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