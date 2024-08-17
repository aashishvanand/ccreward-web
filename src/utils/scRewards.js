import { mccList } from '../data/mccData';

export const scCardRewards = {
  "Platinum Rewards": {
    cardType: "points",
    defaultRate: 1 / 150, // 1 reward point per INR 150 spent on other categories
    mccRates: {
      "5812": 5 / 150, // 5x reward points for fine-dining outlets
      "5813": 5 / 150, // Assuming this MCC also covers fine-dining
      "5814": 5 / 150, // Assuming this MCC also covers fine-dining
      "5541": 5 / 150, // 5x reward points for fuel
      "5542": 5 / 150  // Including both common fuel MCCs
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = scCardRewards["Platinum Rewards"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && scCardRewards["Platinum Rewards"].mccRates[mcc]) {
        rate = scCardRewards["Platinum Rewards"].mccRates[mcc];
        rateType = "mcc-specific";
        category = (mcc === "5541" || mcc === "5542") ? "Fuel" : "Fine Dining";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Ultimate": {
    cardType: "hybrid",
    defaultRate: 5 / 150, // 5 reward points per INR 150 spent
    mccRates: {
      "5309": 0.05 // 5% cashback on duty-free spends
    },
    pointValue: 1, // 1 Reward point equals to INR 1
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = scCardRewards.Ultimate.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc === "5309") {
        rate = scCardRewards.Ultimate.mccRates["5309"];
        rateType = "cashback";
        category = "Duty-Free";
      }

      const points = Math.floor(amount * rate);
      const cashback = mcc === "5309" ? amount * rate : 0;

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Smart": {
    cardType: "cashback",
    defaultRate: 0.01, // 1% cashback on other spends
    onlineRate: 0.02, // 2% cashback on online spends
    mccRates: {
      "5541": 0, // Fuel transactions are not eligible for cashback
      "5542": 0
    },
    cashbackCaps: {
      online: 1000, // Max INR 1000 per month on online spends
      other: 500   // Max INR 500 per month on other spends
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = scCardRewards.Smart.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isOnlineSpend) {
        rate = scCardRewards.Smart.onlineRate;
        category = "Online Spend";
        rateType = "online";
      } else if (mcc && scCardRewards.Smart.mccRates[mcc] !== undefined) {
        rate = scCardRewards.Smart.mccRates[mcc];
        rateType = "excluded";
        category = "Excluded Category";
      }

      const cashback = amount * rate;
      return { cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an online transaction?',
        name: 'isOnlineSpend',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isOnlineSpend || false,
        onChange: (value) => onChange('isOnlineSpend', value === 'true')
      }
    ]
  },
  "EaseMyTrip": {
    cardType: "points",
    defaultRate: 2 / 100, // 2x reward points for every INR 100 spent on all other category
    mccRates: {
      // 10x rewards on hotel and airline bookings
      "3000": 10 / 100, "3001": 10 / 100, "3002": 10 / 100, "3003": 10 / 100, "3004": 10 / 100,
      // ... (include all airline MCCs)
      "3501": 10 / 100, "3502": 10 / 100, "3503": 10 / 100, "3504": 10 / 100, "3505": 10 / 100,
      // ... (include all hotel MCCs)
      "4511": 10 / 100 // Airlines
    },
    pointValue: 0.25, // 1 reward point = INR 0.25
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = scCardRewards.EaseMyTrip.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && scCardRewards.EaseMyTrip.mccRates[mcc]) {
        rate = scCardRewards.EaseMyTrip.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Travel Booking";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Rewards": {
    cardType: "points",
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
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = scCardRewards.Rewards.defaultRate;
      let category = "Retail Spend";
      let rateType = "default";

      if (mcc && scCardRewards.Rewards.mccRates[mcc] !== undefined) {
        rate = scCardRewards.Rewards.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Government/Insurance Spend";
      }

      if (additionalParams.monthlySpend && additionalParams.monthlySpend > scCardRewards.Rewards.acceleratedRewards.tier1.threshold) {
        rate = scCardRewards.Rewards.acceleratedRewards.tier1.rate;
        rateType = "accelerated";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'number',
        label: 'Total monthly spend so far',
        name: 'monthlySpend',
        value: currentInputs.monthlySpend || 0,
        onChange: (value) => onChange('monthlySpend', parseFloat(value))
      }
    ]
  }
};

export const calculateSCRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = scCardRewards[cardName];
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

  if (cardReward.cardType === "hybrid") {
    return applyHybridCapping(result, cardReward, cardName);
  } else if (cardReward.cardType === "cashback") {
    return applyCashbackCapping(result, cardReward, cardName);
  } else {
    return applyPointsCapping(result, cardReward, cardName);
  }
};

const applyHybridCapping = (result, cardReward, cardName) => {
  let { points, cashback, rate, rateType, category } = result;
  let cappedPoints = points;
  let cappedCashback = cashback;
  let appliedCap = null;

  // Apply capping logic here if needed

  const rewardText = generateHybridRewardText(cardName, cappedPoints, cappedCashback, rate, rateType, category, appliedCap);

  return {
    points: cappedPoints,
    cashback: cappedCashback,
    rewardText,
    uncappedPoints: points,
    uncappedCashback: cashback,
    cappedPoints,
    cappedCashback,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

const applyCashbackCapping = (result, cardReward, cardName) => {
  let { cashback, rate, rateType, category } = result;
  let cappedCashback = cashback;
  let appliedCap = null;

  if (cardReward.cashbackCaps) {
    const cap = rateType === "online" ? cardReward.cashbackCaps.online : cardReward.cashbackCaps.other;
    if (cappedCashback > cap) {
      cappedCashback = cap;
      appliedCap = { category, maxCashback: cap };
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

  if (cardReward.rewardsCap && rateType === "accelerated") {
    const bonusCap = cardReward.rewardsCap.bonusPoints;
    if (cappedPoints > bonusCap) {
      cappedPoints = bonusCap;
      appliedCap = { category: "Bonus Rewards", maxPoints: bonusCap };
    }
  }

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


const generateHybridRewardText = (cardName, points, cashback, rate, rateType, category, appliedCap) => {
  let rewardText = "";

  if (rateType === "cashback") {
    rewardText = `₹${cashback.toFixed(2)} Cashback`;
  } else {
    const pointValue = points * (scCardRewards[cardName].pointValue || 1);
    rewardText = `${points} Reward Points (Worth ₹${pointValue.toFixed(2)})`;
  }

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints ? appliedCap.maxPoints + ' points' : '₹' + appliedCap.maxCashback})`;
  }

  return rewardText;
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
  let rewardText = `${points} SC Reward Points`;

  if (cardName === "EaseMyTrip") {
    const pointValue = points * scCardRewards.EaseMyTrip.pointValue;
    rewardText += ` (Worth ₹${pointValue.toFixed(2)})`;
  }

  if (category !== "Other Spends" && !rewardText.includes(category)) {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points)`;
  }

  return rewardText;
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = scCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};