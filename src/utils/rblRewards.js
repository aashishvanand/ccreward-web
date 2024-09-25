//TODO: Fix Cashback Text
export const rblCardRewards = {
  "IRCTC": {
    cardType: "points",
    defaultRate: 1 / 200, // 1 Reward Point per INR 200 spent
    mccRates: {
      // FASTag recharge, NCMC Reload, UTS App
      "4784": 3 / 200, // 3 Reward Points per INR 200
      // IRCTC website or app for flights, hotels, and cruises
      "4722": 2 / 200, // 2 Reward Points per INR 200
      // Excluded categories
      "5541": 0, "5542": 0, "5172": 0, // Fuel & Auto
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "6513": 0, // Real Estate/Rental
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "6540": 0, // Wallets/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
      "5960": 0 // Miscellaneous
    },
    redemptionRate: {
      cashValue: 1 // 1 Reward Point = INR 1 on IRCTC
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["IRCTC"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && rblCardRewards["IRCTC"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["IRCTC"].mccRates[mcc];
        rateType = "mcc-specific";
        if (mcc === "4784") {
          category = "FASTag/NCMC/UTS";
        } else if (mcc === "4722") {
          category = "IRCTC Travel";
        } else if (rate === 0) {
          category = "Excluded Category";
        }
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * rblCardRewards["IRCTC"].redemptionRate.cashValue
      };
      let rewardText = rate === 0
        ? `No rewards earned for this transaction (${category})`
        : `${points} Reward Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} on IRCTC`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: rblCardRewards["IRCTC"].cardType };
    },
    dynamicInputs: () => []
  },
  "IndianOil XTRA": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 fuel points on INR 100 spent on every other purchase
    mccRates: {
      // IndianOil fuel stations
      "5541": 15 / 100, // 15 fuel points on every INR 100 spent
      "5542": 15 / 100,
      "5983": 15 / 100,
      // Excluded categories
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "6513": 0, // Real Estate/Rental
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "6540": 0, // Wallets/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
      "5960": 0 // Miscellaneous
    },
    capping: {
      categories: {
        "Fuel": { points: 2000, period: "monthly" }
      }
    },
    redemptionRate: {
      cashValue: 0.5 // 1 Fuel Point = INR 0.5 for buying XTRA Reward points
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["IndianOil XTRA"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && rblCardRewards["IndianOil XTRA"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["IndianOil XTRA"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5541", "5542", "5983"].includes(mcc)) {
          category = "Fuel";
        } else if (rate === 0) {
          category = "Excluded Category";
        }
      }

      let points = Math.floor(amount * rate);

      // Apply capping for fuel category
      if (category === "Fuel") {
        const cap = rblCardRewards["IndianOil XTRA"].capping.categories.Fuel;
        points = Math.min(points, cap.points);
      }

      const cashbackValue = {
        cashValue: points * rblCardRewards["IndianOil XTRA"].redemptionRate.cashValue
      };
      let rewardText = rate === 0
        ? `No fuel points earned for this transaction (${category})`
        : `${points} Fuel Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} in XTRA Reward points`;
      if (category === "Fuel") {
        rewardText += ` (8.5% Valueback including 1% fuel surcharge waiver)`;
      }

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: rblCardRewards["IndianOil XTRA"].cardType };
    },
    dynamicInputs: () => []
  },

  "IndianOil": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 fuel point on INR 100 spent on every other purchase
    mccRates: {
      // IndianOil fuel stations
      "5541": 10 / 100, // 10 fuel points on every INR 100 spent
      "5542": 10 / 100,
      "5983": 10 / 100,
      // Excluded categories (same as XTRA)
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "6513": 0, // Real Estate/Rental
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "6540": 0, // Wallets/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
      "5960": 0 // Miscellaneous
    },
    capping: {
      categories: {
        "Fuel": { points: 1000, period: "monthly" }
      }
    },
    redemptionRate: {
      cashValue: 0.5 // 1 Fuel Point = INR 0.5 for buying XTRA Reward points
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["IndianOil"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && rblCardRewards["IndianOil"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["IndianOil"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5541", "5542", "5983"].includes(mcc)) {
          category = "Fuel";
        } else if (rate === 0) {
          category = "Excluded Category";
        }
      }

      let points = Math.floor(amount * rate);

      // Apply capping for fuel category
      if (category === "Fuel") {
        const cap = rblCardRewards["IndianOil"].capping.categories.Fuel;
        points = Math.min(points, cap.points);
      }

      const cashbackValue = {
        cashValue: points * rblCardRewards["IndianOil"].redemptionRate.cashValue
      };

      let rewardText = "";
      if (rate === 0) {
        rewardText = `No fuel points earned for this transaction (${category})`;
      } else {
        rewardText = `${points} Fuel Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} in XTRA Reward points`;
        if (category === "Fuel") {
          rewardText += ` (6% Valueback including 1% fuel surcharge waiver)`;
        }
      }

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: rblCardRewards["IndianOil"].cardType };
    },
    dynamicInputs: () => []
  },
  "DMI Finance": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point per INR 100 in-store
    onlineRate: 2 / 100, // 2 Reward Points per INR 100 online
    mccRates: {
      // Excluded categories
      "4112": 0, "4011": 0, "0066": 0, // Railways
      "0032": 0, "2541": 0, "4001": 0, "5542": 0, "5541": 0, "5172": 0, // Fuel & Auto
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "6513": 0, // Real Estate/Rental
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "6540": 0, // Wallets/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
      "5960": 0 // Miscellaneous
    },
    redemptionRate: {
      cashValue: 0.25
    },
    milestones: [
      { spend: 50000, period: "quarterly", reward: { points: 2000 } },
      { spend: 200000, period: "annually", reward: { voucher: { type: "Amazon", value: 500 } } },
      { spend: 300000, period: "annually", reward: { voucher: { type: "Swiggy", value: 200 } } }
    ],
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["DMI Finance"].defaultRate;
      let category = "In-store Purchase";
      let rateType = "default";

      if (additionalParams.isOnline) {
        rate = rblCardRewards["DMI Finance"].onlineRate;
        category = "Online Purchase";
        rateType = "online";
      }

      if (mcc && rblCardRewards["DMI Finance"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["DMI Finance"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      let points = Math.floor(amount * rate);

      const cashValue = (points * (rblCardRewards["DMI Finance"].redemptionRate?.cashValue || 0)).toFixed(2);
      let rewardText = rate === 0
        ? `No rewards earned for this transaction (${category})`
        : `${points} Reward Points earned (${category}) - Worth ₹${cashValue}`;

      return { points, rate, rateType, category, rewardText, cashbackValue: { cashValue }, cardType: rblCardRewards["DMI Finance"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an online transaction?',
        name: 'isOnline',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isOnline || false,
        onChange: (value) => onChange('isOnline', value === 'true')
      }
    ]
  },

  "ShopRite": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 reward point for every INR 100 spent
    groceryRate: 20 / 100, // 20 reward points for every INR 100 spent on grocery
    mccRates: {
      "5411": 20 / 100, // Grocery Stores
      // Excluded categories
      "0032": 0, "2541": 0, "4001": 0, "5542": 0, "5541": 0, "5172": 0, // Fuel & Auto
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "6513": 0, // Real Estate/Rental
      "6540": 0, // Wallet/Service Providers
      "5960": 0 // Miscellaneous
    },
    capping: {
      categories: {
        "Grocery": { points: 1000, period: "monthly" }
      }
    },
    redemptionRate: {
      cashValue: 0.25
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["ShopRite"].defaultRate;
      let category = "Other Purchases";
      let rateType = "default";

      if (mcc && rblCardRewards["ShopRite"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["ShopRite"].mccRates[mcc];
        rateType = "mcc-specific";
        category = mcc === "5411" ? "Grocery" : (rate === 0 ? "Excluded Category" : "Category Spend");
      }

      let points = Math.floor(amount * rate);

      // Apply capping for grocery category
      if (category === "Grocery") {
        const cap = rblCardRewards["ShopRite"].capping.categories.Grocery;
        points = Math.min(points, cap.points);
      }

      const cashValue = (points * (rblCardRewards["ShopRite"].redemptionRate?.cashValue || 0)).toFixed(2);
      let rewardText = rate === 0
        ? `No rewards earned for this transaction (${category})`
        : `${points} Reward Points earned (${category}) - Worth ₹${cashValue}`;

      return { points, rate, rateType, category, rewardText, cashbackValue: { cashValue }, cardType: rblCardRewards["ShopRite"].cardType };
    },
    dynamicInputs: () => []
  },

  "World Safari": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 travel points for every INR 100 spent
    travelRate: 5 / 100, // 5 travel points for every INR 100 spent on travel
    mccRates: {
      // Travel-related MCCs (example, may need to be expanded)
      "3000": 5 / 100, "3001": 5 / 100, "3002": 5 / 100, "3003": 5 / 100, // Airlines
      "3501": 5 / 100, "3502": 5 / 100, "3503": 5 / 100, "3504": 5 / 100, // Hotels
      "4722": 5 / 100, // Travel Agencies
    },
    milestones: [
      { spend: 250000, period: "annually", reward: { points: 10000 } },
      { spend: 500000, period: "annually", reward: { points: 15000 } },
      { spend: 750000, period: "annually", reward: { voucher: { type: "Premium Brands", value: 10000 } } }
    ],
    redemptionRate: {
      cashValue: 0.25
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["World Safari"].defaultRate;
      let category = "Other Purchases";
      let rateType = "default";

      if (mcc && rblCardRewards["World Safari"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["World Safari"].mccRates[mcc];
        rateType = "mcc-specific";
        category = "Travel";
      }

      if (additionalParams.isInternational) {
        rate = 0;
        category = "International Purchase";
        rateType = "international";
      }

      let points = Math.floor(amount * rate);
      
      const cashbackValue = {
        cashValue: points * rblCardRewards["World Safari"].redemptionRate.cashValue
      };
      const cashValue = (points * (rblCardRewards["World Safari"].redemptionRate?.cashValue || 0)).toFixed(2);
      let rewardText = rate === 0
        ? `No travel points earned for this transaction (${category})`
        : `${points} Travel Points earned (${category}) - Worth ₹${cashValue}`;

      return { points, rate, rateType, category, rewardText, cashbackValue: { cashValue }, cardType: rblCardRewards["World Safari"].cardType };
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
  "Icon": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 reward points for every INR 100 spent
    weekendDiningRate: 20 / 100, // 20 reward points for every INR 100 spent on dining on weekends
    internationalRate: 20 / 100, // 20 reward points for every INR 100 spent on international spends
    mccRates: {
      // Excluded categories
      "4011": 0, "4112": 0, // Railways
      "6513": 0, // Rental
      "5960": 0 // Miscellaneous payments
    },
    capping: {
      categories: {
        "Weekend Dining": { points: 2000, period: "monthly" },
        "International Spends": { points: 2000, period: "monthly" }
      }
    },
    milestones: [
      { spend: 300000, period: "annually", reward: { points: 10000 } },
      { spend: 500000, period: "annually", reward: { points: 15000 } },
      { spend: 800000, period: "annually", reward: { points: 20000 } }
    ],
    redemptionRate: {
      cashValue: 0.25 
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["Icon"].defaultRate;
      let category = "Other Purchases";
      let rateType = "default";

      if (additionalParams.isWeekend && additionalParams.isDining) {
        rate = rblCardRewards["Icon"].weekendDiningRate;
        category = "Weekend Dining";
        rateType = "weekend-dining";
      } else if (additionalParams.isInternational) {
        rate = rblCardRewards["Icon"].internationalRate;
        category = "International Spends";
        rateType = "international";
      }

      if (mcc && rblCardRewards["Icon"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["Icon"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      if (category === "Weekend Dining" || category === "International Spends") {
        const cap = rblCardRewards["Icon"].capping.categories[category];
        points = Math.min(points, cap.points);
      }

      const cashbackValue = {
        cashValue: points * (rblCardRewards["Icon"].redemptionRate?.cashValue || 0)
      };
      let rewardText = rate === 0
        ? `No rewards earned for this transaction (${category})`
        : `${points} Reward Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: rblCardRewards["Icon"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a weekend transaction?',
        name: 'isWeekend',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isWeekend || false,
        onChange: (value) => onChange('isWeekend', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a dining transaction?',
        name: 'isDining',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isDining || false,
        onChange: (value) => onChange('isDining', value === 'true')
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
        onChange: (value) => onChange('isInternational', value === 'true')
      }
    ]
  },

  "Platinum Maxima Plus": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 reward points for every INR 100 spent
    acceleratedRate: 10 / 100, // 10 reward points for every INR 100 spent on dining, entertainment, grocery, and international purchases
    mccRates: {
      // Excluded categories
      "0032": 0, "2541": 0, "4001": 0, "5542": 0, "5541": 0, "5172": 0, // Fuel & Auto
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "4900": 0, // Utilities
      "6513": 0, // Real Estate/Rental
      "6540": 0, // Wallet/Service Providers
      "6300": 0, "6310": 0, // Insurance
      "5960": 0 // Miscellaneous
    },
    milestones: [
      { spend: 200000, period: "annually", reward: { points: 10000 } },
      { spend: 350000, period: "annually", reward: { points: 10000 } },
      { spend: 500000, period: "annually", reward: { points: 10000 } }
    ],
    redemptionRate: {
      cashValue: 0.25
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["Platinum Maxima Plus"].defaultRate;
      let category = "Other Purchases";
      let rateType = "default";

      if (additionalParams.isAcceleratedCategory) {
        rate = rblCardRewards["Platinum Maxima Plus"].acceleratedRate;
        category = "Accelerated Category";
        rateType = "accelerated";
      }

      if (mcc && rblCardRewards["Platinum Maxima Plus"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["Platinum Maxima Plus"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * (rblCardRewards["Platinum Maxima Plus"].redemptionRate?.cashValue || 0)
      };
      let rewardText = rate === 0
        ? `No rewards earned for this transaction (${category})`
        : `${points} Reward Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: rblCardRewards["Platinum Maxima Plus"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an accelerated category transaction (dining, entertainment, grocery, or international)?',
        name: 'isAcceleratedCategory',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isAcceleratedCategory || false,
        onChange: (value) => onChange('isAcceleratedCategory', value === 'true')
      }
    ]
  },

  "Platinum Delight": {
    cardType: "points",
    defaultRate: 0, // No regular reward points
    fuelSurchargeWaiver: {
      minAmount: 500,
      maxAmount: 4000,
      maxWaiver: 150
    },
    milestoneReward: {
      transactionCount: 5,
      minTransactionAmount: 1000,
      rewardPoints: 1000,
      period: "monthly"
    },
    mccRates: {
      // Excluded categories for milestone reward
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "6513": 0, // Real Estate/Rental
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "6540": 0, // Wallet/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
      "5960": 0 // Miscellaneous
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let points = 0;
      let category = "Other Purchases";
      let rateType = "default";
      let rewardText = "";

      if (mcc === "5541" || mcc === "5542") { // Fuel transactions
        if (amount >= 500 && amount <= 4000) {
          const surchargeWaiver = Math.min(amount * 0.01, 150);
          rewardText = `Fuel surcharge waiver of ₹${surchargeWaiver.toFixed(2)} applied`;
        } else {
          rewardText = "No fuel surcharge waiver applied (Transaction amount out of range)";
        }
      } else {
        rewardText = "No direct rewards for this transaction";
      }
      return { points, rate: 0, rateType, category, rewardText, cardType: rblCardRewards["Platinum Delight"].cardType };
    },
    dynamicInputs: () => []
  },
  "Cookies": {
    cardType: "hybrid",
    defaultRate: 1 / 100, // 1 reward point for every INR 100 spent offline
    onlineRate: 5 / 100, // 5 reward points for every INR 100 spent online
    cashbackRates: {
      "Myntra": 0.10,
      "Uber": 0.10,
      "Zomato": 0.10
    },
    instantDiscounts: {
      "BookMyShow": 0.10
    },
    mccRates: {
      // Excluded categories
      "0032": 0, "2541": 0, "4001": 0, "5542": 0, "5541": 0, "5172": 0, // Fuel & Auto
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "6513": 0, // Real Estate/Rental
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "6540": 0, // Wallet/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
      "5960": 0 // Miscellaneous
    },
    capping: {
      cashback: {
        "Myntra": { amount: 300, period: "monthly" },
        "Uber": { amount: 300, period: "monthly" },
        "Zomato": { amount: 300, period: "monthly" }
      },
      instantDiscount: {
        "BookMyShow": { amount: 300, period: "monthly" }
      }
    },
    fuelSurchargeWaiver: {
      minAmount: 500,
      maxAmount: 4000,
      maxWaiver: 150
    },
    milestones: [
      { spend: 200000, period: "annually", reward: { voucher: { value: 1000, options: ["Shoppers Stop", "Croma", "Myntra", "Flipkart", "Amazon"] } } },
      { spend: 500000, period: "annually", reward: { voucher: { value: 5000, options: ["Shoppers Stop", "Croma", "Myntra", "Flipkart", "Amazon"] } } }
    ],
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = additionalParams.isOnline ? rblCardRewards["Cookies"].onlineRate : rblCardRewards["Cookies"].defaultRate;
      let category = additionalParams.isOnline ? "Online Purchase" : "Offline Purchase";
      let rateType = additionalParams.isOnline ? "online" : "offline";
      let points = 0;
      let cashback = 0;
      let instantDiscount = 0;

      if (mcc && rblCardRewards["Cookies"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["Cookies"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      if (rate > 0) {
        points = Math.floor(amount * rate);
      }

      if (additionalParams.merchant) {
        if (rblCardRewards["Cookies"].cashbackRates[additionalParams.merchant]) {
          cashback = Math.min(
            amount * rblCardRewards["Cookies"].cashbackRates[additionalParams.merchant],
            rblCardRewards["Cookies"].capping.cashback[additionalParams.merchant].amount
          );
          category = `${additionalParams.merchant} Cashback`;
        } else if (rblCardRewards["Cookies"].instantDiscounts[additionalParams.merchant]) {
          instantDiscount = Math.min(
            amount * rblCardRewards["Cookies"].instantDiscounts[additionalParams.merchant],
            rblCardRewards["Cookies"].capping.instantDiscount[additionalParams.merchant].amount
          );
          category = `${additionalParams.merchant} Instant Discount`;
        }
      }

      let rewardText = "";
      if (points > 0) {
        const cashbackValue = {
          cashValue: points * (rblCardRewards["Cookies"].redemptionRate?.cashValue || 0)
        };
        rewardText += `${points} Reward Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}. `;
      }
      if (cashback > 0) {
        rewardText += `₹${cashback.toFixed(2)} Cashback earned (${category}). `;
      }
      if (instantDiscount > 0) {
        rewardText += `₹${instantDiscount.toFixed(2)} Instant Discount applied (${category}). `;
      }
      if (rewardText === "") {
        rewardText = `No rewards earned for this transaction (${category})`;
      }
      return { points, cashback, instantDiscount, rate, rateType, category, rewardText, cardType: rblCardRewards["Cookies"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an online transaction?',
        name: 'isOnline',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isOnline || false,
        onChange: (value) => onChange('isOnline', value === 'true')
      },
      {
        type: 'select',
        label: 'Select Merchant (if applicable)',
        name: 'merchant',
        options: [
          { label: 'Other', value: '' },
          { label: 'Myntra', value: 'Myntra' },
          { label: 'Uber', value: 'Uber' },
          { label: 'Zomato', value: 'Zomato' },
          { label: 'BookMyShow', value: 'BookMyShow' }
        ],
        value: currentInputs.merchant || '',
        onChange: (value) => onChange('merchant', value)
      }
    ]
  },

  "Platinum Maxima": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 reward points for every INR 100 spent
    acceleratedRate: 10 / 100, // 10 reward points for every INR 100 spent on dining, grocery, entertainment and international purchases
    mccRates: {
      // Excluded categories
      "0032": 0, "2541": 0, "4001": 0, "5542": 0, "5541": 0, "5172": 0, // Fuel & Auto
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "4900": 0, // Utilities
      "6513": 0, // Real Estate/Rental
      "6540": 0, // Wallet/Service Providers
      "6300": 0, "6310": 0, // Insurance
      "5960": 0 // Miscellaneous
    },
    milestones: [
      { spend: 250000, period: "annually", reward: { points: 10000 } },
      { spend: 400000, period: "annually", reward: { points: 10000 } }
    ],
    redemptionRate: {
      cashValue: 0.25 // Assuming 1 point = INR 0.25, adjust if different
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["Platinum Maxima"].defaultRate;
      let category = "Other Purchases";
      let rateType = "default";

      if (additionalParams.isAcceleratedCategory) {
        rate = rblCardRewards["Platinum Maxima"].acceleratedRate;
        category = "Accelerated Category";
        rateType = "accelerated";
      }

      if (mcc && rblCardRewards["Platinum Maxima"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["Platinum Maxima"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * (rblCardRewards["Platinum Maxima"].redemptionRate?.cashValue || 0)
      };
      let rewardText = rate === 0
        ? `No rewards earned for this transaction (${category})`
        : `${points} Reward Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: rblCardRewards["Platinum Maxima"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an accelerated category transaction (dining, grocery, entertainment, or international)?',
        name: 'isAcceleratedCategory',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isAcceleratedCategory || false,
        onChange: (value) => onChange('isAcceleratedCategory', value === 'true')
      }
    ]
  },

  "Insignia Preferred Banking": {
    cardType: "points",
    defaultRate: 5 / 100, // 5 reward points for every INR 100 spent on domestic transactions
    internationalRate: 10 / 100, // 10 reward points for every INR 100 spent on international transactions
    redemptionRate: {
      cashValue: 0.25 // Assuming 1 point = INR 0.25, adjust if different
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = additionalParams.isInternational ? rblCardRewards["Insignia Preferred Banking"].internationalRate : rblCardRewards["Insignia Preferred Banking"].defaultRate;
      let category = additionalParams.isInternational ? "International Transaction" : "Domestic Transaction";
      let points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * (rblCardRewards["Insignia Preferred Banking"].redemptionRate?.cashValue || 0)
      };
      let rewardText = `${points} Reward Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      return { points, rate, category, rewardText, cashbackValue, cardType: rblCardRewards["Insignia Preferred Banking"].cardType };
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

  "iGlobe": {
    cardType: "points",
    defaultRate: 5 / 100, // 5 Reward Points for every INR 100 spent on domestic purchases
    internationalRate: 10 / 100, // 10 Reward Points for every INR 100 spent on international spends
    redemptionRate: {
      cashValue: 0.25 // Assuming 1 point = INR 0.25, adjust if different
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = additionalParams.isInternational ? rblCardRewards["iGlobe"].internationalRate : rblCardRewards["iGlobe"].defaultRate;
      let category = additionalParams.isInternational ? "International Transaction" : "Domestic Transaction";
      let points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * (rblCardRewards["iGlobe"].redemptionRate?.cashValue || 0)
      };
      let rewardText = `${points} Reward Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      return { points, rate, category, rewardText, cashbackValue, cardType: rblCardRewards["iGlobe"].cardType };
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

  "Play": {
    cardType: "hybrid",
    monthlyMovieTickets: {
      spendThreshold: 5000,
      benefit: {
        tickets: 2,
        maxValuePerTicket: 250
      }
    },
    bookMyShowDiscount: {
      amount: 100,
      category: "Food and Beverage"
    },
    mccRates: {
      // Excluded categories
      "9752": 0, "5541": 0, "5983": 0, "5172": 0, "5542": 0, // Petrol
      "6513": 0, // Rental
      "6540": 0, // Wallet
      "6300": 0, "5960": 0, // Insurance
      "4900": 0, // Utilities
      "9399": 0, "9402": 0, "9405": 0, // Government services
      "0032": 0, "2541": 0, "4001": 0, // Fuel & Auto
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9211": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let category = "Eligible Purchase";
      let rewardText = "";

      if (mcc && rblCardRewards["Play"].mccRates[mcc] !== undefined && rblCardRewards["Play"].mccRates[mcc] === 0) {
        category = "Excluded Category";
        rewardText = "No rewards earned for this transaction (Excluded Category)";
      } else {
        rewardText = "Transaction eligible for monthly movie tickets benefit";
        if (additionalParams.isBookMyShow) {
          rewardText += ` and up to ₹${rblCardRewards["Play"].bookMyShowDiscount.amount} discount on food and beverage`;
        }
      }
      return { category, rewardText, cardType: rblCardRewards["Play"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a BookMyShow transaction?',
        name: 'isBookMyShow',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBookMyShow || false,
        onChange: (value) => onChange('isBookMyShow', value === 'true')
      }
    ]
  },
  "LazyPay": {
    cardType: "cashback",
    defaultRate: 0.01, // 1% cashback
    monthlyLimit: 500,
    mccRates: {
      // Excluded categories
      "0032": 0, "2541": 0, "4001": 0, "5542": 0, "5541": 0, "5172": 0, // Fuel & Auto
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "6513": 0, // Real Estate/Rental
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "6540": 0, // Wallets/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
      "5960": 0 // Miscellaneous
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["LazyPay"].defaultRate;
      let category = "Eligible Purchase";

      if (mcc && rblCardRewards["LazyPay"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["LazyPay"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      let cashback = amount * rate;
      cashback = Math.min(cashback, rblCardRewards["LazyPay"].monthlyLimit);

      let rewardText = rate === 0
        ? `No cashback earned for this transaction (${category})`
        : `₹${cashback.toFixed(2)} Cashback earned (${category})`;
      return { cashback, rate, category, rewardText, cardType: rblCardRewards["LazyPay"].cardType };
    },
    dynamicInputs: () => []
  },

  "Bankbazaar Savemax": {
    cardType: "hybrid",
    defaultRate: 1 / 100, // 1 Reward Point for every INR 100 spent
    groceryRate: 5 / 100, // 5x Reward Points on grocery
    cashbackRates: {
      "Zomato": 0.10,
      "BookMyShow": 0.10
    },
    capping: {
      grocery: { points: 1000, period: "monthly" },
      cashback: {
        "Zomato": { amount: 100, period: "monthly" },
        "BookMyShow": { amount: 100, period: "monthly" }
      }
    },
    redemptionRate: {
      cashValue: 0.25
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["Bankbazaar Savemax"].defaultRate;
      let category = "Other Purchases";
      let points = 0;
      let cashback = 0;

      if (additionalParams.isGrocery) {
        rate = rblCardRewards["Bankbazaar Savemax"].groceryRate;
        category = "Grocery";
        points = Math.min(Math.floor(amount * rate), rblCardRewards["Bankbazaar Savemax"].capping.grocery.points);
      } else if (additionalParams.merchant && rblCardRewards["Bankbazaar Savemax"].cashbackRates[additionalParams.merchant]) {
        cashback = Math.min(
          amount * rblCardRewards["Bankbazaar Savemax"].cashbackRates[additionalParams.merchant],
          rblCardRewards["Bankbazaar Savemax"].capping.cashback[additionalParams.merchant].amount
        );
        category = `${additionalParams.merchant} Cashback`;
      } else {
        points = Math.floor(amount * rate);
      }

      let rewardText = cashback > 0
        ? `₹${cashback.toFixed(2)} Cashback earned (${category})`
        : `${points} Reward Points earned (${category}) - Worth ₹${(points * (rblCardRewards["Bankbazaar Savemax"].redemptionRate?.cashValue || 0)).toFixed(2)}`;
      return { points, cashback, rate, category, rewardText, cardType: rblCardRewards["Bankbazaar Savemax"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a grocery purchase?',
        name: 'isGrocery',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isGrocery || false,
        onChange: (value) => onChange('isGrocery', value === 'true')
      },
      {
        type: 'select',
        label: 'Select Merchant (if applicable)',
        name: 'merchant',
        options: [
          { label: 'Other', value: '' },
          { label: 'Zomato', value: 'Zomato' },
          { label: 'BookMyShow', value: 'BookMyShow' }
        ],
        value: currentInputs.merchant || '',
        onChange: (value) => onChange('merchant', value)
      }
    ]
  },

  "Bankbazaar Savemax Pro": {
    cardType: "hybrid",
    defaultRate: 2 / 100, // 2x rewards points on every INR 100 spent on all other purchases
    groceryRate: 10 / 100, // 10x rewards points on every INR 100 spent on groceries
    fuelRate: 5 / 100, // 5x reward points on every INR 100 spent on fuel
    cashbackRates: {
      "BookMyShow": 0.10,
      "Zomato": 0.10
    },
    capping: {
      grocery: { points: 1000, period: "monthly" },
      fuel: { points: 1000, period: "monthly" },
      cashback: {
        "BookMyShow": { amount: 100, period: "monthly" },
        "Zomato": { amount: 100, period: "monthly" }
      }
    },
    milestones: [
      { spend: 200000, period: "annually", reward: { points: 2000 } },
      { spend: 400000, period: "annually", reward: { points: 4000 } }
    ],
    mccRates: {
      // Excluded categories
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "6513": 0, // Real Estate/Rental
      "6540": 0, // Wallet/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0 // Government Services
    },
    redemptionRate: {
      cashValue: 0.25 
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["Bankbazaar Savemax Pro"].defaultRate;
      let category = "Other Purchases";
      let points = 0;
      let cashback = 0;

      if (additionalParams.isGrocery) {
        rate = rblCardRewards["Bankbazaar Savemax Pro"].groceryRate;
        category = "Grocery";
        points = Math.min(Math.floor(amount * rate), rblCardRewards["Bankbazaar Savemax Pro"].capping.grocery.points);
      } else if (additionalParams.isFuel) {
        rate = rblCardRewards["Bankbazaar Savemax Pro"].fuelRate;
        category = "Fuel";
        points = Math.min(Math.floor(amount * rate), rblCardRewards["Bankbazaar Savemax Pro"].capping.fuel.points);
      } else if (additionalParams.merchant && rblCardRewards["Bankbazaar Savemax Pro"].cashbackRates[additionalParams.merchant]) {
        cashback = Math.min(
          amount * rblCardRewards["Bankbazaar Savemax Pro"].cashbackRates[additionalParams.merchant],
          rblCardRewards["Bankbazaar Savemax Pro"].capping.cashback[additionalParams.merchant].amount
        );
        category = `${additionalParams.merchant} Cashback`;
      } else if (mcc && rblCardRewards["Bankbazaar Savemax Pro"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["Bankbazaar Savemax Pro"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      } else {
        points = Math.floor(amount * rate);
      }

      let rewardText = cashback > 0
        ? `₹${cashback.toFixed(2)} Cashback earned (${category})`
        : `${points} Reward Points earned (${category}) - Worth ₹${(points * (rblCardRewards["Bankbazaar Savemax Pro"].redemptionRate?.cashValue || 0)).toFixed(2)}`;
      return { points, cashback, rate, category, rewardText, cardType: rblCardRewards["Bankbazaar Savemax Pro"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a grocery purchase?',
        name: 'isGrocery',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isGrocery || false,
        onChange: (value) => onChange('isGrocery', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a fuel purchase?',
        name: 'isFuel',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isFuel || false,
        onChange: (value) => onChange('isFuel', value === 'true')
      },
      {
        type: 'select',
        label: 'Select Merchant (if applicable)',
        name: 'merchant',
        options: [
          { label: 'Other', value: '' },
          { label: 'BookMyShow', value: 'BookMyShow' },
          { label: 'Zomato', value: 'Zomato' }
        ],
        value: currentInputs.merchant || '',
        onChange: (value) => onChange('merchant', value)
      }
    ]
  },
  "MoneyTap Black": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 reward points for every INR 100 spent
    onlineRate: 10 / 100, // 10 reward points for every INR 100 spent online
    mccRates: {
      // Excluded categories
      "0032": 0, "2541": 0, "4001": 0, "5542": 0, "5541": 0, "5172": 0, // Fuel & Auto
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "6513": 0, // Real Estate/Rental
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "6540": 0, // Wallets/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
      "5960": 0 // Miscellaneous
    },
    capping: {
      online: { points: 500, period: "monthly" }
    },
    monthlyBenefit: {
      transactions: 5,
      minAmount: 1000,
      reward: { points: 1000 }
    },
    milestones: [
      { spend: 250000, period: "annually", reward: { points: 8000 } },
      { spend: 400000, period: "annually", reward: { points: 8000 } }
    ],
    bookMyShowDiscount: {
      rate: 0.10,
      maxDiscount: 100,
      maxUses: 15,
      period: "annually"
    },
    redemptionRate: {
      cashValue: 0.25 // Assuming 1 point = INR 0.25, adjust if different
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = rblCardRewards["MoneyTap Black"].defaultRate;
      let category = "Other Purchases";
      let points = 0;
      let discount = 0;

      if (additionalParams.isOnline) {
        rate = rblCardRewards["MoneyTap Black"].onlineRate;
        category = "Online Purchase";
        points = Math.min(Math.floor(amount * rate), rblCardRewards["MoneyTap Black"].capping.online.points);
      } else if (mcc && rblCardRewards["MoneyTap Black"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["MoneyTap Black"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      if (rate > 0) {
        points = Math.floor(amount * rate);
      }

      if (additionalParams.isBookMyShow) {
        discount = Math.min(
          amount * rblCardRewards["MoneyTap Black"].bookMyShowDiscount.rate,
          rblCardRewards["MoneyTap Black"].bookMyShowDiscount.maxDiscount
        );
        category = "BookMyShow Purchase";
      }

      let rewardText = "";
      if (points > 0) {
        const cashbackValue = {
          cashValue: points * (rblCardRewards["MoneyTap Black"].redemptionRate?.cashValue || 0)
        };
        rewardText += `${points} Reward Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} `;
      }
      if (discount > 0) {
        rewardText += `₹${discount.toFixed(2)} Discount applied on BookMyShow purchase. `;
      }
      if (rewardText === "") {
        rewardText = `No rewards earned for this transaction (${category})`;
      }
      return { points, discount, rate, category, rewardText, cardType: rblCardRewards["MoneyTap Black"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an online transaction?',
        name: 'isOnline',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isOnline || false,
        onChange: (value) => onChange('isOnline', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a BookMyShow transaction?',
        name: 'isBookMyShow',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBookMyShow || false,
        onChange: (value) => onChange('isBookMyShow', value === 'true')
      }
    ]
  },

  "MoneyTap": {
    cardType: "hybrid",
    defaultRate: 1 / 100, // 1 reward point for every INR 100 spent on all purchases at merchant outlet
    onlineRate: 2 / 100, // 2 reward points for every INR 100 spent on all online purchases
    mccRates: {
      // Excluded categories
      "0032": 0, "2541": 0, "4001": 0, "5542": 0, "5541": 0, "5172": 0, // Fuel & Auto
      "4900": 0, // Utilities
      "6300": 0, "6310": 0, // Insurance
      "6050": 0, "6051": 0, "4829": 0, // Quasi-Cash
      "0066": 0, "4011": 0, "4112": 0, // Railways
      "6513": 0, // Real Estate/Rental
      "8220": 0, "8244": 0, "8249": 0, "8211": 0, "8241": 0, "8299": 0, // Education
      "6540": 0, // Wallets/Service Providers
      "9400": 0, "1490": 0, "2490": 0, "2995": 0, "7800": 0, "9406": 0, "9222": 0, "9405": 0, "9399": 0, "9211": 0, "9402": 0, "9401": 0, "9311": 0, "9223": 0, // Government Services
      "1711": 0, "1740": 0, "0763": 0, "1520": 0, "0742": 0, "1761": 0, "1799": 0, "1750": 0, "1731": 0, "1771": 0, "0780": 0, // Contracted Services
      "6011": 0, "6010": 0, // Cash
      "5960": 0 // Miscellaneous
    },
    cashbackRates: {
      "Zomato": 0.20
    },
    capping: {
      cashback: {
        "Zomato": { amount: 200, period: "monthly" }
      }
    },
    milestones: [
      { spend: 250000, period: "annually", reward: { voucher: { type: "Amazon", value: 1000 } } }
    ],
    movieTickets: {
      offer: "1+1",
      maxDiscount: 200,
      applicableDays: ["Saturday", "Sunday"],
      period: "monthly"
    },
    redemptionRate: {
      cashValue: 0.25 // Assuming 1 point = INR 0.25, adjust if different
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = additionalParams.isOnline ? rblCardRewards["MoneyTap"].onlineRate : rblCardRewards["MoneyTap"].defaultRate;
      let category = additionalParams.isOnline ? "Online Purchase" : "Other Purchases";
      let points = 0;
      let cashback = 0;
      let movieDiscount = 0;

      if (mcc && rblCardRewards["MoneyTap"].mccRates[mcc] !== undefined) {
        rate = rblCardRewards["MoneyTap"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      if (rate > 0) {
        points = Math.floor(amount * rate);
      }

      if (additionalParams.merchant === "Zomato") {
        cashback = Math.min(
          amount * rblCardRewards["MoneyTap"].cashbackRates.Zomato,
          rblCardRewards["MoneyTap"].capping.cashback.Zomato.amount
        );
        category = "Zomato Cashback";
      }

      if (additionalParams.isMovieTicket && rblCardRewards["MoneyTap"].movieTickets.applicableDays.includes(additionalParams.dayOfWeek)) {
        movieDiscount = Math.min(amount / 2, rblCardRewards["MoneyTap"].movieTickets.maxDiscount);
        category = "Movie Ticket Discount";
      }

      let rewardText = "";
      if (points > 0) {
        const cashbackValue = {
          cashValue: points * (rblCardRewards["MoneyTap"].redemptionRate?.cashValue || 0)
        };
        rewardText += `${points} Reward Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} `;
      }
      if (cashback > 0) {
        rewardText += `₹${cashback.toFixed(2)} Cashback earned on Zomato purchase. `;
      }
      if (movieDiscount > 0) {
        rewardText += `₹${movieDiscount.toFixed(2)} Discount applied on movie ticket purchase. `;
      }
      if (rewardText === "") {
        rewardText = `No rewards earned for this transaction (${category})`;
      }
      return { points, cashback, movieDiscount, rate, category, rewardText, cardType: rblCardRewards["MoneyTap"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an online transaction?',
        name: 'isOnline',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isOnline || false,
        onChange: (value) => onChange('isOnline', value === 'true')
      },
      {
        type: 'select',
        label: 'Select Merchant (if applicable)',
        name: 'merchant',
        options: [
          { label: 'Other', value: '' },
          { label: 'Zomato', value: 'Zomato' }
        ],
        value: currentInputs.merchant || '',
        onChange: (value) => onChange('merchant', value)
      },
      {
        type: 'radio',
        label: 'Is this a movie ticket purchase?',
        name: 'isMovieTicket',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isMovieTicket || false,
        onChange: (value) => onChange('isMovieTicket', value === 'true')
      },
      {
        type: 'select',
        label: 'Day of the week (for movie tickets)',
        name: 'dayOfWeek',
        options: [
          { label: 'Monday', value: 'Monday' },
          { label: 'Tuesday', value: 'Tuesday' },
          { label: 'Wednesday', value: 'Wednesday' },
          { label: 'Thursday', value: 'Thursday' },
          { label: 'Friday', value: 'Friday' },
          { label: 'Saturday', value: 'Saturday' },
          { label: 'Sunday', value: 'Sunday' }
        ],
        value: currentInputs.dayOfWeek || '',
        onChange: (value) => onChange('dayOfWeek', value),
        condition: (inputs) => inputs.isMovieTicket
      }
    ]
  }
};

export const calculateRBLRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = rblCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      rewardText: "Card not found",
      category: "Unknown",
      cashbackValue: { cashValue: 0 },
      cardType: "unknown"
    };
  }

  return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getRBLCardInputs = (cardName, currentInputs, onChange, selectedMcc) => {
  const cardReward = rblCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange, selectedMcc) : [];
};