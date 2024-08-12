export const kotakCardRewards = {
  "811": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Biz": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Indian Oil": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "IndiGo 6E Rewards": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "IndiGo 6E Rewards XL": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Kotak Infinite": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "League": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Metro": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "MOJO": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Myntra": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Privy League Signature": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "PVR INOX": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "PVR INOX Gold": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "PVR INOX Platinum": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Royale Signature": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Urbane": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Urbane Gold": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "White": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "White Reserve": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Zen": {
    defaultRate: 1 / 100,
    mccRates: {}
  }
};


export const calculateKotakRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = kotakCardRewards[cardName];
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
  let rewardText = `${cappedPoints} Kotak Reward Points`;

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