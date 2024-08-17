export const scCardRewards = {
  "Platinum Rewards": {
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
      uncappedCashback: 0,
      cappedPoints: 0,
      cappedCashback: 0,
      appliedCap: null,
      rateUsed: 0,
      rateType: null
    };
  }

  const result = cardReward.calculateRewards(amount, mcc, additionalParams);
  return applyCapping(result, cardReward, cardName, amount);
};

const applyCapping = (result, cardReward, cardName, amount) => {
  let { points, cashback, rate, rateType, category } = result;
  let cappedPoints = points || 0;
  let cappedCashback = cashback || 0;
  let appliedCap = null;

  switch (cardName) {
    case "Smart":
      const smartCap = rateType === "online" ? cardReward.cashbackCaps.online : cardReward.cashbackCaps.other;
      if (cappedCashback > smartCap) {
        cappedCashback = smartCap;
        appliedCap = { category, maxCashback: smartCap };
      }
      break;

    case "Rewards":
      if (rateType === "accelerated") {
        const bonusCap = cardReward.rewardsCap.bonusPoints;
        const basePoints = Math.floor(amount * cardReward.defaultRate);
        const bonusPoints = cappedPoints - basePoints;
        if (bonusPoints > bonusCap) {
          cappedPoints = basePoints + bonusCap;
          appliedCap = { category: "Bonus Rewards", maxPoints: bonusCap };
        }
      }
      break;

    default:
      // For any other cards, keep the original values
      break;
  }

  const rewardText = generateRewardText(cardName, cappedPoints, cappedCashback, rate, rateType, category, appliedCap);

  return {
    points: cappedPoints,
    cashback: cappedCashback,
    rewardText,
    uncappedPoints: points || 0,
    uncappedCashback: cashback || 0,
    cappedPoints,
    cappedCashback,
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
      if (appliedCap && appliedCap.maxCashback) {
        rewardText += ` (Capped at ₹${appliedCap.maxCashback} per month)`;
      }
      break;

    case "Ultimate":
      if (rateType === "cashback") {
        rewardText = `₹${cashback.toFixed(2)} Cashback`;
      } else {
        rewardText = `${points} Reward Points (Worth ₹${points})`;
      }
      break;

    case "EaseMyTrip":
      const value = points * scCardRewards.EaseMyTrip.pointValue;
      rewardText = `${points} Reward Points (Worth ₹${value.toFixed(2)})`;
      break;

    case "Platinum Rewards":
    case "Rewards":
    default:
      rewardText = `${points} SC Reward Points`;
      break;
  }

  if (category !== "Other Spends" && !rewardText.includes(category)) {
    rewardText += ` (${category})`;
  }

  if (appliedCap && appliedCap.maxPoints && !rewardText.includes("Capped")) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points)`;
  }

  return rewardText.trim();
}

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = scCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};