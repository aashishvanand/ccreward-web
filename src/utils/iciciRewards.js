import { mccList } from '../data/mccData';

export const iciciCardRewards = {
  "AmazonPay": {
    defaultRate: 1 / 100,
    mccRates: {
      "5399": 3 / 100,
      "5735": 2 / 100
    },
    amazonPrimeRate: {
      "5399": 5 / 100
    }
  },
  "Coral": {
    defaultRate: 2 / 50,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    }
  },
  "Emeralde Private": {
    defaultRate: 6 / 200,
    mccRates: {
      "6513": 0,
      "5541": 0
    },
    capping: {
      categories: {
        "Insurance": { points: 5000, maxSpent: 166666.67 },
        "Grocery": { points: 1000, maxSpent: 33333.33 },
        "Utilities": { points: 1000, maxSpent: 33333.33 },
        "Education": { points: 1000, maxSpent: 33333.33 }
      }
    }
  },
  "Emeralde": {
    defaultRate: 4 / 100,
    mccRates: {
      "5541": 1 / 100,
      "4900": 1 / 100
    }
  },
  "Rubyx": {
    defaultRate: 2 / 100,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    },
    internationalRate: 4 / 100
  },
  "Sapphiro": {
    defaultRate: 2 / 100,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    },
    internationalRate: 4 / 100
  },
  "HPCL Super Saver": {
    defaultRate: 2 / 100, // 2 ICICI Bank Reward Points per INR 100 spent on non-fuel, utility, and departmental store purchases
    mccRates: {
      "5541": 4 / 100, // Fuel Spends
      "4900": 5 / 100, // Utility
      "5311": 5 / 100  // Grocery & Departmental store
    },
    capping: {
      categories: {
        "Fuel Spends & HP Pay": { points: 200 / 0.05, maxSpent: 200 }, // Capped at Rs. 200 per month
        "Utility, Grocery & Departmental Store": { points: 400, maxSpent: 100 / 0.05 }, // Capped at 400 points (equivalent to Rs. 100) per month
        "HP Pay Fuel Spends": { points: 1.5 / 100 } // Additional 1.5% as points
      }
    },
  },
  "HPCL Coral": {
    defaultRate: 2 / 100,
    mccRates: {
      "5541": 0
    }
  },
  "Mine": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "MakeMyTrip Signature": {
    defaultRate: 1.25 / 200,
    mccRates: {
      "7011": 4 / 200,
      "4511": 2 / 200
    }
  },
  "Manchester United Platinum": {
    defaultRate: 3 / 100,
    mccRates: {}
  },
  "Manchester United Signature": {
    defaultRate: 5 / 100,
    mccRates: {}
  },
  "Platinum": {
    defaultRate: 2 / 100,
    mccRates: {}
  },
  "MMT": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "MMT Black": {
    defaultRate: 1 / 100,
    mccRates: {}
  }
};

export const calculateICICIRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = iciciCardRewards[cardName];
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

  const mccName = mcc ? mccList.find(item => item.mcc === mcc)?.name.toLowerCase() : '';
  const isAmazonTransaction = mccName.includes('amazon');

  switch (cardName) {
    case "AmazonPay":
      result = calculateAmazonPayRewards(cardReward, amount, mcc, { ...additionalParams, isAmazonTransaction });
      break;
    case "HPCL Super Saver":
      result = calculateHPCLSuperSaverRewards(cardReward, amount, mcc, additionalParams);
      break;
    case "Emeralde Private":
      result = calculateEmeraldePrivateRewards(cardReward, amount, mcc, additionalParams);
      break;
    case "Rubyx":
    case "Sapphiro":
      result = calculateInternationalRewards(cardReward, amount, mcc, additionalParams);
      break;
    default:
      result = calculateDefaultRewards(cardReward, amount, mcc, additionalParams);
  }

  return applyCapping(result, cardReward, cardName);
};

const calculateAmazonPayRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (additionalParams.isAmazonTransaction) {
    if (additionalParams.isPrimeMember && cardReward.amazonPrimeRate) {
      rate = cardReward.amazonPrimeRate[mcc] || cardReward.amazonPrimeRate["default"] || cardReward.defaultRate;
      category = "Amazon Prime Purchase";
      rateType = "amazon-prime";
    } else if (cardReward.mccRates) {
      rate = cardReward.mccRates[mcc] || cardReward.mccRates["default"] || cardReward.defaultRate;
      category = "Amazon Purchase";
      rateType = "amazon";
    }
  } else if (cardReward.mccRates && cardReward.mccRates[mcc]) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = "Category Spend";
  }

  const points = Math.floor(amount * rate);
  const cashback = points / 100;

  return { points, cashback, rate, rateType, category };
};

const calculateHPCLSuperSaverRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (mcc && cardReward.mccRates[mcc]) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = mcc === "5541" ? "Fuel Spends" : (mcc === "4900" ? "Utility" : "Grocery & Departmental Store");
  }

  if (additionalParams.isHPPayFuelSpend) {
    rate = cardReward.capping.categories["HP Pay Fuel Spends"].points;
    category = "HP Pay Fuel Spends";
    rateType = "hp-pay";
  }

  const points = Math.floor(amount * rate);

  return { points, rate, rateType, category };
};

const calculateEmeraldePrivateRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (mcc && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = rate === 0 ? "Excluded Category" : "Category Spend";
  }

  const points = Math.floor(amount * rate);

  return { points, rate, rateType, category };
};

const calculateInternationalRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (additionalParams.isInternational && cardReward.internationalRate) {
    rate = cardReward.internationalRate;
    rateType = "international";
    category = "International Transaction";
  } else if (mcc && cardReward.mccRates && cardReward.mccRates[mcc]) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = "Category Spend";
  }

  const points = Math.floor(amount * rate);

  return { points, rate, rateType, category };
};

const calculateDefaultRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (mcc && cardReward.mccRates && cardReward.mccRates[mcc]) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = "Category Spend";
  }

  const points = Math.floor(amount * rate);

  return { points, rate, rateType, category };
};

const applyCapping = (result, cardReward, cardName) => {
  let { points, cashback, rate, rateType, category } = result;
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

  const rewardText = generateRewardText(cardName, cappedPoints, rate, rateType, category, cashback, appliedCap);

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

const generateRewardText = (cardName, points, rate, rateType, category, cashback, appliedCap) => {
  let rewardText = "";

  switch (cardName) {
    case "AmazonPay":
      rewardText = `₹${cashback.toFixed(2)} Cashback`;
      if (rateType === "amazon-prime") {
        rewardText += " (Amazon Prime Purchase)";
      } else if (rateType === "amazon") {
        rewardText += " (Amazon Purchase)";
      }
      break;
    case "HPCL Super Saver":
      rewardText = `${points} ICICI Bank Reward Points`;
      if (category !== "Other Spends") {
        rewardText += ` (${category})`;
      }
      if (appliedCap) {
        rewardText += ` (Capped at ${appliedCap.maxPoints} points)`;
      }
      break;
    default:
      rewardText = `${points} ICICI Reward Points`;
      if (rateType === "international") {
        rewardText += " (International Transaction)";
      } else if (category !== "Other Spends") {
        rewardText += ` (${category})`;
      }
  }

  return rewardText;
};