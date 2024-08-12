export const scCardRewards = {
  "Platinum Rewards": {
    defaultRate: 1 / 150, // 1 reward point per INR 150 spent on other categories
    mccRates: {
      "5812": 5 / 150, // 5x reward points for fine-dining outlets
      "5813": 5 / 150, // Assuming this MCC also covers fine-dining
      "5814": 5 / 150, // Assuming this MCC also covers fine-dining
      "5541": 5 / 150, // 5x reward points for fuel
      "5542": 5 / 150  // Including both common fuel MCCs
    }
  },
  "Ultimate": {
    defaultRate: 5 / 150, // 5 reward points per INR 150 spent
    mccRates: {
      "5309": 0.05 // 5% cashback on duty-free spends
    },
    pointValue: 1 // 1 Reward point equals to INR 1
  },
  "Smart": {
    defaultRate: 0.01, // 1% cashback on other spends
    mccRates: {
      // Online spends (using general e-commerce MCC as an example)
      "5399": 0.02, // 2% cashback on online spends
      // Excluded categories
      "5541": 0, // Fuel transactions are not eligible for cashback
      "5542": 0
    },
    cashbackCaps: {
      online: 1000, // Max INR 1000 per month on online spends
      other: 500   // Max INR 500 per month on other spends
    }
  },
  "EaseMyTrip": {
    defaultRate: 2 / 100, // 2x reward points for every INR 100 spent on all other category
    mccRates: {
      // 10x rewards on hotel and airline bookings
      "3000": 10 / 100, "3001": 10 / 100, "3002": 10 / 100, "3003": 10 / 100, "3004": 10 / 100,
      // ... (include all airline MCCs)
      "3501": 10 / 100, "3502": 10 / 100, "3503": 10 / 100, "3504": 10 / 100, "3505": 10 / 100,
      // ... (include all hotel MCCs)
      "4511": 10 / 100 // Airlines
    },
    pointValue: 0.25 // 1 reward point = INR 0.25
  },
  "Rewards": {
    defaultRate: 4 / 150, // 4 reward points per INR 150 on all Retail spends
    mccRates: {
      "9311": 1 / 150, // 1 reward point on Government categories
      "6300": 1 / 150, // 1 reward point on Insurance categories
      "5541": 0, // Excluded Fuel category
      "5542": 0  // Excluded Fuel category
    },
    acceleratedRewards: {
      tier1: {
        rate: 8 / 150, // Additional 4 reward points
        threshold: 20000
      }
    },
    rewardsCap: {
      bonusPoints: 2000 // Max 2000 bonus reward points per statement cycle
    }
  }
};

export const calculateSCRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = scCardRewards[cardName];
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
    case "Smart":
      result = calculateSmartRewards(cardReward, amount, mcc, additionalParams);
      break;
    case "Rewards":
      result = calculateRewardsCardRewards(cardReward, amount, mcc, additionalParams);
      break;
    default:
      result = calculateDefaultRewards(cardReward, amount, mcc, additionalParams);
  }

  return applyCapping(result, cardReward, cardName);
};

const calculateSmartRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (mcc && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "online";
    category = "Online Spend";
  }

  const cashback = amount * rate;

  return { cashback, rate, rateType, category };
};

const calculateRewardsCardRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Retail Spend";
  let rateType = "default";

  if (mcc && cardReward.mccRates[mcc] !== undefined) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
    category = "Government/Insurance Spend";
  }

  if (additionalParams.monthlySpend && additionalParams.monthlySpend > cardReward.acceleratedRewards.tier1.threshold) {
    rate = cardReward.acceleratedRewards.tier1.rate;
    rateType = "accelerated";
  }

  const points = Math.floor(amount * rate);

  return { points, rate, rateType, category };
};

const calculateDefaultRewards = (cardReward, amount, mcc, additionalParams) => {
  let rate = cardReward.defaultRate;
  let category = "Other Spends";
  let rateType = "default";

  if (mcc && cardReward.mccRates && cardReward.mccRates[mcc] !== undefined) {
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

  if (cardName === "Smart") {
    const cap = rateType === "online" ? cardReward.cashbackCaps.online : cardReward.cashbackCaps.other;
    if (cashback > cap) {
      cashback = cap;
      appliedCap = { category, maxCashback: cap };
    }
  } else if (cardName === "Rewards" && rateType === "accelerated") {
    const bonusCap = cardReward.rewardsCap.bonusPoints;
    if (points > bonusCap) {
      cappedPoints = bonusCap;
      appliedCap = { category: "Bonus Rewards", maxPoints: bonusCap };
    }
  }

  const rewardText = generateRewardText(cardName, cappedPoints, cashback, rate, rateType, category, appliedCap);

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

const generateRewardText = (cardName, points, cashback, rate, rateType, category, appliedCap) => {
  let rewardText = "";

  switch (cardName) {
    case "Smart":
      rewardText = `₹${cashback.toFixed(2)} Cashback`;
      if (appliedCap) {
        rewardText += ` (Capped at ₹${appliedCap.maxCashback} per month)`;
      }
      break;
    case "Ultimate":
      rewardText = `${points} Reward Points (Worth ₹${points})`;
      break;
    case "EaseMyTrip":
      const value = points * 0.25;
      rewardText = `${points} Reward Points (Worth ₹${value.toFixed(2)})`;
      break;
    default:
      rewardText = `${points} SC Reward Points`;
  }

  if (category !== "Other Spends" && !rewardText.includes(category)) {
    rewardText += ` (${category})`;
  }

  return rewardText;
};