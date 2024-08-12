export const bobCardRewards = {
  "Easy": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Eterna": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "HPCL Energie": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "IRCTC BOBCard": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "BOB Premier": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "BOB Prime": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Select BOBCard": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Snapdeal": {
    defaultRate: 1 / 100,
    mccRates: {}
  }
};

export const calculateBOBRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = bobCardRewards[cardName];
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
  let rewardText = `${cappedPoints} BOB Reward Points`;

  // Bank-specific logic (to be customized for each bank)
  switch (cardName) {
    // Add more cases as needed
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