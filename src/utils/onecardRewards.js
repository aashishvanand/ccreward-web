export const oneCardRewards = {
  "One Card": {
    defaultRate: 1 / 50, // 1 point for every Rs. 50 spent
    oneCard: true,
    topCategoryRate: 5 / 50, // 5 points for every Rs. 50 spent in top categories
    mccRates: {
      // Excluded categories
      "5541": 0, // Fuel
      "5542": 0, // Fuel
      "5983": 0, // Fuel
      // Add any other excluded MCCs for transfers here
    }
  }
};

export const calculateOneCardRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = oneCardRewards[cardName];
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
  let category = "Other Spends";

  // Check if it's a top category spend
  if (additionalParams.isTopCategorySpend) {
    rate = cardReward.topCategoryRate;
    rateType = "top-category";
    category = "Top Category Spend";
  }

  // Check for excluded categories
  if (mcc && cardReward.mccRates && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = rate === 0 ? "Excluded Category" : "Category Spend";
  }

  // Calculate points with fractional precision
  let points = amount * rate;
  
  // Round to 2 decimal places for display
  points = Math.round(points * 100) / 100;

  let rewardText = rate === 0 ? "No OneCard Reward Points for this transaction" : `${points} OneCard Reward Points`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  return {
    points: points,
    rewardText,
    uncappedPoints: points,
    cappedPoints: points, // OneCard doesn't seem to have capping
    appliedCap: null,
    rateUsed: rate,
    rateType
  };
};