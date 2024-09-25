export const idbiCardRewards = {
  "Royale": {
    cardType: "points",
    defaultRate: 3 / 100, // 3 Points per Rs. 100 Spent
    mccRates: {
      // Excluded categories
      "6011": 0, // Financial Institutions-Manual Cash Disbursements
      "6010": 0, // Financial Institutions-Automated Cash Disbursements
      "6211": 0, // Securities-Brokers/Dealers
      "6300": 0, "5960": 0, // Insurance Sales, Underwriting, and Premiums
      "9211": 0, // Court Costs including Alimony and Child Support
      "9222": 0, // Fines
      "9311": 0, // Tax Payments
      "9399": 0, // Government Services-not elsewhere classified
      "9402": 0, // Intra-Government Purchases-Government Only
      "5541": 0, "5542": 0, // Service Stations and Automated fuel dispensers
      "5983": 0, // Fuel Dealers - Coal fuel Oil, Liquefied petroleum goods
    },
    redemptionRate: {
      cashValue: 0.25,
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = idbiCardRewards.Royale.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (idbiCardRewards.Royale.mccRates[mcc] !== undefined) {
        rate = idbiCardRewards.Royale.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      if (additionalParams.isBirthdayMonth) {
        rate *= 2; // 2X Points on birthday month
        rateType = "birthday";
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * idbiCardRewards.Royale.redemptionRate.cashValue
      };

      const rewardText = `${points} Delight Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: idbiCardRewards.Royale.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this your birthday month?',
        name: 'isBirthdayMonth',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBirthdayMonth || false,
        onChange: (value) => onChange('isBirthdayMonth', value === 'true')
      }
    ]
  },
  "Euphoria": {
    cardType: "points",
    defaultRate: 3 / 100, // 3 Points per Rs. 100 Spent
    travelRate: 6 / 100, // 2X Points on Travel related spends
    mccRates: {
      // Travel related MCCs (example, adjust as needed)
      "4111": 6 / 100, // Local/Suburban Commuter Passenger Transportation
      "4112": 6 / 100, // Passenger Railways
      "4511": 6 / 100, // Airlines, Air Carriers
      "7011": 6 / 100, // Lodging – Hotels, Motels, Resorts
      // ... (add other travel-related MCCs)

      // Excluded categories (same as Royale)
      "6011": 0, "6010": 0, "6211": 0, "6300": 0, "5960": 0, "9211": 0, "9222": 0,
      "9311": 0, "9399": 0, "9402": 0, "5541": 0, "5542": 0, "5983": 0,
    },
    redemptionRate: {
      cashValue: 0.25,
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = idbiCardRewards.Euphoria.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (idbiCardRewards.Euphoria.mccRates[mcc] !== undefined) {
        rate = idbiCardRewards.Euphoria.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : (rate === idbiCardRewards.Euphoria.travelRate ? "Travel" : "Category Spend");
      }

      if (additionalParams.isBirthdayMonth) {
        rate *= 2; // 2X Points on birthday month
        rateType = "birthday";
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * idbiCardRewards.Euphoria.redemptionRate.cashValue
      };

      const rewardText = `${points} Delight Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: idbiCardRewards.Euphoria.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this your birthday month?',
        name: 'isBirthdayMonth',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBirthdayMonth || false,
        onChange: (value) => onChange('isBirthdayMonth', value === 'true')
      }
    ]
  },
  "Aspire": {
    cardType: "points",
    defaultRate: 2 / 150, // 2 Points per Rs. 150 Spent
    mccRates: {
      // Excluded categories (same as Royale)
      "6011": 0, "6010": 0, "6211": 0, "6300": 0, "5960": 0, "9211": 0, "9222": 0,
      "9311": 0, "9399": 0, "9402": 0, "5541": 0, "5542": 0, "5983": 0,
    },
    redemptionRate: {
      cashValue: 0.25,
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = idbiCardRewards.Aspire.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (idbiCardRewards.Aspire.mccRates[mcc] !== undefined) {
        rate = idbiCardRewards.Aspire.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      if (additionalParams.isBirthdayMonth) {
        rate *= 2; // 2X Points on birthday month
        rateType = "birthday";
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * idbiCardRewards.Aspire.redemptionRate.cashValue
      };

      const rewardText = `${points} Delight Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: idbiCardRewards.Aspire.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this your birthday month?',
        name: 'isBirthdayMonth',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBirthdayMonth || false,
        onChange: (value) => onChange('isBirthdayMonth', value === 'true')
      }
    ]
  },
  "Imperium": {
    cardType: "points",
    defaultRate: 2 / 150, // 2 Points per Rs. 150 Spent
    mccRates: {
      // Excluded categories (same as Royale)
      "6011": 0, "6010": 0, "6211": 0, "6300": 0, "5960": 0, "9211": 0, "9222": 0,
      "9311": 0, "9399": 0, "9402": 0, "5541": 0, "5542": 0, "5983": 0,
    },
    redemptionRate: {
      cashValue: 0.25,
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = idbiCardRewards.Imperium.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (idbiCardRewards.Imperium.mccRates[mcc] !== undefined) {
        rate = idbiCardRewards.Imperium.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      if (additionalParams.isBirthdayMonth) {
        rate *= 2; // 2X Points on birthday month
        rateType = "birthday";
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * idbiCardRewards.Imperium.redemptionRate.cashValue
      };

      const rewardText = `${points} Delight Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: idbiCardRewards.Imperium.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this your birthday month?',
        name: 'isBirthdayMonth',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBirthdayMonth || false,
        onChange: (value) => onChange('isBirthdayMonth', value === 'true')
      }
    ]
  },
  "Lumine": {
    cardType: "points",
    defaultRate: 3 / 100, // 3 Points per Rs. 100 Spent
    mccRates: {
      // Excluded categories (same as Royale)
      "6011": 0, "6010": 0, "6211": 0, "6300": 0, "5960": 0, "9211": 0, "9222": 0,
      "9311": 0, "9399": 0, "9402": 0, "5541": 0, "5542": 0, "5983": 0,
    },
    redemptionRate: {
      cashValue: 0.25,
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = idbiCardRewards["Lumine"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (idbiCardRewards["Lumine"].mccRates[mcc] !== undefined) {
        rate = idbiCardRewards["Lumine"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      if (additionalParams.isBirthdayMonth) {
        rate *= 2; // 2X Points on birthday month
        rateType = "birthday";
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * idbiCardRewards["Lumine"].redemptionRate.cashValue
      };

      const rewardText = `${points} Delight Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: idbiCardRewards["Lumine"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this your birthday month?',
        name: 'isBirthdayMonth',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBirthdayMonth || false,
        onChange: (value) => onChange('isBirthdayMonth', value === 'true')
      }
    ]
  },
  "Eclat": {
    cardType: "points",
    defaultRate: 4 / 100, // 4 Points per Rs. 100 Spent
    mccRates: {
      // Excluded categories (same as other cards)
      "6011": 0, "6010": 0, "6211": 0, "6300": 0, "5960": 0, "9211": 0, "9222": 0,
      "9311": 0, "9399": 0, "9402": 0, "5541": 0, "5542": 0, "5983": 0,
    },
    redemptionRate: {
      cashValue: 0.25,
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = idbiCardRewards["Eclat"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (idbiCardRewards["Eclat"].mccRates[mcc] !== undefined) {
        rate = idbiCardRewards["Eclat"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      if (additionalParams.isBirthdayMonth) {
        rate *= 2; // 2X Points on birthday month
        rateType = "birthday";
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * idbiCardRewards["Eclat"].redemptionRate.cashValue
      };

      const rewardText = `${points} Delight Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: idbiCardRewards["Eclat"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this your birthday month?',
        name: 'isBirthdayMonth',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBirthdayMonth || false,
        onChange: (value) => onChange('isBirthdayMonth', value === 'true')
      }
    ]
  },
  "Winnings": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Points per Rs. 100 Spent
    mccRates: {
      // Excluded categories
      "6011": 0, "6010": 0, "6211": 0, "6300": 0, "5960": 0, "9211": 0, "9222": 0,
      "9311": 0, "9399": 0, "9402": 0, "5541": 0, "5542": 0, "5983": 0,
    },
    redemptionRate: {
      cashValue: 0.25,
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = idbiCardRewards.Winnings.defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let bonusPoints = 0;

      if (idbiCardRewards.Winnings.mccRates[mcc] !== undefined) {
        rate = idbiCardRewards.Winnings.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      if (additionalParams.isBirthdayMonth) {
        rate *= 2; // 2X Points on birthday month
        rateType = "birthday";
      }

      let points = Math.floor(amount * rate);

      // Check for Winning Delight Bonus (only applicable for RuPay card)
      if (additionalParams.isRuPayCard && additionalParams.transactionsOver1000 >= 5) {
        bonusPoints = 500;
        category += " with Winning Delight Bonus";
      }

      points += bonusPoints;

      const cashbackValue = {
        cashValue: points * idbiCardRewards.Winnings.redemptionRate.cashValue
      };

      const pointsLabel = additionalParams.isRuPayCard ? "Winning Delight Points" : "Delight Points";
      const rewardText = `${points} ${pointsLabel} (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: idbiCardRewards.Winnings.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this your birthday month?',
        name: 'isBirthdayMonth',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBirthdayMonth || false,
        onChange: (value) => onChange('isBirthdayMonth', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a RuPay card?',
        name: 'isRuPayCard',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isRuPayCard || false,
        onChange: (value) => onChange('isRuPayCard', value === 'true')
      },
      {
        type: 'radio',
        label: 'Number of transactions over Rs. 1000 this billing cycle (for RuPay card)',
        name: 'transactionsOver1000',
        options: [
          { label: '0-4 transactions', value: 0 },
          { label: '5 or more transactions', value: 5 }
        ],
        value: currentInputs.transactionsOver1000 || 0,
        onChange: (value) => onChange('transactionsOver1000', parseInt(value)),
        condition: (inputs) => inputs.isRuPayCard
      }
    ]
  }
};

export const calculateIDBIRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = idbiCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      rewardText: "Card not found",
      category: "Unknown",
      cashbackValue: { cashValue: 0 },
      cardType: "unknown",
    };
  }

  return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getIDBICardInputs = (cardName, currentInputs, onChange, selectedMcc) => {
  const cardReward = idbiCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange, selectedMcc) : [];
};