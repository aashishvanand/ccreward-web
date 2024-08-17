export const oneCardRewards = {
  "One Card": {
    cardType: "points",
    defaultRate: 1 / 50, // 1 point for every Rs. 50 spent
    oneCard: true,
    topCategoryRate: 5 / 50, // 5 points for every Rs. 50 spent in top categories
    mccRates: {
      // Excluded categories
      "5541": 0, // Fuel
      "5542": 0, // Fuel
      "5983": 0, // Fuel
      // Add any other excluded MCCs for transfers here
    },
    redemptionRate: 0.01, // 1 point = ₹0.01
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = oneCardRewards["One Card"].defaultRate;
      let rateType = "default";
      let category = "Other Spends";

      // Check if it's a top category spend
      if (additionalParams.isTopCategorySpend) {
        rate = oneCardRewards["One Card"].topCategoryRate;
        rateType = "top-category";
        category = "Top Category Spend";
      }

      // Check for excluded categories
      if (mcc && oneCardRewards["One Card"].mccRates[mcc] !== undefined) {
        rate = oneCardRewards["One Card"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      // Calculate points with fractional precision
      let points = amount * rate;

      // Round to 2 decimal places for display
      points = Math.round(points * 100) / 100;

      const cashbackValue = points * oneCardRewards["One Card"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a top category spend?',
        name: 'isTopCategorySpend',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTopCategorySpend || false,
        onChange: (value) => onChange('isTopCategorySpend', value === 'true')
      }
    ]
  }
};

export const calculateOneCardRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = oneCardRewards[cardName];
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
  // This function is not currently used for OneCard, but we'll include it for future use
  let { cashback, rate, rateType, category } = result;
  let cappedCashback = cashback;
  let appliedCap = null;

  // Apply capping logic here if needed in the future

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
  let { points, rate, rateType, category, cashbackValue } = result;
  let cappedPoints = points;
  let appliedCap = null;

  // OneCard doesn't currently have capping, but we can add logic here if needed in the future

  const rewardText = generatePointsRewardText(cardName, cappedPoints, rate, rateType, category, appliedCap, cashbackValue);

  return {
    points: cappedPoints,
    rewardText,
    uncappedPoints: points,
    cappedPoints,
    appliedCap,
    rateUsed: rate,
    rateType,
    category,
    cashbackValue
  };
};

const generateCashbackRewardText = (cardName, cashback, rate, rateType, category, appliedCap) => {
  // This function is not currently used for OneCard, but we'll include it for future use
  let rewardText = rate === 0 ? "No cashback for this transaction" : `₹${cashback.toFixed(2)} Cashback`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ₹${appliedCap.maxCashback})`;
  }

  return rewardText;
};

const generatePointsRewardText = (cardName, points, rate, rateType, category, appliedCap, cashbackValue) => {
  let rewardText = rate === 0 ? "No OneCard Reward Points for this transaction" : `${points.toFixed(2)} OneCard Reward Points`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  rewardText += ` (Approx. value: ₹${cashbackValue.toFixed(2)})`;

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points)`;
  }

  return rewardText;
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = oneCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};