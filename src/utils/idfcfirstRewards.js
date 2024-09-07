import { mccList } from '../data/mccData';
export const idfcFirstCardRewards = {
  "Classic": {
    cardType: "points",
    defaultRate: 1 / 100,
    acceleratedRewards: {
      tier1: {
        rate: 3 / 100,
        threshold: 20000
      },
      tier2: {
        rate: 10 / 100,
        threshold: 200000
      }
    },
    birthdayRate: 10 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = idfcFirstCardRewards.Classic.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isBirthday) {
        rate = idfcFirstCardRewards.Classic.birthdayRate;
        rateType = "birthday";
        category = "Birthday Spend";
      } else if (amount > idfcFirstCardRewards.Classic.acceleratedRewards.tier2.threshold) {
        rate = idfcFirstCardRewards.Classic.acceleratedRewards.tier2.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
      } else if (amount > idfcFirstCardRewards.Classic.acceleratedRewards.tier1.threshold) {
        rate = idfcFirstCardRewards.Classic.acceleratedRewards.tier1.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
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
      }
    ]
  },
  "Club Vistara": {
    cardType: "points",
    defaultRate: 6 / 200, // 6 CV Points per ₹200 for spends up to ₹1 lakh
    acceleratedRewards: {
      tier1: {
        rate: 4 / 200, // 4 CV Points per ₹200 for spends above ₹1 lakh
        threshold: 100000
      }
    },
    birthdayRate: 10 / 200,
    mccRates: {
      // Special rate MCCs (1 CV Point per ₹200)
      "5541": 1 / 200, // Fuel
      "5542": 1 / 200, // Fuel
      "6300": 1 / 200, // Insurance
      "4900": 1 / 200, // Utility
      "4814": 1 / 200, // Utility
      "4816": 1 / 200, // Utility
      "4899": 1 / 200, // Utility

      // Excluded categories
      "6012": 0, // Financial institutions (for EMI)
      "6011": 0, // ATM cash withdrawal
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = idfcFirstCardRewards["Club Vistara"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isBirthday) {
        rate = idfcFirstCardRewards["Club Vistara"].birthdayRate;
        rateType = "birthday";
        category = "Birthday Spend";
      } else if (amount > idfcFirstCardRewards["Club Vistara"].acceleratedRewards.tier1.threshold) {
        rate = idfcFirstCardRewards["Club Vistara"].acceleratedRewards.tier1.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
      }

      if (mcc && idfcFirstCardRewards["Club Vistara"].mccRates[mcc] !== undefined) {
        rate = idfcFirstCardRewards["Club Vistara"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount / 200) * (rate * 200);

      return { points, rate, rateType, category };
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
      }
    ]
  },
  "Millennia": {
    cardType: "points",
    defaultRate: 1 / 100,
    acceleratedRewards: {
      tier1: {
        rate: 3 / 100,
        threshold: 20000
      },
      tier2: {
        rate: 10 / 100,
        threshold: 200000
      }
    },
    birthdayRate: 10 / 100,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = idfcFirstCardRewards.Millennia.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isBirthday) {
        rate = idfcFirstCardRewards.Millennia.birthdayRate;
        rateType = "birthday";
        category = "Birthday Spend";
      } else if (amount > idfcFirstCardRewards.Millennia.acceleratedRewards.tier2.threshold) {
        rate = idfcFirstCardRewards.Millennia.acceleratedRewards.tier2.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
      } else if (amount > idfcFirstCardRewards.Millennia.acceleratedRewards.tier1.threshold) {
        rate = idfcFirstCardRewards.Millennia.acceleratedRewards.tier1.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
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
      }
    ]
  },
  "Power": {
    cardType: "points",
    defaultRate: 2 / 150, // 2 Reward points per ₹150 for other retail spends
    mccRates: {
      // Reward categories
      "5541": 21 / 150, // 21 Rewards per ₹150 spends on HPCL fuel
      "5542": 21 / 150, // Including both MCC codes for fuel
      "5411": 15 / 150, // 15 Reward points per ₹150 spends on grocery
      "4900": 15 / 150, // 15 Reward points per ₹150 spends on utility

      //Fasttag
      "4784": 15 / 150, // 15 Reward points per ₹150 spends on FASTag

      // Excluded categories
      "6300": 0, // Insurance premium payments
      "5983": 0, // Fuel dealers (for non-HPCL fuel)
      "6012": 0, // Financial institutions – merchandise, services, and debt repayments (for EMI)
      "6011": 0, // ATM cash withdrawal

      // Additional excluded MCCs (you may need to add more based on specific requirements)
      "5944": 0, // Jewelry stores (often excluded from reward programs)
      "7995": 0, // Gambling transactions
      "4829": 0, // Wire transfers
      "6050": 0, // Quasi cash transactions
      "6051": 0, // Non-financial institutions – foreign currency, money orders, travelers' cheques
      "6211": 0, // Security brokers/dealers
      "6529": 0, // Remote stored value load - financial
      "6530": 0, // Remote stored value load - merchant
      "6531": 0, // Payment service provider - money transfer for a purchase
      "6532": 0, // Payment service provider - member financial institution - payment transaction
      "6533": 0, // Payment service provider - merchant - payment transaction
      "6534": 0, // Money transfer - member financial institution
      "6535": 0, // Value-loaded card purchase/load
    },
    capping: {
      categories: {
        "Fuel": { points: 700, maxSpent: 5000 },
        "Grocery": { points: 400, maxSpent: 4000 },
        "Utility": { points: 400, maxSpent: 4000 },
        "FASTag": { points: 200, maxSpent: 1000 }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = idfcFirstCardRewards.Power.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && idfcFirstCardRewards.Power.mccRates[mcc] !== undefined) {
        rate = idfcFirstCardRewards.Power.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
        if (mcc === "5541" || mcc === "5542") category = "Fuel";
        else if (mcc === "5411") category = "Grocery";
        else if (mcc === "4900") category = "Utility";
        else if (mcc === "4784") category = "FASTag";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Select": {
    cardType: "points",
    defaultRate: 1 / 150,
    mccRates: {},
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = idfcFirstCardRewards.Select.defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "SWYP": {
    cardType: "points",
    defaultRate: 0,
    mccRates: {
      // Excluded categories
      "6011": 0, // Cash withdrawal
      "5541": 0, // Fuel
      "5542": 0, // Fuel
    },
    acceleratedRewards: {
      tier1: {
        rate: 200 / 5000, // 200 points for 5000 spent
        threshold: 5000,
        maxPoints: 200
      },
      tier2: {
        rate: 500 / 10000, // 500 points for 10000 spent
        threshold: 10000,
        maxPoints: 500
      },
      tier3: {
        rate: 1000 / 15000, // 1000 points for 15000 spent
        threshold: 15000,
        maxPoints: 1000
      }
    },
    capping: {
      categories: {
        "RentalAndUtility": { points: 400, maxSpent: 20000 }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let points = 0;
      let rate = 0;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && idfcFirstCardRewards.SWYP.mccRates[mcc] !== undefined) {
        rate = idfcFirstCardRewards.SWYP.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Excluded Category";
      } else {
        const tiers = Object.values(idfcFirstCardRewards.SWYP.acceleratedRewards).sort((a, b) => b.threshold - a.threshold);
        for (const tier of tiers) {
          if (amount >= tier.threshold) {
            points = Math.min(tier.maxPoints, Math.floor(amount * tier.rate));
            rate = tier.rate;
            rateType = "accelerated";
            category = "Accelerated Spend";
            break;
          }
        }
      }

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Wealth": {
    cardType: "points",
    defaultRate: 1 / 50,
    acceleratedRewards: {
      tier1: {
        rate: 3 / 100,
        threshold: 20000
      },
      tier2: {
        rate: 10 / 100,
        threshold: 200000
      }
    },
    birthdayRate: 10 / 100,
    mccRates: {
      "4814": 1 / 150, // Utility - 0.66%
      "4816": 1 / 150, // Utility - 0.66%
      "4899": 1 / 150, // Utility - 0.66%
      "4900": 1 / 150, // Utility - 0.66%
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = idfcFirstCardRewards.Wealth.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isBirthday) {
        rate = idfcFirstCardRewards.Wealth.birthdayRate;
        rateType = "birthday";
        category = "Birthday Spend";
      } else if (amount > idfcFirstCardRewards.Wealth.acceleratedRewards.tier2.threshold) {
        rate = idfcFirstCardRewards.Wealth.acceleratedRewards.tier2.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
      } else if (amount > idfcFirstCardRewards.Wealth.acceleratedRewards.tier1.threshold) {
        rate = idfcFirstCardRewards.Wealth.acceleratedRewards.tier1.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
      }

      if (mcc && idfcFirstCardRewards.Wealth.mccRates[mcc]) {
        rate = idfcFirstCardRewards.Wealth.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Utility";
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
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
      }
    ]
  },
  "WOW": {
    cardType: "points",
    defaultRate: 1 / 150,
    mccRates: {
      "4814": 1 / 150, // Utility
      "4816": 1 / 150, // Utility
      "4899": 1 / 150, // Utility
      "4900": 1 / 150, // Utility
      "6011": 0, // Cash withdrawal
      "5541": 0, // Fuel
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = idfcFirstCardRewards.WOW.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && idfcFirstCardRewards.WOW.mccRates[mcc] !== undefined) {
        rate = idfcFirstCardRewards.WOW.mccRates[mcc];
        rateType = "mcc-specific";
        if (rate === 0) {
          category = "Excluded Category";
        } else if (["4814", "4816", "4899", "4900"].includes(mcc)) {
          category = "Utility";
        } else if (["5541", "5542"].includes(mcc)) {
          category = "Fuel";
        }
      }

      const points = Math.floor(amount * rate);

      return { points, rate, rateType, category };
    },
    dynamicInputs: () => []
  },
  "Mayura": {
    cardType: "points",
    defaultRate: 5 / 150, // 5X reward points on spends till ₹20,000
    acceleratedRate: 10 / 150, // 10X reward points for incremental spends above ₹20,000
    specialCategoryRate: 3 / 150, // 3X reward points on special categories
    utilitiesInsuranceRate: 1 / 150, // 1X reward points on utilities and insurance
    redemptionRate: 0.25, // 1 reward point = ₹0.25
    mccRates: {
      "6513": 3 / 150, // Education, Rent, Property Management/Purchase
      "6540": 3 / 150, // Wallet Load
      "9399": 3 / 150, // Government
      "9311": 3 / 150, // Government
      "4814": 1 / 150, // Utilities
      "4900": 1 / 150, // Utilities
      "5960": 1 / 150, // Insurance
      "6300": 1 / 150, // Insurance
      "6381": 1 / 150, // Insurance
      "5172": 0, // Fuel
      "5541": 0, // Fuel
      "5542": 0, // Fuel
      "5983": 0  // Fuel
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = idfcFirstCardRewards.Mayura.defaultRate;
      let category = "Regular Spend";
      let rateType = "default";

      if (additionalParams.isBirthday) {
        rate = idfcFirstCardRewards.Mayura.acceleratedRate;
        category = "Birthday Spend";
        rateType = "birthday";
      } else if (additionalParams.monthlySpend > 20000) {
        rate = idfcFirstCardRewards.Mayura.acceleratedRate;
        category = "Accelerated Spend";
        rateType = "accelerated";
      } else if (mcc && idfcFirstCardRewards.Mayura.mccRates[mcc] !== undefined) {
        rate = idfcFirstCardRewards.Mayura.mccRates[mcc];
        if (rate === idfcFirstCardRewards.Mayura.specialCategoryRate) {
          category = "Special Category";
          rateType = "special";
        } else if (rate === idfcFirstCardRewards.Mayura.utilitiesInsuranceRate) {
          category = "Utilities & Insurance";
          rateType = "utilities-insurance";
        } else if (rate === 0) {
          category = "Excluded Category";
          rateType = "excluded";
        }
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * idfcFirstCardRewards.Mayura.redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
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
        type: 'number',
        label: 'Total monthly spend so far',
        name: 'monthlySpend',
        value: currentInputs.monthlySpend || 0,
        onChange: (value) => onChange('monthlySpend', parseFloat(value))
      }
    ]
  },

  "Ashva": {
    cardType: "points",
    defaultRate: 5 / 150, // 5X reward points on spends up to ₹20,000
    acceleratedRate: 10 / 150, // 10X reward points for incremental spends above ₹20,000
    specialCategoryRate: 3 / 150, // 3X reward points on special categories
    utilitiesInsuranceRate: 1 / 150, // 1X reward points on utilities and insurance
    redemptionRate: 0.25, // 1 reward point = ₹0.25
    mccRates: {
      "6513": 3 / 150, // Education, Rent, Property Management/Purchase
      "6540": 3 / 150, // Wallet Load
      "9399": 3 / 150, // Government
      "9311": 3 / 150, // Government
      "4814": 1 / 150, // Utilities
      "4900": 1 / 150, // Utilities
      "5960": 1 / 150, // Insurance
      "6300": 1 / 150, // Insurance
      "6381": 1 / 150, // Insurance
      "5172": 0, // Fuel
      "5541": 0, // Fuel
      "5542": 0, // Fuel
      "5983": 0  // Fuel
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = idfcFirstCardRewards.Ashva.defaultRate;
      let category = "Regular Spend";
      let rateType = "default";

      if (additionalParams.isBirthday) {
        rate = idfcFirstCardRewards.Ashva.acceleratedRate;
        category = "Birthday Spend";
        rateType = "birthday";
      } else if (additionalParams.monthlySpend > 20000) {
        rate = idfcFirstCardRewards.Ashva.acceleratedRate;
        category = "Accelerated Spend";
        rateType = "accelerated";
      } else if (mcc && idfcFirstCardRewards.Ashva.mccRates[mcc] !== undefined) {
        rate = idfcFirstCardRewards.Ashva.mccRates[mcc];
        if (rate === idfcFirstCardRewards.Ashva.specialCategoryRate) {
          category = "Special Category";
          rateType = "special";
        } else if (rate === idfcFirstCardRewards.Ashva.utilitiesInsuranceRate) {
          category = "Utilities & Insurance";
          rateType = "utilities-insurance";
        } else if (rate === 0) {
          category = "Excluded Category";
          rateType = "excluded";
        }
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = points * idfcFirstCardRewards.Ashva.redemptionRate;

      return { points, rate, rateType, category, cashbackValue };
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
        type: 'number',
        label: 'Total monthly spend so far',
        name: 'monthlySpend',
        value: currentInputs.monthlySpend || 0,
        onChange: (value) => onChange('monthlySpend', parseFloat(value))
      }
    ]
  },

  "Power+": {
    cardType: "hybrid",
    defaultRate: 3 / 150, // 3X Rewards on other retail spends
    mccRates: {
      "5541": 30 / 150, // 30X Rewards on HPCL fuel spends
      "5542": 30 / 150, // 30X Rewards on HPCL fuel spends
      "5411": 30 / 150, // 30X Rewards on grocery
      "4900": 30 / 150, // 30X Rewards on utility
      "5960": 0, // Insurance
      "6300": 0, // Insurance
      "6381": 0, // Insurance
      "5172": 0, // Non-HPCL Fuel
      "5983": 0, // Non-HPCL Fuel
    },
    happyCoinsRate: 6 / 100, // 6 Happy Coins per ₹100 fuel spends through HP Pay App
    redemptionRate: 0.25, // 1 Reward point = ₹0.25
    capping: {
      categories: {
        "HPCL Fuel": { points: 2400, maxSpent: 12000, period: "statement cycle" },
        "Grocery and Utility": { points: 400, maxSpent: 2000, period: "statement cycle" },
        "IDFC FIRST FASTag": { points: 200, maxSpent: 1000, period: "statement cycle" }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = idfcFirstCardRewards["Power+"].defaultRate;
      let category = "Other Retail Spends";
      let rateType = "default";
      let happyCoins = 0;

      if (mcc && idfcFirstCardRewards["Power+"].mccRates[mcc] !== undefined) {
        rate = idfcFirstCardRewards["Power+"].mccRates[mcc];
        if ((mcc === "5541" || mcc === "5542") && additionalParams.isHPCL) {
          category = "HPCL Fuel";
          rateType = "hpcl-fuel";
          if (additionalParams.isHPPayApp) {
            happyCoins = Math.floor(amount * idfcFirstCardRewards["Power+"].happyCoinsRate);
          }
        } else if (mcc === "5411" || mcc === "4900") {
          category = "Grocery and Utility";
          rateType = "grocery-utility";
        } else if (rate === 0) {
          category = "Excluded Category";
          rateType = "excluded";
        }
      }

      if (additionalParams.isIDFCFASTag) {
        rate = idfcFirstCardRewards["Power+"].mccRates["5411"]; // Using the same rate as grocery
        category = "IDFC FIRST FASTag";
        rateType = "fastag";
      }
      const points = Math.floor(amount * rate);
      const cashbackValue = points * idfcFirstCardRewards["Power+"].redemptionRate;

      return { points, happyCoins, rate, rateType, category, cashbackValue };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const inputs = [];

      if (selectedMcc === "5541" || selectedMcc === "5542") {
        inputs.push({
          type: 'radio',
          label: 'Is this an HPCL fuel transaction?',
          name: 'isHPCL',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          value: currentInputs.isHPCL || false,
          onChange: (value) => onChange('isHPCL', value === 'true')
        });

        if (currentInputs.isHPCL) {
          inputs.push({
            type: 'radio',
            label: 'Is this transaction through HP Pay App?',
            name: 'isHPPayApp',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isHPPayApp || false,
            onChange: (value) => onChange('isHPPayApp', value === 'true')
          });
        }
      }

      inputs.push({
        type: 'radio',
        label: 'Is this an IDFC FIRST FASTag recharge?',
        name: 'isIDFCFASTag',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isIDFCFASTag || false,
        onChange: (value) => onChange('isIDFCFASTag', value === 'true')
      });

      return inputs;
    }
  }
};

export const calculateIDFCFirstRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = idfcFirstCardRewards[cardName];
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

  if (category !== "Other Spends") {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ₹${appliedCap.maxCashback})`;
  }

  return rewardText;
};

const generatePointsRewardText = (cardName, points, rate, rateType, category, appliedCap) => {
  let rewardText = `${points} IDFC First Reward Points`;

  if (cardName === "Club Vistara") {
    rewardText = `${points} CV Points`;
  }

  if (rateType === "birthday") {
    rewardText += " (Birthday bonus applied)";
  } else if (rateType === "accelerated") {
    rewardText += " (Accelerated rate applied)";
  }

  if (category !== "Other Spends" && !rewardText.includes(category)) {
    rewardText += ` (${category})`;
  }

  if (appliedCap) {
    rewardText += ` (Capped at ${appliedCap.maxPoints} points)`;
  }

  return rewardText;
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
  const cardReward = idfcFirstCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};
