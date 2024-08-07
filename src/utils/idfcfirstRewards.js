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

  let points = 0;
  let rate = cardReward.defaultRate;
  let rateType = "default";
  let category = "Other Retail Spends";

  // Check for birthday rate
  if (additionalParams.isBirthday && cardReward.birthdayRate) {
    rate = cardReward.birthdayRate;
    rateType = "birthday";
    category = "Birthday Spend";
  }
  // Check for MCC-specific rate
  else if (mcc && cardReward.mccRates && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = rate === 0 ? "Excluded Category" : "Special Category";
  }
  // Check for accelerated rewards
  else if (cardReward.acceleratedRewards) {
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

  // Calculate points
  if (cardName === "Club Vistara") {
    points = Math.floor(amount / 200) * (rate * 200);
  } else {
    points = Math.floor(amount * rate);
  }

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

  // Generate reward text
  let rewardText;
  switch (cardName) {
    case "Club Vistara":
      rewardText = rate === 0 ? "No CV Points earned for this transaction" : `${cappedPoints} CV Points`;
      break;
    default:
      rewardText = rate === 0 ? "No IDFC Reward Points earned for this transaction" : `${cappedPoints} IDFC Reward Points`;
      break;
  }

  // Add category and rate information to reward text
  if (category !== "Other Retail Spends" && category !== "Excluded Category") {
    rewardText += ` (${category})`;
  }
  if (rateType === "accelerated") {
    rewardText += " (Accelerated rate applied)";
  } else if (rateType === "birthday") {
    rewardText += " (Birthday bonus applied)";
  }

  return {
    points: cappedPoints,
    rewardText,
    uncappedPoints: points,
    cappedPoints,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};