export const sbiCardRewards = {
  "Air India Platinum": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward points for every Rs. 100 spent
    redemptionRate: 1, // 1 Reward point is equal to 1 Air India Air mile
    mccRates: {
      "3020": 15 / 100, // Air India tickets booked through airindia.in or mobile app for self
      "3193": 5 / 100, // Air India tickets booked through other channels
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Air India Platinum"].defaultRate;
      let category = "Regular Spends";
      let rateType = "default";

      if (["3020", "3193"].includes(mcc)) {
        if (mcc === "3020" && additionalParams.isAirIndiaSelf) {
          rate = sbiCardRewards["Air India Platinum"].mccRates["3020"];
          category = "Air India Self Booking";
          rateType = "air-india-self";
        } else {
          rate = sbiCardRewards["Air India Platinum"].mccRates[mcc];
          category = "Air India Related";
          rateType = "air-india-related";
        }
      }

      const points = Math.floor(amount * rate);
      const airMiles = points; // 1:1 conversion

      return { points, airMiles, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      if (["3020", "3193"].includes(selectedMcc)) {
        return [
          {
            type: 'radio',
            label: 'Is this an Air India ticket booking for self?',
            name: 'isAirIndiaSelf',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isAirIndiaSelf || false,
            onChange: (value) => onChange('isAirIndiaSelf', value === 'true')
          }
        ];
      }
      return [];
    }
  },
  "Air India Signature": {
    cardType: "points",
    defaultRate: 4 / 100, // 4 Reward points for every Rs. 100 spent
    redemptionRate: 1, // 1 Reward point is equal to 1 Air India Air mile
    mccRates: {
      "3020": 30 / 100, // Air India tickets booked through airindia.in or mobile app for self
      "3193": 10 / 100, // Air India tickets booked through other channels
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Air India Signature"].defaultRate;
      let category = "Regular Spends";
      let rateType = "default";

      if (["3020", "3193"].includes(mcc)) {
        if (mcc === "3020" && additionalParams.isAirIndiaSelf) {
          rate = sbiCardRewards["Air India Signature"].mccRates["3020"];
          category = "Air India Self Booking";
          rateType = "air-india-self";
        } else {
          rate = sbiCardRewards["Air India Signature"].mccRates[mcc];
          category = "Air India Related";
          rateType = "air-india-related";
        }
      }

      const points = Math.floor(amount * rate);
      const airMiles = points; // 1:1 conversion

      return { points, airMiles, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      if (["3020", "3193"].includes(selectedMcc)) {
        return [
          {
            type: 'radio',
            label: 'Is this an Air India ticket booking for self?',
            name: 'isAirIndiaSelf',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isAirIndiaSelf || false,
            onChange: (value) => onChange('isAirIndiaSelf', value === 'true')
          }
        ];
      }
      return [];
    }
  },
  "Apollo": {
    cardType: "points",
    defaultRate: 1 / 200, // 1 Reward Point on every Rs. 200 spent on other non-fuel retail purchases
    redemptionRate: 1, // 1 Reward Point = Rs. 1
    mccRates: {
      // 3X Reward Points on every Rs. 100 spent on all Apollo services
      "8011": 3 / 100, // Doctors
      "8021": 3 / 100, // Dentists
      "8031": 3 / 100, // Osteopaths
      "8041": 3 / 100, // Chiropractors
      "8042": 3 / 100, // Optometrists
      "8043": 3 / 100, // Opticians
      "8049": 3 / 100, // Podiatrists
      "8050": 3 / 100, // Nursing and Personal Care Facilities
      "8062": 3 / 100, // Hospitals
      "8071": 3 / 100, // Medical and Dental Laboratories
      "8099": 3 / 100, // Medical Services and Health Practitioners (Not Elsewhere Classified)

      // 2X Reward Points on every Rs. 100 spent on Dining, Movies & Entertainment
      "5812": 2 / 100, // Eating Places and Restaurants
      "5813": 2 / 100, // Drinking Places
      "5814": 2 / 100, // Fast Food Restaurants
      "7832": 2 / 100, // Motion Picture Theaters
      "7922": 2 / 100, // Theatrical Producers
      "7929": 2 / 100, // Bands, Orchestras, and Miscellaneous Entertainers

      // 1 Reward Point on every Rs. 100 spent on Beauty & Wellness services
      "7230": 1 / 100, // Beauty and Barber Shops
      "7298": 1 / 100, // Health and Beauty Spas
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Apollo"].defaultRate;
      let category = "Other Non-Fuel Retail";
      let rateType = "default";

      if (mcc && sbiCardRewards["Apollo"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Apollo"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["8011", "8021", "8031", "8041", "8042", "8043", "8049", "8050", "8062", "8071", "8099"].includes(mcc)) {
          category = "Apollo Services";
        } else if (["5812", "5813", "5814", "7832", "7922", "7929"].includes(mcc)) {
          category = "Dining, Movies & Entertainment";
        } else if (["7230", "7298"].includes(mcc)) {
          category = "Beauty & Wellness";
        }
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards.Apollo.redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: () => []
  },
  "Aurum": {
    cardType: "points",
    defaultRate: 4 / 100, // 4 reward points on every Rs. 100 spent
    redemptionRate: 0.25, // 1 Reward Point = Rs. 0.25
    mccRates: {
      "6540": 0, "6541": 0 // Wallet loads
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Aurum"].defaultRate;
      let category = "All Spends";
      let rateType = "default";

      if (mcc && sbiCardRewards["Aurum"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Aurum"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        rateType = "mcc-specific";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Aurum"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: () => []
  },
  "BPCL": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point for every Rs. 100 spent on non-fuel retail purchases
    redemptionRate: 1 / 4, // 4 Reward Points = Re 1
    mccRates: {
      "5411": 5 / 100, // Groceries
      "5311": 5 / 100, // Departmental Stores
      "7832": 5 / 100, // Movies
      "5812": 5 / 100, // Dining
      "5813": 5 / 100, // Bars
      "5814": 5 / 100, // Fast Food
      "5541": 13 / 100, // BPCL fuel purchases
      "5542": 13 / 100, // BPCL fuel purchases
    },
    capping: {
      categories: {
        "Accelerated Rewards": { points: 5000, period: "monthly" },
        "BPCL Fuel": { points: 1300, period: "billing cycle" },
      }
    },
    fuelSurchargeWaiver: {
      rate: 0.01, // 1% fuel surcharge waiver
      maxAmount: 4000
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["BPCL"].defaultRate;
      let category = "Other Non-Fuel Retail";
      let rateType = "default";
      let surchargeWaiver = 0;

      if (["5541", "5542"].includes(mcc) && additionalParams.isBPCL) {
        rate = sbiCardRewards["BPCL"].mccRates["5541"];
        category = "BPCL Fuel";
        rateType = "bpcl-fuel";
        if (amount <= 4000) {
          surchargeWaiver = amount * sbiCardRewards["BPCL"].fuelSurchargeWaiver.rate;
        }
      } else if (sbiCardRewards["BPCL"].mccRates[mcc]) {
        rate = sbiCardRewards["BPCL"].mccRates[mcc];
        category = "Accelerated Rewards";
        rateType = "accelerated";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["BPCL"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue, surchargeWaiver };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      if (["5541", "5542"].includes(selectedMcc)) {
        return [
          {
            type: 'radio',
            label: 'Is this a BPCL fuel transaction?',
            name: 'isBPCL',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isBPCL || false,
            onChange: (value) => onChange('isBPCL', value === 'true')
          }
        ];
      }
      return [];
    }
  },
  "BPCL Octane": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward point per 100 Rs. spent on other retail purchases
    redemptionRate: 1 / 4, // 4 Reward Point = 1 Rs
    BharatGasRate: 25 / 100, // Added Bharat Gas rate
    mccRates: {
      "5541": 25 / 100, // BPCL fuel purchases
      "5542": 25 / 100, // BPCL fuel purchases
      "5812": 10 / 100, // Dining
      "5813": 10 / 100, // Drinking Places
      "5814": 10 / 100, // Fast Food
      "5311": 10 / 100, // Department Stores
      "5411": 10 / 100, // Grocery Stores
      "7832": 10 / 100, // Movies
    },

    capping: {
      categories: {
        "BPCL Fuel": { points: 2500, period: "billing cycle" },
        "Dining & Others": { points: 7500, period: "monthly" },
        "Bharat Gas": { points: 500, period: "billing cycle" }
      }
    },
    fuelSurchargeWaiver: {
      rate: 0.01, // 1% fuel surcharge waiver
      maxAmount: 4000
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["BPCL Octane"].defaultRate;
      let category = "Other Retail";
      let rateType = "default";
      let surchargeWaiver = 0;

      if (["5541", "5542"].includes(mcc) && additionalParams.isBPCL) {
        rate = sbiCardRewards["BPCL Octane"].mccRates["5541"];
        category = "BPCL Fuel";
        rateType = "bpcl-fuel";
        if (amount <= 4000) {
          surchargeWaiver = amount * sbiCardRewards["BPCL Octane"].fuelSurchargeWaiver.rate;
        }
      } else if (additionalParams.isBharatGas) {
        rate = 25 / 100;
        category = "Bharat Gas";
        rateType = "bharat-gas";
      } else if (mcc && sbiCardRewards["BPCL Octane"].mccRates[mcc]) {
        rate = sbiCardRewards["BPCL Octane"].mccRates[mcc];
        category = "Dining & Others";
        rateType = "accelerated";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["BPCL Octane"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue, surchargeWaiver };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const inputs = [];
      if (["5541", "5542"].includes(selectedMcc)) {
        inputs.push({
          type: 'radio',
          label: 'Is this a BPCL fuel transaction?',
          name: 'isBPCL',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isBPCL || false,
          onChange: (value) => onChange('isBPCL', value === 'true')
        });
      }
      inputs.push({
        type: 'radio',
        label: 'Is this a Bharat Gas transaction?',
        name: 'isBharatGas',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBharatGas || false,
        onChange: (value) => onChange('isBharatGas', value === 'true')
      });
      return inputs;
    }
  },
  "Cashback": {
    cardType: "cashback",
    defaultRate: 0.01, // 1% cashback on offline spends
    onlineRate: 0.05, // 5% cashback on online spends
    mccRates: {
      "5051": 0, "5094": 0, "5944": 0, "7631": 0, "5111": 0, "5192": 0, "5942": 0, "5943": 0,
      "8211": 0, "8220": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, "8351": 0,
      "4814": 0, "4900": 0,
      "9399": 0, "4816": 0, "4899": 0,
      "5960": 0,
      "6300": 0, "6381": 0, "5947": 0,
      "6011": 0, "6012": 0, "6051": 0,
      "4011": 0, "4112": 0,
      "5172": 0, "5541": 0, "5542": 0, "5983": 0,
      "6540": 0, "6541": 0, "6513": 0,
      "7349": 0
    },
    maxCashback: 5000, // Maximum cashback per statement cycle
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Cashback"].defaultRate;
      let category = "Offline Spend";
      let rateType = "default";

      if (additionalParams.isOnline) {
        rate = sbiCardRewards["Cashback"].onlineRate;
        category = "Online Spend";
        rateType = "online";
      }

      if (mcc && sbiCardRewards["Cashback"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Cashback"].mccRates[mcc];
        rateType = "mcc-specific";
        category = "Excluded Category";
      }

      let cashback = Math.floor(amount * rate * 100) / 100; // Rounded down to 2 decimal places

      return { cashback, rate, rateType, category };
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
  "Elite": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points per Rs. 100 on all other spends
    redemptionRate: 1 / 4, // 4 Reward Points = Rs. 1
    mccRates: {
      // 5X Reward Points on Dining, Departmental stores and Grocery Spends
      "5812": 10 / 100, // Eating Places and Restaurants
      "5813": 10 / 100, // Drinking Places
      "5814": 10 / 100, // Fast Food Restaurants
      "5311": 10 / 100, // Departmental Stores
      "5411": 10 / 100, // Grocery Stores & Supermarkets

      // Fuel transactions
      "5172": 0, "5541": 0, "5542": 0, "5983": 0,

      // Rent transactions (effective April 1, 2024)
      "6513": 0
    },
    fuelSurchargeWaiver: {
      rate: 0.01, // 1% fuel surcharge waiver
      maxWaiver: 250 // Maximum waiver of Rs. 250 per month
    },
    capping: {
      categories: {
        "Accelerated Rewards": { points: 7500, maxSpent: 7500 / (10 / 100), period: "monthly" },
        "Fuel": { surchargeWaiver: 250, period: "monthly" }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Elite"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let surchargeWaiver = 0;

      if (mcc && sbiCardRewards["Elite"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Elite"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5812", "5813", "5814"].includes(mcc)) {
          category = "Dining";
        } else if (["5311", "5411"].includes(mcc)) {
          category = "Departmental Stores & Grocery";
        } else if (["5172", "5541", "5542", "5983"].includes(mcc)) {
          category = "Fuel";
          surchargeWaiver = Math.min(amount * sbiCardRewards["Elite"].fuelSurchargeWaiver.rate, sbiCardRewards["Elite"].fuelSurchargeWaiver.maxWaiver);
        } else {
          category = rate === 0 ? "Excluded Category" : "Category Spend";
        }
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Elite"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue, surchargeWaiver };
    },
    dynamicInputs: () => []
  },
  "Elite Advantage": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points per Rs. 100 on all other spends
    redemptionRate: 1 / 4, // 4 Reward Points = Rs. 1
    mccRates: {
      // 5X Reward Points on Dining, Departmental stores and Grocery Spends
      "5812": 10 / 100, // Eating Places and Restaurants
      "5813": 10 / 100, // Drinking Places
      "5814": 10 / 100, // Fast Food Restaurants
      "5311": 10 / 100, // Departmental Stores
      "5411": 10 / 100, // Grocery Stores & Supermarkets
    },
    fuelSurchargeWaiver: {
      rate: 0.01, // 1% fuel surcharge waiver
      maxWaiver: 250 // Maximum waiver of Rs. 250 per month
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Elite Advantage"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let surchargeWaiver = 0;

      if (mcc && sbiCardRewards["Elite Advantage"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Elite Advantage"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5812", "5813", "5814"].includes(mcc)) {
          category = "Dining";
        } else if (["5311", "5411"].includes(mcc)) {
          category = "Departmental Stores & Grocery";
        }
      }

      if (["5172", "5541", "5542", "5983"].includes(mcc)) {
        category = "Fuel";
        surchargeWaiver = Math.min(amount * sbiCardRewards["Elite Advantage"].fuelSurchargeWaiver.rate, sbiCardRewards["Elite Advantage"].fuelSurchargeWaiver.maxWaiver);
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Elite Advantage"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue, surchargeWaiver };
    },
    dynamicInputs: () => []
  },
  "Etihad Guest": {
    cardType: "miles",
    defaultRate: 1 / 100, // 1 Etihad Guest Mile on every Rs. 100 spent on other spends
    mccRates: {
      "3034": 3 / 100, // 3 Etihad Guest Miles on every Rs. 100 spent on Etihad.com
      "5172": 0, "5541": 0, "5983": 0, "5542": 0, "6513": 0, // Excluded categories
    },
    internationalRate: 2 / 100, // 2 Etihad Guest Miles on every Rs. 100 spent on International spends
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Etihad Guest"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
    
      if (mcc === "3034") {
        rate = sbiCardRewards["Etihad Guest"].mccRates["3034"];
        category = "Etihad.com";
        rateType = "etihad";
      } else if (additionalParams.isInternational) {
        rate = sbiCardRewards["Etihad Guest"].internationalRate;
        category = "International Spends";
        rateType = "international";
      } else if (sbiCardRewards["Etihad Guest"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Etihad Guest"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        rateType = "mcc-specific";
      }
    
      const miles = Math.floor(amount * rate);
    
      return { miles, rate, rateType, category };
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
  "Etihad Guest Premier": {
    cardType: "miles",
    defaultRate: 2 / 100, // 2 Etihad Guest Miles on every Rs. 100 spent on other spends
    internationalRate: 4 / 100, // 4 Etihad Guest Miles on every Rs. 100 spent on International Spends
    tierMileRate: 1 / 50, // 1 Etihad Guest Tier Mile for every Rs. 50 spent
    tierMileCap: 40000, // Maximum 40,000 Etihad Guest Tier Miles can be earned in a year
    mccRates: {
      "3034": 6 / 100, // 6 Etihad Guest Miles on every Rs. 100 spent on Etihad.com
      "5172": 0, "5541": 0, "5983": 0, "5542": 0, "6513": 0,
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Etihad Guest Premier"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc === "3034") {
        rate = sbiCardRewards["Etihad Guest Premier"].mccRates["3034"];
        category = "Etihad.com";
        rateType = "etihad";
      } else if (additionalParams.isInternational) {
        rate = sbiCardRewards["Etihad Guest Premier"].internationalRate;
        category = "International Spends";
        rateType = "international";
      } else if (sbiCardRewards["Etihad Guest Premier"].mccRates[mcc] !== undefined) {
        rate = 0;
        category = "Excluded Category";
        rateType = "excluded";
      }

      const miles = Math.floor(amount * rate);
      const tierMiles = Math.floor(amount * sbiCardRewards["Etihad Guest Premier"].tierMileRate);

      return { miles, tierMiles, rate, rateType, category };
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
  "Lifestyle": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point per Rs. 100 spent on other retail purchases
    acceleratedRate: 5 / 100, // 5 Reward Points per Rs. 100 spent on accelerated categories
    redemptionRate: 1 / 4, // 4 Reward Points = Rs. 1
    mccRates: {
      "5812": 5 / 100, // Dining
      "5813": 5 / 100, // Bars
      "5814": 5 / 100, // Fast Food
      "7832": 5 / 100, // Movies
      "5712": 0, "5541": 0, "5983": 0, "5542": 0, "6513": 0 // Excluded categories
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Lifestyle"].defaultRate;
      let category = "Other Retail";
      let rateType = "default";

      if (additionalParams.isLandmarkStore) {
        rate = sbiCardRewards["Lifestyle"].acceleratedRate;
        category = "Landmark Stores";
        rateType = "landmark";
      } else if (mcc && sbiCardRewards["Lifestyle"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Lifestyle"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Dining & Movies";
        rateType = rate === 0 ? "excluded" : "dining-movies";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Lifestyle"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Landmark Store transaction? (Lifestyle, Home Centre, Max, or Spar)',
        name: 'isLandmarkStore',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isLandmarkStore || false,
        onChange: (value) => onChange('isLandmarkStore', value === 'true')
      }
    ]
  },
  "Lifestyle Prime": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points per Rs. 100 spent on other retail purchases
    redemptionRate: 1 / 4, // 4 Reward Points = Rs. 1
    mccRates: {
      "5812": 10 / 100, // Dining
      "5813": 10 / 100, // Bars
      "5814": 10 / 100, // Fast Food
      "7832": 10 / 100, // Movies
      "5712": 0, "5541": 0, "5983": 0, "5542": 0, "6513": 0 // Excluded categories
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Lifestyle"].defaultRate;
      let category = "Other Retail";
      let rateType = "default";

      if (additionalParams.isLandmarkStore) {
        rate = sbiCardRewards["Lifestyle"].acceleratedRate;
        category = "Landmark Stores";
        rateType = "landmark";
      } else if (mcc && sbiCardRewards["Lifestyle"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Lifestyle"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Dining & Movies";
        rateType = rate === 0 ? "excluded" : "dining-movies";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Lifestyle"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Landmark Store transaction?',
        name: 'isLandmarkStore',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isLandmarkStore || false,
        onChange: (value) => onChange('isLandmarkStore', value === 'true')
      }
    ]
  },
  "Lifestyle Select": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points per Rs. 100 spent on other retail purchases
    redemptionRate: 1 / 4, // 4 Reward Points = Rs. 1
    mccRates: {
      "5812": 10 / 100, // Dining
      "5813": 10 / 100, // Bars
      "5814": 10 / 100, // Fast Food
      "7832": 10 / 100, // Movies
      "5712": 0, "5541": 0, "5983": 0, "5542": 0, "6513": 0 // Excluded categories
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Lifestyle Select"].defaultRate;
      let category = "Other Retail";
      let rateType = "default";

      if (additionalParams.isLandmarkStore) {
        rate = 5 / 100;
        category = "Landmark Store";
        rateType = "landmark-store";
      } else if (mcc && sbiCardRewards["Lifestyle Select"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Lifestyle Select"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Dining & Movies";
        rateType = rate === 0 ? "excluded" : "dining-movies";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Lifestyle Select"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Landmark Store transaction?',
        name: 'isLandmarkStore',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isLandmarkStore || false,
        onChange: (value) => onChange('isLandmarkStore', value === 'true')
      }
    ]
  },
  "Miles": {
    cardType: "points",
    defaultRate: 1 / 200, // 1 Travel Credit for every Rs. 200 on all other spends
    travelRate: 2 / 200, // 2 Travel Credits for every Rs. 200 on travel spends
    redemptionRate: {
      airMiles: 1,
      travelBookings: 0.5,
      catalogue: 0.25
    },
    mccRates: {
      // Travel transactions (2 Travel Credits for every Rs. 200)
      "4511": 2 / 200, "3020": 2 / 200, "3026": 2 / 200, "3034": 2 / 200, "3005": 2 / 200,
      "3008": 2 / 200, "3075": 2 / 200, "3136": 2 / 200, "3007": 2 / 200, "3010": 2 / 200,
      "3047": 2 / 200, "4722": 2 / 200, "4784": 2 / 200, "4131": 2 / 200, "4111": 2 / 200,
      "4121": 2 / 200, "7512": 2 / 200, "4789": 2 / 200, "4214": 2 / 200, "7011": 2 / 200,
      "3640": 2 / 200, "3509": 2 / 200, "3649": 2 / 200, "3501": 2 / 200,

      // Excluded categories (same as MILES PRIME and MILES Elite)
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0,
      "4900": 0, "4814": 0, "4899": 0, "9399": 0,
      "5960": 0, "6300": 0, "6380": 0,
      "6012": 0, "6051": 0, "9222": 0, "9311": 0, "9402": 0,
      "5172": 0, "5541": 0, "5542": 0, "5983": 0,
      "6540": 0, "6541": 0,
      "6513": 0,
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Miles"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && sbiCardRewards["Miles"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Miles"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Travel";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        airMiles: points * sbiCardRewards["Miles"].redemptionRate.airMiles,
        travelBookings: points * sbiCardRewards["Miles"].redemptionRate.travelBookings,
        catalogue: points * sbiCardRewards["Miles"].redemptionRate.catalogue
      };

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: () => []
  },
  "Miles Elite": {
    cardType: "points",
    defaultRate: 2 / 200, // 2 Travel Credits for every Rs. 200 on all other spends
    travelRate: 6 / 200, // 6 Travel Credits for every Rs. 200 on travel spends
    redemptionRate: {
      airMiles: 1,
      travelBookings: 0.5,
      catalogue: 0.25
    },
    mccRates: {
      // Travel transactions (6 Travel Credits for every Rs. 200)
      "4511": 6 / 200, "3020": 6 / 200, "3026": 6 / 200, "3034": 6 / 200, "3005": 6 / 200,
      "3008": 6 / 200, "3075": 6 / 200, "3136": 6 / 200, "3007": 6 / 200, "3010": 6 / 200,
      "3047": 6 / 200, "4722": 6 / 200, "4784": 6 / 200, "4131": 6 / 200, "4111": 6 / 200,
      "4121": 6 / 200, "7512": 6 / 200, "4789": 6 / 200, "4214": 6 / 200, "7011": 6 / 200,
      "3640": 6 / 200, "3509": 6 / 200, "3649": 6 / 200, "3501": 6 / 200,

      // Excluded categories (same as MILES PRIME)
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0,
      "4900": 0, "4814": 0, "4899": 0, "9399": 0,
      "5960": 0, "6300": 0, "6380": 0,
      "6012": 0, "6051": 0, "9222": 0, "9311": 0, "9402": 0,
      "5172": 0, "5541": 0, "5542": 0, "5983": 0,
      "6540": 0, "6541": 0,
      "6513": 0,
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Miles Elite"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && sbiCardRewards["Miles Elite"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Miles Elite"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Travel";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        airMiles: points * sbiCardRewards["Miles Elite"].redemptionRate.airMiles,
        travelBookings: points * sbiCardRewards["Miles Elite"].redemptionRate.travelBookings,
        catalogue: points * sbiCardRewards["Miles Elite"].redemptionRate.catalogue
      };

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: () => []
  },
  "Miles Prime": {
    cardType: "points",
    defaultRate: 2 / 200, // 2 Travel Credits for every Rs. 200 on all other spends
    travelRate: 4 / 200, // 4 Travel Credits for every Rs. 200 on travel spends
    redemptionRate: {
      airMiles: 1,
      travelBookings: 0.5,
      catalogue: 0.25
    },
    mccRates: {
      // Travel transactions
      "4511": 4 / 200, "3020": 4 / 200, "3026": 4 / 200, "3034": 4 / 200, "3005": 4 / 200,
      "3008": 4 / 200, "3075": 4 / 200, "3136": 4 / 200, "3007": 4 / 200, "3010": 4 / 200,
      "3047": 4 / 200, "4722": 4 / 200, "4784": 4 / 200, "4131": 4 / 200, "4111": 4 / 200,
      "4121": 4 / 200, "7512": 4 / 200, "4789": 4 / 200, "4214": 4 / 200, "7011": 4 / 200,
      "3640": 4 / 200, "3509": 4 / 200, "3649": 4 / 200, "3501": 4 / 200,

      // Excluded categories
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // School & Educational Services
      "4900": 0, "4814": 0, "4899": 0, "9399": 0, // Utility transactions
      "5960": 0, "6300": 0, "6380": 0, // Insurance transactions
      "6012": 0, "6051": 0, "9222": 0, "9311": 0, "9402": 0, // Quasi Cash
      "5172": 0, "5541": 0, "5542": 0, "5983": 0, // Fuel
      "6540": 0, "6541": 0, // E-wallet loading
      "6513": 0, // Rent payments
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Miles Prime"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && sbiCardRewards["Miles Prime"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Miles Prime"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Travel";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        airMiles: points * sbiCardRewards["Miles Prime"].redemptionRate.airMiles,
        travelBookings: points * sbiCardRewards["Miles Prime"].redemptionRate.travelBookings,
        catalogue: points * sbiCardRewards["Miles Prime"].redemptionRate.catalogue
      };

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: () => []
  },
  "Ola Money": {
    cardType: "points",
    defaultRate: 1 / 100, // 1% Reward Points on all other spends
    redemptionRate: 1, // 1 Reward Point = Re.1
    mccRates: {
      "4121": 7 / 100, // 7% Reward Points on all Ola rides
      // Excluded MCCs
      "5172": 0, // Petroleum and Petroleum Products
      "5541": 0, // Service Stations (with or without ancillary services)
      "5983": 0, // Fuel Dealers – Fuel Oil, Wood, Coal, Liquefied Petroleum
      "5542": 0, // Automated Fuel Dispensers
      "6513": 0  // Real Estate Agents and Managers - Rentals
    },
    capping: {
      categories: {
        "OLA Rides": { points: 500, period: "statement cycle" },
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Ola Money"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc === "4121" && additionalParams.isOlaRide) {
        rate = sbiCardRewards["Ola Money"].mccRates["4121"];
        category = "OLA Rides";
        rateType = "ola-ride";
      } else if (sbiCardRewards["Ola Money"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Ola Money"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Ola Money"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      if (selectedMcc === "4121") {
        return [
          {
            type: 'radio',
            label: 'Is this an OLA ride?',
            name: 'isOlaRide',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isOlaRide || false,
            onChange: (value) => onChange('isOlaRide', value === 'true')
          }
        ];
      }
      return [];
    }
  },
  "PayTM": {
    cardType: "cashback",
    defaultRate: 0.01, // 1% cashback on any other spends
    mccRates: {
      "5541": 0, "5542": 0, // Fuel spends
      "6513": 0, // Rent payments
      "9399": 0, "9311": 0, // Government transactions
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["PayTM"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isPaytmMallMoviesTravel) {
        rate = 0.03; // 3% cashback
        category = "Paytm Mall, Movies and Travel";
        rateType = "paytm-special";
      } else if (additionalParams.isPaytmApp) {
        rate = 0.02; // 2% cashback
        category = "Paytm App";
        rateType = "paytm-app";
      } else if (mcc && sbiCardRewards["PayTM"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["PayTM"].mccRates[mcc];
        rateType = "mcc-specific";
        category = "Excluded Category";
      }

      const cashback = amount * rate;

      return { cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'paytmTransactionType',
        options: [
          { label: 'Paytm Mall, Movies or Travel transaction', value: 'mallMoviesTravel' },
          { label: 'Paytm App transaction', value: 'app' },
          { label: 'Other transaction', value: 'other' }
        ],
        value: currentInputs.paytmTransactionType || 'other',
        onChange: (value) => {
          onChange('paytmTransactionType', value);
          onChange('isPaytmMallMoviesTravel', value === 'mallMoviesTravel');
          onChange('isPaytmApp', value === 'app');
        }
      }
    ]
  },
  "PayTM Select": {
    cardType: "cashback",
    defaultRate: 0.01, // 1% cashback on any other spends
    mccRates: {
      "5541": 0, "5542": 0, // Fuel spends
      "6513": 0, // Rent payments
      "9399": 0, "9311": 0, // Government transactions
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["PayTM Select"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isPaytmMallMoviesTravel) {
        rate = 0.05; // 5% cashback
        category = "Paytm Mall, Movies and Travel";
        rateType = "paytm-special";
      } else if (additionalParams.isPaytmApp) {
        rate = 0.02; // 2% cashback
        category = "Paytm App";
        rateType = "paytm-app";
      } else if (mcc && sbiCardRewards["PayTM Select"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["PayTM Select"].mccRates[mcc];
        rateType = "mcc-specific";
        category = "Excluded Category";
      }

      const cashback = amount * rate;

      return { cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'paytmTransactionType',
        options: [
          { label: 'Paytm Mall, Movies or Travel transaction', value: 'mallMoviesTravel' },
          { label: 'Paytm App transaction', value: 'app' },
          { label: 'Other transaction', value: 'other' }
        ],
        value: currentInputs.paytmTransactionType || 'other',
        onChange: (value) => {
          onChange('paytmTransactionType', value);
          onChange('isPaytmMallMoviesTravel', value === 'mallMoviesTravel');
          onChange('isPaytmApp', value === 'app');
        }
      }
    ]
  },
  "Prime": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points per Rs. 100 on all other retail spends
    redemptionRate: 1 / 4, // 4 Reward Points = Rs. 1
    mccRates: {
      // 10 Reward Points per Rs. 100 on Dining, Groceries, Departmental stores and Movies
      "5812": 10 / 100, // Eating Places and Restaurants
      "5813": 10 / 100, // Drinking Places
      "5814": 10 / 100, // Fast Food Restaurants
      "5411": 10 / 100, // Grocery Stores & Supermarkets
      "5311": 10 / 100, // Departmental Stores
      "7832": 10 / 100, // Motion Picture Theaters

      // Fuel transactions
      "5172": 0, "5541": 0, "5542": 0, "5983": 0
    },
    birthdayRate: 20 / 100, // 20 Reward Points per Rs. 100 on birthday
    utilityBillRate: 20 / 100, // 20 Reward Points per Rs. 100 on utility bill transactions
    fuelSurchargeWaiver: {
      rate: 0.01, // 1% fuel surcharge waiver
      minAmount: 500,
      maxAmount: 4000,
      maxWaiver: 250 // Maximum waiver of Rs. 250 per month
    },
    capping: {
      categories: {
        "Birthday Spend": { points: 2000, period: "yearly" },
        "Utility Bill": { points: 3000, period: "monthly" },
        "Accelerated Rewards": { points: 7500, period: "monthly" },
        // Add other categories as needed
      }
    },
    acceleratedCap: 7500, // Monthly cap on accelerated reward points
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Prime"].defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";
      let surchargeWaiver = 0;

      if (additionalParams.isBirthday) {
        rate = sbiCardRewards["Prime"].birthdayRate;
        category = "Birthday Spend";
        rateType = "birthday";
      } else if (additionalParams.isUtilityBill) {
        rate = sbiCardRewards["Prime"].utilityBillRate;
        category = "Utility Bill";
        rateType = "utility";
      } else if (mcc && sbiCardRewards["Prime"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Prime"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5812", "5813", "5814", "5411", "5311", "7832"].includes(mcc)) {
          category = "Accelerated Rewards";
        } else if (["5172", "5541", "5542", "5983"].includes(mcc)) {
          category = "Fuel";
          if (amount >= 500 && amount <= 4000) {
            surchargeWaiver = Math.min(amount * sbiCardRewards["Prime"].fuelSurchargeWaiver.rate, sbiCardRewards["Prime"].fuelSurchargeWaiver.maxWaiver);
          }
        }
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Prime"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue, surchargeWaiver };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a birthday transaction?',
        name: 'isBirthday',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isBirthday || false,
        onChange: (value) => onChange('isBirthday', value === 'true')
      },
      {
        type: 'radio',
        label: 'Is this a utility bill transaction?',
        name: 'isUtilityBill',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isUtilityBill || false,
        onChange: (value) => onChange('isUtilityBill', value === 'true')
      }
    ]
  },
  "Prime Advantage": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points per Rs. 100 on all other retail spends
    redemptionRate: 1 / 4, // 4 Reward Points = Rs. 1
    mccRates: {
      // 10 Reward Points per Rs. 100 on Dining, Departmental stores, Grocery & Movie spends
      "5812": 10 / 100, // Eating Places and Restaurants
      "5813": 10 / 100, // Drinking Places
      "5814": 10 / 100, // Fast Food Restaurants
      "5411": 10 / 100, // Grocery Stores & Supermarkets
      "5311": 10 / 100, // Departmental Stores
      "7832": 10 / 100, // Motion Picture Theaters

      // Utility bill transactions
      "4900": 20 / 100, // Utilities - Electric, Gas, Sanitary, Water
      "4814": 20 / 100, // Telecommunication Services
      "4899": 20 / 100, // Cable, Satellite, and Other Pay Television and Radio Services

      // Fuel transactions
      "5172": 0, "5541": 0, "5542": 0, "5983": 0
    },
    utilityBillRate: 20 / 100, // 20 Reward Points per Rs. 100 on utility bill transactions
    utilityBillCap: 3000, // Utility bill reward points capped at 3000 per month
    fuelSurchargeWaiver: {
      rate: 0.01, // 1% fuel surcharge waiver
      minAmount: 500,
      maxAmount: 4000,
      maxWaiver: 250 // Maximum waiver of Rs. 250 per month
    },
    capping: {
      categories: {
        "Utility Bill": { points: 3000, period: "monthly" },
        "Accelerated Rewards": { points: 7500, period: "monthly" },
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Prime Advantage"].defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";
      let surchargeWaiver = 0;

      if (mcc && sbiCardRewards["Prime Advantage"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Prime Advantage"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["4900", "4814", "4899"].includes(mcc)) {
          category = "Utility Bill";
        } else if (["5812", "5813", "5814", "5411", "5311", "7832"].includes(mcc)) {
          category = "Accelerated Rewards";
        } else if (["5172", "5541", "5542", "5983"].includes(mcc)) {
          category = "Fuel";
          if (amount >= 500 && amount <= 4000) {
            surchargeWaiver = Math.min(amount * 0.01, 250);
          }
        } else {
          category = "Excluded Category";
        }
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Prime Advantage"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue, surchargeWaiver };
    },
    dynamicInputs: () => []
  },
  "Pulse": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points per Rs. 100 on all other spends
    redemptionRate: 1 / 4, // 4 Reward Points = Rs. 1
    mccRates: {
      // 10 Reward Points per Rs. 100 spent on Chemist, Pharmacy, Sports, Dining and Movies
      "5912": 10 / 100, "8099": 10 / 100, // Pharmacy & Chemist
      "5812": 10 / 100, "5813": 10 / 100, "5814": 10 / 100, // Dining
      "7832": 10 / 100, // Movies
      "5655": 10 / 100, // Sports & Riding Apparel Stores
      "5941": 10 / 100, // Sporting Goods Store
      "7941": 10 / 100, // Commercial Sports, Professional Sports Clubs, Athletic Fields, and Sports Promoters
      "7997": 10 / 100, // Membership Clubs (Sports, Recreation, Athletic), Country Clubs, and Private Golf Courses

      // Excluded categories
      "5172": 0, "5541": 0, "5542": 0, "5983": 0, // Fuel
      "6540": 0, "6541": 0 // E-wallet loading
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Pulse"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && sbiCardRewards["Pulse"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Pulse"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5912", "8099"].includes(mcc)) {
          category = "Pharmacy & Chemist";
        } else if (["5812", "5813", "5814"].includes(mcc)) {
          category = "Dining";
        } else if (mcc === "7832") {
          category = "Movies";
        } else if (["5655", "5941", "7941", "7997"].includes(mcc)) {
          category = "Sports";
        } else {
          category = rate === 0 ? "Excluded Category" : "Category Spend";
        }
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Pulse"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: () => []
  },
  "Reliance": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point per Rs. 100 spent on other retail purchases
    redemptionRate: 0.25, // 1 Reward Point = Rs. 0.25
    mccRates: {
      "5812": 5 / 100, // Dining
      "5813": 5 / 100, // Bars
      "5814": 5 / 100, // Fast Food
      "7832": 5 / 100, // Movies
      "5172": 0, "5541": 0, "5983": 0, "5542": 0, "6540": 0, "6541": 0, "6513": 0, "9399": 0, "9311": 0 // Excluded categories
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Reliance"].defaultRate;
      let category = "Other Retail";
      let rateType = "default";

      if (additionalParams.isRelianceRetail) {
        rate = 5 / 100;
        category = "Reliance Retail";
        rateType = "reliance-retail";
      } else if (mcc && sbiCardRewards["Reliance"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Reliance"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Dining & Movies";
        rateType = rate === 0 ? "excluded" : "dining-movies";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Reliance"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Reliance Retail transaction?',
        name: 'isRelianceRetail',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isRelianceRetail || false,
        onChange: (value) => onChange('isRelianceRetail', value === 'true')
      }
    ]
  },
  "Reliance Prime": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 Reward Points per Rs. 100 spent on other retail purchases
    redemptionRate: 0.25, // 1 Reward Point = Rs. 0.25
    mccRates: {
      "5812": 5 / 100, // Dining
      "5813": 5 / 100, // Bars
      "5814": 5 / 100, // Fast Food
      "7832": 5 / 100, // Movies
      "7922": 5 / 100, // Entertainment
      "3000": 5 / 100, // Airlines (generic)
      "5172": 0, "5541": 0, "5983": 0, "5542": 0, "6540": 0, "6541": 0, "6513": 0, "9399": 0, "9311": 0 // Excluded categories
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Reliance Prime"].defaultRate;
      let category = "Other Categories";
      let rateType = "default";

      if (additionalParams.isRelianceRetail) {
        rate = 10 / 100;
        category = "Reliance Retail";
        rateType = "reliance-retail";
      } else if (mcc && sbiCardRewards["Reliance Prime"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Reliance Prime"].mccRates[mcc];
        if (rate === 0) {
          category = "Excluded Category";
          rateType = "excluded";
        } else {
          category = "Accelerated Domestic";
          rateType = "accelerated";
        }
      } else if (additionalParams.isInternational) {
        rate = 6 / 100;
        category = "International";
        rateType = "international";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Reliance Prime"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Reliance Retail', value: 'relianceRetail' },
          { label: 'International', value: 'international' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isRelianceRetail', value === 'relianceRetail');
          onChange('isInternational', value === 'international');
        }
      }
    ]
  },
  "IRCTC": {
    cardType: "points",
    mccRates: {
    },
    defaultRate: 1 / 125, // 1 Reward point for every Rs. 125 spent on non-fuel retail purchases
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["IRCTC"].defaultRate;
      let category = "Non-Fuel Retail";
      let rateType = "default";

      if (additionalParams.isIRCTCPurchase) {
        rate = 0.10; // Up to 10% Value Back as Reward Points
        category = "IRCTC Railway Ticket";
        rateType = "irctc";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an IRCTC railway ticket purchase?',
        name: 'isIRCTCPurchase',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isIRCTCPurchase || false,
        onChange: (value) => onChange('isIRCTCPurchase', value === 'true')
      }
    ]
  },
  "IRCTC Platinum": {
    cardType: "points",
    defaultRate: 1 / 125, // 1 Reward point for every Rs. 125 spent on non-fuel retail purchases
    mccRates: {
      "5172": 0, "5541": 0, "5983": 0, "5542": 0 // Fuel purchases
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["IRCTC Platinum"].defaultRate;
      let category = "Non-Fuel Retail";
      let rateType = "default";

      if (mcc && sbiCardRewards["IRCTC Platinum"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["IRCTC Platinum"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        rateType = "mcc-specific";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "IRCTC Premier": {
    cardType: "points",
    defaultRate: 1 / 125, // 1 Reward Point per 125 spent on other non-fuel retail purchases
    mccRates: {
      "5812": 3 / 125, // Dining
      "5813": 3 / 125, // Drinking Places
      "5814": 3 / 125, // Fast Food
      "4900": 3 / 125, // Utilities
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["IRCTC Premier"].defaultRate;
      let category = "Other Non-Fuel Retail";
      let rateType = "default";

      if (additionalParams.isIRCTCPurchase) {
        rate = 0.10; // 10% back as Reward Points
        category = "IRCTC Railway Ticket";
        rateType = "irctc";
      } else if (mcc && sbiCardRewards["IRCTC Premier"].mccRates[mcc]) {
        rate = sbiCardRewards["IRCTC Premier"].mccRates[mcc];
        category = ["5812", "5813", "5814"].includes(mcc) ? "Dining" : "Utility";
        rateType = "accelerated";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an IRCTC railway ticket purchase?',
        name: 'isIRCTCPurchase',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isIRCTCPurchase || false,
        onChange: (value) => onChange('isIRCTCPurchase', value === 'true')
      }
    ]
  },
  "Vistara": {
    cardType: "points",
    defaultRate: 3 / 200, // 3 CV Points per Rs. 200 spent on all spends
    mccRates: {
      "6540": 0, "6541": 0, "6513": 0 // E-wallet loading and Rent Payment
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Vistara"].defaultRate;
      let category = "All Spends";
      let rateType = "default";

      if (mcc && sbiCardRewards["Vistara"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Vistara"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        rateType = "mcc-specific";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Vistara Prime": {
    cardType: "points",
    defaultRate: 4 / 200, // 4 CV Points per Rs. 200 spent on all spends
    mccRates: {
      "6540": 0, "6541": 0, "6513": 0 // E-wallet loading and Rent Payment
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Vistara"].defaultRate;
      let category = "All Spends";
      let rateType = "default";

      if (mcc && sbiCardRewards["Vistara"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Vistara"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        rateType = "mcc-specific";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "SimplyClick": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point per Rs. 100 spent on all other spends
    onlineRate: 5 / 100, // 5X Reward Points on all other online spends
    partnerRate: 10 / 100, // 10X Reward Points on online spends with exclusive partners
    redemptionRate: 1, // Assuming 1 point = Rs. 1 for simplicity
    mccRates: {
      "6540": 0, "6541": 0, "5172": 0, "5541": 0, "5983": 0, "5542": 0, "6513": 0, "9399": 0, "9311": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["SimplyClick"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isExclusivePartner) {
        rate = sbiCardRewards["SimplyClick"].partnerRate;
        category = "Exclusive Partner";
        rateType = "partner";
      } else if (additionalParams.isOnline) {
        rate = sbiCardRewards["SimplyClick"].onlineRate;
        category = "Online Spends";
        rateType = "online";
      } else if (mcc && sbiCardRewards["SimplyClick"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["SimplyClick"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        rateType = "mcc-specific";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["SimplyClick"].redemptionRate;

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
        onChange: (value) => {
          const isOnline = value === 'true';
          onChange('isOnline', isOnline);
          if (isOnline) {
            onChange('isExclusivePartner', false);
          }
        }
      },
      {
        type: 'radio',
        label: 'Is this an exclusive partner transaction?',
        name: 'isExclusivePartner',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isExclusivePartner || false,
        onChange: (value) => {
          const isExclusivePartner = value === 'true';
          onChange('isExclusivePartner', isExclusivePartner);
          if (isExclusivePartner) {
            onChange('isOnline', false);
          }
        }
      }
    ]
  },
  "SimplySave": {
    cardType: "points",
    defaultRate: 1 / 150, // 1 Reward Point per Rs. 150 spent on all other spends
    acceleratedRate: 10 / 150, // 10 Reward Points per Rs. 150 spent on accelerated categories
    redemptionRate: 1 / 4, // 4 Reward Points = Rs. 1
    mccRates: {
      "5812": 10 / 150, // Dining
      "5813": 10 / 150, // Bars
      "5814": 10 / 150, // Fast Food
      "7832": 10 / 150, // Movies
      "5311": 10 / 150, // Department Stores
      "5411": 10 / 150, // Grocery Stores
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["SimplySave"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (sbiCardRewards["SimplySave"].mccRates[mcc]) {
        rate = sbiCardRewards["SimplySave"].acceleratedRate;
        category = "Accelerated Category";
        rateType = "accelerated";

        if (["5812", "5813", "5814"].includes(mcc)) {
          category = "Dining";
        } else if (mcc === "7832") {
          category = "Movies";
        } else if (mcc === "5311") {
          category = "Department Stores";
        } else if (mcc === "5411") {
          category = "Grocery";
        }
      }

      // Adjust rate for UPI transactions if applicable
      if (additionalParams.isUPITransaction) {
        // Note: The card doesn't specify a different rate for UPI transactions,
        // so we're using the same rate. Adjust this if there's a specific UPI rate.
        category += " (UPI)";
        rateType += "-upi";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["SimplySave"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a UPI transaction?',
        name: 'isUPITransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isUPITransaction || false,
        onChange: (value) => onChange('isUPITransaction', value === 'true')
      }
    ]
  },
  "Tata": {
    cardType: "cashback",
    defaultRate: 0,
    mccRates: {
      "5732": 0.015, // 1.5% value back on Croma
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Tata"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc === "5732" || additionalParams.isCroma) {
        rate = sbiCardRewards["Tata"].mccRates["5732"];
        category = "Croma";
        rateType = "croma";
      } else if (additionalParams.isTataOutlet) {
        rate = 0.05; // 5% value back on Tata outlets
        category = "Tata Outlet";
        rateType = "tata-outlet";
      }

      const cashback = amount * rate;

      return { cashback, rate, rateType, category };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Croma transaction?',
        name: 'isCroma',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isCroma || false,
        onChange: (value) => {
          const isCroma = value === 'true';
          onChange('isCroma', isCroma);
          if (isCroma) {
            onChange('isTataOutlet', false);
          }
        }
      },
      {
        type: 'radio',
        label: 'Is this a Tata outlet transaction?',
        name: 'isTataOutlet',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTataOutlet || false,
        onChange: (value) => {
          const isTataOutlet = value === 'true';
          onChange('isTataOutlet', isTataOutlet);
          if (isTataOutlet) {
            onChange('isCroma', false);
          }
        }
      }
    ]
  },
  "Tata Select": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Point per Rs. 100 spent on other retail outlets
    redemptionRate: 1, // 1 Empower Point = Re. 1
    mccRates: {
      // 3X Points on Departmental & Grocery stores, Dining & International spends
      "5311": 3 / 100, // Department Stores
      "5411": 3 / 100, // Grocery Stores and Supermarkets
      "5812": 3 / 100, // Eating Places and Restaurants
      "5813": 3 / 100, // Drinking Places
      "5814": 3 / 100, // Fast Food Restaurants
    },
    specialRates: {
      croma: 1.5 / 100, // 1.5% value back on spends at Croma and cromaretail.com
      tataOutlets: 5 / 100, // Up to 5% value back on spends on Tata outlets
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Tata Select"].defaultRate;
      let category = "Other Retail";
      let rateType = "default";

      if (additionalParams.isCroma) {
        rate = sbiCardRewards["Tata Select"].specialRates.croma;
        category = "Croma";
        rateType = "special-croma";
      } else if (additionalParams.isTataOutlet) {
        rate = sbiCardRewards["Tata Select"].specialRates.tataOutlets;
        category = "Tata Outlet";
        rateType = "special-tata";
      } else if (mcc && sbiCardRewards["Tata Select"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Tata Select"].mccRates[mcc];
        rateType = "mcc-specific";
        if (["5311", "5411"].includes(mcc)) {
          category = "Departmental & Grocery";
        } else if (["5812", "5813", "5814"].includes(mcc)) {
          category = "Dining";
        }
      }

      if (additionalParams.isInternational && rateType === "default") {
        rate = sbiCardRewards["Tata Select"].mccRates["5812"]; // Using dining rate for international spends
        category = "International Spend";
        rateType = "international";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Tata Select"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Croma transaction?',
        name: 'isCroma',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isCroma || false,
        onChange: (value) => {
          onChange('isCroma', value === 'true');
          if (value === 'true') {
            onChange('isTataOutlet', false);
            onChange('isInternational', false);
          }
        }
      },
      {
        type: 'radio',
        label: 'Is this a Tata outlet transaction?',
        name: 'isTataOutlet',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTataOutlet || false,
        onChange: (value) => {
          onChange('isTataOutlet', value === 'true');
          if (value === 'true') {
            onChange('isCroma', false);
            onChange('isInternational', false);
          }
        }
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
        onChange: (value) => {
          onChange('isInternational', value === 'true');
          if (value === 'true') {
            onChange('isCroma', false);
            onChange('isTataOutlet', false);
          }
        }
      }
    ]
  },
  "Titan": {
    cardType: "mixed",
    defaultRate: 6 / 100, // 6 Reward Points per Rs 100 spent on all other categories
    redemptionRate: 0.25, // 1 Reward Point = Rs. 0.25
    titanRates: {
      "Tanishq": 3 / 100, // 3% Value back on Tanishq
      "MiaCaratlaneZoya": 5 / 100, // 5% Cashback on Mia, Caratlane & Zoya
      "OtherTitan": 7.5 / 100, // 7.5% Cashback on other Titan brands
    },
    mccRates: {
      "5541": 0, "5542": 0, "6540": 0, "6541": 0, "6513": 0, "4900": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Titan"].defaultRate;
      let category = "Other Categories";
      let rateType = "default";
      let cashback = 0;
      let points = 0;

      if (additionalParams.titanBrand) {
        rate = sbiCardRewards["Titan"].titanRates[additionalParams.titanBrand];
        category = additionalParams.titanBrand;
        rateType = "titan-brand";
        cashback = amount * rate;
      } else if (mcc && sbiCardRewards["Titan"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Titan"].mccRates[mcc];
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        rateType = "mcc-specific";
      } else {
        points = Math.floor(amount * rate);
      }

      const cashbackValue = points * sbiCardRewards["Titan"].redemptionRate;

      return { points, cashback, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'select',
        label: 'Titan Brand',
        name: 'titanBrand',
        options: [
          { label: 'Not Titan', value: '' },
          { label: 'Tanishq', value: 'Tanishq' },
          { label: 'Mia/Caratlane/Zoya', value: 'MiaCaratlaneZoya' },
          { label: 'Other Titan Brands', value: 'OtherTitan' },
        ],
        value: currentInputs.titanBrand || '',
        onChange: (value) => onChange('titanBrand', value)
      }
    ]
  },
  "Yatra": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward Point on every Rs. 100 spent on all other categories
    redemptionRate: 0.25, // 1 Reward point = Rs. 0.25
    mccRates: {
      "5311": 6 / 100, // Departmental Stores
      "5411": 6 / 100, // Grocery
      "5812": 6 / 100, // Dining
      "5813": 6 / 100, // Bars
      "5814": 6 / 100, // Fast Food
      "7832": 6 / 100, // Movies
      "7922": 6 / 100, // Entertainment
      "5172": 0, "5541": 0, "5983": 0, "5542": 0, "6513": 0, "9399": 0, "9311": 0 // Excluded categories
    },
    capping: {
      categories: {
        "Accelerated Domestic": { points: 5000, period: "monthly" },
        "International": { points: 5000, period: "monthly" },
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = sbiCardRewards["Yatra"].defaultRate;
      let category = "Other Categories";
      let rateType = "default";

      if (mcc && sbiCardRewards["Yatra"].mccRates[mcc] !== undefined) {
        rate = sbiCardRewards["Yatra"].mccRates[mcc];
        if (rate === 0) {
          category = "Excluded Category";
          rateType = "excluded";
        } else {
          category = "Accelerated Domestic";
          rateType = "accelerated";
        }
      } else if (additionalParams.isInternational) {
        rate = 6 / 100;
        category = "International";
        rateType = "international";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * sbiCardRewards["Yatra"].redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
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
  }
};

export const calculateSBIRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = sbiCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      cashback: 0,
      rewardText: "Card not found",
      uncappedPoints: 0,
      cappedPoints: 0,
      uncappedCashback: 0,
      cappedCashback: 0,
      appliedCap: null
    };
  }

  const result = cardReward.calculateRewards(amount, mcc, additionalParams);

  switch (cardReward.cardType) {
    case "cashback":
      return applyCashbackCapping(result, cardReward, cardName);
    case "miles":
      return applyMilesCapping(result, cardReward, cardName);
    case "mixed":
      return applyMixedRewardsCapping(result, cardReward, cardName);
    case "points":
    default:
      return applyPointsCapping(result, cardReward, cardName);
  }
};

const applyMixedRewardsCapping = (result, cardReward, cardName) => {
  let { points, cashback, rate, rateType, category, cashbackValue } = result;
  let cappedPoints = points;
  let cappedCashback = cashback;
  let appliedCap = null;

  // Apply capping logic here if needed

  const rewardText = generateMixedRewardText(cardName, cappedPoints, cappedCashback, rate, rateType, category, appliedCap, cashbackValue);

  return {
    points: cappedPoints,
    cashback: cappedCashback,
    rewardText,
    uncappedPoints: points,
    cappedPoints,
    uncappedCashback: cashback,
    cappedCashback,
    appliedCap,
    rateUsed: rate,
    rateType,
    category,
    cashbackValue
  };
};

const generateMixedRewardText = (cardName, points, cashback, rate, rateType, category, appliedCap, cashbackValue) => {
  let rewardText = "";

  if (cashback > 0) {
    rewardText = `₹${cashback.toFixed(2)} Cashback`;
  } else if (points > 0) {
    rewardText = `${points} SBI Reward Points`;
    if (cashbackValue > 0) {
      rewardText += ` (Worth ₹${cashbackValue.toFixed(2)})`;
    }
  } else {
    rewardText = "No rewards earned";
  }

  if (category !== "Other Categories") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints || appliedCap.maxCashback})`;
  }

  return rewardText;
};

const applyMilesCapping = (result, cardReward, cardName) => {
  let { miles, tierMiles, rate, rateType, category } = result;
  let cappedMiles = miles;
  let cappedTierMiles = tierMiles;
  let appliedCap = null;

  if (cardReward.tierMileCap && tierMiles > cardReward.tierMileCap) {
    cappedTierMiles = cardReward.tierMileCap;
    appliedCap = {
      category: "Tier Miles",
      maxMiles: cardReward.tierMileCap,
      period: "yearly"
    };
  }

  const rewardText = generateMilesRewardText(cardName, cappedMiles, cappedTierMiles, rate, rateType, category, appliedCap);

  return {
    miles: cappedMiles,
    tierMiles: cappedTierMiles,
    rewardText,
    uncappedMiles: miles,
    cappedMiles,
    appliedCap,
    rateUsed: rate,
    rateType,
    category
  };
};

const applyCashbackCapping = (result, cardReward, cardName) => {
  let { cashback, rate, rateType, category } = result;
  let cappedCashback = cashback;
  let appliedCap = null;

  if (cardReward.maxCashback && cashback > cardReward.maxCashback) {
    cappedCashback = cardReward.maxCashback;
    appliedCap = { category: "Total Cashback", maxCashback: cardReward.maxCashback };
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
  let { points, rate, rateType, category, cashbackValue, surchargeWaiver } = result;
  let cappedPoints = points;
  let appliedCap = null;

  if (cardReward.capping && cardReward.capping.categories && category) {
    const cappingCategory = cardReward.capping.categories[category];
    if (cappingCategory) {
      const { points: maxPoints } = cappingCategory;
      cappedPoints = Math.min(points, maxPoints);

      if (cappedPoints < points) {
        appliedCap = { category, maxPoints };
      }
    }
  }

  // Recalculate cashback value if points were capped
  if (cappedPoints !== points && cardReward.redemptionRate) {
    cashbackValue = cappedPoints * cardReward.redemptionRate;
  }

  const rewardText = generatePointsRewardText(cardName, cappedPoints, rate, rateType, category, appliedCap, cashbackValue, surchargeWaiver);

  return {
    points: cappedPoints,
    rewardText,
    uncappedPoints: points,
    cappedPoints,
    appliedCap,
    rateUsed: rate,
    rateType,
    category,
    cashbackValue,
    surchargeWaiver
  };
};

const generateMilesRewardText = (cardName, miles, tierMiles, rate, rateType, category, appliedCap) => {
  let rewardText = `${miles} Etihad Guest Miles`;

  if (tierMiles) {
    rewardText += ` + ${tierMiles} Tier Miles`;
  }

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Tier Miles capped at ${appliedCap.maxMiles} per year)`;
  }

  return rewardText;
};

const generateCashbackRewardText = (cardName, cashback, rate, rateType, category, appliedCap) => {
  let rewardText = `₹${cashback.toFixed(2)} Cashback`;

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ₹${appliedCap.maxCashback})`;
  }

  return rewardText;
};

const generatePointsRewardText = (cardName, points, rate, rateType, category, appliedCap, cashbackValue, surchargeWaiver) => {
  let rewardText = "";

  if (cardName.toLowerCase().includes("miles") || cardName.toLowerCase().includes("etihad")) {
    rewardText = `${points} ${cardName.includes("Etihad") ? "Etihad Guest Miles" : "Miles"}`;
  } else {
    rewardText = `${points} SBI Reward Points`;
    if (typeof cashbackValue === 'number') {
      rewardText += ` (Worth ₹${cashbackValue.toFixed(2)})`;
    }
  }

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints || appliedCap.maxMiles} ${points ? "points" : "miles"}`;
    if (appliedCap.maxSpent) {
      rewardText += ` or ₹${appliedCap.maxSpent} spent`;
    }
    rewardText += ')';
  }

  if (surchargeWaiver && surchargeWaiver > 0) {
    rewardText += ` + ₹${surchargeWaiver.toFixed(2)} Fuel Surcharge Waiver`;
  }

  return rewardText;
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = sbiCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};