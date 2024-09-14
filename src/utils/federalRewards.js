export const federalCardRewards = {
  "Signet": {
    cardType: "points",
    defaultRate: 1 / 200,
    mccRates: {
      "5541": 0, "7983": 0, "5172": 0, "5542": 0, // Fuel
      "9399": 0, "4784": 0, "9311": 0, "9222": 0, "9402": 0, "4011": 0, "9405": 0, "9211": 0, // Government Services
      "6012": 0, // Financial institutions (from 15th Jul 2024)
      "6051": 0, "6050": 0, // Quasi Cash (from 15th Jul 2024)
      "6513": 0, // Rent payments
    },
    capping: {
      categories: {
        "Insurance": { points: 250, maxSpent: 250 * 200, period: "monthly" } // 250 points cap for Insurance transactions per month (from 15th Jul 2024)
      }
    },
    redemptionRate: {
      cashValue: 0.25, // Each Federal Reward Point is valued at Rs. 0.25
      cashbackValue: 0.10 // Redemption towards 'Cash' will be computed at 10 paise per point (from 15th Jul 2024)
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = federalCardRewards["Signet"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (federalCardRewards["Signet"].mccRates[mcc] === 0) {
        return { points: 0, rate: 0, rateType: "excluded", category: "Excluded Category", rewardText: "No Reward Points", cardType: federalCardRewards["Signet"].cardType };
      }

      if (["6300", "5960"].includes(mcc)) {
        category = "Insurance";
      }

      let points = Math.floor(amount * rate);

      // Apply capping for Insurance category
      if (category === "Insurance") {
        const cap = federalCardRewards["Signet"].capping.categories["Insurance"];
        points = Math.min(points, cap.points);
      }

      const cashbackValue = {
        cashValue: points * federalCardRewards["Signet"].redemptionRate.cashValue,
        cashbackValue: points * federalCardRewards["Signet"].redemptionRate.cashbackValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} or ₹${cashbackValue.cashbackValue.toFixed(2)} as cashback`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: federalCardRewards["Signet"].cardType };
    },
    dynamicInputs: () => []
  },
  "Imperio": {
    cardType: "points",
    defaultRate: 1 / 150,
    mccRates: {
      "5541": 0, "7983": 0, "5172": 0, "5542": 0, // Fuel
      "9399": 0, "4784": 0, "9311": 0, "9222": 0, "9402": 0, "4011": 0, "9405": 0, "9211": 0, // Government Services
      "6012": 0, // Financial institutions (from 15th Jul 2024)
      "6051": 0, "6050": 0, // Quasi Cash (from 15th Jul 2024)
      "6513": 0, // Rent payments
    },
    capping: {
      categories: {
        "Insurance": { points: 250, maxSpent: 250 * 150, period: "monthly" } // 250 points cap for Insurance transactions per month (from 15th Jul 2024)
      }
    },
    redemptionRate: {
      cashValue: 0.25, // Each Federal Reward Point is valued at Rs. 0.25
      cashbackValue: 0.10 // Redemption towards 'Cash' will be computed at 10 paise per point (from 15th Jul 2024)
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = federalCardRewards["Imperio"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (federalCardRewards["Imperio"].mccRates[mcc] === 0) {
        return { points: 0, rate: 0, rateType: "excluded", category: "Excluded Category", rewardText: "No Reward Points", cardType: federalCardRewards["Imperio"].cardType };
      }

      if (["6300", "5960"].includes(mcc)) {
        category = "Insurance";
      }

      let points = Math.floor(amount * rate);

      // Apply capping for Insurance category
      if (category === "Insurance") {
        const cap = federalCardRewards["Imperio"].capping.categories["Insurance"];
        points = Math.min(points, cap.points);
      }

      const cashbackValue = {
        cashValue: points * federalCardRewards["Imperio"].redemptionRate.cashValue,
        cashbackValue: points * federalCardRewards["Imperio"].redemptionRate.cashbackValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} or ₹${cashbackValue.cashbackValue.toFixed(2)} as cashback`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: federalCardRewards["Imperio"].cardType };
    },
    dynamicInputs: () => []
  },
  "Celesta": {
    cardType: "points",
    defaultRate: 1 / 100,
    mccRates: {
      "5541": 0, "7983": 0, "5172": 0, "5542": 0, // Fuel
      "9399": 0, "4784": 0, "9311": 0, "9222": 0, "9402": 0, "4011": 0, "9405": 0, "9211": 0, // Government Services
      "6012": 0, // Financial institutions (from 15th Jul 2024)
      "6051": 0, "6050": 0, // Quasi Cash (from 15th Jul 2024)
      "6513": 0, // Rent payments
    },
    capping: {
      categories: {
        "Insurance": { points: 250, maxSpent: 250 * 100, period: "monthly" } // 250 points cap for Insurance transactions per month (from 15th Jul 2024)
      }
    },
    redemptionRate: {
      cashValue: 0.25, // Each Federal Reward Point is valued at Rs. 0.25
      cashbackValue: 0.10 // Redemption towards 'Cash' will be computed at 10 paise per point (from 15th Jul 2024)
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = federalCardRewards["Celesta"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (federalCardRewards["Celesta"].mccRates[mcc] === 0) {
        return { points: 0, rate: 0, rateType: "excluded", category: "Excluded Category", rewardText: "No Reward Points", cardType: federalCardRewards["Celesta"].cardType };
      }

      if (["6300", "5960"].includes(mcc)) {
        category = "Insurance";
      }

      let points = Math.floor(amount * rate);

      // Apply capping for Insurance category
      if (category === "Insurance") {
        const cap = federalCardRewards["Celesta"].capping.categories["Insurance"];
        points = Math.min(points, cap.points);
      }

      const cashbackValue = {
        cashValue: points * federalCardRewards["Celesta"].redemptionRate.cashValue,
        cashbackValue: points * federalCardRewards["Celesta"].redemptionRate.cashbackValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} or ₹${cashbackValue.cashbackValue.toFixed(2)} as cashback`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: federalCardRewards["Celesta"].cardType };
    },
    dynamicInputs: () => []
  },
  "Wave": {
    cardType: "points",
    defaultRate: 1 / 200,
    mccRates: {
      "5541": 0, "7983": 0, "5172": 0, "5542": 0, // Fuel
      "9399": 0, "4784": 0, "9311": 0, "9222": 0, "9402": 0, "4011": 0, "9405": 0, "9211": 0, // Government Services
      "6012": 0, // Financial institutions (from 15th Jul 2024)
      "6051": 0, "6050": 0, // Quasi Cash (from 15th Jul 2024)
      "6513": 0, // Rent payments
    },
    capping: {
      categories: {
        "Insurance": { points: 250, maxSpent: 250 * 200, period: "monthly" } // 250 points cap for Insurance transactions per month (from 15th Jul 2024)
      }
    },
    redemptionRate: {
      cashValue: 0.25, // Each Federal Reward Point is valued at Rs. 0.25
      cashbackValue: 0.10 // Redemption towards 'Cash' will be computed at 10 paise per point (from 15th Jul 2024)
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = federalCardRewards["Wave"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (federalCardRewards["Wave"].mccRates[mcc] === 0) {
        return { points: 0, rate: 0, rateType: "excluded", category: "Excluded Category", rewardText: "No Reward Points", cardType: federalCardRewards["Wave"].cardType };
      }

      if (["6300", "5960"].includes(mcc)) {
        category = "Insurance";
      }

      let points = Math.floor(amount * rate);

      // Apply capping for Insurance category
      if (category === "Insurance") {
        const cap = federalCardRewards["Wave"].capping.categories["Insurance"];
        points = Math.min(points, cap.points);
      }

      const cashbackValue = {
        cashValue: points * federalCardRewards["Wave"].redemptionRate.cashValue,
        cashbackValue: points * federalCardRewards["Wave"].redemptionRate.cashbackValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} or ₹${cashbackValue.cashbackValue.toFixed(2)} as cashback`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: federalCardRewards["Wave"].cardType };
    },
    dynamicInputs: () => []
  },
  "Scapia": {
    cardType: "points",
    defaultRate: 0.10, // 10% Scapia coins on every eligible online and offline spend
    mccRates: {
      // Assuming the same exclusions as other Federal Bank cards
      "5541": 0, "7983": 0, "5172": 0, "5542": 0, // Fuel
      "9399": 0, "4784": 0, "9311": 0, "9222": 0, "9402": 0, "4011": 0, "9405": 0, "9211": 0, // Government Services
      "6012": 0, // Financial institutions (from 15th Jul 2024)
      "6051": 0, "6050": 0, // Quasi Cash (from 15th Jul 2024)
      "6513": 0, // Rent payments
    },
    redemptionRate: {
      travelValue: 0.20, // 5 Scapia coins = ₹1 for travel services
      cashValue: 0.20 // Assuming the same cash value as other Federal Bank cards
    },
    forexMarkup: 0, // Zero forex markup on all international transactions
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = federalCardRewards["Scapia"].defaultRate;
      let category = "Eligible Spend";
      let rateType = "default";

      if (federalCardRewards["Scapia"].mccRates[mcc] === 0) {
        return { points: 0, rate: 0, rateType: "excluded", category: "Excluded Category", rewardText: "No Scapia Coins", cardType: federalCardRewards["Scapia"].cardType };
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        travelValue: points * federalCardRewards["Scapia"].redemptionRate.travelValue,
        cashValue: points * federalCardRewards["Scapia"].redemptionRate.cashValue
      };

      const rewardText = `${points} Scapia Coins (${category}) - Worth ₹${cashbackValue.travelValue.toFixed(2)} for travel or ₹${cashbackValue.cashValue.toFixed(2)} as cashback`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: federalCardRewards["Scapia"].cardType };
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
};

export const calculateFederalRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = federalCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      rewardText: "Card not found",
      category: "Unknown",
      cashbackValue: { cashValue: 0, cashbackValue: 0 },
      cardType: "unknown",
    };
  }

  return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = federalCardRewards[cardName];
  if (!cardReward || typeof cardReward.dynamicInputs !== 'function') {
    return [];
  }
  return cardReward.dynamicInputs(currentInputs, onChange);
};