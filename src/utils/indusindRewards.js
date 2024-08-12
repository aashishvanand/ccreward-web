export const indusIndCardRewards = {
  "Avios": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Celesta": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Club Vistara Explorer": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Crest": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Duo": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "EazyDiner Platinum": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "EazyDiner Signature": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "IndusInd Platinum": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Indulge": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "InterMiles Odyssey": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "InterMiles Voyage": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Legend": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Nexxt": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Pinnacle": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Pioneer Heritage": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Pioneer Legacy": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Pioneer Private": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Platinum Aura Edge": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Platinum Select": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Samman": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Solitare": {
    defaultRate: 1 / 100,
    mccRates: {}
  }
};

export const calculateIndusIndRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = indusIndCardRewards[cardName];
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
  let rewardText = `${cappedPoints} IndusInd Reward Points`;

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