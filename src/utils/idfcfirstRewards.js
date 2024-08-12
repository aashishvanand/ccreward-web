export const idfcFirstCardRewards = {
  "Classic": {
    defaultRate: 1 / 100,
    acceleratedRewards: {
      tier1: {
        rate: 3 / 100,
        threshold: 20000
      },
      tier2: {
        rate: 10 / 100,
        threshold: 200000
      }
    },
    birthdayRate: 10 / 100,
    mccRates: {}
  },
  "Club Vistara": {
    defaultRate: 6 / 200, // 6 CV Points per ₹200 for spends up to ₹1 lakh
    acceleratedRewards: {
      tier1: {
        rate: 4 / 200, // 4 CV Points per ₹200 for spends above ₹1 lakh
        threshold: 100000
      }
    },
    birthdayRate: 10 / 200,
    mccRates: {
      // Special rate MCCs (1 CV Point per ₹200)
      "5541": 1 / 200, // Fuel
      "5542": 1 / 200, // Fuel
      "6300": 1 / 200, // Insurance
      "4900": 1 / 200, // Utility
      "4814": 1 / 200, // Utility
      "4816": 1 / 200, // Utility
      "4899": 1 / 200, // Utility
      
      // Excluded categories
      "6012": 0, // Financial institutions (for EMI)
      "6011": 0, // ATM cash withdrawal
    },
  },
  "Millennia": {
    defaultRate: 1 / 100,
    acceleratedRewards: {
      tier1: {
        rate: 3 / 100,
        threshold: 20000
      },
      tier2: {
        rate: 10 / 100,
        threshold: 200000
      }
    },
    birthdayRate: 10 / 100,
    mccRates: {}
  },
  "Power": {
    defaultRate: 2 / 150, // 2 Reward points per ₹150 for other retail spends
    mccRates: {
      // Reward categories
      "5541": 21 / 150, // 21 Rewards per ₹150 spends on HPCL fuel
      "5542": 21 / 150, // Including both MCC codes for fuel
      "5411": 15 / 150, // 15 Reward points per ₹150 spends on grocery
      "4900": 15 / 150, // 15 Reward points per ₹150 spends on utility

      //Fasttag
      "4784": 15 / 150, // 15 Reward points per ₹150 spends on FASTag

      // Excluded categories
      "6300": 0, // Insurance premium payments
      "5983": 0, // Fuel dealers (for non-HPCL fuel)
      "6012": 0, // Financial institutions – merchandise, services, and debt repayments (for EMI)
      "6011": 0, // ATM cash withdrawal

      // Additional excluded MCCs (you may need to add more based on specific requirements)
      "5944": 0, // Jewelry stores (often excluded from reward programs)
      "7995": 0, // Gambling transactions
      "4829": 0, // Wire transfers
      "6050": 0, // Quasi cash transactions
      "6051": 0, // Non-financial institutions – foreign currency, money orders, travelers' cheques
      "6211": 0, // Security brokers/dealers
      "6529": 0, // Remote stored value load - financial
      "6530": 0, // Remote stored value load - merchant
      "6531": 0, // Payment service provider - money transfer for a purchase
      "6532": 0, // Payment service provider - member financial institution - payment transaction
      "6533": 0, // Payment service provider - merchant - payment transaction
      "6534": 0, // Money transfer - member financial institution
      "6535": 0, // Value-loaded card purchase/load
    },
    capping: {
      categories: {
        "Fuel": { points: 700, maxSpent: 5000 },
        "Grocery": { points: 400, maxSpent: 4000 },
        "Utility": { points: 400, maxSpent: 4000 },
        "FASTag": { points: 200, maxSpent: 1000 }
      }
    }
  },
  "Select": {
    defaultRate: 1 / 150,
    mccRates: {}
  },
  //TODO: Fix SWYP rewards
  "SYWP": {
    defaultRate: 0,
    mccRates: {
       // Excluded categories
       "6011": 0, // Cash withdrawal
       "5541": 0, // Fuel
       "5542": 0, // Fuel
    },
    acceleratedRewards: {
      tier1: {
        rate: 200 / 5000, // 200 points for 5000 spent
        threshold: 5000,
        maxPoints: 200
      },
      tier2: {
        rate: 500 / 10000, // 500 points for 10000 spent
        threshold: 10000,
        maxPoints: 500
      },
      tier3: {
        rate: 1000 / 15000, // 1000 points for 15000 spent
        threshold: 15000,
        maxPoints: 1000
      }
    },
    capping: {
      categories: {
        "RentalAndUtility": { points: 400, maxSpent: 20000 }
      }
    },
  },
  "Wealth": {
    defaultRate: 1 / 50,
    acceleratedRewards: {
      tier1: {
        rate: 3 / 100,
        threshold: 20000
      },
      tier2: {
        rate: 10 / 100,
        threshold: 200000
      }
    },
    birthdayRate: 10 / 100,
    mccRates: {
      "4814": 1 / 150, // Utility - 0.66%
      "4816": 1 / 150, // Utility - 0.66%
      "4899": 1 / 150, // Utility - 0.66%
      "4900": 1 / 150, // Utility - 0.66%
    }
  },
  "WOW": {
    defaultRate: 1 / 150,
    mccRates: {
      "4814": 1 / 150, // Utility
      "4816": 1 / 150, // Utility
      "4899": 1 / 150, // Utility
      "4900": 1 / 150, // Utility
      "6011": 0, // Cash withdrawal
      "5541": 0, // Fuel
    }
  }
};

