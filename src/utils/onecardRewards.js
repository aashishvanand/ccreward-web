export const oneCardRewards = {
  "One Card": {
    cardType: "points",
    defaultRate: 1 / 50, // 1 point for every Rs. 50 spent
    oneCard: true,
    topCategoryRate: 5 / 50, // 5 points for every Rs. 50 spent in top categories
    mccRates: {
      // Excluded categories
      "5541": 0, // Fuel
      "5542": 0, // Fuel
      "5983": 0, // Fuel
      // Add any other excluded MCCs for transfers here
    },
    redemptionRate: {
      cashValue: 0.10  // 1 point = ₹0.10 (10 paisa)
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = oneCardRewards["One Card"].defaultRate;
      let rateType = "default";
      let category = "Other Spends";

      // Check if it's a top category spend
      if (additionalParams.isTopCategorySpend) {
        rate = oneCardRewards["One Card"].topCategoryRate;
        rateType = "top-category";
        category = "Top Category Spend";
      }

      // Check for excluded categories
      if (mcc && oneCardRewards["One Card"].mccRates[mcc] !== undefined) {
        rate = oneCardRewards["One Card"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      // Calculate points
      let points = amount * rate;

      // Round to 2 decimal places for display
      points = Math.round(points * 100) / 100;

      const cashbackValuePaisa = points * (oneCardRewards["One Card"].redemptionRate.cashValue * 100);
      const cashbackValueRupees = cashbackValuePaisa / 100;

      const cashbackValue = {
        cashValue: cashbackValueRupees
      };

      const rewardText = `${points} Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: oneCardRewards["One Card"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a top category spend?',
        name: 'isTopCategorySpend',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTopCategorySpend || false,
        onChange: (value) => onChange('isTopCategorySpend', value === 'true')
      }
    ]
  }
};

export const calculateOneCardRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = oneCardRewards[cardName];
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

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = oneCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};