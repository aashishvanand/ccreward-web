export const kotakCardRewards = {
  "811": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 1 / 100,
    onlineRate: 2 / 100,
    redemptionRate: 0.25, // Assuming 1 point = Rs. 0.25
    milestones: [
      { spend: 75000, reward: "cashback", value: 750 },
      { spend: 75000, reward: "pvrTickets", value: 4 }
    ],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["811"].defaultRate;
      let category = "Offline Spend";
      let rateType = "default";

      if (additionalParams.isOnline) {
        rate = kotakCardRewards["811"].onlineRate;
        category = "Online Spend";
        rateType = "online";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * kotakCardRewards["811"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
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
  "811 #DreamDifferent": {
    cardType: "points",
    defaultRate: 1 / 100,
    onlineRate: 4 / 100,
    mccRates: {
      "5541": 0, // Fuel
      "5542": 0, // Fuel
      "4112": 0, // Railway
      "6011": 0, // Cash withdrawals
    },
    milestones: [
      { spend: 36000, reward: "amazonVoucher", value: 250 },
      { spend: 72000, reward: "amazonVoucher", value: 1000 }
    ],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["811 #DreamDifferent"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isOnline && additionalParams.isRuPay) {
        rate = kotakCardRewards["811 #DreamDifferent"].onlineRate;
        category = "Online Spend";
        rateType = "online";
      } else if (additionalParams.isOnline) {
        rate = 2 / 100; // 2 points for online spends on non-RuPay variant
        category = "Online Spend";
        rateType = "online";
      }

      if (mcc in kotakCardRewards["811 #DreamDifferent"].mccRates) {
        rate = kotakCardRewards["811 #DreamDifferent"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        rateType = "mcc-specific";
      }

      const points = Math.floor(amount * rate);

      // Check for milestone rewards
      let milestoneReward = 0;
      const totalSpend = additionalParams.totalAnnualSpend + amount;
      for (const milestone of kotakCardRewards["811 #DreamDifferent"].milestones) {
        if (totalSpend >= milestone.spend) {
          milestoneReward = milestone.value;
        } else {
          break;
        }
      }

      return { points, milestoneReward, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Online', value: 'online' },
          { label: 'RuPay', value: 'rupay' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnline', value === 'online');
          onChange('isRuPay', value === 'rupay');
        }
      },
      {
        type: 'select',
        label: 'Total annual spend so far',
        name: 'totalAnnualSpend',
        options: [
          { label: 'Up to ₹36,000', value: 0 },
          { label: '₹36,001 - ₹72,000', value: 36000 },
          { label: 'Above ₹72,000', value: 72000 }
        ],
        value: currentInputs.totalAnnualSpend || 0,
        onChange: (value) => onChange('totalAnnualSpend', parseInt(value))
      }
    ]
  },
  "Indian Oil": {
    cardType: "points",
    defaultRate: 3 / 150,
    fuelRate: 24 / 150,
    groceryDiningRate: 12 / 150,
    redemptionRate: 0.25,
    mccRates: {
    },
    fuelMCCs: ["5541", "5542"],
    groceryDiningMCCs: ["5812", "5814", "5813", "5411", "5311", "5399", "5422", "5451", "5499", "5441"],
    capping: {
      fuel: { points: 1200, period: "statement cycle" },
      groceryDining: { points: 800, period: "statement cycle" }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["Indian Oil"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (kotakCardRewards["Indian Oil"].fuelMCCs.includes(mcc)) {
        rate = kotakCardRewards["Indian Oil"].fuelRate;
        category = "Fuel";
        rateType = "fuel";
      } else if (kotakCardRewards["Indian Oil"].groceryDiningMCCs.includes(mcc)) {
        rate = kotakCardRewards["Indian Oil"].groceryDiningRate;
        category = "Grocery and Dining";
        rateType = "grocery-dining";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * kotakCardRewards["Indian Oil"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: () => []
  },
  "6E Rewards": {
    cardType: "points",
    defaultRate: 1 / 100,
    indigoRate: 3 / 100,
    specialRate: 2 / 100,
    specialCategories: ["5812", "5814", "5411", "7832"], // Dining, Grocery, Entertainment
    mccRates: {
      "6513": 0, "6540": 0, "8211": 0, "8220": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0,
      "9211": 0, "9222": 0, "9311": 0, "9399": 0, "9402": 0, "9405": 0, "9950": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["6E Rewards"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isIndigoTransaction) {
        rate = kotakCardRewards["6E Rewards"].indigoRate;
        category = "IndiGo Transaction";
        rateType = "indigo";
      } else if (kotakCardRewards["6E Rewards"].specialCategories.includes(mcc)) {
        rate = kotakCardRewards["6E Rewards"].specialRate;
        category = "Special Category";
        rateType = "special";
      } else if (mcc in kotakCardRewards["6E Rewards"].mccRates) {
        rate = kotakCardRewards["6E Rewards"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an IndiGo transaction?',
        name: 'isIndigoTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isIndigoTransaction || false,
        onChange: (value) => onChange('isIndigoTransaction', value === 'true')
      }
    ]
  },
  "6E Rewards XL": {
    cardType: "points",
    defaultRate: 2 / 100,
    indigoRate: 6 / 100,
    specialRate: 3 / 100,
    specialCategories: ["5812", "5814", "5411", "7832"], // Dining, Grocery, Entertainment
    mccRates: {
      "6513": 0, "6540": 0, "8211": 0, "8220": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0,
      "9211": 0, "9222": 0, "9311": 0, "9399": 0, "9402": 0, "9405": 0, "9950": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["6E Rewards XL"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isIndigoTransaction) {
        rate = kotakCardRewards["6E Rewards XL"].indigoRate;
        category = "IndiGo Transaction";
        rateType = "indigo";
      } else if (kotakCardRewards["6E Rewards XL"].specialCategories.includes(mcc)) {
        rate = kotakCardRewards["6E Rewards XL"].specialRate;
        category = "Special Category";
        rateType = "special";
      } else if (mcc in kotakCardRewards["6E Rewards XL"].mccRates) {
        rate = kotakCardRewards["6E Rewards XL"].mccRates[mcc];
        category = "Excluded Category";
        rateType = "excluded";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an IndiGo transaction?',
        name: 'isIndigoTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isIndigoTransaction || false,
        onChange: (value) => onChange('isIndigoTransaction', value === 'true')
      }
    ]
  },
  "League": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 4 / 150,
    specialRate: 8 / 150,
    specialCategories: ["4722", "4723", "4511", "5732", "5722", "5311"],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["League"].defaultRate;
      let category = "Other Categories";
      let rateType = "default";

      if (kotakCardRewards["League"].specialCategories.includes(mcc)) {
        rate = kotakCardRewards["League"].specialRate;
        category = "Special Category";
        rateType = "special";
      }

      if (additionalParams.annualSpend >= 200000) {
        rate = kotakCardRewards["League"].specialRate;
        rateType = "high-spend";
      }

      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'select',
        label: 'Total annual spend so far',
        name: 'annualSpend',
        options: [
          { label: 'Up to ₹200,000', value: 0 },
          { label: 'Above ₹200,000', value: 200000 }
        ],
        value: currentInputs.annualSpend || 0,
        onChange: (value) => onChange('annualSpend', parseInt(value))
      }
    ]
  },
  "Metro": {
    cardType: "cashback",
    mccRates: {
    },
    defaultRate: 0,
    metroRates: [
      { minSpend: 10001, maxSpend: 30000, rate: 0.0025 },
      { minSpend: 30001, maxSpend: 500000, rate: 0.005 },
      { minSpend: 500001, maxSpend: Infinity, rate: 0.01 }
    ],
    maxCashback: 10000,
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["Metro"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let cashback = 0;

      if (additionalParams.isMetroSpend) {
        const totalSpend = additionalParams.spendTier + amount;
        for (const tier of kotakCardRewards["Metro"].metroRates) {
          if (totalSpend >= tier.minSpend && totalSpend <= tier.maxSpend) {
            rate = tier.rate;
            break;
          }
        }
        cashback = Math.min(amount * rate, kotakCardRewards["Metro"].maxCashback);
        category = "Metro Spend";
        rateType = "metro";
      }

      return { cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Metro spend?',
        name: 'isMetroSpend',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isMetroSpend || false,
        onChange: (value) => onChange('isMetroSpend', value === 'true')
      },
      {
        type: 'select',
        label: 'Current monthly Metro spend tier',
        name: 'spendTier',
        options: [
          { label: 'Up to ₹10,000', value: 0 },
          { label: '₹10,001 - ₹30,000', value: 10001 },
          { label: '₹30,001 - ₹500,000', value: 30001 },
          { label: 'Above ₹500,000', value: 500001 }
        ],
        value: currentInputs.spendTier || 0,
        onChange: (value) => onChange('spendTier', parseInt(value)),
        condition: (inputs) => inputs.isMetroSpend
      }
    ]
  },
  "MOJO": {
    cardType: "points",
    defaultRate: 1 / 100,
    onlineRate: 2.5 / 100,
    redemptionRate: 0.40,
    mccRates: {
      "5541": 0, // Fuel
      "5542": 0, // Fuel
      "6011": 0, // Cash withdrawal
    },
    milestones: [
      { spend: 75000, points: 2500, period: "quarterly" }
    ],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["MOJO"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isOnline) {
        rate = kotakCardRewards["MOJO"].onlineRate;
        category = "Online Spends";
        rateType = "online";
      } else if (mcc in kotakCardRewards["MOJO"].mccRates) {
        rate = kotakCardRewards["MOJO"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        rateType = "mcc-specific";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * kotakCardRewards["MOJO"].redemptionRate;

      // Check for milestone bonus (only for first year, quarterly)
      let bonusPoints = 0;
      if (additionalParams.isFirstYear && additionalParams.quarterlySpend) {
        const totalSpend = additionalParams.quarterlySpend + amount;
        for (const milestone of kotakCardRewards["MOJO"].milestones) {
          if (totalSpend >= milestone.spend) {
            bonusPoints = milestone.points;
            break;
          }
        }
      }

      return { points, bonusPoints, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Online', value: 'online' },
          { label: 'First Year', value: 'firstYear' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnline', value === 'online');
          onChange('isFirstYear', value === 'firstYear');
        }
      },
      {
        type: 'select',
        label: 'Total quarterly spend so far',
        name: 'quarterlySpend',
        options: [
          { label: 'Up to ₹75,000', value: 0 },
          { label: 'Above ₹75,000', value: 75000 }
        ],
        value: currentInputs.quarterlySpend || 0,
        onChange: (value) => onChange('quarterlySpend', parseInt(value)),
        condition: (inputs) => inputs.isFirstYear
      }
    ]
  },
  "Myntra": {
    cardType: "cashback",
    defaultRate: 0.0125, // 1.25% cashback on all other spends
    myntraRate: 0.075, // 7.5% instant discount on Myntra
    preferredRate: 0.05, // 5% cashback on preferred partners
    mccRates: {
      "6513": 0, "6540": 0, "5541": 0, "5542": 0, "5983": 0, "5172": 0, "5552": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["Myntra"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let cashback = 0;
      let instantDiscount = 0;

      if (additionalParams.isMyntra) {
        rate = kotakCardRewards["Myntra"].myntraRate;
        category = "Myntra";
        rateType = "myntra";
        instantDiscount = Math.min(amount * rate, 750); // Max discount of Rs. 750
      } else if (additionalParams.isPreferredPartner) {
        rate = kotakCardRewards["Myntra"].preferredRate;
        category = "Preferred Partner";
        rateType = "preferred";
        cashback = Math.min(amount * rate, 1000); // Max cashback of Rs. 1000 per statement cycle
      } else if (!(mcc in kotakCardRewards["Myntra"].mccRates)) {
        cashback = amount * rate;
      } else {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      return { cashback, instantDiscount, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Myntra', value: 'myntra' },
          { label: 'Preferred Partner', value: 'preferred' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isMyntra', value === 'myntra');
          onChange('isPreferredPartner', value === 'preferred');
        }
      }
    ]
  },
  "Privy League Signature": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 2 / 100,
    specialRate: 5 / 100,
    redemptionRate: 0.25,
    shopperCategories: ["5311", "5411", "5732", "5399", "5999"], // Apparel, Grocery, Electronics, Online, Department stores
    travellerCategories: ["4511", "7011", "5309", "4722"], // Airlines, Hotels, Duty Free, Travel Agencies
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["Privy League Signature"].defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";

      if ((additionalParams.plan === "Shopper" && kotakCardRewards["Privy League Signature"].shopperCategories.includes(mcc)) ||
        (additionalParams.plan === "Traveller" && kotakCardRewards["Privy League Signature"].travellerCategories.includes(mcc)) ||
        (additionalParams.plan === "Traveller" && additionalParams.isInternational)) {
        rate = kotakCardRewards["Privy League Signature"].specialRate;
        category = additionalParams.plan === "Shopper" ? "Shopping" : "Travel";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * kotakCardRewards["Privy League Signature"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const inputs = [
        {
          type: 'select',
          label: 'Reward Plan',
          name: 'plan',
          options: [
            { label: "Shopper's Plan", value: 'Shopper' },
            { label: "Traveller's Plan", value: 'Traveller' }
          ],
          value: currentInputs.plan || 'Shopper',
          onChange: (value) => onChange('plan', value)
        }
      ];

      const travellerCategories = ["4511", "7011", "5309", "4722"]; // Airlines, Hotels, Duty Free, Travel Agencies
      if (currentInputs.plan === 'Traveller' && travellerCategories.includes(selectedMcc)) {
        inputs.push({
          type: 'radio',
          label: 'Is this an international transaction?',
          name: 'isInternational',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isInternational || false,
          onChange: (value) => onChange('isInternational', value === 'true')
        });
      }

      return inputs;
    }
  },
  "PVR INOX": {
    cardType: "points",
    mccRates: {
    },
    ticketRate: 1 / 10000, // 1 ticket per Rs. 10,000 spent
    ticketValue: 300,
    discountRate: 0.05, // 5% discount on movie tickets
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = 1 / 100;
      const category = "All Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);
      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "PVR INOX Gold": {
    cardType: "cashback",
    mccRates: {
    },
    ticketThreshold1: 10000,
    ticketThreshold2: 15000,
    freeTickets1: 1,
    freeTickets2: 2,
    foodCashbackRate: 0.15,
    ticketCashbackRate: 0.05,
    calculateRewards: (amount, mcc, additionalParams) => {
      let cashback = 0;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isPVRFood) {
        cashback = Math.min(amount * 0.15, 750);
        category = "PVR Food";
        rateType = "food-cashback";
      } else if (additionalParams.isPVRTicket) {
        cashback = Math.min(amount * 0.05, 250);
        category = "PVR Ticket";
        rateType = "ticket-cashback";
      }

      return { cashback, rate: cashback / amount, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'PVR Food', value: 'food' },
          { label: 'PVR Ticket', value: 'ticket' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isPVRFood', value === 'food');
          onChange('isPVRTicket', value === 'ticket');
        }
      }
    ]
  },
  "PVR Platinum": {
    cardType: "cashback",
    mccRates: {
    },
    ticketThreshold: 10000,
    freeTickets: 2,
    foodCashbackRate: 0.15,
    ticketCashbackRate: 0.05,
    calculateRewards: (amount, mcc, additionalParams) => {
      let cashback = 0;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isPVRFood) {
        cashback = Math.min(amount * 0.15, 750);
        category = "PVR Food";
        rateType = "food-cashback";
      } else if (additionalParams.isPVRTicket) {
        cashback = Math.min(amount * 0.05, 250);
        category = "PVR Ticket";
        rateType = "ticket-cashback";
      }

      return { cashback, rate: cashback / amount, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'PVR Food', value: 'food' },
          { label: 'PVR Ticket', value: 'ticket' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isPVRFood', value === 'food');
          onChange('isPVRTicket', value === 'ticket');
        }
      }
    ]
  },
  "Royale Signature": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 2 / 150,
    specialRate: 4 / 150,
    specialCategories: ["7011", "5812", "4722", "4723", "4511"], // MCCs for Hotels, Restaurants, Travel Agencies, Airlines
    milestones: [
      { spend: 400000, points: 10000 },
      { spend: 800000, points: 30000 }
    ],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards["Royale Signature"].defaultRate;
      let category = "Other Categories";
      let rateType = "default";

      if (kotakCardRewards["Royale Signature"].specialCategories.includes(mcc) || additionalParams.isInternational) {
        rate = kotakCardRewards["Royale Signature"].specialRate;
        category = "Special Categories";
        rateType = "special";
      }

      const points = Math.floor(amount * rate);

      // Check for milestone bonus
      let bonusPoints = 0;
      const totalSpend = additionalParams.totalAnnualSpend + amount;
      for (const milestone of kotakCardRewards["Royale Signature"].milestones) {
        if (totalSpend >= milestone.spend) {
          bonusPoints = milestone.points;
        } else {
          break;
        }
      }

      return { points, bonusPoints, rate, rateType, category };
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
        type: 'select',
        label: 'Total annual spend so far',
        name: 'totalAnnualSpend',
        options: [
          { label: 'Up to ₹400,000', value: 0 },
          { label: '₹400,001 - ₹800,000', value: 400000 },
          { label: 'Above ₹800,000', value: 800000 }
        ],
        value: currentInputs.totalAnnualSpend || 0,
        onChange: (value) => onChange('totalAnnualSpend', parseInt(value))
      }
    ]
  },
  "UPI RuPay": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 3 / 100,
    redemptionRate: 0.1, // 1000 points = Rs. 100
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = kotakCardRewards["UPI RuPay"].defaultRate;
      const category = "All Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);
      const cashbackValue = points * kotakCardRewards["UPI RuPay"].redemptionRate / 1000;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: () => []
  },
  "White": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 0, // No regular points
    milestones: [
      { spend: 200000, value: 2000 },
      { spend: 400000, value: 4000 },
      { spend: 600000, value: 6000 },
      { spend: 900000, value: 7000 },
      { spend: 1200000, value: 8000 }
    ],
    redemptionRate: {
      catalog: 1,
      cashback: 0.7
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let whitePassValue = 0;
      let category = "Spend Milestone";
      let rateType = "milestone";

      const totalSpend = additionalParams.spendTier + amount;
      for (const milestone of kotakCardRewards.White.milestones) {
        if (totalSpend >= milestone.spend) {
          whitePassValue = milestone.value;
        } else {
          break;
        }
      }

      return { points: whitePassValue, rate: whitePassValue / amount, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'select',
        label: 'Current annual spend range',
        name: 'spendTier',
        options: [
          { label: 'Up to ₹2,00,000', value: 0 },
          { label: '₹2,00,001 - ₹4,00,000', value: 200000 },
          { label: '₹4,00,001 - ₹6,00,000', value: 400000 },
          { label: '₹6,00,001 - ₹9,00,000', value: 600000 },
          { label: '₹9,00,001 - ₹12,00,000', value: 900000 },
          { label: 'Above ₹12,00,000', value: 1200000 }
        ],
        value: currentInputs.spendTier || 0,
        onChange: (value) => onChange('spendTier', parseInt(value))
      }
    ]
  },
  "White Reserve": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 0, // No regular points
    milestones: [
      { spend: 300000, value: 5000 },
      { spend: 1000000, value: 15000 },
      { spend: 2000000, value: 22000 },
      { spend: 3000000, value: 24000 },
      { spend: 4000000, value: 26000 },
      { spend: 5000000, value: 28000 },
      { spend: 7500000, value: 63000 },
      { spend: 10000000, value: 67000 }
    ],
    redemptionRate: {
      catalog: 1,
      cashback: 0.7
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let whitePassValue = 0;
      let category = "Spend Milestone";
      let rateType = "milestone";

      const totalSpend = additionalParams.spendTier + amount;
      for (const milestone of kotakCardRewards["White Reserve"].milestones) {
        if (totalSpend >= milestone.spend) {
          whitePassValue = milestone.value;
        } else {
          break;
        }
      }

      return { points: whitePassValue, rate: whitePassValue / amount, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'select',
        label: 'Current annual spend range',
        name: 'spendTier',
        options: [
          { label: 'Up to ₹3,00,000', value: 0 },
          { label: '₹3,00,001 - ₹10,00,000', value: 300000 },
          { label: '₹10,00,001 - ₹20,00,000', value: 1000000 },
          { label: '₹20,00,001 - ₹30,00,000', value: 2000000 },
          { label: '₹30,00,001 - ₹40,00,000', value: 3000000 },
          { label: '₹40,00,001 - ₹50,00,000', value: 4000000 },
          { label: '₹50,00,001 - ₹75,00,000', value: 5000000 },
          { label: '₹75,00,001 - ₹1,00,00,000', value: 7500000 },
          { label: 'Above ₹1,00,00,000', value: 10000000 }
        ],
        value: currentInputs.spendTier || 0,
        onChange: (value) => onChange('spendTier', parseInt(value))
      }
    ],
  },
  "Zen": {
    cardType: "points",
    defaultRate: 5 / 150,
    mccRates: {
      "5311": 10 / 150, // Department Stores
      "5611": 10 / 150, // Men's and Boys' Clothing and Accessories Stores
      "5621": 10 / 150, // Women's Ready-to-Wear Stores
      "5631": 10 / 150, // Women's Accessory and Specialty Shops
      "5651": 10 / 150, // Family Clothing Stores
      "5661": 10 / 150, // Shoe Stores
      "5691": 10 / 150, // Men's and Women's Clothing Stores
      "5699": 10 / 150, // Miscellaneous Apparel and Accessory Shops
      "5944": 10 / 150, // Jewelry Stores
      "5541": 0, // Fuel
      "5542": 0  // Fuel
    },
    pointsCap: 6500,
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = kotakCardRewards.Zen.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc in kotakCardRewards.Zen.mccRates) {
        rate = kotakCardRewards.Zen.mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Shopping";
        rateType = rate === 0 ? "excluded" : "shopping";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
};

