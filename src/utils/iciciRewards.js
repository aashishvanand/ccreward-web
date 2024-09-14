import { mccList } from '../data/mccData';
export const iciciCardRewards = {
  "AmazonPay": {
    cardType: "cashback",
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
        if (additionalParams.isPrimeMember && iciciCardRewards.AmazonPay.amazonPrimeRate[mcc]) {
          rate = iciciCardRewards.AmazonPay.amazonPrimeRate[mcc];
          category = "Amazon Prime Purchase";
          rateType = "amazon-prime";
        } else if (iciciCardRewards.AmazonPay.mccRates[mcc]) {
          rate = iciciCardRewards.AmazonPay.mccRates[mcc];
          category = "Amazon Purchase";
          rateType = "amazon";
        }
      } else if (iciciCardRewards.AmazonPay.mccRates[mcc]) {
        rate = iciciCardRewards.AmazonPay.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Category Spend";
      }

      const cashback = amount * rate;
      const rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;

      return { cashback, rate, rateType, category, rewardText, cardType: iciciCardRewards.AmazonPay.cardType };

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
    cardType: "points",
    defaultRate: 2 / 100,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    },
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
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
      const cashbackValue = {
        cashValue: points * iciciCardRewards.Coral.redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards.Coral.cardType };
    },
    dynamicInputs: () => []
  },

  "Emeralde Private": {
    cardType: "points",
    defaultRate: 6 / 200,
    mccRates: {
      "6513": 0,
      "5541": 0,
      "6540": 0,
      "9311": 0
    },
    capping: {
      categories: {
        "Insurance": { points: 5000, maxSpent: 166666.67 },
        "Grocery": { points: 1000, maxSpent: 33333.33 },
        "Utilities": { points: 1000, maxSpent: 33333.33 },
        "Education": { points: 1000, maxSpent: 33333.33 }
      }
    },
    redemptionRate: {
      cashValue: 1  // 1 point = ₹1
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards["Emeralde Private"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc in iciciCardRewards["Emeralde Private"].mccRates) {
        rate = iciciCardRewards["Emeralde Private"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      if (iciciCardRewards["Emeralde Private"].capping.categories[category]) {
        const cap = iciciCardRewards["Emeralde Private"].capping.categories[category];
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * iciciCardRewards["Emeralde Private"].redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards["Emeralde Private"].cardType };
    },
    dynamicInputs: () => []
  },


  "Emeralde": {
    cardType: "points",
    defaultRate: 4 / 100,
    mccRates: {
      "5541": 1 / 100,
      "4900": 1 / 100
    },
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
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
      const cashbackValue = {
        cashValue: points * iciciCardRewards.Emeralde.redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards.Emeralde.cardType };
    },
    dynamicInputs: () => []
  },

  "Rubyx": {
    cardType: "points",
    defaultRate: 2 / 100,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    },
    internationalRate: 4 / 100,
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
    },
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
      const cashbackValue = {
        cashValue: points * iciciCardRewards.Rubyx.redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards.Rubyx.cardType };
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
    cardType: "points",
    defaultRate: 2 / 100,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    },
    internationalRate: 4 / 100,
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
    },
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
      const cashbackValue = {
        cashValue: points * iciciCardRewards.Sapphiro.redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards.Sapphiro.cardType };
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
    cardType: "points",
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
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
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

      let points = Math.floor(amount * rate);

      // Apply capping
      if (iciciCardRewards["HPCL Super Saver"].capping.categories[category]) {
        const cap = iciciCardRewards["HPCL Super Saver"].capping.categories[category];
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * iciciCardRewards["HPCL Super Saver"].redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards["HPCL Super Saver"].cardType };

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
    cardType: "points",
    defaultRate: 2 / 100,
    mccRates: {
      "5541": 0
    },
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
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
      const cashbackValue = {
        cashValue: points * iciciCardRewards["HPCL Coral"].redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards["HPCL Coral"].cardType };

    },
    dynamicInputs: () => []
  },

  "Mine": {
    cardType: "points",
    defaultRate: 1 / 100,
    mccRates: {},
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = iciciCardRewards.Mine.defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * iciciCardRewards.Mine.redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards.Mine.cardType };
    },
    dynamicInputs: () => []
  },


  "MMT Signature": {
    cardType: "points",
    defaultRate: 1.25 / 200,
    internationalRate: 1.5 / 200,
    mccRates: {
      "7011": 4 / 200,
      "4511": 2 / 200
    },
    redemptionRate: {
      cashValue: 1  // 1 point = ₹1
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards["MMT Signature"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isInternational) {
        rate = iciciCardRewards["MMT Signature"].internationalRate;
        category = "International Spend";
        rateType = "international";
      } else if (mcc && iciciCardRewards["MMT Signature"].mccRates[mcc]) {
        rate = iciciCardRewards["MMT Signature"].mccRates[mcc];
        rateType = "mcc-specific";
        category = "Travel Spend";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * iciciCardRewards["MMT Signature"].redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards["MMT Signature"].cardType };

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

  "Manchester United Platinum": {
    cardType: "points",
    defaultRate: 2 / 100,
    matchDayRate: 3 / 100,
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards["Manchester United Platinum"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isMatchDay) {
        rate = iciciCardRewards["Manchester United Platinum"].matchDayRate;
        category = "Manchester United Match Day";
        rateType = "match-day";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * iciciCardRewards["Manchester United Platinum"].redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards["Manchester United Platinum"].cardType };

    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Manchester United match day?',
        name: 'isMatchDay',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isMatchDay || false,
        onChange: (value) => onChange('isMatchDay', value === 'true')
      }
    ]
  },

  "Manchester United Signature": {
    cardType: "points",
    defaultRate: 3 / 150,
    internationalRate: 4 / 150,
    matchDayRate: 5 / 150,
    mccRates: {
      "5541": 0, // Fuel transactions excluded
      "5542": 0  // Fuel transactions excluded
    },
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards["Manchester United Signature"].defaultRate;
      let category = "Domestic Spend";
      let rateType = "default";

      if (mcc && iciciCardRewards["Manchester United Signature"].mccRates[mcc] === 0) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      } else if (additionalParams.isMatchDay) {
        rate = iciciCardRewards["Manchester United Signature"].matchDayRate;
        category = "Manchester United Match Day";
        rateType = "match-day";
      } else if (additionalParams.isInternational) {
        rate = iciciCardRewards["Manchester United Signature"].internationalRate;
        category = "International Spend";
        rateType = "international";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * iciciCardRewards["Manchester United Signature"].redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards["Manchester United Signature"].cardType };

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
      },
      {
        type: 'radio',
        label: 'Is this a Manchester United match day?',
        name: 'isMatchDay',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isMatchDay || false,
        onChange: (value) => onChange('isMatchDay', value === 'true')
      }
    ]
  },

  "Platinum": {
    cardType: "points",
    defaultRate: 2 / 100,
    mccRates: {},
    redemptionRate: {
      cashValue: 0.25  // 1 My Cash = ₹0.25
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = iciciCardRewards.Platinum.defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * iciciCardRewards.Platinum.redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards.Platinum.cardType };

    },
    dynamicInputs: () => []
  },

  "MMT": {
    cardType: "points",
    defaultRate: 1 / 200,
    internationalRate: 1.25 / 200,
    mccRates: {
      "7011": 3 / 200,  // Hotel bookings
      "4511": 2 / 200   // Flight bookings
    },
    redemptionRate: {
      cashValue: 1  // 1 My Cash = ₹1
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = iciciCardRewards.MMT.defaultRate;
      let category = "Domestic Spends Outside MMT";
      let rateType = "default";

      if (additionalParams.isMMTBooking) {
        if (mcc === "7011") {
          rate = iciciCardRewards.MMT.mccRates["7011"];
          category = "Hotel/Holiday Bookings on MMT";
          rateType = "mmt-hotel";
        } else if (mcc === "4511") {
          rate = iciciCardRewards.MMT.mccRates["4511"];
          category = "Flight Bookings on MMT";
          rateType = "mmt-flight";
        }
      } else if (additionalParams.isInternational) {
        rate = iciciCardRewards.MMT.internationalRate;
        category = "International Spends Outside MMT";
        rateType = "international";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * iciciCardRewards.MMT.redemptionRate.cashValue
      };

      const rewardText = `${points} ICICI Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: iciciCardRewards.MMT.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a MakeMyTrip booking?',
        name: 'isMMTBooking',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isMMTBooking || false,
        onChange: (value) => onChange('isMMTBooking', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this an international transaction?',
        name: 'isInternational',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isInternational || false,
        onChange: (value) => onChange('isInternational', value === 'true'),
        condition: (inputs) => !inputs.isMMTBooking
      }
    ]
  }
};

export const calculateICICIRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = iciciCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      cashback: 0,
      rewardText: "Card not found",
      category: "Unknown",
      cashbackValue: { airMiles: 0, cashValue: 0 },
      cardType: "unknown",
    };
  }

  return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getAxisCardInputs = (cardName, currentInputs, onChange, selectedMcc) => {
  const cardReward = iciciCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange, selectedMcc) : [];
};