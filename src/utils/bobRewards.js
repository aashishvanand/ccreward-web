export const bobCardRewards = {
  "Vikram": {
    cardType: "points",
    defaultRate: 1 / 50, // 2 points per 100 INR
    mccRates: {
      "5311": 5 / 100, // Departmental stores
      "7832": 5 / 100, // Movies
    },
    capping: {
      categories: {
        "Accelerated": { points: 1000, maxSpent: 20000 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards.Vikram.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards.Vikram.mccRates[mcc]) {
        rate = bobCardRewards.Vikram.mccRates[mcc];
        category = "Accelerated";
        rateType = "accelerated";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards.Vikram.capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards.Vikram.redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards.Vikram.cardType };
    },
    dynamicInputs: () => []
  },

  "Indian Coast Guard Rakshamah": {
    cardType: "points",
    defaultRate: 2 / 100,
    mccRates: {
      "5311": 10 / 100, // Departmental stores
      "7832": 10 / 100, // Movies
    },
    capping: {
      categories: {
        "Accelerated": { points: 1000, maxSpent: 10000 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Indian Coast Guard Rakshamah"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards["Indian Coast Guard Rakshamah"].mccRates[mcc]) {
        rate = bobCardRewards["Indian Coast Guard Rakshamah"].mccRates[mcc];
        category = "Accelerated";
        rateType = "accelerated";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["Indian Coast Guard Rakshamah"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["Indian Coast Guard Rakshamah"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Indian Coast Guard Rakshamah"].cardType };
    },
    dynamicInputs: () => []
  },

  "IRCTC": {
    cardType: "points",
    defaultRate: 2 / 100,
    irctcRate: 40 / 100, // Up to 40 points per 100 INR on IRCTC bookings
    mccRates: {
      "5311": 4 / 100, // Departmental stores
    },
    capping: {
      categories: {
        "IRCTC": { points: 1000, maxSpent: 2500 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards.IRCTC.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isIRCTCBooking) {
        rate = bobCardRewards.IRCTC.irctcRate;
        category = "IRCTC";
        rateType = "irctc";
      } else if (mcc && bobCardRewards.IRCTC.mccRates[mcc]) {
        rate = bobCardRewards.IRCTC.mccRates[mcc];
        category = "Accelerated";
        rateType = "accelerated";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards.IRCTC.capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards.IRCTC.redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards.IRCTC.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an IRCTC booking?',
        name: 'isIRCTCBooking',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isIRCTCBooking || false,
        onChange: (value) => onChange('isIRCTCBooking', value === 'true')
      }
    ]
  },

  "Indian Army Yoddha": {
    cardType: "points",
    defaultRate: 2 / 100,
    mccRates: {
      "5311": 10 / 100, // Departmental stores
      "7832": 10 / 100, // Movies
    },
    capping: {
      categories: {
        "Accelerated": { points: 1000, maxSpent: 10000 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Indian Army Yoddha"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards["Indian Army Yoddha"].mccRates[mcc]) {
        rate = bobCardRewards["Indian Army Yoddha"].mccRates[mcc];
        category = "Accelerated";
        rateType = "accelerated";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["Indian Army Yoddha"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["Indian Army Yoddha"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Indian Army Yoddha"].cardType };
    },
    dynamicInputs: () => []
  },
  "Indian Navy Varunah": {
    cardType: "points",
    defaultRate: 3 / 100,
    mccRates: {
      "4722": 15 / 100, // Travel
      "5812": 15 / 100, // Dining
      "5999": 15 / 100, // Online (assumed MCC, may need adjustment)
    },
    capping: {
      categories: {
        "Accelerated": { points: 2500, maxSpent: 16667 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Indian Navy Varunah"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards["Indian Navy Varunah"].mccRates[mcc]) {
        rate = bobCardRewards["Indian Navy Varunah"].mccRates[mcc];
        category = "Accelerated";
        rateType = "accelerated";
      } else if (additionalParams.isInternational) {
        rate = 15 / 100;
        category = "International";
        rateType = "international";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["Indian Navy Varunah"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["Indian Navy Varunah"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Indian Navy Varunah"].cardType };
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
  "Nainital Renaissance": {
    cardType: "points",
    defaultRate: 1 / 100,
    mccRates: {
      "5311": 5 / 100, // Departmental stores
      "7832": 5 / 100, // Movies
    },
    capping: {
      categories: {
        "Accelerated": { points: 1000, maxSpent: 20000 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Nainital Renaissance"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards["Nainital Renaissance"].mccRates[mcc]) {
        rate = bobCardRewards["Nainital Renaissance"].mccRates[mcc];
        category = "Accelerated";
        rateType = "accelerated";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["Nainital Renaissance"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["Nainital Renaissance"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Nainital Renaissance"].cardType };
    },
    dynamicInputs: () => []
  },
  "HPCL Energie": {
    cardType: "points",
    defaultRate: 2 / 150,
    fuelRate: 24 / 150,
    utilityRate: 10 / 150,
    mccRates: {
      "5541": 24 / 150, // Fuel stations
      "5542": 24 / 150, // Fuel stations
      "5983": 24 / 150, // Fuel stations
      "4900": 10 / 150, // Utilities
      "5311": 10 / 150, // Departmental stores
    },
    capping: {
      categories: {
        "Fuel": { points: 1000, maxSpent: 6250 },
        "Utility": { points: 1000, maxSpent: 15000 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["HPCL Energie"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards["HPCL Energie"].mccRates[mcc]) {
        rate = bobCardRewards["HPCL Energie"].mccRates[mcc];
        category = ["5541", "5542", "5983"].includes(mcc) ? "Fuel" : "Utility";
        rateType = "accelerated";
      }

      if (additionalParams.isHPPayApp && ["5541", "5542", "5983"].includes(mcc)) {
        rate = bobCardRewards["HPCL Energie"].fuelRate;
        category = "Fuel";
        rateType = "hp-pay-app";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["HPCL Energie"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["HPCL Energie"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["HPCL Energie"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a fuel purchase through HP Pay App?',
        name: 'isHPPayApp',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isHPPayApp || false,
        onChange: (value) => onChange('isHPPayApp', value === 'true')
      }
    ]
  },
  "Snapdeal": {
    cardType: "points",
    defaultRate: 4 / 100,
    snapdealRate: 20 / 100,
    onlineShoppingRate: 10 / 100,
    mccRates: {
      "5311": 10 / 100, // Departmental stores
    },
    capping: {
      categories: {
        "Online Shopping": { points: 2000, maxSpent: 20000 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Snapdeal"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isSnapdeal) {
        rate = bobCardRewards["Snapdeal"].snapdealRate;
        category = "Snapdeal";
        rateType = "snapdeal";
      } else if (additionalParams.isOnlineShopping || mcc === "5311") {
        rate = bobCardRewards["Snapdeal"].onlineShoppingRate;
        category = "Online Shopping";
        rateType = "online-shopping";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["Snapdeal"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["Snapdeal"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Snapdeal"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Snapdealpurchase?',
        name: 'isSnapdeal',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSnapdeal|| false,
        onChange: (value) => onChange('isSnapdeal', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this an online shopping transaction?',
        name: 'isOnlineShopping',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isOnlineShopping || false,
        onChange: (value) => onChange('isOnlineShopping', value === 'true')
      }
    ]
  },

  "Easy": {
    cardType: "points",
    defaultRate: 1 / 100,
    mccRates: {
      "5311": 5 / 100, // Departmental stores
      "7832": 5 / 100, // Movies
    },
    capping: {
      categories: {
        "Accelerated": { points: 1000, maxSpent: 20000 }
      }
    },
    redemptionRate: {
      cashValue: 0.20 // 1 point = 0.20 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Easy"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards["Easy"].mccRates[mcc]) {
        rate = bobCardRewards["Easy"].mccRates[mcc];
        category = "Accelerated";
        rateType = "accelerated";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["Easy"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["Easy"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Easy"].cardType };
    },
    dynamicInputs: () => []
  },

  "Eterna": {
    cardType: "points",
    defaultRate: 3 / 100,
    mccRates: {
      "5812": 15 / 100, // Dining
      "5813": 15 / 100, // Bars
      "5814": 15 / 100, // Fast Food
    },
    capping: {
      categories: {
        "Accelerated": { points: 5000, maxSpent: 33334 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Eterna"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards["Eterna"].mccRates[mcc]) {
        rate = bobCardRewards["Eterna"].mccRates[mcc];
        category = "Accelerated";
        rateType = "accelerated";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["Eterna"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["Eterna"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Eterna"].cardType };
    },
    dynamicInputs: () => []
  },
  "Premier": {
    cardType: "points",
    defaultRate: 2 / 100,
    mccRates: {
      "4722": 10 / 100, // Travel
    },
    capping: {
      categories: {
        "Accelerated": { points: 2000, maxSpent: 20000 }
      }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 point = 0.25 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Premier"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards["Premier"].mccRates[mcc]) {
        rate = bobCardRewards["Premier"].mccRates[mcc];
        category = "Accelerated";
        rateType = "accelerated";
      } else if (additionalParams.isInternational) {
        rate = 10 / 100;
        category = "International";
        rateType = "international";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["Premier"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["Premier"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Premier"].cardType };
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
  "Select": {
    cardType: "points",
    defaultRate: 1 / 100,
    mccRates: {
      "5812": 5 / 100, // Dining
      "5813": 5 / 100, // Bars
      "5814": 5 / 100, // Fast Food
    },
    capping: {
      categories: {
        "Accelerated": { points: 1000, maxSpent: 20000 }
      }
    },
    redemptionRate: {
      cashValue: 0.20 // 1 point = 0.20 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Select"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && bobCardRewards["Select"].mccRates[mcc]) {
        rate = bobCardRewards["Select"].mccRates[mcc];
        category = "Dining";
        rateType = "accelerated";
      } else if (additionalParams.isOnlineSpend) {
        rate = 5 / 100;
        category = "Online Spends";
        rateType = "accelerated";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      const cap = bobCardRewards["Select"].capping.categories[category];
      if (cap) {
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * bobCardRewards["Select"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Select"].cardType };
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
  "Prime": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 points per 100 INR
    mccRates: {
      // Fuel transactions don't earn points
      "5541": 0, // Service Stations
      "5542": 0, // Automated Fuel Dispensers
      "5983": 0, // Fuel Dealers
      // Add other excluded MCCs here as needed
    },
    capping: {
      // No specific capping mentioned, so we'll leave this empty
    },
    redemptionRate: {
      cashValue: 0.20 // 1 point = 0.20 INR
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = bobCardRewards["Prime"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      // Check if the MCC is in the excluded list
      if (bobCardRewards["Prime"].mccRates[mcc] !== undefined) {
        rate = bobCardRewards["Prime"].mccRates[mcc]; // This will be 0 for excluded categories
        category = rate === 0 ? "Excluded Category" : category;
        rateType = "excluded";
      }

      let points = Math.floor(amount * rate);

      // No capping logic as it's not mentioned in the card details

      const cashbackValue = {
        cashValue: points * bobCardRewards["Prime"].redemptionRate.cashValue
      };

      const rewardText = rate === 0 
        ? "No Rewards (Excluded Category)" 
        : `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: bobCardRewards["Prime"].cardType };
    },
    dynamicInputs: () => [] // No dynamic inputs needed for this card
  },

};

export const calculateBOBRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = bobCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      rewardText: "Card not found",
      category: "Unknown",
      cashbackValue: { airMiles: 0, cashValue: 0 },
      cardType: "unknown"
    };
  }

  return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = bobCardRewards[cardName];
  if (!cardReward || typeof cardReward.dynamicInputs !== 'function') {
    return [];
  }
  return cardReward.dynamicInputs(currentInputs, onChange);
};