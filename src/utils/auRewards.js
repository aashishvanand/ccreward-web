export const auBankCards = {
  "ixigo": {
    cardType: "points",
    defaultRate: 5 / 200, // 5 Reward Points for every ₹200 spent offline
    mccRates: {
      // Online spends
      "5811": 10 / 200, "5812": 10 / 200, "5813": 10 / 200, "5814": 10 / 200, // Restaurants
      "4111": 10 / 200, "4131": 10 / 200, // Transportation
      "7011": 10 / 200, "7012": 10 / 200, // Lodging
      "4511": 10 / 200, // Airlines
      "5309": 10 / 200, // Duty Free Stores
      "5310": 10 / 200, // Discount Stores
      "5311": 10 / 200, // Department Stores
      "5411": 10 / 200, // Grocery Stores
      "5499": 10 / 200, // Misc. Food Stores
      "5611": 10 / 200, "5621": 10 / 200, "5631": 10 / 200, "5641": 10 / 200, "5651": 10 / 200, "5655": 10 / 200, "5661": 10 / 200, "5691": 10 / 200, "5699": 10 / 200, // Clothing Stores
      "5732": 10 / 200, "5733": 10 / 200, // Electronics Stores
      "5912": 10 / 200, // Drug Stores
      "5942": 10 / 200, // Book Stores
      "5945": 10 / 200, // Toy Stores
      "5977": 10 / 200, // Cosmetic Stores
      "7832": 10 / 200, // Motion Picture Theaters
      "7922": 10 / 200, // Theatrical Producers
      "7991": 10 / 200, "7992": 10 / 200, "7993": 10 / 200, "7994": 10 / 200, "7995": 10 / 200, "7996": 10 / 200, "7997": 10 / 200, "7998": 10 / 200, "7999": 10 / 200, // Recreation Services

      // Train bookings on ixigo
      "4112": 20 / 200,

      // Excluded categories
      "5541": 0, "5542": 0, "5983": 0, // Fuel
      "6513": 0, // Rent
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // Education
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government
      "5944": 0, // Jewelry
      "6300": 0, // Insurance
      "6540": 0 // Wallet reload
    },
    redemptionRate: {
      cashValue: 0.25,
      voucherValue: 0.20,
      ixigoMoneyValue: 0.50
    },
    capping: {
      overall: { points: 10000, period: "monthly" }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards.ixigo.defaultRate;
      let category = "Offline Spends";
      let rateType = "default";

      if (additionalParams.isIxigoTrainBooking) {
        rate = 20 / 200;
        category = "ixigo Train Booking";
        rateType = "ixigo-train";
      } else if (auBankCards.ixigo.mccRates[mcc] !== undefined) {
        rate = auBankCards.ixigo.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Online Spends";
      }

      if (additionalParams.isRuPayUPI) {
        if (category === "Offline Spends") {
          rate = 5 / 200;
        } else if (category === "Online Spends") {
          rate = 10 / 200;
        }
        rateType = "rupay-upi";
      }

      let points = Math.floor(amount * rate);

      // Apply overall capping
      points = Math.min(points, auBankCards.ixigo.capping.overall.points);

      const cashbackValue = {
        cashValue: points * auBankCards.ixigo.redemptionRate.cashValue,
        voucherValue: points * auBankCards.ixigo.redemptionRate.voucherValue,
        ixigoMoneyValue: points * auBankCards.ixigo.redemptionRate.ixigoMoneyValue
      };
      
      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} as cash, ₹${cashbackValue.voucherValue.toFixed(2)} as vouchers, or ₹${cashbackValue.ixigoMoneyValue.toFixed(2)} as ixigo Money`;
      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: auBankCards.ixigo.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an ixigo train booking?',
        name: 'isIxigoTrainBooking',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isIxigoTrainBooking || false,
        onChange: (value) => onChange('isIxigoTrainBooking', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a RuPay UPI transaction?',
        name: 'isRuPayUPI',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isRuPayUPI || false,
        onChange: (value) => onChange('isRuPayUPI', value === 'true')
      }
    ]
  },
  "Zenith": {
    cardType: "points",
    defaultRate: 5 / 100, // 5 Reward Points for every Rs. 100 spent on all other spends
    mccRates: {
      // Dining at standalone restaurants
      "5812": 20 / 100, "5813": 20 / 100,
      // International transactions, Grocery and Departmental stores
      "5411": 10 / 100, "5311": 10 / 100,
      // Insurance and Utility & Telecom categories
      "6300": 1 / 100, "4900": 1 / 100,
      // Excluded categories
      "5541": 0, "5542": 0, // Fuel
      "6513": 0, // Rent
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // Education
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government
      "6540": 0 // Wallet reload
    },
    redemptionRate: {
      cashValue: 0.25
    },
    capping: {
      categories: {
        "Dining": { points: 5000, period: "monthly" }
      },
      overall: { points: 25000, period: "monthly" }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards.Zenith.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (auBankCards.Zenith.mccRates[mcc] !== undefined) {
        rate = auBankCards.Zenith.mccRates[mcc];
        rateType = "mcc-specific";
        if (["5812", "5813"].includes(mcc)) {
          category = "Dining";
        } else if (["5411", "5311"].includes(mcc) || additionalParams.isInternational) {
          category = "International/Grocery/Dept. Store";
        } else if (["6300", "4900"].includes(mcc)) {
          category = "Insurance/Utility/Telecom";
        } else if (rate === 0) {
          category = "Excluded Category";
        }
      }

      let points = Math.floor(amount * rate);

      // Apply category-specific capping
      if (category === "Dining") {
        points = Math.min(points, auBankCards.Zenith.capping.categories.Dining.points);
      }

      // Apply overall capping
      points = Math.min(points, auBankCards.Zenith.capping.overall.points);

      const cashbackValue = {
        cashValue: points * auBankCards.Zenith.redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: auBankCards.Zenith.cardType };
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

  "Zenith+": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point for every Rs. 100 spent
    travelDiningRate: 2 / 100, // 2 Reward Points for every Rs. 100 spent on travel, dining, and international spends
    redemptionRate: {
      cashValue: 1 // 1 Reward Point = Rs. 1
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards["Zenith+"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isTravelDiningOrInternational) {
        rate = auBankCards["Zenith+"].travelDiningRate;
        category = "Travel/Dining/International";
        rateType = "travel-dining-international";
      }

      let points = Math.floor(amount * rate);

      const cashbackValue = {
        cashValue: points * auBankCards["Zenith+"].redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: auBankCards["Zenith+"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a travel, dining, or international transaction?',
        name: 'isTravelDiningOrInternational',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTravelDiningOrInternational || false,
        onChange: (value) => onChange('isTravelDiningOrInternational', value === 'true')
      }
    ]
  },

  "Altura": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% cashback on all other retail spends
    preferredRate: 2 / 100, // 2% cashback on utility bills, groceries, and departmental stores
    capping: {
      categories: {
        "Preferred": { cashback: 50, period: "monthly" },
        "Other": { cashback: 50, period: "monthly" }
      },
      overall: { cashback: 100, period: "monthly" }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards.Altura.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (["4900", "5411", "5311"].includes(mcc)) {
        rate = auBankCards.Altura.preferredRate;
        category = "Preferred (Utility/Grocery/Dept. Store)";
        rateType = "preferred";
      }

      let cashback = amount * rate;

      // Apply category-specific capping
      if (category === "Preferred (Utility/Grocery/Dept. Store)") {
        cashback = Math.min(cashback, auBankCards.Altura.capping.categories.Preferred.cashback);
      } else {
        cashback = Math.min(cashback, auBankCards.Altura.capping.categories.Other.cashback);
      }

      // Apply overall capping
      cashback = Math.min(cashback, auBankCards.Altura.capping.overall.cashback);

      const rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;

      return { cashback, rate, rateType, category, rewardText, cardType: auBankCards.Altura.cardType };
    },
    dynamicInputs: () => []
  },

  "Altura Plus": {
    cardType: "hybrid",
    defaultRate: 1.5 / 100, // 1.5% cashback on all POS retail spends
    onlineRate: 2 / 100, // 2x Reward Points on online transactions
    utilityRate: 1 / 100, // 1 Reward Point per Rs. 100 on Utility & Telecom and Insurance category spends
    capping: {
      cashback: { amount: 100, period: "monthly" }
    },
    redemptionRate: {
      cashValue: 0.25 // 1 Reward Point = Rs. 0.25
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards["Altura Plus"].defaultRate;
      let category = "POS Retail Spends";
      let rateType = "default";
      let cashback = 0;
      let points = 0;

      if (additionalParams.isOnlineTransaction) {
        rate = auBankCards["Altura Plus"].onlineRate;
        category = "Online Transaction";
        rateType = "online";
        points = Math.floor(amount * rate);
      } else if (["4900", "6300"].includes(mcc)) {
        rate = auBankCards["Altura Plus"].utilityRate;
        category = "Utility/Telecom/Insurance";
        rateType = "utility";
        points = Math.floor(amount * rate);
      } else {
        cashback = amount * rate;
        // Apply cashback capping
        cashback = Math.min(cashback, auBankCards["Altura Plus"].capping.cashback.amount);
      }

      const cashbackValue = points > 0 ? {
        cashValue: points * auBankCards["Altura Plus"].redemptionRate.cashValue
      } : null;
      
      const rewardText = cashback > 0
        ? `₹${cashback.toFixed(2)} Cashback (${category})`
        : `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { cashback, points, rate, rateType, category, rewardText, cashbackValue, cardType: auBankCards["Altura Plus"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an online transaction?',
        name: 'isOnlineTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isOnlineTransaction || false,
        onChange: (value) => onChange('isOnlineTransaction', value === 'true')
      }
    ]
  },

  "Vetta": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points per Rs. 100 on all other retail spends
    utilityRate: 10 / 100, // 10 Reward Points per Rs. 100 on utility bill payments
    groceryRate: 4 / 100, // 4 Reward Points per Rs. 100 on grocery and departmental store spends
    redemptionRate: {
      cashValue: 0.25 // 1 Reward Point = Rs. 0.25
    },
    capping: {
      categories: {
        "Utility": { points: 100, maxSpent: 10000, period: "transaction" }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards.Vetta.defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";

      if (["4900"].includes(mcc)) {
        rate = auBankCards.Vetta.utilityRate;
        category = "Utility Bill Payments";
        rateType = "utility";
      } else if (["5411", "5311"].includes(mcc)) {
        rate = auBankCards.Vetta.groceryRate;
        category = "Grocery/Departmental Store";
        rateType = "grocery";
      }

      let points = Math.floor(amount * rate);

      // Apply category-specific capping
      if (category === "Utility Bill Payments") {
        points = Math.min(points, auBankCards.Vetta.capping.categories.Utility.points);
      }

      const cashbackValue = {
        cashValue: points * auBankCards.Vetta.redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: auBankCards.Vetta.cardType };
    },
    dynamicInputs: () => []
  },
  "NOMO": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points for every ₹100 spent on retail purchases
    utilityInsuranceRate: 1 / 100, // 1 Reward Point for every ₹100 spent on utility and insurance transactions
    redemptionRate: {
      cashValue: 0.25 // 1 Reward Point = ₹0.25
    },
    capping: {
      categories: {
        "Utility": { points: 100, period: "transaction" }
      }
    },
    milestoneBenefits: [
      { spend: 25000, points: 500, period: "quarterly" },
      { spend: 50000, points: 1000, period: "quarterly" }
    ],
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards.NOMO.defaultRate;
      let category = "Retail Purchases";
      let rateType = "default";

      if (["4900", "6300"].includes(mcc)) {
        rate = auBankCards.NOMO.utilityInsuranceRate;
        category = "Utility/Insurance";
        rateType = "utility-insurance";
      } else if (["5541", "5542", "5983", "6011", "6513", "8211", "8241", "8244", "8249", "8299", "9211", "9222", "9223", "9311", "9399", "9402"].includes(mcc)) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      let points = Math.floor(amount * rate);

      // Apply category-specific capping
      if (category === "Utility/Insurance") {
        points = Math.min(points, auBankCards.NOMO.capping.categories.Utility.points);
      }

      const cashbackValue = {
        cashValue: points * auBankCards.NOMO.redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: auBankCards.NOMO.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Quarterly retail spend',
        name: 'quarterlySpend',
        options: [
          { label: 'Up to ₹25,000', value: 0 },
          { label: '₹25,001 - ₹50,000', value: 25000 },
          { label: 'Above ₹50,000', value: 50000 }
        ],
        value: currentInputs.quarterlySpend || 0,
        onChange: (value) => onChange('quarterlySpend', parseInt(value))
      }
    ]
  },

  "Adithya Birla Capital Pro": {
    cardType: "hybrid",
    defaultRate: 4 / 200, // 4 Reward Points for every ₹200 spent on Offline Spends
    onlineRate: 6 / 200, // 6 Reward Points for every ₹200 spent on Online Spends
    travelDiningEntertainmentRate: 10 / 200, // 10 Reward Points for every ₹200 spent on Travel, Dining, Entertainment & International Spends
    olaCashbackRate: 10 / 100, // 10% Cashback on OLA bookings
    redemptionRate: {
      cashValue: 0.20 // Redemption rate not provided
    },
    capping: {
      categories: {
        "OLA": { cashback: 200, period: "monthly" }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards["Adithya Birla Capital Pro"].defaultRate;
      let category = "Offline Spends";
      let rateType = "default";
      let points = 0;
      let cashback = 0;

      if (additionalParams.isOnlineSpend) {
        rate = auBankCards["Adithya Birla Capital Pro"].onlineRate;
        category = "Online Spends";
        rateType = "online";
      } else if (additionalParams.isTravelDiningEntertainmentInternational) {
        rate = auBankCards["Adithya Birla Capital Pro"].travelDiningEntertainmentRate;
        category = "Travel/Dining/Entertainment/International";
        rateType = "travel-dining-entertainment-international";
      } else if (additionalParams.isOlaBooking) {
        cashback = Math.min(amount * auBankCards["Adithya Birla Capital Pro"].olaCashbackRate, auBankCards["Adithya Birla Capital Pro"].capping.categories.OLA.cashback);
        category = "OLA Booking";
        rateType = "ola-cashback";
      }

      if (["6011", "4814", "5541", "5983", "6300"].includes(mcc)) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      points = Math.floor(amount * rate);

      let pointValue = 0;
      if (!isNaN(auBankCards["Adithya Birla Capital Pro"].redemptionRate.cashValue)) {
        pointValue = points * auBankCards["Adithya Birla Capital Pro"].redemptionRate.cashValue;
      }

      let rewardText = "";
if (cashback > 0) {
  rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;
} else if (points > 0) {
  rewardText = `${points} Reward Points (${category})`;
  if (pointValue > 0) {
    rewardText += ` - Worth ₹${pointValue.toFixed(2)}`;
  }
} else {
  rewardText = `No rewards earned for this transaction (${category})`;
}

      return { points, cashback, rate, rateType, category, rewardText, cardType: auBankCards["Adithya Birla Capital Pro"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction type',
        name: 'transactionType',
        options: [
          { label: 'Online Spend', value: 'online' },
          { label: 'Travel/Dining/Entertainment/International', value: 'travel' },
          { label: 'OLA Booking', value: 'ola' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnlineSpend', value === 'online');
          onChange('isTravelDiningEntertainmentInternational', value === 'travel');
          onChange('isOlaBooking', value === 'ola');
        }
      }
    ]
  },

  "LIT": {
    cardType: "hybrid",
    defaultRate: 1 / 100, // 1 Reward Point for every Rs. 100 spent on retail
    redemptionRate: {
      cashValue: 0.25 // Redemption rate not provided
    },
    acceleratedRewards: {
      online10x: { rate: 10 / 100, fee: 299, duration: 90 },
      online5x: { rate: 5 / 100, fee: 199, duration: 90 },
      offline10x: { rate: 10 / 100, fee: 299, duration: 90 },
      offline5x: { rate: 5 / 100, fee: 199, duration: 90 }
    },
    categoryCashback: {
      grocery: { rate: 5 / 100, fee: 299, duration: 90, maxCashback: 1000 },
      travel: { rate: 5 / 100, fee: 299, duration: 90, maxCashback: 1000 },
      dining: { rate: 5 / 100, fee: 299, duration: 90, maxCashback: 1000 },
      electronics: { rate: 5 / 100, fee: 299, duration: 90, maxCashback: 1000 },
      apparel: { rate: 5 / 100, fee: 199, duration: 90, maxCashback: 1000 }
    },
    milestoneCashback: {
      fivePercent: { rate: 5 / 100, fee: 299, duration: 30, minSpend: 7500, maxCashback: 500 },
      twoPercent: { rate: 2 / 100, fee: 199, duration: 30, minSpend: 10000, maxCashback: 100 }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards.LIT.defaultRate;
      let category = "Retail Purchases";
      let rateType = "default";
      let points = 0;
      let cashback = 0;

      if (additionalParams.acceleratedRewards) {
        const rewardType = additionalParams.acceleratedRewards;
        rate = auBankCards.LIT.acceleratedRewards[rewardType].rate;
        category = rewardType.includes('online') ? "Online Spends" : "Offline Spends";
        rateType = "accelerated";
      } else if (additionalParams.categoryCashback) {
        const cashbackType = additionalParams.categoryCashback;
        rate = auBankCards.LIT.categoryCashback[cashbackType].rate;
        cashback = Math.min(amount * rate, auBankCards.LIT.categoryCashback[cashbackType].maxCashback);
        category = cashbackType.charAt(0).toUpperCase() + cashbackType.slice(1);
        rateType = "category-cashback";
      } else if (additionalParams.milestoneCashback) {
        const milestoneType = additionalParams.milestoneCashback;
        if (amount >= auBankCards.LIT.milestoneCashback[milestoneType].minSpend) {
          rate = auBankCards.LIT.milestoneCashback[milestoneType].rate;
          cashback = Math.min(amount * rate, auBankCards.LIT.milestoneCashback[milestoneType].maxCashback);
          category = "Milestone Cashback";
          rateType = "milestone-cashback";
        }
      }

      if (["6011", "5541", "5542", "5983"].includes(mcc)) {
        rate = 0;
        cashback = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      points = Math.floor(amount * rate);

      let rewardText = "";
if (cashback > 0) {
  rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;
} else if (points > 0) {
  rewardText = `${points} Reward Points (${category})`;
  if (!isNaN(auBankCards.LIT.redemptionRate.cashValue)) {
    const pointValue = points * auBankCards.LIT.redemptionRate.cashValue;
    rewardText += ` - Worth ₹${pointValue.toFixed(2)}`;
  }
} else {
  rewardText = `No rewards earned for this transaction (${category})`;
}

      return { points, cashback, rate, rateType, category, rewardText, cardType: auBankCards.LIT.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'select',
        label: 'Reward Type',
        name: 'rewardType',
        options: [
          { label: 'Default', value: 'default' },
          { label: '10x Online Rewards', value: 'online10x' },
          { label: '5x Online Rewards', value: 'online5x' },
          { label: '10x Offline Rewards', value: 'offline10x' },
          { label: '5x Offline Rewards', value: 'offline5x' },
          { label: 'Grocery Cashback', value: 'grocery' },
          { label: 'Travel Cashback', value: 'travel' },
          { label: 'Dining Cashback', value: 'dining' },
          { label: 'Electronics Cashback', value: 'electronics' },
          { label: 'Apparel Cashback', value: 'apparel' },
          { label: '5% Milestone Cashback', value: 'fivePercent' },
          { label: '2% Milestone Cashback', value: 'twoPercent' }
        ],
        value: currentInputs.rewardType || 'default',
        onChange: (value) => {
          onChange('rewardType', value);
          onChange('acceleratedRewards', ['online10x', 'online5x', 'offline10x', 'offline5x'].includes(value) ? value : null);
          onChange('categoryCashback', ['grocery', 'travel', 'dining', 'electronics', 'apparel'].includes(value) ? value : null);
          onChange('milestoneCashback', ['fivePercent', 'twoPercent'].includes(value) ? value : null);
        }
      }
    ]
  },
  "Adithya Birla Capital Nxt": {
  cardType: "hybrid",
  defaultRate: 2 / 200,
  onlineRate: 4 / 200,
  specialCategoryRate: 6 / 200,
  olaCashbackRate: 5 / 100,
  redemptionRate: {
    cashValue: 0.20
  },
  capping: {
    categories: {
      "OLA": { cashback: 100, period: "monthly" }
    }
  },
  mccRates: {
    // Special category rates
    "4900": 6 / 200, // Utilities
    "5411": 6 / 200, // Grocery
    "5311": 6 / 200, // Departmental stores
    "8211": 6 / 200, "8241": 6 / 200, "8244": 6 / 200, "8249": 6 / 200, "8299": 6 / 200, // Education
    // Excluded categories
    "5172": 0, "5541": 0, "5542": 0, "5552": 0, "5983": 0, "6513": 0, 
    "5094": 0, "5944": 0, "5960": 0, "6300": 0, "6011": 0, "4814": 0, "6010": 0
  },
  calculateRewards: (amount, mcc, additionalParams) => {
    let rate = auBankCards["Adithya Birla Capital Nxt"].defaultRate;
    let category = "Offline Spends";
    let rateType = "default";
    let points = 0;
    let cashback = 0;

    if (auBankCards["Adithya Birla Capital Nxt"].mccRates[mcc] !== undefined) {
      rate = auBankCards["Adithya Birla Capital Nxt"].mccRates[mcc];
      rateType = "mcc-specific";
      category = rate === 0 ? "Excluded Category" : "Special Category";
    } else if (additionalParams.isOnlineSpend) {
      rate = auBankCards["Adithya Birla Capital Nxt"].onlineRate;
      category = "Online Spends";
      rateType = "online";
    } else if (additionalParams.isOlaBooking) {
      cashback = Math.min(amount * auBankCards["Adithya Birla Capital Nxt"].olaCashbackRate, auBankCards["Adithya Birla Capital Nxt"].capping.categories.OLA.cashback);
      category = "OLA Booking";
      rateType = "ola-cashback";
    }

    if (additionalParams.isBBPS || additionalParams.isEMI) {
      rate = 0;
      category = "Excluded Category";
      rateType = "excluded";
    }

    if (cashback === 0 && rate > 0) {
      points = Math.floor(amount * rate);
      if (additionalParams.quarterlySpend > 50000) {
        points *= 2;
        rateType += "-milestone";
      }
    }

    const cashbackValue = points > 0 ? {
      cashValue: points * auBankCards["Adithya Birla Capital Nxt"].redemptionRate.cashValue
    } : null;

    let rewardText;
    if (cashback > 0) {
      rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;
    } else if (points > 0) {
      rewardText = `${points} Reward Points (${category})`;
      if (!isNaN(cashbackValue?.cashValue)) {
        rewardText += ` - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      }
    } else {
      rewardText = `No rewards earned (${category})`;
    }

    return { points, cashback, rate, rateType, category, rewardText, cashbackValue, cardType: auBankCards["Adithya Birla Capital Nxt"].cardType };
  },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction type',
        name: 'transactionType',
        options: [
          { label: 'Online Spend', value: 'online' },
          { label: 'OLA Booking', value: 'ola' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnlineSpend', value === 'online');
          onChange('isOlaBooking', value === 'ola');
        }
      },
      {
        type: 'radio',
        label: 'Quarterly retail spend',
        name: 'quarterlySpend',
        options: [
          { label: 'Up to ₹50,000', value: 0 },
          { label: 'Above ₹50,000', value: 50001 }
        ],
        value: currentInputs.quarterlySpend || 0,
        onChange: (value) => onChange('quarterlySpend', parseInt(value))
      },
      {
        type: 'radio',
        label: 'Is this a BBPS transaction?',
        name: 'isBBPS',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: false,
        onChange: (value) => onChange('isBBPS', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this an EMI transaction?',
        name: 'isEMI',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: false,
        onChange: (value) => onChange('isEMI', value === 'true')
      }
    ]
  },
  "Adithya Birla Capital Flex": {
  cardType: "hybrid",
  defaultRate: 2 / 200,
  onlineRate: 4 / 200,
  specialCategoryRate: 6 / 200,
  olaCashbackRate: 5 / 100,
  redemptionRate: {
    cashValue: 0.20
  },
  capping: {
    categories: {
      "OLA": { cashback: 100, period: "monthly" }
    }
  },
  mccRates: {
    // Special category rates
    "4900": 6 / 200, // Utilities
    "5411": 6 / 200, // Grocery
    "5311": 6 / 200, // Departmental stores
    "8211": 6 / 200, "8241": 6 / 200, "8244": 6 / 200, "8249": 6 / 200, "8299": 6 / 200, // Education
    // Excluded categories
    "5172": 0, "5541": 0, "5542": 0, "5552": 0, "5983": 0, "6513": 0, 
    "5094": 0, "5944": 0, "5960": 0, "6300": 0, "6011": 0, "4814": 0, "6010": 0
  },
  calculateRewards: (amount, mcc, additionalParams) => {
    let rate = auBankCards["Adithya Birla Capital Flex"].defaultRate;
    let category = "Offline Spends";
    let rateType = "default";
    let points = 0;
    let cashback = 0;

    if (auBankCards["Adithya Birla Capital Flex"].mccRates[mcc] !== undefined) {
      rate = auBankCards["Adithya Birla Capital Flex"].mccRates[mcc];
      rateType = "mcc-specific";
      category = rate === 0 ? "Excluded Category" : "Special Category";
    } else if (additionalParams.isOnlineSpend) {
      rate = auBankCards["Adithya Birla Capital Flex"].onlineRate;
      category = "Online Spends";
      rateType = "online";
    } else if (additionalParams.isOlaBooking) {
      cashback = Math.min(amount * auBankCards["Adithya Birla Capital Flex"].olaCashbackRate, auBankCards["Adithya Birla Capital Flex"].capping.categories.OLA.cashback);
      category = "OLA Booking";
      rateType = "ola-cashback";
    }

    if (additionalParams.isBBPS || additionalParams.isEMI) {
      rate = 0;
      category = "Excluded Category";
      rateType = "excluded";
    }

    if (cashback === 0 && rate > 0) {
      points = Math.floor(amount * rate);
      if (additionalParams.quarterlySpend > 50000) {
        points *= 2;
        rateType += "-milestone";
      }
    }

    const cashbackValue = points > 0 ? {
      cashValue: points * auBankCards["Adithya Birla Capital Flex"].redemptionRate.cashValue
    } : null;

    let rewardText;
    if (cashback > 0) {
      rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;
    } else if (points > 0) {
      rewardText = `${points} Reward Points (${category})`;
      if (!isNaN(cashbackValue?.cashValue)) {
        rewardText += ` - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      }
    } else {
      rewardText = `No rewards earned (${category})`;
    }

    return { points, cashback, rate, rateType, category, rewardText, cashbackValue, cardType: auBankCards["Adithya Birla Capital Flex"].cardType };
  },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction type',
        name: 'transactionType',
        options: [
          { label: 'Online Spend', value: 'online' },
          { label: 'OLA Booking', value: 'ola' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isOnlineSpend', value === 'online');
          onChange('isOlaBooking', value === 'ola');
        }
      },
      {
        type: 'radio',
        label: 'Quarterly retail spend',
        name: 'quarterlySpend',
        options: [
          { label: 'Up to ₹50,000', value: 0 },
          { label: 'Above ₹50,000', value: 50001 }
        ],
        value: currentInputs.quarterlySpend || 0,
        onChange: (value) => onChange('quarterlySpend', parseInt(value))
      },
      {
        type: 'radio',
        label: 'Is this a BBPS transaction?',
        name: 'isBBPS',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: false,
        onChange: (value) => onChange('isBBPS', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this an EMI transaction?',
        name: 'isEMI',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: false,
        onChange: (value) => onChange('isEMI', value === 'true')
      }
    ]
  },
  "SPONT": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% Cashback on all transactions
    upiCoinRate: 5, // 5 coins per UPI transaction
    firstUpiCoinBonus: 500, // 500 coins on first UPI transaction
    capping: {
      overall: { cashback: 500, period: "monthly" }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = auBankCards["SPONT"].defaultRate;
      let category = "All Spends";
      let rateType = "default";
      let cashback = 0;
      let coins = 0;

      if (["5541", "5542", "5983", "6513", "8211", "8241", "8244", "8249", "8299", "6011", "6300"].includes(mcc)) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      } else {
        cashback = Math.min(amount * rate, auBankCards["SPONT"].capping.overall.cashback);

        if (additionalParams.isUpiTransaction) {
          coins = auBankCards["SPONT"].upiCoinRate;
          if (additionalParams.isFirstUpiTransaction) {
            coins += auBankCards["SPONT"].firstUpiCoinBonus;
          }
          category = "UPI Transaction";
          rateType = "upi";
        }
      }

      const rewardText = `₹${cashback.toFixed(2)} Cashback${coins > 0 ? ` and ${coins} Coins` : ''} (${category})`;

      return { cashback, coins, rate, rateType, category, rewardText, cardType: auBankCards["SPONT"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a UPI transaction?',
        name: 'isUpiTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isUpiTransaction || false,
        onChange: (value) => onChange('isUpiTransaction', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this your first UPI transaction?',
        name: 'isFirstUpiTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isFirstUpiTransaction || false,
        onChange: (value) => onChange('isFirstUpiTransaction', value === 'true'),
        condition: (inputs) => inputs.isUpiTransaction
      }
    ]
  },

  "InstaPay": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% Cashback on eligible UPI transactions
    capping: {
      overall: { cashback: 100, period: "monthly" }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = 0;
      let category = "Other Spends";
      let rateType = "default";
      let cashback = 0;

      if (additionalParams.isUpiTransaction && amount >= 200 && ["5311", "5812", "5912", "5411"].includes(mcc)) {
        rate = auBankCards.InstaPay.defaultRate;
        cashback = Math.min(amount * rate, auBankCards.InstaPay.capping.overall.cashback);
        category = "Eligible UPI Transaction";
        rateType = "upi-cashback";
      }

      const rewardText = cashback > 0
        ? `₹${cashback.toFixed(2)} Cashback (${category})`
        : `No Cashback (${category})`;

      return { cashback, rate, rateType, category, rewardText, cardType: auBankCards.InstaPay.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a UPI transaction?',
        name: 'isUpiTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isUpiTransaction || false,
        onChange: (value) => onChange('isUpiTransaction', value === 'true')
      }
    ]
  }
};

export const calculateAURewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = auBankCards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      rewardText: "Card not found",
      category: "Unknown",
      cashbackValue: { cashValue: 0, voucherValue: 0, ixigoMoneyValue: 0 },
      cardType: "unknown"
    };
  }

  return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getAUBankCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = auBankCards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};