export const yesCardRewards = {
  "ACE": {
    cardType: "points",
    defaultRate: 4 / 200, // 4 YES Rewardz Points on every INR 200 for Offline Shopping
    onlineRate: 8 / 200, // 8 YES Rewardz Points on every INR 200 for Online Shopping
    selectCategoriesRate: 2 / 200, // 2 YES Rewardz Points on every INR 200 on Select categories
    redemptionRate: {
      airMiles: 1 / 10 // 10 YES Rewardz Points = 1 InterMile / 1 Club Vistara Point
    },
    mccRates: {
      "5541": 0,
      "5542": 0,
      "6011": 0
    },
    capping: {
      maxPoints: 5000, // Maximum 5000 reward points per statement cycle
      period: "statement cycle"
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["ACE"].defaultRate;
      let category = "Offline Shopping";
      let rateType = "default";

      if (additionalParams.isOnline) {
        rate = yesCardRewards["ACE"].onlineRate;
        category = "Online Shopping";
        rateType = "online";
      } else if (additionalParams.isSelectCategory) {
        rate = yesCardRewards["ACE"].selectCategoriesRate;
        category = "Select Category";
        rateType = "select";
      }

      if (yesCardRewards["ACE"].mccRates[mcc] !== undefined || additionalParams.isUPI) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Online', value: 'online' },
          { label: 'Select Category', value: 'select' },
          { label: 'UPI', value: 'upi' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnline', value === 'online');
          onChange('isSelectCategory', value === 'select');
          onChange('isUPI', value === 'upi');
        },
        helperText: 'Select Categories include insurance, utilities, education fees, and rent. Please refer to your card terms for the complete list.'
      }
    ]
  },
  "BYOC": {
    cardType: "cashback",
    defaultRate: 0, // No default cashback
    cashbackRate: 0.10, // 10% cashback on selected merchants
    maxCashbackPerMerchant: 100, // Maximum of ₹100 per merchant per statement cycle
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["BYOC"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isSelectedMerchant) {
        rate = yesCardRewards["BYOC"].cashbackRate;
        category = "Selected Merchant";
        rateType = "cashback";
      }

      let cashback = amount * rate;
      if (cashback > yesCardRewards["BYOC"].maxCashbackPerMerchant) {
        cashback = yesCardRewards["BYOC"].maxCashbackPerMerchant;
      }

      return { cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a transaction with a selected merchant?',
        name: 'isSelectedMerchant',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSelectedMerchant || false,
        onChange: (value) => onChange('isSelectedMerchant', value === 'true')
      },
      {
        type: 'select',
        label: 'Select your BYOC plan',
        name: 'byocPlan',
        options: [
          { label: 'Regular', value: 'regular' },
          { label: 'Gold', value: 'gold' },
          { label: 'Platinum', value: 'platinum' }
        ],
        value: currentInputs.byocPlan || 'regular',
        onChange: (value) => onChange('byocPlan', value)
      }
    ]
  },
  "Yes First": {
    cardType: "points",
    defaultRate: 6 / 100, // 6 Reward Points per INR 100 spent
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["Yes First"].defaultRate;
      let category = "All Spends";
      let rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },

  "Yes First Exclusive": {
    cardType: "points",
    defaultRate: 12 / 100, // 12 Reward Points per INR 100 spent
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["Yes First Exclusive"].defaultRate;
      let category = "All Spends";
      let rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Elite+": {
    cardType: "points",
    defaultRate: 6 / 200, // 6 YES Rewardz Points on every INR 200 for Offline Shopping
    onlineRate: 12 / 200, // 12 YES Rewardz Points on every INR 200 for Online Shopping
    selectCategoriesRate: 4 / 200, // 4 YES Rewardz Points on every INR 200 on Select categories
    redemptionRate: {
      airMiles: 1 / 10 // 10 YES Rewardz Points = 1 InterMile / 1 Club Vistara Point
    },
    mccRates: {
      "5541": 0,
      "5542": 0,
      "6011": 0
    },
    capping: {
      maxPoints: 12000, // Maximum 12000 reward points per statement cycle
      period: "statement cycle"
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["Elite+"].defaultRate;
      let category = "Offline Shopping";
      let rateType = "default";

      if (additionalParams.isOnline) {
        rate = yesCardRewards["Elite+"].onlineRate;
        category = "Online Shopping";
        rateType = "online";
      } else if (additionalParams.isSelectCategory) {
        rate = yesCardRewards["Elite+"].selectCategoriesRate;
        category = "Select Category";
        rateType = "select";
      }

      if (yesCardRewards["Elite+"].mccRates[mcc] !== undefined) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Online', value: 'online' },
          { label: 'Select Category', value: 'select' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnline', value === 'online');
          onChange('isSelectCategory', value === 'select');
        },
        helperText: 'Select Categories typically include insurance, utilities, and education fees. Check your card terms for the full list of eligible categories.'
      }
    ]
  },
  "Marquee": {
    cardType: "points",
    defaultRate: 18 / 200, // 18 YES Rewardz Points on every INR 200 for Offline Shopping
    onlineRate: 36 / 200, // 36 YES Rewardz Points on every INR 200 for Online Shopping
    selectCategoriesRate: 10 / 200, // 10 YES Rewardz Points on every INR 200 on Select categories
    redemptionRate: {
      airMiles: 1 / 4 // 4 YES Rewardz Points = 1 InterMile / 1 Club Vistara Point
    },
    mccRates: {
      "6513": 0,
      "6540": 0,
      "5541": 0,
      "5542": 0,
      "6011": 0
    },
    capping: {
      maxPoints: 100000, // Maximum 1L YES Rewardz Points per statement cycle
      period: "statement cycle"
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["Marquee"].defaultRate;
      let category = "Offline Shopping";
      let rateType = "default";

      if (additionalParams.isOnline) {
        rate = yesCardRewards["Marquee"].onlineRate;
        category = "Online Shopping";
        rateType = "online";
      } else if (additionalParams.isSelectCategory) {
        rate = yesCardRewards["Marquee"].selectCategoriesRate;
        category = "Select Category";
        rateType = "select";
      }

      if (yesCardRewards["Marquee"].mccRates[mcc] !== undefined) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Online', value: 'online' },
          { label: 'Select Category', value: 'select' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnline', value === 'online');
          onChange('isSelectCategory', value === 'select');
        },
        helperText: 'Select Categories typically include insurance, utilities, and education fees. Check your card terms for the full list of eligible categories.'
      }
    ]
  },
  "Prosperity": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point per INR 100 spent
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["Prosperity"].defaultRate;
      let category = "All Spends";
      let rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Reserv": {
    cardType: "points",
    defaultRate: 12 / 200, // 12 YES Rewardz Points on every INR 200 for Offline Shopping
    onlineRate: 24 / 200, // 24 YES Rewardz Points on every INR 200 for Online Shopping
    selectCategoriesRate: 6 / 200, // 6 YES Rewardz Points on every INR 200 on Select categories
    redemptionRate: {
      airMiles: 1 / 10 // 10 YES Rewardz Points = 1 InterMile / 1 Club Vistara Point
    },
    mccRates: {
      "5541": 0,
      "5542": 0,
      "6011": 0
    },
    capping: {
      maxPoints: 36000, // Maximum 36000 reward points per statement cycle
      period: "statement cycle"
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["Reserv"].defaultRate;
      let category = "Offline Shopping";
      let rateType = "default";

      if (additionalParams.isOnline) {
        rate = yesCardRewards["Reserv"].onlineRate;
        category = "Online Shopping";
        rateType = "online";
      } else if (additionalParams.isSelectCategory) {
        rate = yesCardRewards["Reserv"].selectCategoriesRate;
        category = "Select Category";
        rateType = "select";
      }

      if (yesCardRewards["Reserv"].mccRates[mcc] !== undefined) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Online', value: 'online' },
          { label: 'Select Category', value: 'select' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnline', value === 'online');
          onChange('isSelectCategory', value === 'select');
        },
        helperText: 'Select Categories typically include insurance, utilities, and education fees. Check your card terms for the full list of eligible categories.'
      }
    ]
  },
  "Select": {
    cardType: "points",
    defaultRate: 4 / 200, // 4 YES Rewardz Points on every INR 200 for Offline Shopping
    onlineRate: 8 / 200, // 8 YES Rewardz Points on every INR 200 for Online Shopping
    selectCategoriesRate: 2 / 200, // 2 YES Rewardz Points on every INR 200 on Select categories
    redemptionRate: {
      airMiles: 1 / 10 // 10 YES Rewardz Points = 1 InterMile / 1 Club Vistara Point
    },
    mccRates: {
      "5541": 0,
      "5542": 0,
      "6011": 0
    },
    capping: {
      maxPoints: 5000, // Maximum 5000 reward points per statement cycle
      period: "statement cycle"
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["Select"].defaultRate;
      let category = "Offline Shopping";
      let rateType = "default";

      if (additionalParams.isOnline) {
        rate = yesCardRewards["Select"].onlineRate;
        category = "Online Shopping";
        rateType = "online";
      } else if (additionalParams.isSelectCategory) {
        rate = yesCardRewards["Select"].selectCategoriesRate;
        category = "Select Category";
        rateType = "select";
      }

      if (yesCardRewards["Select"].mccRates[mcc] !== undefined) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Online', value: 'online' },
          { label: 'Select Category', value: 'select' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnline', value === 'online');
          onChange('isSelectCategory', value === 'select');
        },
        helperText: 'Select Categories typically include insurance, utilities, and education fees. Check your card terms for the full list of eligible categories.'
      }
    ]
  },
  "Wellness Plus": {
    cardType: "points",
    defaultRate: 4 / 200, // 4 Reward Points on spending INR 200 on other categories
    chemistRate: 20 / 200, // 20 Reward Points on every INR 200 spent on Chemists/Pharmaceutical stores
    redemptionRate: {
      airMiles: 1 / 10 // 10 Reward Points = 1 InterMile / 1 Club Vistara Point
    },
    mccRates: {
      "6513": 0,
      "6540": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["Wellness Plus"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isChemist) {
        rate = yesCardRewards["Wellness Plus"].chemistRate;
        category = "Chemists/Pharmaceutical";
        rateType = "chemist";
      }

      if (yesCardRewards["Wellness Plus"].mccRates[mcc] !== undefined) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a transaction at a Chemist/Pharmaceutical store?',
        name: 'isChemist',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isChemist || false,
        onChange: (value) => onChange('isChemist', value === 'true')
      }
    ]
  },

};