export const calculateIDFCFirstRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = idfcFirstCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      rewardText: "Card not found",
      uncappedPoints: 0,
      cappedPoints: 0,
      appliedCap: null
    };
  }

  let result;

  switch (cardName) {
    case "Classic":
    case "Millennia":
    case "Wealth":
      result = calculateAcceleratedRewards(cardReward, amount, mcc, additionalParams);
      break;
    case "Club Vistara":
      result = calculateClubVistaraRewards(cardReward, amount, mcc, additionalParams);
      break;
    case "Power":
      result = calculatePowerRewards(cardReward, amount, mcc, additionalParams);
      break;
    case "SYWP":
      result = calculateSYWPRewards(cardReward, amount, mcc, additionalParams);
      break;
    default:
      result = calculateDefaultRewards(cardReward, amount, mcc, additionalParams);
  }

  return applyCapping(result, cardReward, cardName);
};

const calculateAcceleratedRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (additionalParams.isBirthday && cardReward.birthdayRate) {
    rate = cardReward.birthdayRate;
    rateType = "birthday";
    category = "Birthday Spend";
  } else if (cardReward.acceleratedRewards) {
    const tiers = Object.values(cardReward.acceleratedRewards).sort((a, b) => b.threshold - a.threshold);
    for (const tier of tiers) {
      if (amount > tier.threshold) {
        rate = tier.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
        break;
      }
    }
  }

  if (mcc && cardReward.mccRates && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = rate === 0 ? "Excluded Category" : "Category Spend";
  }

  const points = Math.floor(amount * rate);

  return { points, rate, rateType, category };
};

const calculateClubVistaraRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (additionalParams.isBirthday && cardReward.birthdayRate) {
    rate = cardReward.birthdayRate;
    rateType = "birthday";
    category = "Birthday Spend";
  } else if (amount > cardReward.acceleratedRewards.tier1.threshold) {
    rate = cardReward.acceleratedRewards.tier1.rate;
    rateType = "accelerated";
    category = "Accelerated Spend";
  }

  if (mcc && cardReward.mccRates && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = rate === 0 ? "Excluded Category" : "Category Spend";
  }

  const points = Math.floor(amount / 200) * (rate * 200);

  return { points, rate, rateType, category };
};

const calculatePowerRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (mcc && cardReward.mccRates && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = rate === 0 ? "Excluded Category" : "Category Spend";
    if (mcc === "5541" || mcc === "5542") category = "Fuel";
    else if (mcc === "5411") category = "Grocery";
    else if (mcc === "4900") category = "Utility";
    else if (mcc === "4784") category = "FASTag";
  }

  const points = Math.floor(amount * rate);

  return { points, rate, rateType, category };
};

const calculateSYWPRewards = (cardReward, amount, mcc, additionalParams) => {
  let points = 0;
  let rate = 0;
  let category = "Other Spends";
  let rateType = "default";

  if (mcc && cardReward.mccRates && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = rate === 0 ? "Excluded Category" : "Category Spend";
  } else {
    const tiers = Object.values(cardReward.acceleratedRewards).sort((a, b) => b.threshold - a.threshold);
    for (const tier of tiers) {
      if (amount >= tier.threshold) {
        points = Math.min(tier.maxPoints, Math.floor(amount * tier.rate));
        rate = tier.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
        break;
      }
    }
  }

  return { points, rate, rateType, category };
};

const calculateDefaultRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (mcc && cardReward.mccRates && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = rate === 0 ? "Excluded Category" : "Category Spend";
  }

  const points = Math.floor(amount * rate);

  return { points, rate, rateType, category };
};

const applyCapping = (result, cardReward, cardName) => {
  let { points, rate, rateType, category } = result;
  let cappedPoints = points;
  let appliedCap = null;

  if (cardReward.capping && cardReward.capping.categories && category) {
    const cappingCategory = cardReward.capping.categories[category];
    if (cappingCategory) {
      const { points: maxPoints, maxSpent } = cappingCategory;
      const cappedAmount = Math.min(result.amount, maxSpent);
      cappedPoints = Math.min(points, maxPoints, Math.floor(cappedAmount * rate));
      
      if (cappedPoints < points) {
        appliedCap = { category, maxPoints, maxSpent };
      }
    }
  }

  const rewardText = generateRewardText(cardName, cappedPoints, rate, rateType, category, appliedCap);

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

const generateRewardText = (cardName, points, rate, rateType, category, appliedCap) => {
  let rewardText = "";

  switch (cardName) {
    case "Club Vistara":
      rewardText = rate === 0 ? "No CV Points for this transaction" : `${points} CV Points`;
      break;
    case "SYWP":
      rewardText = `${points} SYWP Points`;
      break;
    case "Power":
      rewardText = rate === 0 ? "No IDFC First Reward Points for this transaction" : `${points} IDFC First Reward Points`;
      if (category === "Fuel" || category === "Grocery" || category === "Utility" || category === "FASTag") {
        rewardText += ` (${category})`;
      }
      break;
    default:
      rewardText = rate === 0 ? "No IDFC First Reward Points for this transaction" : `${points} IDFC First Reward Points`;
  }

  if (rateType === "birthday") {
    rewardText += " (Birthday bonus applied)";
  } else if (rateType === "accelerated") {
    rewardText += " (Accelerated rate applied)";
  }

  if (category !== "Other Spends" && !rewardText.includes(category)) {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points or ₹${appliedCap.maxSpent.toFixed(2)} spent for ${appliedCap.category})`;
  }

  return rewardText;
};