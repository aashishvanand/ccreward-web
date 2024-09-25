export const canaraCardRewards = {
  "Rupay Select": {
    cardType: "hybrid",
    defaultRate: 2 / 100, // 2 points for every ₹100 transaction
    utilityBillRate: 5 / 100, // 5% cashback on utility bill payments
    redemptionRate: {
      cashValue: 0.25 // ₹0.25 per point
    },
    capping: {
      categories: {
        "Utility Bills": { cashback: 50, period: "monthly" }
      }
    },
    mccRates: {
      // Utility bill payment MCCs (example MCCs, adjust as needed)
      "4900": 5 / 100, // Electric Utilities
      "4814": 5 / 100, // Telecommunication Services
      "4821": 5 / 100, // Telegraph Services
      "4899": 5 / 100  // Cable and Other Pay Television Services
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = canaraCardRewards["Rupay Select"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let points = 0;
      let cashback = 0;

      if (canaraCardRewards["Rupay Select"].mccRates[mcc]) {
        rate = canaraCardRewards["Rupay Select"].utilityBillRate;
        category = "Utility Bills";
        rateType = "utility-bill";
        cashback = Math.min(amount * rate, canaraCardRewards["Rupay Select"].capping.categories["Utility Bills"].cashback);
      } else {
        points = Math.floor(amount * rate);
      }

      const cashbackValue = {
        cashValue: points * canaraCardRewards["Rupay Select"].redemptionRate.cashValue
      };

      let rewardText = "";
      if (cashback > 0) {
        rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;
      } else {
        rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      }

      return { points, cashback, rate, rateType, category, rewardText, cashbackValue, cardType: canaraCardRewards["Rupay Select"].cardType };
    },
    dynamicInputs: () => []
  },

  "MasterCard World": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 points for every ₹100 spent
    redemptionRate: {
      cashValue: 0.25 // Redemption rate not provided, using 0.25 as placeholder
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = canaraCardRewards["MasterCard World"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * canaraCardRewards["MasterCard World"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: canaraCardRewards["MasterCard World"].cardType };
    },
    dynamicInputs: () => []
  },

  "Platinum": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 points for every ₹100 spent
    redemptionRate: {
      cashValue: 0.25 // Redemption rate not provided, using 0.25 as placeholder
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = canaraCardRewards["Platinum"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * canaraCardRewards["Platinum"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: canaraCardRewards["Platinum"].cardType };
    },
    dynamicInputs: () => []
  },

  "Gold": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 points for every ₹100 spent
    redemptionRate: {
      cashValue: 0.25 // Redemption rate not provided, using 0.25 as placeholder
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = canaraCardRewards["Gold"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * canaraCardRewards["Gold"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: canaraCardRewards["Gold"].cardType };
    },
    dynamicInputs: () => []
  },

  "Classic": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 points for every ₹100 spent
    redemptionRate: {
      cashValue: 0.25 // Redemption rate not provided, using 0.25 as placeholder
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = canaraCardRewards["Classic"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * canaraCardRewards["Classic"].redemptionRate.cashValue
      };
      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: canaraCardRewards["Classic"].cardType };
    },
    dynamicInputs: () => []
  },

  "MasterCard Standard": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 points for every ₹100 spent
    redemptionRate: {
      cashValue: 0.25 // Redemption rate not provided, using 0.25 as placeholder
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = canaraCardRewards["MasterCard Standard"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * canaraCardRewards["MasterCard Standard"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: canaraCardRewards["MasterCard Standard"].cardType };
    },
    dynamicInputs: () => []
  }
};

export const calculateCanaraRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = canaraCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      cashback: 0,
      rewardText: "Card not found",
      category: "Unknown",
      cashbackValue: { cashValue: 0 },
      cardType: "unknown",
    };
  }

  return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getCanaraCardInputs = (cardName, currentInputs, onChange, selectedMcc) => {
  const cardReward = canaraCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange, selectedMcc) : [];
};