export const calculateYESRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = yesCardRewards[cardName];
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


export const applyCashbackCapping = (result, cardReward, cardName) => {
  let { cashback, rate, rateType, category } = result;
  let cappedCashback = cashback;
  let appliedCap = null;

  if (cardReward.maxCashbackPerMerchant && cashback > cardReward.maxCashbackPerMerchant) {
    cappedCashback = cardReward.maxCashbackPerMerchant;
    appliedCap = { category: "Per Merchant", maxCashback: cardReward.maxCashbackPerMerchant };
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

export const applyPointsCapping = (result, cardReward, cardName) => {
  let { points, rate, rateType, category } = result;
  let cappedPoints = points;
  let appliedCap = null;

  if (cardReward.capping && cardReward.capping.maxPoints) {
    cappedPoints = Math.min(points, cardReward.capping.maxPoints);
    if (cappedPoints < points) {
      appliedCap = {
        category: "Total Points",
        maxPoints: cardReward.capping.maxPoints,
        period: cardReward.capping.period
      };
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

export const generateCashbackRewardText = (cardName, cashback, rate, rateType, category, appliedCap) => {
  let rewardText = `₹${cashback.toFixed(2)} Cashback`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ₹${appliedCap.maxCashback} per merchant)`;
  }

  return rewardText;
};

export const generatePointsRewardText = (cardName, points, rate, rateType, category, appliedCap) => {
  let rewardText = `${points} YES Rewardz Points`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points per ${appliedCap.period})`;
  }

  return rewardText;
};

export const getYESCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = yesCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};