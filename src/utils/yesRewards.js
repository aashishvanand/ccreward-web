export const yesCardRewards = {
  "ACE": {
    cardType: "points",
    defaultRate: 4 / 200, // 4 YES Rewardz Points on every INR 200 for Offline Shopping
    onlineRate: 8 / 200, // 8 YES Rewardz Points on every INR 200 for Online Shopping
    selectCategoriesRate: 2 / 200, // 2 YES Rewardz Points on every INR 200 on Select categories
    redemptionRate: {
      airMiles: 0.1 // 10 YES Rewardz Points = 1 InterMile / 1 Club Vistara Point
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

      let points = Math.floor(amount * rate);
      let cappedPoints = Math.min(points, yesCardRewards["ACE"].capping.maxPoints);

      const cashbackValue = {
        airMiles: cappedPoints * yesCardRewards["ACE"].redemptionRate.airMiles
      };

      const rewardText = rateType === "excluded"
        ? `No points earned (Excluded category: ${category})`
        : `${cappedPoints} Points (${category}) - Worth ${cashbackValue.airMiles.toFixed(2)} Air Miles`;

      return { points: cappedPoints, rate, rateType, category, rewardText, cashbackValue, cardType: yesCardRewards["ACE"].cardType };
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
    mccRates: {
    },
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
      let cappedCashback = Math.min(cashback, yesCardRewards["BYOC"].maxCashbackPerMerchant);

      const rewardText = rateType === "default"
        ? "No cashback earned on this transaction"
        : `₹${cappedCashback.toFixed(2)} Cashback (${category})`;

      return { cashback: cappedCashback, rate, rateType, category, rewardText, cardType: yesCardRewards["BYOC"].cardType };
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
  "First Preferred": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 12 / 100, // 12 Reward Points per INR 100 spent
    redemptionRate: {
      airMiles: 0.10
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["First Preferred"].defaultRate;
      let category = "All Spends";
      let rateType = "default";

      const points = Math.floor(amount * rate);

      const cashbackValue = {
        airMiles: points * yesCardRewards["First Preferred"].redemptionRate.airMiles,
      };

      const rewardText = `${points} Points (${category}) - Worth ${cashbackValue.airMiles.toFixed(2)} Air Miles`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: yesCardRewards["First Preferred"].cardType };
    },
    dynamicInputs: () => []
  },
  "Elite+": {
    cardType: "points",
    defaultRate: 6 / 200, // 6 YES Rewardz Points on every INR 200 for Offline Shopping
    onlineRate: 12 / 200, // 12 YES Rewardz Points on every INR 200 for Online Shopping
    selectCategoriesRate: 4 / 200, // 4 YES Rewardz Points on every INR 200 on Select categories
    redemptionRate: {
      cashValue: 0.25 // 1 YES Rewardz Points = ₹0.25: 
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

      let points = Math.floor(amount * rate);
      let cappedPoints = Math.min(points, yesCardRewards["Elite+"].capping.maxPoints);

      const cashbackValue = {
        airMiles: cappedPoints * yesCardRewards["Elite+"].redemptionRate.airMiles,
      };

      const rewardText = rateType === "excluded"
        ? `No points earned (Excluded category: ${category})`
        : `${cappedPoints} Points (${category}) - Worth ${cashbackValue.airMiles.toFixed(2)} Air Miles`;

      return { points: cappedPoints, rate, rateType, category, rewardText, cashbackValue, cardType: yesCardRewards["Elite+"].cardType };
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
      airMiles: 0.10,
      cashValue: 0.10
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

      let points = Math.floor(amount * rate);
      let cappedPoints = Math.min(points, yesCardRewards["Marquee"].capping.maxPoints);

      const cashbackValue = {
        airMiles: cappedPoints * yesCardRewards["Marquee"].redemptionRate.airMiles,
        cashValue: cappedPoints * yesCardRewards["Marquee"].redemptionRate.cashValue,
      };

      const rewardText = rateType === "excluded"
        ? `No points earned (Excluded category: ${category})`
        : `${cappedPoints} Points (${category}) - Worth ${cashbackValue.airMiles.toFixed(2)} Air Miles or ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points: cappedPoints, rate, rateType, category, rewardText, cashbackValue, cardType: yesCardRewards["Marquee"].cardType };
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
    mccRates: {
    },
    redemptionRate: {
      cashValue: 0.25 // To be filled in later
    },
    defaultRate: 1 / 100, // 1 Reward Point per INR 100 spent
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = yesCardRewards["Prosperity"].defaultRate;
      let category = "All Spends";
      let rateType = "default";

      // Apply MCC specific rates if available
      if (mcc && yesCardRewards["Prosperity"].mccRates[mcc]) {
        rate = yesCardRewards["Prosperity"].mccRates[mcc];
        category = "MCC Specific";
        rateType = "mcc-specific";
      }

      let points = Math.floor(amount * rate);

      // Apply capping if available
      if (yesCardRewards["Prosperity"].capping) {
        // Implement capping logic here
      }

      const cashbackValue = {
        airMiles: points * yesCardRewards["Prosperity"].redemptionRate.airMiles,
        cashValue: points * yesCardRewards["Prosperity"].redemptionRate.cashValue
      };

      const rewardText = `You earned ${points} YES Rewardz Points in the ${category} category`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: yesCardRewards["Prosperity"].cardType };
    },
    dynamicInputs: () => []
  },
  "Reserv": {
    cardType: "points",
    defaultRate: 12 / 200, // 12 YES Rewardz Points on every INR 200 for Offline Shopping
    onlineRate: 24 / 200, // 24 YES Rewardz Points on every INR 200 for Online Shopping
    selectCategoriesRate: 6 / 200, // 6 YES Rewardz Points on every INR 200 on Select categories
    redemptionRate: {
      airMiles: 0.1 // 10 YES Rewardz Points = 1 InterMile / 1 Club Vistara Point
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

      let points = Math.floor(amount * rate);
      let cappedPoints = Math.min(points, yesCardRewards["Reserv"].capping.maxPoints);

      const cashbackValue = {
        airMiles: cappedPoints * yesCardRewards["Reserv"].redemptionRate.airMiles,
      };

      const rewardText = rateType === "excluded"
        ? `No points earned (Excluded category: ${category})`
        : `${cappedPoints} Points (${category}) - Worth ${cashbackValue.airMiles.toFixed(2)} Air Miles`;


      return { points: cappedPoints, rate, rateType, category, rewardText, cashbackValue, cardType: yesCardRewards["Reserv"].cardType };
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
      airMiles: 0.1 // 10 YES Rewardz Points = 1 InterMile / 1 Club Vistara Point
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

      let points = Math.floor(amount * rate);
      let cappedPoints = Math.min(points, yesCardRewards["Select"].capping.maxPoints);

      const cashbackValue = {
        airMiles: cappedPoints * yesCardRewards["Select"].redemptionRate.airMiles
      };

      const rewardText = rateType === "excluded"
        ? `No points earned (Excluded category: ${category})`
        : `${cappedPoints} Points (${category}) - Worth ${cashbackValue.airMiles.toFixed(2)} Air Miles`;


      return { points: cappedPoints, rate, rateType, category, rewardText, cashbackValue, cardType: yesCardRewards["Select"].cardType };
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
      airMiles: 0.1 // 10 Reward Points = 1 InterMile / 1 Club Vistara Point
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

      const cashbackValue = {
        airMiles: points * yesCardRewards["Wellness Plus"].redemptionRate.airMiles,
      };

      const rewardText = rateType === "excluded"
        ? `No points earned (Excluded category: ${category})`
        : `${points} Points (${category}) - Worth ${cashbackValue.airMiles.toFixed(2)} Air Miles`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: yesCardRewards["Wellness Plus"].cardType };
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
  }

};

export const calculateYESRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = yesCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      cashback: 0,
      rewardText: "Card not found",
      category: "Unknown",
      cashbackValue: 0,
      cardType: "unknown",
    };
  }

  return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = yesCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};