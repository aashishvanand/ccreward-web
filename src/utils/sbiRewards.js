export const sbiCardRewards = {
  "Air India Platinum": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Air India Signature": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Apollo": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Aurum": {
    defaultRate: 1 / 25,
    mccRates: {}
  },
  "BPCL": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "BPCL Octane": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Cashback": {
    defaultRate: 1 / 100,
    mccRates: {
      "5051": 0, "5094": 0, "5944": 0, "7631": 0,
      "5111": 0, "5192": 0, "5942": 0, "5943": 0, "8211": 0, "8220": 0, 
      "8241": 0, "8244": 0, "8249": 0, "8299": 0, "8351": 0,
      "4814": 0, "4900": 0, "9399": 0, "4816": 0, "4899": 0,
      "5960": 0, "6300": 0, "6381": 0,
      "5947": 0,
      "6011": 0, "6012": 0, "6051": 0,
      "4011": 0, "4112": 0
    }
  },
  "Elite": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Etihad Guest": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Etihad Guest Premier": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Lifestyle": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Lifestyle Prime": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Lifestyle Select": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Max": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Max Prime": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Max Select": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Miles": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Miles Elite": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Miles Prime": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Ola Money": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "PayTM": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "PayTM Select": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Prime": {
    defaultRate: 1 / 10,
    mccRates: {}
  },
  "Prime Advantage": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Pulse": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Reliance": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Reliance Prime": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "SBI IRCTC": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "SBI IRCTC Premier": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "SBI Vistara": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "SBI Vistara Prime": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "SimplyClick": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Simply Save": {
    defaultRate: 1 / 150,
    mccRates: {}
  },
  "Spar": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Spar Prime": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Spar Select": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Tata": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Tata Select": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Titan": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Yatra": {
    defaultRate: 1 / 100,
    mccRates: {}
  }
};

export const calculateSBIRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = sbiCardRewards[cardName];
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
  let rewardText = `${cappedPoints} SBI Reward Points`;

  // Bank-specific logic (to be customized for each bank)
  switch (cardName) {
    case "Cashback":
      if (rate === 0) {
        rewardText = "No cashback for this transaction";
      } else {
        const cashback = (cappedPoints / 100).toFixed(2);
        rewardText = `₹${cashback} Cashback`;
      }
      break;
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