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
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
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

      const cashbackValue = {
        cashValue: points * scCardRewards["Platinum Rewards"].redemptionRate.cashValue
      };
      const rewardText = `${points} SC Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;


      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: scCardRewards["Platinum Rewards"].cardType };
    },
    dynamicInputs: () => []
  },
  "Ultimate": {
    cardType: "hybrid",
    defaultRate: 5 / 150, // 5 reward points per INR 150 spent
    mccRates: {
      "5309": 0.05, // 5% cashback on duty-free spends
      "4900": 3 / 150, // Utilities
      "5411": 3 / 150, // Supermarkets
      "5960": 3 / 150, // Insurance
      "6300": 3 / 150, // Insurance
      "7349": 3 / 150, // Property Management
      "6513": 3 / 150, // Property Management / Rent Pay
      "8299": 3 / 150, // Schools
      "9399": 3 / 150, // Government
    },
    redemptionRate: {
      cashValue: 1  // 1 point = ₹1
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = scCardRewards.Ultimate.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc === "5309") {
        rate = scCardRewards.Ultimate.mccRates["5309"];
        rateType = "cashback";
        category = "Duty-Free";
      } else if (scCardRewards.Ultimate.mccRates[mcc]) {
        rate = scCardRewards.Ultimate.mccRates[mcc];
        rateType = "mcc-specific";
        // Inline category mapping
        category = {
          "4900": "Utilities",
          "5411": "Supermarkets",
          "5960": "Insurance",
          "6300": "Insurance",
          "7349": "Property Management",
          "6513": "Property Management / Rent Pay",
          "8299": "Schools",
          "9399": "Government",
        }[mcc] || "Other Spends";
      }

      const points = Math.floor(amount * rate);
      const cashback = mcc === "5309" ? amount * rate : 0;

      const cashbackValue = {
        cashValue: points * scCardRewards.Ultimate.redemptionRate.cashValue
      };

      let rewardText;
      if (cashback > 0) {
        rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;
      } else {
        rewardText = `${points} SC Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      }

      return { points, cashback, rate, rateType, category, rewardText, cashbackValue, cardType: scCardRewards.Ultimate.cardType };
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
      const rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;

      return { cashback, rate, rateType, category, rewardText, cardType: scCardRewards.Smart.cardType };
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
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
    },
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
      const cashbackValue = {
        cashValue: points * scCardRewards.EaseMyTrip.redemptionRate.cashValue
      };

      const rewardText = `${points} SC Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: scCardRewards.EaseMyTrip.cardType };
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
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25 (assumed value, please verify)
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
    
      if (additionalParams.monthlySpend > scCardRewards.Rewards.acceleratedRewards.tier1.threshold) {
        rate = scCardRewards.Rewards.acceleratedRewards.tier1.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
      }
    
      let points = Math.floor(amount * rate);
    
      // Apply bonus points cap
      if (rateType === "accelerated") {
        const basePoints = Math.floor(amount * scCardRewards.Rewards.defaultRate);
        const bonusPoints = Math.min(points - basePoints, scCardRewards.Rewards.rewardsCap.bonusPoints);
        points = basePoints + bonusPoints;
      }
    
      const cashbackValue = {
        cashValue: points * scCardRewards.Rewards.redemptionRate.cashValue
      };
    
      const rewardText = `${points} SC Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
    
      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: scCardRewards.Rewards.cardType };
    },
    
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Total monthly spend so far',
        name: 'monthlySpend',
        options: [
          { label: 'Up to ₹20,000', value: 0 },
          { label: '₹20,001 - ₹50,000', value: 20001 },
          { label: 'Above ₹50,000', value: 50001 }
        ],
        value: currentInputs.monthlySpend || 0,
        onChange: (value) => onChange('monthlySpend', parseInt(value))
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
      category: "Unknown",
      cashbackValue: { airMiles: 0, cashValue: 0 },
      cardType: "unknown",
    };
  }

  return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = scCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};