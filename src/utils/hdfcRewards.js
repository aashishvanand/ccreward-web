import { mccList } from '../data/mccData';
export const hdfcCardRewards = {
  "Pixel Go": {
    cardType: "cashback",
    defaultRate: 1 / 100,
    smartbuyRates: 5 / 100,
    mccRates: {
      "5541": 0, "5542": 0, "5983": 0,
      "6540": 0,
      "6513": 0,
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, "9405": 0,
      "6011": 0,
    },
    capping: {
      categories: {
        "Smartbuy": { points: 500, maxSpent: 10000 },
        "Insurance": { points: 2000, maxSpent: 200000 }
      }
    },
    fuelSurchargeWaiver: {
      rate: 1 / 100,
      minTransaction: 400,
      maxTransaction: 5000,
      maxWaiver: 250
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Pixel Go"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isSmartbuy) {
        rate = hdfcCardRewards["Pixel Go"].smartbuyRates;
        category = "Smartbuy";
        rateType = "smartbuy";
      } else if (mcc && hdfcCardRewards["Pixel Go"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["Pixel Go"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const cashback = amount * rate;
      const points = Math.floor(cashback * 100);

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Smartbuy transaction?',
        name: 'isSmartbuy',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSmartbuy || false,
        onChange: (value) => onChange('isSmartbuy', value === 'true')
      }
    ]
  },
  "Pixel Play": {
    cardType: "cashback",
    defaultRate: 1 / 100,
    smartbuyRates: 5 / 100,
    selectedPacksRate: 5 / 100,
    ecommerceRate: 3 / 100,
    payzappRate: 3 / 100,
    packs: [
      { name: "Dining & Entertainment", mccs: ["7832", "5812", "5814"] },
      { name: "Travel", mccs: ["4511", "4111", "4112", "4121", "4131"] },
      { name: "Grocery", mccs: ["5411", "5422", "5499"] },
      { name: "Electronics", mccs: ["5732", "5045", "5065"] },
      { name: "Fashion", mccs: ["5611", "5621", "5631", "5651", "5691", "5699"] },
    ],
    ecommerceMccs: ["5399", "5310"],
    mccRates: {
      "5541": 0, "5542": 0, "5983": 0,
      "6540": 0,
      "6513": 0,
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, "9405": 0,
      "6011": 0,
    },
    capping: {
      categories: {
        "Selected Packs": { points: 500, maxSpent: 10000 },
        "Smartbuy": { points: 500, maxSpent: 10000 },
        "E-commerce": { points: 500, maxSpent: 16667 },
        "Insurance": { points: 2000, maxSpent: 200000 }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Pixel Play"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isSmartbuy) {
        rate = hdfcCardRewards["Pixel Play"].smartbuyRates;
        category = "Smartbuy";
        rateType = "smartbuy";
      } else if (additionalParams.selectedPacks && additionalParams.selectedPacks.length > 0) {
        const packMccs = additionalParams.selectedPacks.flatMap(pack =>
          hdfcCardRewards["Pixel Play"].packs.find(p => p.name === pack)?.mccs || []
        );
        if (packMccs.includes(mcc)) {
          rate = hdfcCardRewards["Pixel Play"].selectedPacksRate;
          category = "Selected Packs";
          rateType = "selected-packs";
        }
      } else if (additionalParams.selectedEcommerce && hdfcCardRewards["Pixel Play"].ecommerceMccs.includes(mcc)) {
        rate = hdfcCardRewards["Pixel Play"].ecommerceRate;
        category = "E-commerce";
        rateType = "ecommerce";
      } else if (additionalParams.isPayzappTransaction) {
        rate = hdfcCardRewards["Pixel Play"].payzappRate;
        category = "PayZapp";
        rateType = "payzapp";
      } else if (mcc && hdfcCardRewards["Pixel Play"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["Pixel Play"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const cashback = amount * rate;
      const points = Math.floor(cashback * 100);

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Smartbuy transaction?',
        name: 'isSmartbuy',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSmartbuy || false,
        onChange: (value) => onChange('isSmartbuy', value === 'true')
      },
      {
        type: 'multiselect',
        label: 'Selected Packs (Choose up to 2)',
        name: 'selectedPacks',
        options: hdfcCardRewards["Pixel Play"].packs.map(pack => ({ label: pack.name, value: pack.name })),
        value: currentInputs.selectedPacks || [],
        onChange: (value) => onChange('selectedPacks', value),
        maxSelect: 2
      },
      {
        type: 'select',
        label: 'Selected E-commerce Merchant',
        name: 'selectedEcommerce',
        options: [
          { label: 'Amazon', value: 'amazon' },
          { label: 'Flipkart', value: 'flipkart' }
        ],
        value: currentInputs.selectedEcommerce || '',
        onChange: (value) => onChange('selectedEcommerce', value)
      },
      {
        type: 'radio',
        label: 'Is this a PayZapp transaction?',
        name: 'isPayzappTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isPayzappTransaction || false,
        onChange: (value) => onChange('isPayzappTransaction', value === 'true')
      }
    ]
  },
  "6E Rewards": {
    cardType: "points",
    defaultRate: 1 / 100,
    indigoRate: 2.5 / 100,
    groceryDiningEntertainmentRate: 2 / 100,
    fuelRate: 1 / 100,
    redemptionRate: 1, // 1 6E Reward = ₹1
    mccRates: {
      "5411": 2 / 100, // Grocery stores
      "5812": 2 / 100, // Dining
      "5813": 2 / 100, // Bars
      "5814": 2 / 100, // Fast Food
      "7832": 2 / 100, // Entertainment
      "5541": 1 / 100, // Fuel
      "5542": 1 / 100  // Fuel
    },
    capping: {
      categories: {
        "Grocery": { points: 1000, maxSpent: 50000 }, // 1000 RP cap for grocery
        "Fuel": { points: 250, maxSpent: 25000 } // 250 6E Rewards cap for fuel
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["6E Rewards"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isIndigoBooking) {
        rate = hdfcCardRewards["6E Rewards"].indigoRate;
        category = "IndiGo Booking";
        rateType = "indigo";
      } else if (mcc && hdfcCardRewards["6E Rewards"].mccRates[mcc]) {
        rate = hdfcCardRewards["6E Rewards"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5411"].includes(mcc)) {
          category = "Grocery";
        } else if (["5812", "5813", "5814"].includes(mcc)) {
          category = "Dining";
        } else if (["7832"].includes(mcc)) {
          category = "Entertainment";
        } else if (["5541", "5542"].includes(mcc)) {
          category = "Fuel";
        }
      }

      const points = Math.floor(amount * rate);
      const pointsValue = points * hdfcCardRewards["6E Rewards"].redemptionRate;

      return { points, rate, rateType, category, pointsValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an IndiGo flight booking on IndiGo App/Website?',
        name: 'isIndigoBooking',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isIndigoBooking || false,
        onChange: (value) => onChange('isIndigoBooking', value === 'true')
      }
    ]
  },
  "6E Rewards XL": {
    cardType: "points",
    defaultRate: 2 / 100,
    indigoRate: 5 / 100,
    groceryDiningEntertainmentRate: 3 / 100,
    redemptionRate: 1, // 1 6E Reward = ₹1
    mccRates: {
      "5411": 3 / 100, // Grocery stores
      "5812": 3 / 100, // Dining
      "5813": 3 / 100, // Bars
      "5814": 3 / 100, // Fast Food
      "7832": 3 / 100  // Entertainment
    },
    capping: {
      categories: {
        "Grocery": { points: 2000, maxSpent: 66667 } // 2000 RP cap for grocery
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["6E Rewards XL"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isIndigoBooking) {
        rate = hdfcCardRewards["6E Rewards XL"].indigoRate;
        category = "IndiGo Booking";
        rateType = "indigo";
      } else if (mcc && hdfcCardRewards["6E Rewards XL"].mccRates[mcc]) {
        rate = hdfcCardRewards["6E Rewards XL"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5411"].includes(mcc)) {
          category = "Grocery";
        } else if (["5812", "5813", "5814"].includes(mcc)) {
          category = "Dining";
        } else if (["7832"].includes(mcc)) {
          category = "Entertainment";
        }
      }

      const points = Math.floor(amount * rate);
      const pointsValue = points * hdfcCardRewards["6E Rewards XL"].redemptionRate;

      return { points, rate, rateType, category, pointsValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an IndiGo flight booking on IndiGo App/Website?',
        name: 'isIndigoBooking',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isIndigoBooking || false,
        onChange: (value) => onChange('isIndigoBooking', value === 'true')
      }
    ]
  },
  //TODO: Add Exclusions to this card - https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?path=/Personal/Pay/Cards/Credit%20Card/Credit%20Card%20Landing%20Page/Credit%20Cards/Super%20Premium/Diners%20Club%20Black%20Metal%20Edition/Rewards-TnC-Diners-Black-Metal.pdf
  "Diners Club Black Metal": {
    cardType: "points",
    defaultRate: 5 / 150,
    weekendDiningRate: 10 / 150,
    smartBuyRate: 10 / 150,
    redemptionRate: {
      airmiles: 1, // 1 Reward Point = up to 1 Airmile
      productVouchers: 0.50 // 1 Reward Point = up to ₹0.50 for products and vouchers
    },
    mccRates: {
      "5812": 10 / 150, // Restaurants (for weekend dining)
      "5813": 10 / 150, // Bars (for weekend dining)
      "5814": 10 / 150, // Fast Food (for weekend dining)
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Diners Club Black Metal"].defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";

      const isDiningMCC = ["5812", "5813", "5814"].includes(mcc);

      if (isDiningMCC) {
        rate = hdfcCardRewards["Diners Club Black Metal"].mccRates[mcc];
        category = "Dining";
        rateType = "dining";

        if (additionalParams.isWeekend) {
          rate = hdfcCardRewards["Diners Club Black Metal"].weekendDiningRate;
          category = "Weekend Dining";
          rateType = "weekend-dining";
        }
      } else if (additionalParams.isSmartBuy) {
        rate = hdfcCardRewards["Diners Club Black Metal"].smartBuyRate;
        category = "SmartBuy Purchase";
        rateType = "smartbuy";
      }

      const points = Math.floor(amount * rate);
      const airmilesValue = points * hdfcCardRewards["Diners Club Black Metal"].redemptionRate.airmiles;
      const productVoucherValue = points * hdfcCardRewards["Diners Club Black Metal"].redemptionRate.productVouchers;

      return { points, rate, rateType, category, airmilesValue, productVoucherValue };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const isDiningMCC = ["5812", "5813", "5814"].includes(selectedMcc);

      if (isDiningMCC) {
        return [{
          type: 'radio',
          label: 'Is this a weekend transaction?',
          name: 'isWeekend',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isWeekend || false,
          onChange: (value) => onChange('isWeekend', value === 'true')
        }];
      } else {
        return [{
          type: 'radio',
          label: 'Is this a SmartBuy purchase?',
          name: 'isSmartBuy',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isSmartBuy || false,
          onChange: (value) => onChange('isSmartBuy', value === 'true')
        }];
      }
    }
  },
  //TODO: Add Exclusions to this card
  "Diners Club Privilege": {
    cardType: "points",
    defaultRate: 1 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = hdfcCardRewards["Diners Club Privilege"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Freedom": {
    cardType: "points",
    defaultRate: 1 / 150, // 1 CashPoint per ₹150 spent on other spends
    mccRates: {
      // 10X CashPoints on specific merchants
      "5411": 10 / 150, // BigBasket (Grocery Stores)
      "7829": 10 / 150, // BookMyShow (Motion Picture Distribution)
      "7011": 10 / 150, // OYO (Hotels, Motels, Resorts)
      "5814": 10 / 150, // Swiggy (Fast Food Restaurants)
      "4121": 10 / 150, // Uber (Taxicabs and Limousines)

      // Excluded categories
      "5541": 0, "5542": 0, "5983": 0, "1361": 0, "5172": 0, "9752": 0, // Fuel
      "6540": 0, // Wallet loads
      "6513": 0, // Rent payments
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government transactions

      // Capped categories (effective 1st September 2024)
      "4812": 1 / 150, "4814": 1 / 150, "4899": 1 / 150, // Telecom & Cable
      "4900": 1 / 150, // Utility

      // Education (will not earn rewards from Sept 1, 2024, if paid through third-party apps)
      "8211": 1 / 150, "8220": 1 / 150, "8241": 1 / 150, "8244": 1 / 150, "8249": 1 / 150, "8299": 1 / 150,
    },
    capping: {
      categories: {
        "10X CashPoints": { points: 2500, maxSpent: 37500 }, // 2500 CashPoints max per calendar month
        "Grocery": { points: 1000, maxSpent: 150000 }, // 1000 points cap on grocery transactions per month
        "Telecom & Cable": { points: 2000, maxSpent: 300000 }, // 2000 points cap per month (effective 1st Sep 2024)
      }
    },
    pointValue: 0.15, // 1 CashPoint = ₹0.15
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Freedom"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (["5411", "7829", "7011", "5814", "4121"].includes(mcc)) {
        rate = 10 / 150;
        category = "10X CashPoints";
        rateType = "accelerated";
      } else if (hdfcCardRewards["Freedom"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["Freedom"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["4812", "4814", "4899"].includes(mcc)) {
          category = "Telecom & Cable";
        } else if (mcc === "4900") {
          category = "Utility";
        } else if (["8211", "8220", "8241", "8244", "8249", "8299"].includes(mcc)) {
          category = "Education";
          if (additionalParams.isThirdPartyApp) {
            rate = 0;
          }
        } else if (mcc === "5411") {
          category = "Grocery";
        } else {
          category = rate === 0 ? "Excluded Category" : "Category Spend";
        }
      }

      const points = Math.floor(amount * rate);
      const cashback = points * hdfcCardRewards["Freedom"].pointValue;

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const educationMCCs = ["8211", "8220", "8241", "8244", "8249", "8299"];

      if (educationMCCs.includes(selectedMcc)) {
        return [{
          type: 'radio',
          label: 'Is this an education payment through a third-party app?',
          name: 'isThirdPartyApp',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isThirdPartyApp || false,
          onChange: (value) => onChange('isThirdPartyApp', value === 'true')
        }];
      }

      return [];
    }
  },
  //TODO: Add Exclusions to this card
  "H.O.G Diners": {
    cardType: "points",
    defaultRate: 5 / 150,
    harleyDavidsonRate: 10 / 150,
    weekendDiningRate: 10 / 150,
    smartBuyRate: 10 / 150,
    mccRates: {
      "5812": 10 / 150, // Restaurants (for weekend dining)
      "5813": 10 / 150, // Bars (for weekend dining)
      "5814": 10 / 150, // Fast Food (for weekend dining)
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["H.O.G Diners"].defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";

      const isDiningMCC = ["5812", "5813", "5814"].includes(mcc);

      if (isDiningMCC) {
        if (additionalParams.isWeekend) {
          rate = hdfcCardRewards["H.O.G Diners"].weekendDiningRate;
          category = "Weekend Dining";
          rateType = "weekend-dining";
        } else {
          rate = hdfcCardRewards["H.O.G Diners"].mccRates[mcc];
          category = "Dining";
          rateType = "dining";
        }
      } else if (additionalParams.isHarleyDavidsonPurchase) {
        rate = hdfcCardRewards["H.O.G Diners"].harleyDavidsonRate;
        category = "Harley-Davidson Purchase";
        rateType = "harley-davidson";
      } else if (additionalParams.isSmartBuy) {
        rate = hdfcCardRewards["H.O.G Diners"].smartBuyRate;
        category = "SmartBuy Purchase";
        rateType = "smartbuy";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const isDiningMCC = ["5812", "5813", "5814"].includes(selectedMcc);
      const isAutomobileBikeMCC = ["5571"].includes(selectedMcc); // Add more MCCs if needed

      if (isDiningMCC) {
        return [{
          type: 'radio',
          label: 'Is this a weekend transaction?',
          name: 'isWeekend',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isWeekend || false,
          onChange: (value) => onChange('isWeekend', value === 'true')
        }];
      } else if (isAutomobileBikeMCC) {
        return [{
          type: 'radio',
          label: 'Is this a Harley-Davidson merchandise or service purchase from an authorized dealer?',
          name: 'isHarleyDavidsonPurchase',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isHarleyDavidsonPurchase || false,
          onChange: (value) => onChange('isHarleyDavidsonPurchase', value === 'true')
        }];
      } else {
        return [{
          type: 'radio',
          label: 'Is this a SmartBuy purchase?',
          name: 'isSmartBuy',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isSmartBuy || false,
          onChange: (value) => onChange('isSmartBuy', value === 'true')
        }];
      }
    }
  },
  //TODO: Add Exclusions to this card
  "Harley Davidson": {
    cardType: "points",
    defaultRate: 4 / 150,
    swiggyZomatoRate: 20 / 150,
    smartBuyRate: 10 / 150,
    redemptionRate: 0.20, // 1 Reward Point = ₹0.20
    mccRates: {
      "5814": 20 / 150, // Fast Food (for Swiggy and Zomato)
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Harley Davidson"].defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";

      if (mcc === "5814" && additionalParams.isSwiggyZomato) {
        rate = hdfcCardRewards["Harley Davidson"].swiggyZomatoRate;
        category = "Swiggy/Zomato";
        rateType = "swiggy-zomato";
      } else if (additionalParams.isSmartBuy) {
        rate = hdfcCardRewards["Harley Davidson"].smartBuyRate;
        category = "SmartBuy Purchase";
        rateType = "smartbuy";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * hdfcCardRewards["Harley Davidson"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      if (selectedMcc === "5814") {
        return [{
          type: 'radio',
          label: 'Is this a Swiggy or Zomato transaction?',
          name: 'isSwiggyZomato',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isSwiggyZomato || false,
          onChange: (value) => onChange('isSwiggyZomato', value === 'true')
        }];
      } else {
        return [{
          type: 'radio',
          label: 'Is this a SmartBuy purchase?',
          name: 'isSmartBuy',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isSmartBuy || false,
          onChange: (value) => onChange('isSmartBuy', value === 'true')
        }];
      }
    }
  },
  //TODO: Add Exclusions to this card
  "IndianOil": {
    cardType: "points",
    defaultRate: 1 / 100,
    mccRates: {
      "5541": 5 / 100, // Fuel stations
      "5411": 5 / 100  // Grocery stores
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards.IndianOil.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && hdfcCardRewards.IndianOil.mccRates[mcc]) {
        rate = hdfcCardRewards.IndianOil.mccRates[mcc];
        rateType = "mcc-specific";
        category = mcc === "5541" ? "Fuel" : "Grocery";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Infinia Metal": {
    cardType: "points",
    defaultRate: 5 / 150,
    smartbuyRates: {
      hotels: 50 / 150,
      flights: 25 / 150,
      vouchers: 25 / 150
    },
    mccRates: {
      // Exclusions
      "6011": 0,  // ATM
      "6012": 0,  // Financial institutions
      "6051": 0,  // Non-financial institutions
      "6529": 0,  // Wire transfer money orders
      "6530": 0,  // Remote stored value load
      "6534": 0,  // Money transfer
      "6540": 0,  // POI funding transactions
      "9211": 0,  // Court costs
      "9222": 0,  // Fines
      "9223": 0,  // Bail
      "9311": 0,  // Tax payments
      "9399": 0,  // Government services
      "9402": 0,  // Postal services
      "9405": 0,  // Intra-government purchases
      "9702": 0,  // Emergency services
      "9703": 0,  // Counseling services
      "9950": 0,  // Intra-company purchases
      // Add other MCC codes if needed
    },
    capping: {
      categories: {
        "Regular Spends": { points: 200000, maxSpent: 6000000 },
        "Hotels (Via Smartbuy)": { points: 15000, maxSpent: 50000, rate: 50 / 150 },
        "Flights / eVouchers (Via Smartbuy)": { points: 15000, maxSpent: 114000, rate: 25 / 150 },
        "Grocery": { points: 2000, maxSpent: 60000 },
        "Insurance": { points: 5000, maxSpent: 150000 },
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Infinia Metal"].defaultRate;
      let category = "Regular Spends";
      let rateType = "default";

      if (additionalParams.isSmartbuy) {
        if (additionalParams.smartbuyCategory === "hotels") {
          rate = hdfcCardRewards["Infinia Metal"].smartbuyRates.hotels;
          category = "Hotels (Via Smartbuy)";
        } else if (additionalParams.smartbuyCategory === "flights" || additionalParams.smartbuyCategory === "vouchers") {
          rate = hdfcCardRewards["Infinia Metal"].smartbuyRates.flights;
          category = "Flights / eVouchers (Via Smartbuy)";
        }
        rateType = "smartbuy";
      } else if (mcc && hdfcCardRewards["Infinia Metal"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["Infinia Metal"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      // Check for grocery and insurance MCCs
      if (["5411", "5422", "5451", "5499"].includes(mcc)) {
        category = "Grocery";
      } else if (["6300", "5960"].includes(mcc)) {
        category = "Insurance";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => {
      const inputs = [
        {
          type: "radio",
          name: "isSmartBuy",
          label: "Is this a Smartbuy transaction?",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" }
          ],
          onChange: (value) => onChange("isSmartBuy", value === "true"),
        },
      ];
      if (currentInputs.isSmartBuy === true) {
        inputs.push({
          type: "select",
          name: "smartbuyCategory",
          label: "Smartbuy Category",
          options: [
            { label: 'Hotels', value: 'hotels' },
            { label: 'Flights', value: 'flights' },
            { label: 'Vouchers', value: 'vouchers' }
          ],
          onChange: (value) => onChange("smartbuyCategory", value),
        });
      }

      return inputs;
    }
  },
  "IRCTC": {
    cardType: "points",
    defaultRate: 1 / 100,
    irctcRate: 5 / 100,
    smartbuyRate: 5 / 100,
    mccRates: {
      "4112": 5 / 100,
      "4011": 5 / 100,
      "4511": 5 / 100,
      "5541": 0, "5542": 0, "5983": 0,
      "6513": 0,
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0,
      "6011": 0,
    },
    capping: {
      categories: {
        "IRCTC": { points: 1000, maxSpent: 20000 },
        "Smartbuy": { cashback: 500, maxSpent: 10000 },
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["IRCTC"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let cashback = 0;

      if (additionalParams.isIRCTC || (mcc && ["4112", "4011"].includes(mcc))) {
        rate = hdfcCardRewards["IRCTC"].irctcRate;
        rateType = "irctc";
        category = "IRCTC";
      } else if (additionalParams.isSmartbuy) {
        rate = hdfcCardRewards["IRCTC"].smartbuyRate;
        rateType = "smartbuy";
        category = "Smartbuy";
        cashback = amount * rate;
      } else if (mcc && hdfcCardRewards["IRCTC"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["IRCTC"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const isRailwaysMcc = selectedMcc && ["4112", "4011"].includes(selectedMcc);

      if (isRailwaysMcc) {
        return [
          {
            type: 'radio',
            label: 'Is this an IRCTC transaction?',
            name: 'isIRCTC',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isIRCTC || false,
            onChange: (value) => onChange('isIRCTC', value === 'true')
          }
        ];
      } else {
        return [
          {
            type: 'radio',
            label: 'Is this a Smartbuy transaction?',
            name: 'isSmartbuy',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isSmartbuy || false,
            onChange: (value) => onChange('isSmartbuy', value === 'true')
          }
        ];
      }
    }
  },
  "Marriott Bonvoy": {
    cardType: "points",
    defaultRate: 2 / 150,
    mccRates: {
      // Marriott Hotels 8 points per 150 INR
      "3501": 8 / 150, "3502": 8 / 150, "3503": 8 / 150, "3504": 8 / 150, "3505": 8 / 150,
      "3506": 8 / 150, "3507": 8 / 150, "3508": 8 / 150, "3509": 8 / 150, "3510": 8 / 150,
      // ... (add all Marriott Bonvoy hotel MCCs)
      "3790": 8 / 150, "7011": 8 / 150,
      // Travel 4 points per 150 INR
      "3000": 4 / 150, "3001": 4 / 150, "3002": 4 / 150, "3003": 4 / 150, "3004": 4 / 150, "3005": 4 / 150,
      "3006": 4 / 150, "3007": 4 / 150, "3008": 4 / 150, "3009": 4 / 150, "3010": 4 / 150, "3011": 4 / 150,
      "3012": 4 / 150, "3013": 4 / 150, "3014": 4 / 150, "3015": 4 / 150, "3016": 4 / 150, "3017": 4 / 150,
      "3018": 4 / 150, "3019": 4 / 150, "3020": 4 / 150, "3021": 4 / 150, "3022": 4 / 150, "3023": 4 / 150,
      "3024": 4 / 150, "3025": 4 / 150, "3026": 4 / 150, "3027": 4 / 150, "3028": 4 / 150, "3029": 4 / 150,
      "3030": 4 / 150, "3031": 4 / 150, "3032": 4 / 150, "3033": 4 / 150, "3034": 4 / 150, "3035": 4 / 150,
      "3036": 4 / 150, "3037": 4 / 150, "3038": 4 / 150, "3039": 4 / 150, "3040": 4 / 150, "3041": 4 / 150,
      "3042": 4 / 150, "3043": 4 / 150, "3044": 4 / 150, "3045": 4 / 150, "3046": 4 / 150, "3047": 4 / 150,
      "3048": 4 / 150, "3049": 4 / 150, "3050": 4 / 150, "3051": 4 / 150, "3052": 4 / 150, "3053": 4 / 150,
      "3054": 4 / 150, "3055": 4 / 150, "3056": 4 / 150, "3057": 4 / 150, "3058": 4 / 150, "3059": 4 / 150,
      "3060": 4 / 150, "3061": 4 / 150, "3062": 4 / 150, "3063": 4 / 150, "3064": 4 / 150, "3065": 4 / 150,
      "3066": 4 / 150, "3067": 4 / 150, "3068": 4 / 150, "3069": 4 / 150, "3070": 4 / 150, "3071": 4 / 150,
      "3072": 4 / 150, "3073": 4 / 150, "3074": 4 / 150, "3075": 4 / 150, "3076": 4 / 150, "3077": 4 / 150,
      "3078": 4 / 150, "3079": 4 / 150, "3080": 4 / 150, "3081": 4 / 150, "3082": 4 / 150, "3083": 4 / 150,
      "3084": 4 / 150, "3085": 4 / 150, "3086": 4 / 150, "3087": 4 / 150, "3088": 4 / 150, "3089": 4 / 150,
      "3090": 4 / 150, "3091": 4 / 150, "3092": 4 / 150, "3093": 4 / 150, "3094": 4 / 150, "3095": 4 / 150,
      "3096": 4 / 150, "3097": 4 / 150, "3098": 4 / 150, "3099": 4 / 150, "3100": 4 / 150, "3101": 4 / 150,
      "3102": 4 / 150, "3103": 4 / 150, "3104": 4 / 150, "3105": 4 / 150, "3106": 4 / 150, "3107": 4 / 150,
      "3108": 4 / 150, "3109": 4 / 150, "3110": 4 / 150, "3111": 4 / 150, "3112": 4 / 150, "3113": 4 / 150,
      "3114": 4 / 150, "3115": 4 / 150, "3116": 4 / 150, "3117": 4 / 150, "3118": 4 / 150, "3119": 4 / 150,
      "3120": 4 / 150, "3121": 4 / 150, "3122": 4 / 150, "3123": 4 / 150, "3124": 4 / 150, "3125": 4 / 150,
      "3126": 4 / 150, "3127": 4 / 150, "3128": 4 / 150, "3129": 4 / 150, "3130": 4 / 150, "3131": 4 / 150,
      "3132": 4 / 150, "3133": 4 / 150, "3134": 4 / 150, "3135": 4 / 150, "3136": 4 / 150, "3137": 4 / 150,
      "3138": 4 / 150, "3139": 4 / 150, "3140": 4 / 150, "3141": 4 / 150, "3142": 4 / 150, "3143": 4 / 150,
      "3144": 4 / 150, "3145": 4 / 150, "3146": 4 / 150, "3147": 4 / 150, "3148": 4 / 150, "3149": 4 / 150,
      "3150": 4 / 150, "3151": 4 / 150, "3152": 4 / 150, "3153": 4 / 150, "3154": 4 / 150, "3155": 4 / 150,
      "3156": 4 / 150, "3157": 4 / 150, "3158": 4 / 150, "3159": 4 / 150, "3160": 4 / 150, "3161": 4 / 150,
      "3162": 4 / 150, "3163": 4 / 150, "3164": 4 / 150, "3165": 4 / 150, "3166": 4 / 150, "3167": 4 / 150,
      "3168": 4 / 150, "3169": 4 / 150, "3170": 4 / 150, "3171": 4 / 150, "3172": 4 / 150, "3173": 4 / 150,
      "3174": 4 / 150, "3175": 4 / 150, "3176": 4 / 150, "3177": 4 / 150, "3178": 4 / 150, "3179": 4 / 150,
      "3180": 4 / 150, "3181": 4 / 150, "3182": 4 / 150, "3183": 4 / 150, "3184": 4 / 150, "3185": 4 / 150,
      "3186": 4 / 150, "3187": 4 / 150, "3188": 4 / 150, "3189": 4 / 150, "3190": 4 / 150, "3191": 4 / 150,
      "3192": 4 / 150, "3193": 4 / 150, "3194": 4 / 150, "3195": 4 / 150, "3196": 4 / 150, "3197": 4 / 150,
      "3198": 4 / 150, "3199": 4 / 150, "3200": 4 / 150, "3201": 4 / 150, "3202": 4 / 150, "3203": 4 / 150,
      "3204": 4 / 150, "3205": 4 / 150, "3206": 4 / 150, "3207": 4 / 150, "3208": 4 / 150, "3209": 4 / 150,
      "3210": 4 / 150, "3211": 4 / 150, "3212": 4 / 150, "3213": 4 / 150, "3214": 4 / 150, "3215": 4 / 150,
      "3216": 4 / 150, "3217": 4 / 150, "3218": 4 / 150, "3219": 4 / 150, "3220": 4 / 150, "3221": 4 / 150,
      "3222": 4 / 150, "3223": 4 / 150, "3224": 4 / 150, "3225": 4 / 150, "3226": 4 / 150, "3227": 4 / 150,
      "3228": 4 / 150, "3229": 4 / 150, "3230": 4 / 150, "3231": 4 / 150, "3232": 4 / 150, "3233": 4 / 150,
      "3234": 4 / 150, "3235": 4 / 150, "3236": 4 / 150, "3237": 4 / 150, "3238": 4 / 150, "3239": 4 / 150,
      "3240": 4 / 150, "3241": 4 / 150, "3242": 4 / 150, "3243": 4 / 150, "3244": 4 / 150, "3245": 4 / 150,
      "3246": 4 / 150, "3247": 4 / 150, "3248": 4 / 150, "3249": 4 / 150, "3250": 4 / 150, "3251": 4 / 150,
      "3252": 4 / 150, "3253": 4 / 150, "3254": 4 / 150, "3255": 4 / 150, "3256": 4 / 150, "3257": 4 / 150,
      "3258": 4 / 150, "3259": 4 / 150, "3260": 4 / 150, "3261": 4 / 150, "3262": 4 / 150, "3263": 4 / 150,
      "3264": 4 / 150, "3265": 4 / 150, "3266": 4 / 150, "3267": 4 / 150, "3268": 4 / 150, "3269": 4 / 150,
      "3270": 4 / 150, "3271": 4 / 150, "3272": 4 / 150, "3273": 4 / 150, "3274": 4 / 150, "3275": 4 / 150,
      "3276": 4 / 150, "3277": 4 / 150, "3278": 4 / 150, "3279": 4 / 150, "3280": 4 / 150, "3281": 4 / 150,
      "3282": 4 / 150, "3283": 4 / 150, "3284": 4 / 150, "3285": 4 / 150, "3286": 4 / 150, "3287": 4 / 150,
      "3288": 4 / 150, "3289": 4 / 150, "3290": 4 / 150, "3291": 4 / 150, "3292": 4 / 150, "3293": 4 / 150,
      "3294": 4 / 150, "3295": 4 / 150, "3296": 4 / 150, "3297": 4 / 150, "3298": 4 / 150, "3299": 4 / 150,
      "3300": 4 / 150, "3301": 4 / 150, "3302": 4 / 150, "3303": 4 / 150, "3304": 4 / 150, "3305": 4 / 150,
      "3306": 4 / 150, "3307": 4 / 150, "3308": 4 / 150, "3309": 4 / 150, "3310": 4 / 150, "3311": 4 / 150,
      "3312": 4 / 150, "3313": 4 / 150, "3314": 4 / 150, "3315": 4 / 150, "3316": 4 / 150, "3317": 4 / 150,
      "3318": 4 / 150, "3319": 4 / 150, "3320": 4 / 150, "3321": 4 / 150, "3322": 4 / 150, "3323": 4 / 150,
      "3324": 4 / 150, "3325": 4 / 150, "3326": 4 / 150, "3327": 4 / 150, "3328": 4 / 150, "3329": 4 / 150,
      "3330": 4 / 150, "3331": 4 / 150, "3332": 4 / 150, "3333": 4 / 150, "3334": 4 / 150, "3335": 4 / 150,
      "3336": 4 / 150, "3337": 4 / 150, "3338": 4 / 150, "3339": 4 / 150, "3340": 4 / 150, "3341": 4 / 150,
      "3342": 4 / 150, "3343": 4 / 150, "3344": 4 / 150, "3345": 4 / 150, "3346": 4 / 150, "3347": 4 / 150,
      "3348": 4 / 150, "3349": 4 / 150, "3350": 4 / 150, "4511": 4 / 150,

      "4511": 4 / 150,
      "4112": 4 / 150, // Passenger Railways
      "4411": 4 / 150, // Steamship/Cruise Lines
      "4722": 4 / 150, // Travel Agencies and Tour Operators

      //Dining 4 points per 150 INR
      "5812": 4 / 150, // Eating Places and Restaurants
      "5813": 4 / 150, // Drinking Places (Alcoholic Beverages), Bars, Taverns, Cocktail lounges, Nightclubs and Discotheques
      "5814": 4 / 150, // Fast Food Restaurants

      // Entertainment (4 points per 150 INR
      "7832": 4 / 150, // Motion Picture Theaters
      "7922": 4 / 150, // Theatrical Producers (Except Motion Pictures) and Ticket Agencies
      "7929": 4 / 150, // Bands, Orchestras, and Miscellaneous Entertainers (Not Elsewhere Classified)
      "7991": 4 / 150, // Tourist Attractions and Exhibits
      "7996": 4 / 150, // Amusement Parks, Circuses, Carnivals, and Fortune Tellers
      "7998": 4 / 150, // Aquariums, Seaquariums, Dolphinariums
      "7999": 4 / 150,  // Recreation Services (Not Elsewhere Classified)

      // Exclusions (0 points)
      "5541": 0, // Fuel
      "5542": 0, // Fuel
      "6540": 0, // Wallet load
      "9211": 0, // Government services
      "9222": 0, // Government services
      "9223": 0, // Government services
      "9311": 0, // Government services
      "9399": 0, // Government services
      "6513": 0  // Rent
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Marriott Bonvoy"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && hdfcCardRewards["Marriott Bonvoy"].mccRates[mcc]) {
        rate = hdfcCardRewards["Marriott Bonvoy"].mccRates[mcc];
        rateType = "mcc-specific";
        if (mcc.startsWith("35") || mcc === "7011") {
          category = "Marriott Hotels";
        } else if (mcc.startsWith("30") || mcc === "4511" || mcc === "4112" || mcc === "4411" || mcc === "4722") {
          category = "Travel";
        } else if (["5812", "5813", "5814"].includes(mcc)) {
          category = "Dining";
        } else if (["7832", "7922", "7929", "7991", "7996", "7998", "7999"].includes(mcc)) {
          category = "Entertainment";
        } else {
          category = "Category Spend";
        }
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  //TODO: Fix Capping
  "Millennia": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% cashback on all other spends
    mccRates: {
      // 5% Cashback on specific merchants
      "5399": 5 / 100, // Amazon, Flipkart (General Merchandise Stores)
      "7829": 5 / 100, // BookMyShow (Motion Picture Distribution)
      "7298": 5 / 100, // Cult.fit (Health and Beauty Spas)
      "5691": 5 / 100, // Myntra (Men's and Women's Clothing Stores)
      "4899": 5 / 100, // Sony LIV (Cable and Other Pay Television Services)
      "5814": 5 / 100, // Swiggy, Zomato (Fast Food Restaurants)
      "5311": 5 / 100, // Tata CLiQ (Department Stores)
      "4121": 5 / 100, // Uber (Taxicabs and Limousines)

      // Excluded categories
      "5541": 0, "5542": 0, "5983": 0, "1361": 0, "5172": 0, "9752": 0, // Fuel
      "6540": 0, // Wallet loads
      "6513": 0, // Rent payments
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government transactions
      "8211": 0, "8220": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // Education
      "4900": 0, // Utilities
    },
    capping: {
      categories: {
        "5% Cashback": { cashback: 1000, maxSpent: 20000 }, // Max ₹1000 cashback on 5% category
        "Other Spends": { cashback: 1000, maxSpent: 100000 }, // Max ₹1000 cashback on 1% category
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Millennia"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      // Check for 5% Cashback merchants
      if (["5399", "7829", "7298", "5691", "4899", "5814", "5311", "4121"].includes(mcc)) {
        rate = 5 / 100;
        category = "5% Cashback";
        rateType = "accelerated";
      } else if (hdfcCardRewards["Millennia"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["Millennia"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const cashback = amount * rate;
      const points = Math.floor(cashback * 100); // 1 CashPoint = ₹1

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => []
  },
  "MoneyBack Plus": {
    cardType: "points",
    defaultRate: 2 / 150, // 2 CashPoints per ₹150 spent on other spends
    mccRates: {
      "5399": 20 / 150, // 10X CashPoints (20 per ₹150) for Amazon, Flipkart
      "5411": 20 / 150, // 10X CashPoints for BigBasket
      "5310": 20 / 150, // 10X CashPoints for Reliance Smart SuperStore
      "5814": 20 / 150, // 10X CashPoints for Swiggy

      // Excluded categories
      "5541": 0, "5542": 0, "5983": 0, // Fuel
      "6513": 0, // Rent payments
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government transactions
      "6540": 0, // Wallet loads
      "5944": 0, // Jewelry (often used for gift cards)
      "6011": 0, // Cash Advances

      // Educational MCCs (will not earn rewards from Sept 1, 2024, if paid through third-party apps)
      "8211": 2 / 150, "8220": 2 / 150, "8241": 2 / 150, "8244": 2 / 150, "8249": 2 / 150, "8299": 2 / 150,

      // Excluded transactions (mapped to placeholder MCCs)
      "9000": 0, // Wallet loading (placeholder MCC)
    },
    capping: {
      categories: {
        "10X CashPoints": { points: 2500, maxSpent: 18750 }, // 2500 CashPoints max per calendar month
        "Grocery": { points: 1000, maxSpent: 75000 }, // 1000 points cap on grocery transactions per month
        "UPI": { points: 500, maxSpent: 37500 } // 500 points cap on UPI transactions per month (for RuPay cards)
      }
    },
    specialRates: {
      upi: {
        rate: 2 / 150, // 2 RPs for every Rs.150 spent on UPI (for RuPay cards)
        exclusions: ["5541", "5542", "5983", "6540", "5944"] // Excluding fuel, wallet loads, and voucher purchases
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["MoneyBack Plus"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      // Check for 10X CashPoints merchants
      if (["5399", "5411", "5310", "5814"].includes(mcc)) {
        rate = hdfcCardRewards["MoneyBack Plus"].mccRates[mcc];
        category = "10X CashPoints";
        rateType = "accelerated";
      } else if (mcc && hdfcCardRewards["MoneyBack Plus"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["MoneyBack Plus"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      // Check for UPI transactions (RuPay cards only)
      if (additionalParams.isUPI && additionalParams.isRuPay) {
        const upiRate = hdfcCardRewards["MoneyBack Plus"].specialRates.upi;
        if (!upiRate.exclusions.includes(mcc)) {
          rate = upiRate.rate;
          category = "UPI Spend";
          rateType = "upi";
        }
      }

      if (additionalParams.isWalletLoading) {
        mcc = "9000"; // Use placeholder MCC for wallet loading
        rate = 0;
        category = "Excluded Transaction";
      }

      const points = Math.floor(amount * rate);
      const cashback = points / 100; // 1 CashPoint = ₹0.01

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const inputs = [];
      const walletMccs = ["6540"]; // MCC for wallet loads

      inputs.push({
        type: 'radio',
        label: 'Is this a RuPay card?',
        name: 'isRuPay',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isRuPay || false,
        onChange: (value) => {
          onChange('isRuPay', value === 'true');
          if (value === 'false') {
            onChange('isUPI', false); // Reset UPI if not RuPay
          }
        }
      });

      if (currentInputs.isRuPay) {
        inputs.push({
          type: 'radio',
          label: 'Is this a UPI transaction?',
          name: 'isUPI',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isUPI || false,
          onChange: (value) => {
            onChange('isUPI', value === 'true');
            if (value === 'true') {
              onChange('isWalletLoading', false); // Reset wallet loading if UPI
            }
          }
        });
      }

      if (!currentInputs.isUPI && walletMccs.includes(selectedMcc)) {
        inputs.push({
          type: 'radio',
          label: 'Is this a wallet loading transaction?',
          name: 'isWalletLoading',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isWalletLoading || false,
          onChange: (value) => onChange('isWalletLoading', value === 'true')
        });
      }

      return inputs;
    }
  },
  "Paytm": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% cashback on all other retail spends
    paytmAppRate: 3 / 100, // 3% cashback on Paytm app purchases
    paytmSpendRate: 2 / 100, // 2% cashback on other select Paytm spends
    mccRates: {
      "5541": 0, "5542": 0, // Fuel spends
      "6513": 0, // Rental spends
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government spends
      "5411": 1 / 100, "5422": 1 / 100, "5441": 1 / 100, "5451": 1 / 100, "5462": 1 / 100, "5499": 1 / 100, // Grocery
    },
    capping: {
      categories: {
        "Paytm App": { cashback: 500, maxSpent: 500 * (100 / 3) },
        "Paytm Spends": { cashback: 500, maxSpent: 500 * (100 / 2) },
        "Other Retail": { cashback: 1000, maxSpent: 100000 },
        "Grocery": { cashback: 10, maxSpent: 1000 }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards.Paytm.defaultRate;
      let category = "Other Retail";
      let rateType = "default";

      switch (additionalParams.isPaytmTransaction) {
        case 'app':
          rate = hdfcCardRewards.Paytm.paytmAppRate;
          category = "Paytm App";
          rateType = "paytm-app";
          break;
        case 'spend':
          rate = hdfcCardRewards.Paytm.paytmSpendRate;
          category = "Paytm Spends";
          rateType = "paytm-spend";
          break;
        case 'none':
        default:
          if (mcc && hdfcCardRewards.Paytm.mccRates[mcc] !== undefined) {
            rate = hdfcCardRewards.Paytm.mccRates[mcc];
            rateType = "mcc-specific";
            category = ["5411", "5422", "5441", "5451", "5462", "5499"].includes(mcc) ? "Grocery" : "Category Spend";
          }
          break;
      }

      let cashback = amount * rate;
      let cappedAmount = amount;

      // Apply capping
      const cappingCategory = hdfcCardRewards.Paytm.capping.categories[category] || hdfcCardRewards.Paytm.capping.categories["Other Retail"];
      if (cappingCategory) {
        cappedAmount = Math.min(amount, cappingCategory.maxSpent);
        cashback = Math.min(cashback, cappingCategory.cashback);
      }

      // Round cashback to 2 decimal places
      cashback = Math.round(cashback * 100) / 100;

      const appliedCap = cappedAmount < amount || cashback < amount * rate ? cappingCategory : null;

      return {
        cashback,
        rate,
        rateType,
        category,
        appliedCap,
        cappedAmount
      };
    },
    dynamicInputs: (currentInputs, onChange) => [{
      type: 'radio',
      label: 'Is this a Paytm transaction?',
      name: 'isPaytmTransaction',
      options: [
        { label: 'Yes, Paytm app transaction', value: 'app' },
        { label: 'Yes, other Paytm spend', value: 'spend' },
        { label: 'No', value: 'none' }
      ],
      value: currentInputs.isPaytmTransaction || 'none',
      onChange: (value) => onChange('isPaytmTransaction', value)
    }]
  },
  "Paytm Select": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% cashback on all other retail transactions
    paytmAppRate: 5 / 100, // 5% cashback on Paytm app purchases
    acceleratedRate: 3 / 100, // 3% cashback on accelerated categories
    mccRates: {
      "5541": 0, "5542": 0, // Fuel spends
      "6513": 0, // Rental spends
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government spends
      "5814": 3 / 100, // Swiggy
      "5651": 3 / 100, // AJIO (assuming this MCC, please verify)
      "5411": 3 / 100, // Big Basket (assuming this MCC, please verify)
      "4121": 3 / 100, // Uber
      "5422": 3 / 100, "5441": 3 / 100, "5451": 3 / 100, "5462": 3 / 100, "5499": 3 / 100, // Other Grocery
    },
    capping: {
      categories: {
        "Paytm App": { cashback: 1500, maxSpent: 1500 * (100 / 5) },
        "Accelerated": { cashback: 500, maxSpent: 500 * (100 / 3) },
        "Other Retail": { cashback: 2000, maxSpent: 200000 },
        "Grocery": { cashback: 10, maxSpent: 1000 } // 1000 cashpoints = Rs. 10 cashback
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Paytm Select"].defaultRate;
      let category = "Other Retail";
      let rateType = "default";

      switch (additionalParams.isPaytmTransaction) {
        case 'app':
          rate = hdfcCardRewards["Paytm Select"].paytmAppRate;
          category = "Paytm App";
          rateType = "paytm-app";
          break;
        case 'none':
        default:
          if (mcc && hdfcCardRewards["Paytm Select"].mccRates[mcc] !== undefined) {
            rate = hdfcCardRewards["Paytm Select"].mccRates[mcc];
            rateType = "mcc-specific";
            category = ["5411", "5422", "5441", "5451", "5462", "5499"].includes(mcc) ? "Grocery" : "Accelerated";
          }
          break;
      }

      let cashback = amount * rate;
      let cappedAmount = amount;

      // Apply capping
      const cappingCategory = hdfcCardRewards["Paytm Select"].capping.categories[category] || hdfcCardRewards["Paytm Select"].capping.categories["Other Retail"];
      if (cappingCategory) {
        cappedAmount = Math.min(amount, cappingCategory.maxSpent);
        cashback = Math.min(cashback, cappingCategory.cashback);
      }

      // Round cashback to 2 decimal places
      cashback = Math.round(cashback * 100) / 100;

      const appliedCap = cappedAmount < amount || cashback < amount * rate ? cappingCategory : null;

      return {
        cashback,
        rate,
        rateType,
        category,
        appliedCap,
        cappedAmount
      };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Paytm transaction?',
        name: 'isPaytmTransaction',
        options: [
          { label: 'Paytm App', value: 'app' },
          { label: 'Other', value: 'none' }
        ],
        value: currentInputs.isPaytmTransaction || 'none',
        onChange: (value) => onChange('isPaytmTransaction', value)
      }
    ]
  },

  "Paytm Mobile": {
    cardType: "cashback",
    defaultRate: 0.5 / 100, // 0.5% cashback on all other retail transactions
    paytmAppRate: 2 / 100, // 2% cashback on Paytm app purchases
    paytmSpendRate: 1 / 100, // 1% cashback on other select Paytm spends
    mccRates: {
      "5541": 0, "5542": 0, // Fuel spends
      "6513": 0, // Rental spends
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government spends
      "5411": 0.5 / 100, "5422": 0.5 / 100, "5441": 0.5 / 100, "5451": 0.5 / 100, "5462": 0.5 / 100, "5499": 0.5 / 100, // Grocery
    },
    capping: {
      categories: {
        "Paytm App": { cashback: 250, maxSpent: 250 * (100 / 2) },
        "Paytm Spends": { cashback: 250, maxSpent: 250 * 100 },
        "Other Retail": { cashback: 500, maxSpent: 100000 },
        "Grocery": { cashback: 10, maxSpent: 1000 } // 1000 cashpoints = Rs. 10 cashback
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Paytm Mobile"].defaultRate;
      let category = "Other Retail";
      let rateType = "default";

      switch (additionalParams.isPaytmTransaction) {
        case 'app':
          rate = hdfcCardRewards["Paytm Mobile"].paytmAppRate;
          category = "Paytm App";
          rateType = "paytm-app";
          break;
        case 'spend':
          rate = hdfcCardRewards["Paytm Mobile"].paytmSpendRate;
          category = "Paytm Spends";
          rateType = "paytm-spend";
          break;
        case 'none':
        default:
          if (mcc && hdfcCardRewards["Paytm Mobile"].mccRates[mcc] !== undefined) {
            rate = hdfcCardRewards["Paytm Mobile"].mccRates[mcc];
            rateType = "mcc-specific";
            category = ["5411", "5422", "5441", "5451", "5462", "5499"].includes(mcc) ? "Grocery" : "Category Spend";
          }
          break;
      }

      let cashback = amount * rate;
      let cappedAmount = amount;

      // Apply capping
      const cappingCategory = hdfcCardRewards["Paytm Mobile"].capping.categories[category] || hdfcCardRewards["Paytm Mobile"].capping.categories["Other Retail"];
      if (cappingCategory) {
        cappedAmount = Math.min(amount, cappingCategory.maxSpent);
        cashback = Math.min(cashback, cappingCategory.cashback);
      }

      // Round cashback to 2 decimal places
      cashback = Math.round(cashback * 100) / 100;

      const appliedCap = cappedAmount < amount || cashback < amount * rate ? cappingCategory : null;

      return {
        cashback,
        rate,
        rateType,
        category,
        appliedCap,
        cappedAmount
      };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Paytm transaction?',
        name: 'isPaytmTransaction',
        options: [
          { label: 'Paytm App', value: 'app' },
          { label: 'Paytm Spend', value: 'spend' },
          { label: 'Other', value: 'none' }
        ],
        value: currentInputs.isPaytmTransaction || 'none',
        onChange: (value) => onChange('isPaytmTransaction', value)
      }
    ]
  },

  "Paytm Digital": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% cashback on all other retail spends
    scanAndPayRate: 2 / 100, // 2% cashback on Scan & Pay feature
    acceleratedRate: 2 / 100, // 2% cashback on key accelerated categories
    mccRates: {
      "5541": 0, "5542": 0, // Fuel spends
      "6513": 0, // Rental spends
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government spends
      "5814": 2 / 100, // Swiggy
      "4121": 2 / 100, // Uber
      "5411": 1 / 100, "5422": 1 / 100, "5441": 1 / 100, "5451": 1 / 100, "5462": 1 / 100, "5499": 1 / 100, // Grocery
    },
    capping: {
      categories: {
        "Scan & Pay": { cashback: 250, maxSpent: 250 * (100 / 2) },
        "Accelerated": { cashback: 250, maxSpent: 250 * (100 / 2) },
        "Other Retail": { cashback: 500, maxSpent: 50000 },
        "Grocery": { cashback: 10, maxSpent: 1000 } // 1000 cashpoints = Rs. 10 cashback
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Paytm Digital"].defaultRate;
      let category = "Other Retail";
      let rateType = "default";

      if (additionalParams.isScanAndPay) {
        rate = hdfcCardRewards["Paytm Digital"].scanAndPayRate;
        category = "Scan & Pay";
        rateType = "scan-and-pay";
      } else if (mcc && hdfcCardRewards["Paytm Digital"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["Paytm Digital"].mccRates[mcc];
        rateType = "mcc-specific";
        category = ["5411", "5422", "5441", "5451", "5462", "5499"].includes(mcc) ? "Grocery" : "Accelerated";
      }

      let cashback = amount * rate;
      let cappedAmount = amount;

      // Apply capping
      const cappingCategory = hdfcCardRewards["Paytm Digital"].capping.categories[category] || hdfcCardRewards["Paytm Digital"].capping.categories["Other Retail"];
      if (cappingCategory) {
        cappedAmount = Math.min(amount, cappingCategory.maxSpent);
        cashback = Math.min(cashback, cappingCategory.cashback);
      }

      // Round cashback to 2 decimal places
      cashback = Math.round(cashback * 100) / 100;

      const appliedCap = cappedAmount < amount || cashback < amount * rate ? cappingCategory : null;

      return {
        cashback,
        rate,
        rateType,
        category,
        appliedCap,
        cappedAmount
      };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Scan & Pay transaction?',
        name: 'isScanAndPay',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isScanAndPay || false,
        onChange: (value) => onChange('isScanAndPay', value === 'true')
      }
    ]
  },
  "Regalia": {
    cardType: "points",
    defaultRate: 4 / 150,
    mccRates: {
      "6513": 0,
      "7399": 0,
      "4214": 0,
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards.Regalia.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && hdfcCardRewards.Regalia.mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards.Regalia.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Regalia Gold": {
    cardType: "points",
    defaultRate: 4 / 150,
    mccRates: {
      // Fuel
      "5541": 0,
      "5542": 0,
      "9311": 0, // Tax payments
      "6513": 0, // Rent payments
      "6540": 0, // Wallet top-ups (example MCCs, adjust as needed)

      // Grocery MCCs (for capping purposes)
      "5411": 4 / 150, // Grocery stores
      "5422": 4 / 150, // Freezer and locker meat provisioners
      "5441": 4 / 150, // Candy, nut, and confectionery stores
      "5451": 4 / 150, // Dairy products stores
      "5462": 4 / 150, // Bakeries
      "5499": 4 / 150  // Miscellaneous food stores
    },
    acceleratedSpends: {
      rate: 20 / 150,
      mccRates: {
        "5311": 20 / 150, // Department Stores (for Marks & Spencer)
        "5651": 20 / 150, // Family Clothing Stores (for Myntra)
        "5977": 20 / 150, // Cosmetic Stores (for Nykaa)
        "5732": 20 / 150  // Electronics Stores (for Reliance Digital)
      }
    },
    smartbuyRates: {
      "hotels": 40 / 150,
      "flights": 20 / 150,
      "vouchers": 20 / 150
    },
    capping: {
      categories: {
        "Regular Spends": { points: 200000, maxSpent: 200000 * (150 / 4) },
        "Accelerated Spends": { points: 5000, maxSpent: 5000 * (150 / 20) },
        "Hotels (Via Smartbuy)": { points: 4000, maxSpent: 4000 * (150 / 40), rate: 40 / 150 },
        "Flights / eVouchers (Via Smartbuy)": { points: 4000, maxSpent: 4000 * (150 / 20), rate: 20 / 150 },
        "Grocery": { points: 2000, maxSpent: 2000 * (150 / 4) }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Regalia Gold"].defaultRate;
      let category = "Regular Spends";
      let rateType = "default";

      if (additionalParams.isSmartbuy) {
        if (additionalParams.smartbuyCategory === "hotels") {
          rate = hdfcCardRewards["Regalia Gold"].smartbuyRates.hotels;
          category = "Hotels (Via Smartbuy)";
        } else if (additionalParams.smartbuyCategory === "flights" || additionalParams.smartbuyCategory === "vouchers") {
          rate = hdfcCardRewards["Regalia Gold"].smartbuyRates.flights;
          category = "Flights / eVouchers (Via Smartbuy)";
        }
        rateType = "smartbuy";
      } else if (mcc && hdfcCardRewards["Regalia Gold"].acceleratedSpends.mccRates[mcc]) {
        rate = hdfcCardRewards["Regalia Gold"].acceleratedSpends.rate;
        rateType = "accelerated";
        category = "Accelerated Spends";
      } else if (mcc && hdfcCardRewards["Regalia Gold"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["Regalia Gold"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : (["5411", "5422", "5441", "5451", "5462", "5499"].includes(mcc) ? "Grocery" : "Category Spend");
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Smartbuy transaction?',
        name: 'isSmartbuy',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSmartbuy || false,
        onChange: (value) => onChange('isSmartbuy', value === 'true')
      },
      {
        type: 'select',
        label: 'Smartbuy Category',
        name: 'smartbuyCategory',
        options: [
          { label: 'Hotels', value: 'hotels' },
          { label: 'Flights', value: 'flights' },
          { label: 'Vouchers', value: 'vouchers' }
        ],
        value: currentInputs.smartbuyCategory || '',
        onChange: (value) => onChange('smartbuyCategory', value),
        condition: (inputs) => inputs.isSmartbuy
      }
    ]
  },
  "Shoppers Stop": {
    cardType: "points",
    defaultRate: 1 / 100, // 1% Reward points on non-Shoppers Stop spends
    shoppersStopRate: 3 / 100, // 3% Reward points on Shoppers Stop spends
    mccRates: {
      "5411": 1 / 100, // Grocery stores (capped)
      "6513": 0, // Rental transactions
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0 // Government transactions
    },
    transactionTypes: {
      grocery: ['5411', '5422', '5441', '5451', '5462', '5499'],
      utility: ['4900', '4814', '4816', '4821', '4899'],
      rental: ['6513'],
      government: ['9211', '9222', '9223', '9311', '9399', '9402', '9405']
    },
    capping: {
      categories: {
        "Shoppers Stop": { points: 500, maxSpent: 500 * (100 / 3) }, // Monthly cap of Rs 500 on Shoppers Stop spends
        "Non-Shoppers Stop": { points: 1000, maxSpent: 100000 }, // Monthly cap of Rs 1000 on non-Shoppers Stop spends
        "Grocery": { points: 1000, maxSpent: 100000 } // Monthly cap of 1000 points on grocery spends
      }
    },
    weekendOffer: {
      minSpend: 15000,
      reward: 500,
      maxTimesPerMonth: 1,
      maxTimesPerYear: 5
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Shoppers Stop"].defaultRate;
      let category = "Non-Shoppers Stop";
      let rateType = "default";
      let weekendOfferReward = 0;

      let transactionType = 'other';
      for (const [type, mccs] of Object.entries(hdfcCardRewards["Shoppers Stop"].transactionTypes)) {
        if (mccs.includes(mcc)) {
          transactionType = type;
          break;
        }
      }

      if (additionalParams.isShoppersStopTransaction) {
        rate = hdfcCardRewards["Shoppers Stop"].shoppersStopRate;
        category = "Shoppers Stop";
        if (additionalParams.isWeekendTransaction && amount >= hdfcCardRewards["Shoppers Stop"].weekendOffer.minSpend) {
          weekendOfferReward = hdfcCardRewards["Shoppers Stop"].weekendOffer.reward;
          category = "Shoppers Stop Weekend";
        }
      } else if (transactionType !== 'other') {
        category = transactionType.charAt(0).toUpperCase() + transactionType.slice(1);
      }

      const points = Math.floor(amount * rate);
      const totalPoints = points + weekendOfferReward;

      return { points: totalPoints, rate, rateType, category, weekendOfferReward };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Shoppers Stop transaction?',
        name: 'isShoppersStopTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isShoppersStopTransaction || false,
        onChange: (value) => onChange('isShoppersStopTransaction', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a weekend transaction?',
        name: 'isWeekendTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isWeekendTransaction || false,
        onChange: (value) => onChange('isWeekendTransaction', value === 'true'),
        condition: (inputs) => inputs.isShoppersStopTransaction
      }
    ]
  },

  "Shoppers Stop Black": {
    cardType: "points",
    defaultRate: 2 / 100, // 2% Reward points on non-Shoppers Stop spends
    shoppersStopRate: 7 / 100, // 7% Reward points on Shoppers Stop spends
    mccRates: {
      "5411": 2 / 100, // Grocery stores (capped)
      "6513": 0, // Rental transactions
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0 // Government transactions
    },
    transactionTypes: {
      grocery: ['5411', '5422', '5441', '5451', '5462', '5499'],
      utility: ['4900', '4814', '4816', '4821', '4899'],
      rental: ['6513'],
      government: ['9211', '9222', '9223', '9311', '9399', '9402', '9405']
    },
    capping: {
      categories: {
        "Shoppers Stop": { points: 2000, maxSpent: 2000 * (100 / 7) }, // Monthly cap of Rs 2000 on Shoppers Stop spends
        "Non-Shoppers Stop": { points: 2000, maxSpent: 100000 }, // Monthly cap of Rs 2000 on non-Shoppers Stop spends
        "Grocery": { points: 1000, maxSpent: 50000 } // Monthly cap of 1000 points on grocery spends
      }
    },
    weekendOffer: {
      minSpend: 50000,
      reward: 2000,
      maxTimesPerMonth: 1,
      maxTimesPerYear: 5
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Shoppers Stop Black"].defaultRate;
      let category = "Non-Shoppers Stop";
      let rateType = "default";
      let weekendOfferReward = 0;

      let transactionType = 'other';
      for (const [type, mccs] of Object.entries(hdfcCardRewards["Shoppers Stop Black"].transactionTypes)) {
        if (mccs.includes(mcc)) {
          transactionType = type;
          break;
        }
      }

      if (additionalParams.isShoppersStopTransaction) {
        rate = hdfcCardRewards["Shoppers Stop Black"].shoppersStopRate;
        category = "Shoppers Stop";
        if (additionalParams.isWeekendTransaction && amount >= hdfcCardRewards["Shoppers Stop Black"].weekendOffer.minSpend) {
          weekendOfferReward = hdfcCardRewards["Shoppers Stop Black"].weekendOffer.reward;
          category = "Shoppers Stop Weekend";
        }
      } else if (transactionType !== 'other') {
        category = transactionType.charAt(0).toUpperCase() + transactionType.slice(1);
      }

      const points = Math.floor(amount * rate);
      const totalPoints = points + weekendOfferReward;

      return { points: totalPoints, rate, rateType, category, weekendOfferReward };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Shoppers Stop transaction?',
        name: 'isShoppersStopTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isShoppersStopTransaction || false,
        onChange: (value) => onChange('isShoppersStopTransaction', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a weekend transaction?',
        name: 'isWeekendTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isWeekendTransaction || false,
        onChange: (value) => onChange('isWeekendTransaction', value === 'true'),
        condition: (inputs) => inputs.isShoppersStopTransaction
      }
    ]
  },
  "Swiggy": {
    cardType: "cashback",
    defaultRate: 0.01, // 1% cashback as default
    swiggyAppRate: 0.10, // 10% cashback for Swiggy app transactions
    mccRates: {
      "5137": 0.05, "5139": 0.05, "5611": 0.05, "5621": 0.05, "5631": 0.05, "5641": 0.05, "5651": 0.05,
      "5655": 0.05, "5661": 0.05, "5691": 0.05, "5697": 0.05, "5699": 0.05, "5948": 0.05, // Apparels 5% CB
      "5200": 0.05, "5300": 0.05, "5311": 0.05, "5331": 0.05, "5949": 0.05, "5973": 0.05, // Department Store 5% CB
      "1731": 0.05, "5045": 0.05, "5046": 0.05, "5065": 0.05, "5099": 0.05, "5722": 0.05, "5732": 0.05,
      "5734": 0.05, "5946": 0.05, "7372": 0.05, "7622": 0.05, "7623": 0.05, "7629": 0.05, "7631": 0.05, // Electronics 5% CB
      "4411": 0.05, "4899": 0.05, "5193": 0.05, "5992": 0.05, "7032": 0.05, "7033": 0.05, "7333": 0.05,
      "7832": 0.05, "7911": 0.05, "7922": 0.05, "7929": 0.05, "7933": 0.05, "7991": 0.05, "7996": 0.05,
      "7997": 0.05, // Entertainment 5% CB
      "5198": 0.05, "5211": 0.05, "5231": 0.05, "5251": 0.05, "5712": 0.05, "5713": 0.05, "5714": 0.05,
      "5718": 0.05, "5719": 0.05, "5950": 0.05, "7641": 0.05, // Home Decor 5% CB
      "5122": 0.05, "5912": 0.05, "5975": 0.05, "8042": 0.05, "8043": 0.05, // Pharmacies 5% CB
      "5977": 0.05, "7230": 0.05, "7297": 0.05, "7298": 0.05, // Personal Care 5% CB
      "4121": 0.05, "4111": 0.05, "5511": 0.05, "5521": 0.05, "7512": 0.05, // Local Cabs 5% CB
      "5192": 0.05, "5733": 0.05, "5735": 0.05, "5941": 0.05, "5942": 0.05, "5945": 0.05, "5995": 0.05,
      "7829": 0.05, "7941": 0.05, // Online Pet Stores 5% CB
      "5399": 0.05, // Discount Stores 5% CB
      "5541": 0, "5542": 0, "6513": 0, "6540": 0, "5944": 0, "9222": 0, "9311": 0, "9399": 0, "9402": 0 // No CB
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards.Swiggy.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isSwiggyTransaction) {
        rate = hdfcCardRewards.Swiggy.swiggyAppRate;
        category = "Swiggy App";
        rateType = "swiggy-app";
      } else if (mcc && hdfcCardRewards.Swiggy.mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards.Swiggy.mccRates[mcc];
        rateType = "mcc-specific";
        if (rate === 0.05) {
          category = "5% Cashback Category";
        } else if (rate === 0) {
          category = "Excluded Category";
        } else {
          category = "Category Spend";
        }
      }

      const cashback = amount * rate;
      const points = Math.floor(cashback * 100); // Convert cashback to points

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Swiggy app transaction?',
        name: 'isSwiggyTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSwiggyTransaction || false,
        onChange: (value) => onChange('isSwiggyTransaction', value === 'true')
      }
    ]
  },
  "Tata Neu Infinity": {
    cardType: "points",
    defaultRate: 1.5 / 100, // 1.5% back as NeuCoins on Non-Tata Brand Spends
    tataRate: 5 / 100, // 5% back as NeuCoins on Tata Neu and partner Tata Brands
    upiRate: 1.5 / 100, // 1.5% back on UPI spends
    neuPassRate: 5 / 100, // Additional 5% back on selected categories with NeuPass
    mccRates: {
      "4900": 5 / 100, // Utilities
      "4814": 5 / 100, // Telecommunication services
      "4899": 5 / 100, // Cable services
      "5411": 5 / 100, "5422": 5 / 100, "5441": 5 / 100, "5451": 5 / 100, "5462": 5 / 100, "5499": 5 / 100, // Grocery
      "6513": 0, // Rental transactions
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government transactions
    },
    capping: {
      categories: {
        "UPI": { points: 500, maxSpent: 500 * (100 / 1.5) }, // 500 NeuCoins per month
        "Grocery": { points: 2000, maxSpent: 2000 * (100 / 5) }, // 2000 NeuCoins per month
        "Utility": { points: 2000, maxSpent: 2000 * (100 / 5) }, // 2000 NeuCoins per month (from 1st Sep 2024)
        "Telecom & Cable": { points: 2000, maxSpent: 2000 * (100 / 5) } // 2000 NeuCoins per month (from 1st Sep 2024)
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Tata Neu Infinity"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isTataSpend) {
        rate = hdfcCardRewards["Tata Neu Infinity"].tataRate;
        rateType = "tata";
        category = "Tata Brand Spend";
      } else if (additionalParams.isUPI) {
        rate = hdfcCardRewards["Tata Neu Infinity"].upiRate;
        rateType = "upi";
        category = "UPI";
      } else if (mcc && hdfcCardRewards["Tata Neu Infinity"].mccRates[mcc] !== undefined) {
        rate = hdfcCardRewards["Tata Neu Infinity"].mccRates[mcc];
        rateType = "mcc-specific";
        if (mcc === "4900") {
          category = "Utility";
        } else if (["4814", "4899"].includes(mcc)) {
          category = "Telecom & Cable";
        } else if (["5411", "5422", "5441", "5451", "5462", "5499"].includes(mcc)) {
          category = "Grocery";
        } else {
          category = rate === 0 ? "Excluded Category" : "Category Spend";
        }
      }

      if (additionalParams.isNeuPassTransaction) {
        rate += hdfcCardRewards["Tata Neu Infinity"].neuPassRate;
        rateType += "-neupass";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Tata brand transaction?',
        name: 'isTataSpend',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTataSpend || false,
        onChange: (value) => {
          onChange('isTataSpend', value === 'true');
          if (value === 'true') {
            onChange('isUPI', false);
          }
        }
      },
      {
        type: 'radio',
        label: 'Is this a UPI transaction?',
        name: 'isUPI',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isUPI || false,
        onChange: (value) => onChange('isUPI', value === 'true'),
        condition: (inputs) => !inputs.isTataSpend
      },
      {
        type: 'radio',
        label: 'Do you have NeuPass membership and is this a NeuPass category transaction?',
        name: 'isNeuPassTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isNeuPassTransaction || false,
        onChange: (value) => {
          onChange('isNeuPassTransaction', value === 'true');
          onChange('isNeuPass', value === 'true');
          onChange('isNeuPassCategory', value === 'true');
        }
      }
    ]
  },
  "Tata Neu Plus": {
    cardType: "points",
    defaultRate: 1 / 100, // 1% back as NeuCoins on Non-Tata Brand Spends
    tataRate: 2 / 100, // 2% back as NeuCoins on Tata Neu and partner Tata Brands
    upiRate: 1 / 100, // 1% back on UPI spends
    neuPassRate: 5 / 100, // Additional 5% back on selected categories with NeuPass
    mccRates: {
      "6513": 0, // Rental transactions
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0, // Government transactions
    },
    capping: {
      categories: {
        "UPI": { points: 500, maxSpent: 500 * 100 }, // 500 NeuCoins per month
        "Grocery": { points: 1000, maxSpent: 1000 * (100 / 2) }, // 1000 NeuCoins per month
        "Utility": { points: 2000, maxSpent: 2000 * (100 / 2) }, // 2000 NeuCoins per month (from 1st Sep 2024)
        "Telecom & Cable": { points: 2000, maxSpent: 2000 * (100 / 2) } // 2000 NeuCoins per month (from 1st Sep 2024)
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Tata Neu Plus"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isTataSpend) {
        rate = hdfcCardRewards["Tata Neu Plus"].tataRate;
        rateType = "tata";
        category = "Tata Brand Spend";
      } else if (additionalParams.isUPI) {
        rate = hdfcCardRewards["Tata Neu Plus"].upiRate;
        rateType = "upi";
        category = "UPI";
      }

      if (additionalParams.isNeuPass && additionalParams.isNeuPassCategory) {
        rate += hdfcCardRewards["Tata Neu Plus"].neuPassRate;
        rateType += "-neupass";
        category = "NeuPass Category";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Tata brand transaction?',
        name: 'isTataSpend',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTataSpend || false,
        onChange: (value) => {
          onChange('isTataSpend', value === 'true');
          if (value === 'true') {
            onChange('isUPI', false);
          }
        }
      },
      {
        type: 'radio',
        label: 'Is this a UPI transaction?',
        name: 'isUPI',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isUPI || false,
        onChange: (value) => onChange('isUPI', value === 'true'),
        condition: (inputs) => !inputs.isTataSpend
      },
      {
        type: 'radio',
        label: 'Do you have NeuPass membership and is this a NeuPass category transaction?',
        name: 'isNeuPassTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isNeuPassTransaction || false,
        onChange: (value) => {
          onChange('isNeuPassTransaction', value === 'true');
          onChange('isNeuPass', value === 'true');
          onChange('isNeuPassCategory', value === 'true');
        }
      }
    ]
  },
  //TODO: Add Exclusions to this card
  "Times": {
    cardType: "points",
    defaultRate: 2 / 150,
    diningRate: 5 / 150,
    redemptionRate: 0.1, // 1 Reward Point = ₹0.1
    mccRates: {
      "5812": 5 / 150, // Restaurants
      "5813": 5 / 150, // Bars
      "5814": 5 / 150, // Fast Food
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards.Times.defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";

      if (["5812", "5813", "5814"].includes(mcc) && additionalParams.isWeekday) {
        rate = hdfcCardRewards["Times Platinum"].diningRate;
        category = "Weekday Dining";
        rateType = "dining";
      }

      const points = Math.floor(amount * rate);
      const pointsValue = points * hdfcCardRewards.Times.redemptionRate;

      return { points, rate, rateType, category, pointsValue };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      if (["5812", "5813", "5814"].includes(selectedMcc)) {
        return [{
          type: 'radio',
          label: 'Is this a weekday transaction?',
          name: 'isWeekday',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isWeekday || false,
          onChange: (value) => onChange('isWeekday', value === 'true')
        }];
      } else {
        return []
      }
    }
  },
  //TODO: Add Exclusions to this card
  "Times Platinum": {
    cardType: "points",
    defaultRate: 3 / 150,
    diningRate: 10 / 150,
    utilityShoppingRate: 0.05, // 5% cashback
    redemptionRate: 0.15, // 1 Reward Point = ₹0.15
    mccRates: {
      "5812": 10 / 150, // Restaurants
      "5813": 10 / 150, // Bars
      "5814": 10 / 150, // Fast Food
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["Times Platinum"].defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";
      let cashback = 0;

      if (["5812", "5813", "5814"].includes(mcc) && additionalParams.isWeekday) {
        rate = hdfcCardRewards["Times Platinum"].diningRate;
        category = "Weekday Dining";
        rateType = "dining";
      } else if (additionalParams.isUtilityOrShopping) {
        cashback = amount * hdfcCardRewards["Times Platinum"].utilityShoppingRate;
        category = "Utility Bills/Shopping";
        rateType = "utility-shopping";
      }

      const points = Math.floor(amount * rate);
      const pointsValue = points * hdfcCardRewards["Times Platinum"].redemptionRate;

      return { points, cashback, rate, rateType, category, pointsValue };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      if (["5812", "5813", "5814"].includes(selectedMcc)) {
        return [{
          type: 'radio',
          label: 'Is this a weekday transaction?',
          name: 'isWeekday',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isWeekday || false,
          onChange: (value) => onChange('isWeekday', value === 'true')
        }];
      } else {
        return [{
          type: 'radio',
          label: 'Is this a utility bill or shopping transaction?',
          name: 'isUtilityOrShopping',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isUtilityOrShopping || false,
          onChange: (value) => onChange('isUtilityOrShopping', value === 'true')
        }];
      }
    }
  },
  //TODO: Add Exclusions to this card
  "UPI RuPay": {
    cardType: "points",
    defaultRate: 0,
    mccRates: {
      "5411": 3 / 100,
      "5812": 3 / 100,
      "5311": 3 / 100,
      "4900": 2 / 100
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = hdfcCardRewards["UPI RuPay"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && hdfcCardRewards["UPI RuPay"].mccRates[mcc]) {
        rate = hdfcCardRewards["UPI RuPay"].mccRates[mcc];
        rateType = "mcc-specific";
        category = mcc === "5411" ? "Grocery" : mcc === "5812" ? "Dining" : mcc === "5311" ? "Department Stores" : mcc === "4900" ? "Utilities" : "Category Spend";
      }

      const cashback = amount * rate;
      const points = Math.floor(cashback * 100);

      return { points, cashback, rate, rateType, category };
    },
    dynamicInputs: () => []
  }
};

export const calculateHDFCRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = hdfcCardRewards[cardName];
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
  } else {
    return applyPointsCapping(result, cardReward, cardName);
  }
};

const applyCashbackCapping = (result, cardReward, cardName) => {
  let { cashback, rate, rateType, category } = result;
  let cappedCashback = cashback;
  let appliedCap = null;

  if (cardReward.capping && cardReward.capping.categories && category) {
    const cappingCategory = cardReward.capping.categories[category];
    if (cappingCategory) {
      const { cashback: maxCashback, maxSpent } = cappingCategory;
      cappedCashback = Math.min(cashback, maxCashback, maxSpent * rate);

      if (cappedCashback < cashback) {
        appliedCap = { category, maxCashback, maxSpent };
      }
    }
  }

  const rewardText = generateCashbackRewardText(cardName, cappedCashback, rate, rateType, category, appliedCap);

  return {
    cashback: cappedCashback,
    rewardText,
    uncappedCashback: cashback,
    cappedCashback,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

const applyPointsCapping = (result, cardReward, cardName) => {
  let { points, rate, rateType, category } = result;
  let cappedPoints = points;
  let appliedCap = null;

  if (cardReward.capping && cardReward.capping.categories && category) {
    const cappingCategory = cardReward.capping.categories[category];
    if (cappingCategory) {
      const { points: maxPoints, maxSpent } = cappingCategory;
      cappedPoints = Math.min(points, maxPoints, Math.floor(maxSpent * rate));

      if (cappedPoints < points) {
        appliedCap = { category, maxPoints, maxSpent };
      }
    }
  }

  const rewardText = generatePointsRewardText(cardName, cappedPoints, rate, rateType, category, appliedCap);

  return {
    points: cappedPoints,
    rewardText,
    uncappedPoints: points,
    cappedPoints,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

const generateCashbackRewardText = (cardName, cashback, rate, rateType, category, appliedCap) => {
  let rewardText = `₹${cashback.toFixed(2)} Cashback`;

  if (category !== "Other Spends" && !rewardText.includes(category)) {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ₹${appliedCap.maxCashback})`;
  }

  return rewardText;
};

const generatePointsRewardText = (cardName, points, rate, rateType, category, appliedCap) => {
  let rewardText = `${points} HDFC Reward Points`;

  if (category !== "Other Spends" && !rewardText.includes(category)) {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points)`;
  }

  return rewardText;
};


export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = hdfcCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};