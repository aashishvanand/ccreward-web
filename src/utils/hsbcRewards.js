export const hsbcCardRewards = {
  "Live+": {
    cardType: "cashback",
    defaultRate: 1.5 / 100,
    mccRates: {
      "5411": 10 / 100, // Grocery
      "5812": 10 / 100, // Dining
      "5814": 10 / 100, // Food delivery
      "5541": 0, "5983": 0, "5172": 0, "5542": 0, "5552": 0, // Fuel
      "6540": 0, // E-wallets
      "6513": 0, "7012": 0, "7349": 0, // Property management
      "7399": 0, "7311": 0, "7372": 0, "5045": 0, "5047": 0, "5065": 0, "5072": 0, "5111": 0, "5013": 0, "2741": 0, "5137": 0, "5192": 0, "5193": 0, "5131": 0, "7361": 0, "5085": 0, "7333": 0, "5039": 0, "7379": 0, "5021": 0, "5199": 0, "5122": 0, "5099": 0, "5198": 0, "5139": 0, "7829": 0, "7395": 0, "5051": 0, "5046": 0, "5169": 0, "7375": 0, "5074": 0, "8734": 0, "5044": 0, "2842": 0, "2791": 0, // Business to Business
      "9399": 0, "8299": 0, "8220": 0, "8211": 0, "8241": 0, "9311": 0, "8244": 0, "8249": 0, "9222": 0, "9402": 0, "9211": 0, "9405": 0, "9950": 0, "9223": 0, "8351": 0, // Education and government
      "6300": 0, "5960": 0, // Insurance
      "5944": 0, "5094": 0, "5932": 0, "5937": 0, // Jewelry & Antiques
      "7995": 0, // Gambling
      "4784": 0, // Tolls and Bridge Fees
      "6011": 0, "6010": 0, "6012": 0, "6051": 0, // Financial institutions
      "6211": 0, // Security Broker Services
      "7322": 0, // Collection Agencies
      "8398": 0, "8641": 0, // Charity
      "4829": 0, // Money Transfers
      "5300": 0  // Wholesale Clubs
    },
    capping: {
      categories: {
        "Dining and Grocery": { cashback: 1000, maxSpent: 10000 }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hsbcCardRewards["Live+"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && hsbcCardRewards["Live+"].mccRates[mcc] !== undefined) {
        rate = hsbcCardRewards["Live+"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5411", "5812", "5814"].includes(mcc)) {
          category = "Dining and Grocery";
        } else {
          category = rate === 0 ? "Excluded Category" : "Category Spend";
        }
      }

      const cashback = amount * rate;

      return { cashback, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Platinum": {
    cardType: "points",
    defaultRate: 2 / 150,
    mccRates: {
      "5541": 0, // Fuel
      "5542": 0  // Fuel
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hsbcCardRewards["Platinum"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && hsbcCardRewards["Platinum"].mccRates[mcc] !== undefined) {
        rate = hsbcCardRewards["Platinum"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Premier": {
    cardType: "points",
    defaultRate: 3 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = hsbcCardRewards["Premier"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
};

export const calculateHSBCRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = hsbcCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      cashback: 0,
      rewardText: "Card not found",
      uncappedPoints: 0,
      cappedPoints: 0,
      appliedCap: null
    };
  }

  const result = cardReward.calculateRewards(amount, mcc, additionalParams);

  if (cardReward.cardType === "cashback") {
    return applyCashbackCapping(result, cardReward, cardName);
  } else {
    return applyPointsCapping(result, cardReward, cardName);
  }
};

const applyCashbackCapping = (result, cardReward, cardName) => {
  let { cashback, rate, rateType, category } = result;
  let cappedCashback = cashback;
  let appliedCap = null;

  if (cardReward.capping && cardReward.capping.categories && category) {
    const cappingCategory = cardReward.capping.categories[category];
    if (cappingCategory) {
      const { cashback: maxCashback, maxSpent } = cappingCategory;
      cappedCashback = Math.min(cashback, maxCashback);

      if (cappedCashback < cashback) {
        appliedCap = { category, maxCashback, maxSpent };
      }
    }
  }

  const rewardText = generateCashbackRewardText(cardName, cappedCashback, rate, rateType, category, appliedCap);

  return {
    cashback: cappedCashback,
    rewardText,
    uncappedCashback: cashback,
    cappedCashback,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

const applyPointsCapping = (result, cardReward, cardName) => {
  let { points, rate, rateType, category } = result;
  let cappedPoints = points;
  let appliedCap = null;

  // Apply capping logic here if needed in the future

  const rewardText = generatePointsRewardText(cardName, cappedPoints, rate, rateType, category, appliedCap);

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


const generateCashbackRewardText = (cardName, cashback, rate, rateType, category, appliedCap) => {
  let rewardText = `₹${cashback.toFixed(2)} Cashback`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ₹${appliedCap.maxCashback})`;
  }

  return rewardText;
};

const generatePointsRewardText = (cardName, points, rate, rateType, category, appliedCap) => {
  let rewardText = `${points} HSBC Reward Points`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points)`;
  }

  return rewardText;
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = hsbcCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};
