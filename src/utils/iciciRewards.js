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
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards.AmazonPay.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      const isAmazonTransaction = mcc ? mccList.find(item => item.mcc === mcc)?.name.toLowerCase().includes('amazon') : false;

      if (isAmazonTransaction) {
        if (additionalParams.isPrimeMember && iciciCardRewards.AmazonPay.amazonPrimeRate) {
          rate = iciciCardRewards.AmazonPay.amazonPrimeRate[mcc] || iciciCardRewards.AmazonPay.amazonPrimeRate["default"] || iciciCardRewards.AmazonPay.defaultRate;
          category = "Amazon Prime Purchase";
          rateType = "amazon-prime";
        } else if (iciciCardRewards.AmazonPay.mccRates) {
          rate = iciciCardRewards.AmazonPay.mccRates[mcc] || iciciCardRewards.AmazonPay.mccRates["default"] || iciciCardRewards.AmazonPay.defaultRate;
          category = "Amazon Purchase";
          rateType = "amazon";
        }
      } else if (iciciCardRewards.AmazonPay.mccRates && iciciCardRewards.AmazonPay.mccRates[mcc]) {
        rate = iciciCardRewards.AmazonPay.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Category Spend";
      }

      const points = Math.floor(amount * rate);
      const cashback = points / 100;

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
  const isAmazonMcc = selectedMcc && mccList.find(item => item.mcc === selectedMcc)?.name.toLowerCase().includes('amazon');
  
  if (isAmazonMcc) {
        return [
          {
            type: 'radio',
            label: 'Are you an Amazon Prime member?',
            name: 'isPrimeMember',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isPrimeMember || false,
            onChange: (value) => onChange('isPrimeMember', value === 'true')
          }
        ];
      }
      return [];
    }
  },
  
  "Coral": {
    defaultRate: 2 / 50,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards.Coral.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && iciciCardRewards.Coral.mccRates[mcc]) {
        rate = iciciCardRewards.Coral.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Category Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
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
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards["Emeralde Private"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && iciciCardRewards["Emeralde Private"].mccRates[mcc] !== undefined) {
        rate = iciciCardRewards["Emeralde Private"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },

  "Emeralde": {
    defaultRate: 4 / 100,
    mccRates: {
      "5541": 1 / 100,
      "4900": 1 / 100
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards.Emeralde.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && iciciCardRewards.Emeralde.mccRates[mcc]) {
        rate = iciciCardRewards.Emeralde.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Category Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },

  "Rubyx": {
    defaultRate: 2 / 100,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    },
    internationalRate: 4 / 100,
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards.Rubyx.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isInternational) {
        rate = iciciCardRewards.Rubyx.internationalRate;
        rateType = "international";
        category = "International Transaction";
      } else if (mcc && iciciCardRewards.Rubyx.mccRates[mcc]) {
        rate = iciciCardRewards.Rubyx.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Category Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an international transaction?',
        name: 'isInternational',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isInternational || false,
        onChange: (value) => onChange('isInternational', value === 'true')
      }
    ]
  },

  "Sapphiro": {
  defaultRate: 2 / 100,
  mccRates: {
    "4900": 1 / 100,
    "6300": 1 / 100
  },
  internationalRate: 4 / 100,
  calculateRewards: (amount, mcc, additionalParams) => {
    let rate = iciciCardRewards.Sapphiro.defaultRate;
    let category = "Other Spends";
    let rateType = "default";

    if (additionalParams.isInternational) {
      rate = iciciCardRewards.Sapphiro.internationalRate;
      rateType = "international";
      category = "International Transaction";
    } else if (mcc && iciciCardRewards.Sapphiro.mccRates[mcc]) {
      rate = iciciCardRewards.Sapphiro.mccRates[mcc];
      rateType = "mcc-specific";
      category = "Category Spend";
    }

    const points = Math.floor(amount * rate);

    return { points, rate, rateType, category };
  },
  dynamicInputs: (currentInputs, onChange) => [
    {
      type: 'radio',
      label: 'Is this an international transaction?',
      name: 'isInternational',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ],
      value: currentInputs.isInternational || false,
      onChange: (value) => onChange('isInternational', value === 'true')
    }
  ]
},

  "HPCL Super Saver": {
    defaultRate: 2 / 100,
    mccRates: {
      "5541": 4 / 100,
      "4900": 5 / 100,
      "5311": 5 / 100
    },
    capping: {
      categories: {
        "Fuel Spends & HP Pay": { points: 200 / 0.05, maxSpent: 200 },
        "Utility, Grocery & Departmental Store": { points: 400, maxSpent: 100 / 0.05 },
        "HP Pay Fuel Spends": { points: 1.5 / 100 }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards["HPCL Super Saver"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && iciciCardRewards["HPCL Super Saver"].mccRates[mcc]) {
        rate = iciciCardRewards["HPCL Super Saver"].mccRates[mcc];
        rateType = "mcc-specific";
        category = mcc === "5541" ? "Fuel Spends" : (mcc === "4900" ? "Utility" : "Grocery & Departmental Store");
      }

      if (additionalParams.isHPPayFuelSpend) {
        rate = iciciCardRewards["HPCL Super Saver"].capping.categories["HP Pay Fuel Spends"].points;
        category = "HP Pay Fuel Spends";
        rateType = "hp-pay";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const isFuelMcc = selectedMcc ? mccList.find(item => item.mcc === selectedMcc)?.name.toLowerCase().includes('fuel') : false;
      
      if (isFuelMcc) {
        return [
          {
            type: 'radio',
            label: 'Is this an HP Pay fuel spend?',
            name: 'isHPPayFuelSpend',
            options: [
              { label: 'No', value: false },
              { label: 'Yes', value: true }
            ],
            value: currentInputs.isHPPayFuelSpend || false,
            onChange: (value) => onChange('isHPPayFuelSpend', value === 'true')
          }
        ];
      }
      return [];
    }
  },

  "HPCL Coral": {
    defaultRate: 2 / 100,
    mccRates: {
      "5541": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards["HPCL Coral"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && iciciCardRewards["HPCL Coral"].mccRates[mcc] !== undefined) {
        rate = iciciCardRewards["HPCL Coral"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },

  "Mine": {
    defaultRate: 1 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = iciciCardRewards.Mine.defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },

  "MakeMyTrip Signature": {
    defaultRate: 1.25 / 200,
    mccRates: {
      "7011": 4 / 200,
      "4511": 2 / 200
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards["MakeMyTrip Signature"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && iciciCardRewards["MakeMyTrip Signature"].mccRates[mcc]) {
        rate = iciciCardRewards["MakeMyTrip Signature"].mccRates[mcc];
        rateType = "mcc-specific";
        category = "Travel Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },

  "Manchester United Platinum": {
    defaultRate: 3 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = iciciCardRewards["Manchester United Platinum"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },

  "Manchester United Signature": {
    defaultRate: 5 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = iciciCardRewards["Manchester United Signature"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  
  "Platinum": {
    defaultRate: 2 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = iciciCardRewards.Platinum.defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },

  "MMT": {
    defaultRate: 1 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = iciciCardRewards.MMT.defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },

  "MMT Black": {
    defaultRate: 1 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = iciciCardRewards["MMT Black"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
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

  const result = cardReward.calculateRewards(amount, mcc, additionalParams);

  return applyCapping(result, cardReward, cardName);
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
    default:
      rewardText = `${points} ICICI Reward Points`;
      if (rateType === "international") {
        rewardText += " (International Transaction)";
      } else if (category !== "Other Spends") {
        rewardText += ` (${category})`;
      }
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points)`;
  }

  return rewardText;
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = iciciCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};