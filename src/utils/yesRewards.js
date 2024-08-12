export const yesCardRewards = {
  "Yes ACE": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "BYOC": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Elite+": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Marquee": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Premia": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Prosperity": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Reserv": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Yes Select": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Yes Private": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Welness Plus": {
    defaultRate: 1 / 100,
    mccRates: {}
  }
};

export const calculateYesRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = yesBankCardRewards[cardName];
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
  let rewardText = `${cappedPoints} YES Reward Points`;

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