export const calculateKotakRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = kotakCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      cashback: 0,
      rewardText: "Card not found",
      uncappedPoints: 0,
      cappedPoints: 0,
      appliedCap: null
    };
  }

  const result = cardReward.calculateRewards(amount, mcc, additionalParams);

  if (cardReward.cardType === "cashback") {
    return applyCashbackCapping(result, cardReward, cardName);
  } else if (cardReward.cardType === "tickets") {
    return applyTicketCapping(result, cardReward, cardName);
  } else {
    return applyPointsCapping(result, cardReward, cardName);
  }
};

export const applyTicketCapping = (result, cardReward, cardName) => {
  let { tickets, foodCashback, ticketCashback, rate, rateType, category } = result;
  let cappedTickets = tickets;
  let cappedFoodCashback = foodCashback;
  let cappedTicketCashback = ticketCashback;
  let appliedCap = null;

  if (cardReward.capping) {
    if (cardReward.capping.maxTickets) {
      cappedTickets = Math.min(tickets, cardReward.capping.maxTickets);
    }
    if (cardReward.capping.maxFoodCashback) {
      cappedFoodCashback = Math.min(foodCashback, cardReward.capping.maxFoodCashback);
    }
    if (cardReward.capping.maxTicketCashback) {
      cappedTicketCashback = Math.min(ticketCashback, cardReward.capping.maxTicketCashback);
    }

    if (cappedTickets < tickets || cappedFoodCashback < foodCashback || cappedTicketCashback < ticketCashback) {
      appliedCap = {
        maxTickets: cardReward.capping.maxTickets,
        maxFoodCashback: cardReward.capping.maxFoodCashback,
        maxTicketCashback: cardReward.capping.maxTicketCashback,
        period: cardReward.capping.period
      };
    }
  }

  const rewardText = generateTicketRewardText(cardName, cappedTickets, cappedFoodCashback, cappedTicketCashback, rate, rateType, category, appliedCap);

  return {
    tickets: cappedTickets,
    foodCashback: cappedFoodCashback,
    ticketCashback: cappedTicketCashback,
    rewardText,
    uncappedTickets: tickets,
    uncappedFoodCashback: foodCashback,
    uncappedTicketCashback: ticketCashback,
    cappedTickets,
    cappedFoodCashback,
    cappedTicketCashback,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

export const generateTicketRewardText = (cardName, tickets, foodCashback, ticketCashback, rate, rateType, category, appliedCap) => {
  let rewardText = `${tickets} Free Movie Tickets`;

  if (foodCashback > 0) {
    rewardText += `, ₹${foodCashback.toFixed(2)} Food Cashback`;
  }

  if (ticketCashback > 0) {
    rewardText += `, ₹${ticketCashback.toFixed(2)} Ticket Cashback`;
  }

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxTickets} tickets, ₹${appliedCap.maxFoodCashback} food cashback, ₹${appliedCap.maxTicketCashback} ticket cashback per ${appliedCap.period})`;
  }

  return rewardText;
};


export const applyCashbackCapping = (result, cardReward, cardName) => {
  let { cashback, tickets, foodCashback, ticketCashback, rate, rateType, category } = result;
  let cappedCashback = cashback;
  let appliedCap = null;

  if (cardReward.capping) {
    if (cardReward.capping.maxCashback) {
      cappedCashback = Math.min(cashback, cardReward.capping.maxCashback);
    }

    // Handle ticket-based rewards as cashback
    if (tickets > 0) {
      cappedCashback += tickets * (cardReward.ticketValue || 0);
    }
    if (foodCashback > 0) {
      cappedCashback += foodCashback;
    }
    if (ticketCashback > 0) {
      cappedCashback += ticketCashback;
    }

    if (cappedCashback < (cashback + (tickets * (cardReward.ticketValue || 0)) + foodCashback + ticketCashback)) {
      appliedCap = {
        maxCashback: cardReward.capping.maxCashback,
        period: cardReward.capping.period
      };
    }
  }

  const rewardText = generateCashbackRewardText(cardName, cappedCashback, rate, rateType, category, appliedCap);

  return {
    cashback: cappedCashback,
    rewardText,
    uncappedCashback: cashback + (tickets * (cardReward.ticketValue || 0)) + foodCashback + ticketCashback,
    cappedCashback,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

export const applyPointsCapping = (result, cardReward, cardName) => {
  let { points, tickets, foodCashback, ticketCashback, rate, rateType, category } = result;
  let cappedPoints = points;
  let appliedCap = null;

  if (cardReward.capping) {
    if (cardReward.capping.maxPoints) {
      cappedPoints = Math.min(points, cardReward.capping.maxPoints);
    }

    // Handle ticket-based rewards as points
    if (tickets > 0) {
      cappedPoints += tickets * (cardReward.ticketPointValue || 0);
    }
    if (foodCashback > 0) {
      cappedPoints += Math.floor(foodCashback / (cardReward.pointValue || 1));
    }
    if (ticketCashback > 0) {
      cappedPoints += Math.floor(ticketCashback / (cardReward.pointValue || 1));
    }

    if (cappedPoints < (points + (tickets * (cardReward.ticketPointValue || 0)) +
      Math.floor(foodCashback / (cardReward.pointValue || 1)) +
      Math.floor(ticketCashback / (cardReward.pointValue || 1)))) {
      appliedCap = {
        maxPoints: cardReward.capping.maxPoints,
        period: cardReward.capping.period
      };
    }
  }

  const rewardText = generatePointsRewardText(cardName, cappedPoints, rate, rateType, category, appliedCap);

  return {
    points: cappedPoints,
    rewardText,
    uncappedPoints: points + (tickets * (cardReward.ticketPointValue || 0)) +
      Math.floor(foodCashback / (cardReward.pointValue || 1)) +
      Math.floor(ticketCashback / (cardReward.pointValue || 1)),
    cappedPoints,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

const generateCashbackRewardText = (cardName, cashback, rate, rateType, category, appliedCap) => {
  let rewardText = `₹${cashback.toFixed(2)} Cashback`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ₹${appliedCap.maxCashback} per ${appliedCap.period})`;
  }

  return rewardText;
};

const generatePointsRewardText = (cardName, points, rate, rateType, category, appliedCap) => {
  let rewardText = `${points} Reward Points`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points per ${appliedCap.period})`;
  }

  return rewardText;
};