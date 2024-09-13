export const amexCardRewards = {
    "SmartEarn": {
        cardType: "hybrid",
        defaultRate: 1 / 50,
        mccRates: {
            "5812": 10 / 50, "5651": 10 / 50, "5977": 10 / 50, "7832": 10 / 50, "4121": 10 / 50,
            "5399": 5 / 50,
            "5541": 0, "5542": 0, "6300": 0, "6381": 0, "6399": 0, "4900": 0
        },
        capping: {
            categories: {
                "10X Zomato": { points: 500, maxSpent: 2500 },
                "10X Others": { points: 500, maxSpent: 2500 },
                "5X Amazon": { points: 250, maxSpent: 2500 }
            }
        },
        redemptionRate: {
            airMiles: 0.75,
            cashValue: 0.25
        },
        calculateRewards: (amount, mcc, additionalParams) => {
            let rate = amexCardRewards["SmartEarn"].defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (mcc && amexCardRewards["SmartEarn"].mccRates[mcc] !== undefined) {
                rate = amexCardRewards["SmartEarn"].mccRates[mcc];
                rateType = "mcc-specific";
                if (mcc === "5812") {
                    category = "10X Zomato";
                } else if (["5651", "5977", "7832", "4121"].includes(mcc)) {
                    category = "10X Others";
                } else if (mcc === "5399") {
                    category = "5X Amazon";
                } else {
                    category = rate === 0 ? "Excluded Category" : "Category Spend";
                }
            }

            let points = Math.floor(amount * rate);

            const cappingCategory = amexCardRewards["SmartEarn"].capping.categories[category];
            if (cappingCategory) {
                points = Math.min(points, cappingCategory.points, Math.floor(cappingCategory.maxSpent * rate));
            }

            const cashbackValue = {
                airMiles: points * amexCardRewards["SmartEarn"].redemptionRate.airMiles,
                cashValue: points * amexCardRewards["SmartEarn"].redemptionRate.cashValue
            };

            const rewardText = `You earned ${points} Membership Rewards points in the ${category} category`;

            return { points, rate, rateType, category, rewardText, cashbackValue, cardType: amexCardRewards["SmartEarn"].cardType };
        },
        dynamicInputs: () => []
    },

    "Membership Rewards": {
        cardType: "points",
        defaultRate: 1 / 50,
        mccRates: {
            "5541": 0, "5542": 0, "6300": 0, "6381": 0, "6399": 0, "4900": 0, "9311": 0
        },
        redemptionRate: {
            airMiles: 0.75,
            cashValue: 0.25
        },
        calculateRewards: (amount, mcc, additionalParams) => {
            let rate = amexCardRewards["Membership Rewards"].defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (mcc && amexCardRewards["Membership Rewards"].mccRates[mcc] !== undefined) {
                rate = amexCardRewards["Membership Rewards"].mccRates[mcc];
                rateType = "mcc-specific";
                category = rate === 0 ? "Excluded Category" : "Category Spend";
            }

            let points = Math.floor(amount * rate);

            let milestonePoints = 0;
            const monthlySpendRange = additionalParams.monthlySpendRange || '0-24999';
            const transactionsOver1500Range = additionalParams.transactionsOver1500Range || '0-3';

            if (monthlySpendRange !== '0-20000') {
                milestonePoints += 1000;
            }
            if (transactionsOver1500Range === '4+') {
                milestonePoints += 1000;
            }

            points += milestonePoints;

            const cashbackValue = {
                airMiles: points * amexCardRewards["Membership Rewards"].redemptionRate.airMiles,
                cashValue: points * amexCardRewards["Membership Rewards"].redemptionRate.cashValue
            };

            const rewardText = `You earned ${points} Membership Rewards points (including ${milestonePoints} milestone points)`;

            return { points, rate, rateType, category, rewardText, cashbackValue, cardType: amexCardRewards["Membership Rewards"].cardType };
        },
        dynamicInputs: (currentInputs, onChange) => [
            {
                type: 'radio',
                label: 'Monthly Spend Range',
                name: 'monthlySpendRange',
                options: [
                    { label: 'Less than ₹20,000', value: '0-19999' },
                    { label: '₹20,000 to ₹49,999', value: '20000-49999' },
                    { label: '₹50,000 to ₹99,999', value: '50000-99999' },
                    { label: '₹100,000 or more', value: '100000+' }
                ],
                value: currentInputs.monthlySpendRange || '0-24999',
                onChange: (value) => onChange('monthlySpendRange', value)
            },
            {
                type: 'radio',
                label: 'Number of transactions ≥₹1500 this month',
                name: 'transactionsOver1500Range',
                options: [
                    { label: '0 to 3', value: '0-3' },
                    { label: '4 or more', value: '4+' }
                ],
                value: currentInputs.transactionsOver1500Range || '0-3',
                onChange: (value) => onChange('transactionsOver1500Range', value)
            }
        ]
    },

    "Platinum Reserve": {
        cardType: "points",
        defaultRate: 1 / 50,
        mccRates: {
            "5541": 0, "5542": 0, "6300": 0, "6381": 0, "6399": 0, "4900": 0
        },
        redemptionRate: {
            airMiles: 0.75,
            cashValue: 0.25
        },
        calculateRewards: (amount, mcc, additionalParams) => {
            let rate = amexCardRewards["Platinum Reserve"].defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (mcc && amexCardRewards["Platinum Reserve"].mccRates[mcc] !== undefined) {
                rate = amexCardRewards["Platinum Reserve"].mccRates[mcc];
                rateType = "mcc-specific";
                category = rate === 0 ? "Excluded Category" : "Category Spend";
            }

            const points = Math.floor(amount * rate);
            const cashbackValue = {
                airMiles: points * amexCardRewards["Platinum Reserve"].redemptionRate.airMiles,
                cashValue: points * amexCardRewards["Platinum Reserve"].redemptionRate.cashValue
            };

            const rewardText = `You earned ${points} Membership Rewards points in the ${category} category`;

            return { points, rate, rateType, category, rewardText, cashbackValue, cardType: amexCardRewards["Platinum Reserve"].cardType };
        },
        dynamicInputs: () => []
    },

    "Platinum Travel": {
        cardType: "points",
        defaultRate: 1 / 50,
        amazonRate: 3 / 50,
        mccRates: {
            "5541": 0, "5542": 0, "6300": 0, "6381": 0, "6399": 0, "4900": 0, "9311": 0,
            "5399": 3 / 50
        },
        milestones: [
            { spend: 190000, bonus: 15000 },
            { spend: 400000, bonus: 25000 }
        ],
        redemptionRate: {
            airMiles: 0.75,
            cashValue: 0.25
        },
        calculateRewards: (amount, mcc, additionalParams = {}) => {
            let rate = amexCardRewards["Platinum Travel"].defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (mcc && amexCardRewards["Platinum Travel"].mccRates[mcc] !== undefined) {
                rate = amexCardRewards["Platinum Travel"].mccRates[mcc];
                rateType = "mcc-specific";
                category = rate === 0 ? "Excluded Category" : (mcc === "5399" ? "Amazon / General Merchandise" : "Category Spend");
            }

            if (additionalParams.isAmazonPayGYFTR) {
                rate = amexCardRewards["Platinum Travel"].amazonRate;
                category = "Amazon Pay GYFTR";
                rateType = "special";
            }

            let points = Math.floor(amount * rate);

            // Apply milestone bonus only if currentAnnualSpendRange is provided
            if (additionalParams.currentAnnualSpendRange) {
                const currentSpendRangeLower = parseInt(additionalParams.currentAnnualSpendRange.split('-')[0]);
                const totalSpend = currentSpendRangeLower + amount;
                for (let milestone of amexCardRewards["Platinum Travel"].milestones) {
                    if (totalSpend >= milestone.spend && currentSpendRangeLower < milestone.spend) {
                        points += milestone.bonus;
                        break;
                    }
                }
            }

            const cashbackValue = {
                airMiles: points * amexCardRewards["Platinum Travel"].redemptionRate.airMiles,
                cashValue: points * amexCardRewards["Platinum Travel"].redemptionRate.cashValue
            };

            const rewardText = `You earned ${points} Membership Rewards points in the ${category} category`;

            return { points, rate, rateType, category, rewardText, cashbackValue, cardType: amexCardRewards["Platinum Travel"].cardType };
        },
        dynamicInputs: (currentInputs, onChange) => [
            {
                type: 'radio',
                label: 'Current Annual Spend Range (before this transaction)',
                name: 'currentAnnualSpendRange',
                options: [
                    { label: 'Less than ₹1,90,000', value: '0-189999' },
                    { label: '₹1,90,000 to ₹3,99,999', value: '190000-399999' },
                    { label: '₹4,00,000 or more', value: '400000-999999999' }
                ],
                value: currentInputs.currentAnnualSpendRange || '0-189999',
                onChange: (value) => onChange('currentAnnualSpendRange', value)
            },
            {
                type: 'radio',
                label: 'Is this an Amazon Pay GYFTR transaction?',
                name: 'isAmazonPayGYFTR',
                options: [
                    { label: 'Yes', value: true },
                    { label: 'No', value: false }
                ],
                value: currentInputs.isAmazonPayGYFTR || false,
                onChange: (value) => onChange('isAmazonPayGYFTR', value === 'true')
            }
        ]
    },

    "Platinum": {
        cardType: "points",
        defaultRate: 1 / 40,
        fuelRate: 5 / 100,
        internationalRate: 3 / 40,
        rewardMultiplierRate: 5 / 40,
        mccRates: {
            "5541": 5 / 100, "5542": 5 / 100,
            "6300": 0, "6381": 0, "6399": 0,
            "4900": 0
        },
        capping: {
            categories: {
                "Fuel": { points: 5000, maxSpent: 100000 }
            }
        },
        redemptionRate: {
            airMiles: 0.75,
            cashValue: 0.25
        },
        calculateRewards: (amount, mcc, additionalParams = {}) => {
            let rate = amexCardRewards["Platinum Travel"].defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (mcc && amexCardRewards["Platinum Travel"].mccRates[mcc] !== undefined) {
                rate = amexCardRewards["Platinum Travel"].mccRates[mcc];
                rateType = "mcc-specific";
                category = rate === 0 ? "Excluded Category" : (mcc === "5399" ? "Amazon / General Merchandise" : "Category Spend");
            }

            if (additionalParams.isAmazonPayGYFTR) {
                rate = amexCardRewards["Platinum Travel"].amazonRate;
                category = "Amazon Pay GYFTR";
                rateType = "special";
            }

            let points = Math.floor(amount * rate);

            // Apply milestone bonus
            const currentSpendRangeLower = additionalParams.currentAnnualSpendRange ?
                parseInt(additionalParams.currentAnnualSpendRange.split('-')[0]) : 0;
            const totalSpend = currentSpendRangeLower + amount;
            for (let milestone of amexCardRewards["Platinum Travel"].milestones) {
                if (totalSpend >= milestone.spend && currentSpendRangeLower < milestone.spend) {
                    points += milestone.bonus;
                    break;
                }
            }

            const cashbackValue = {
                airMiles: points * amexCardRewards["Platinum Travel"].redemptionRate.airMiles,
                cashValue: points * amexCardRewards["Platinum Travel"].redemptionRate.cashValue
            };

            const rewardText = `You earned ${points} Membership Rewards points in the ${category} category`;

            return { points, rate, rateType, category, rewardText, cashbackValue, cardType: amexCardRewards["Platinum"].cardType };
        },
        dynamicInputs: (currentInputs, onChange) => [
            {
                type: 'radio',
                label: 'Current Annual Spend Range (before this transaction)',
                name: 'currentAnnualSpendRange',
                options: [
                    { label: 'Less than ₹1,90,000', value: '0-189999' },
                    { label: '₹1,90,000 to ₹3,99,999', value: '190000-399999' },
                    { label: '₹4,00,000 or more', value: '400000-999999999' }
                ],
                value: currentInputs.currentAnnualSpendRange || '0-189999',
                onChange: (value) => onChange('currentAnnualSpendRange', value)
            },
            {
                type: 'radio',
                label: 'Is this an Amazon Pay GYFTR transaction?',
                name: 'isAmazonPayGYFTR',
                options: [
                    { label: 'Yes', value: true },
                    { label: 'No', value: false }
                ],
                value: currentInputs.isAmazonPayGYFTR || false,
                onChange: (value) => onChange('isAmazonPayGYFTR', value === 'true')
            }
        ]
    },
    "Gold": {
        cardType: "points",
        defaultRate: 1 / 50,
        rewardMultiplierRate: 5 / 50,
        mccRates: {
            "5541": 1 / 50, "5542": 1 / 50, // Fuel
            "4900": 1 / 50, // Utilities
            "6300": 0, "6381": 0, "6399": 0, // Insurance
        },
        capping: {
            categories: {
                "Utility": { points: 10000, maxSpent: 500000 }, // Max 10,000 points per month on utilities
                "Fuel": { points: 5000, maxSpent: 250000 } // Max 5,000 points per month on fuel
            }
        },
        redemptionRate: {
            airMiles: 0.75,
            cashValue: 0.25
        },
        calculateRewards: (amount, mcc, additionalParams) => {
            let rate = amexCardRewards["Gold"].defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (additionalParams.isRewardMultiplier) {
                rate = amexCardRewards["Gold"].rewardMultiplierRate;
                category = "Reward Multiplier";
                rateType = "reward-multiplier";
            } else if (mcc && amexCardRewards["Gold"].mccRates[mcc] !== undefined) {
                rate = amexCardRewards["Gold"].mccRates[mcc];
                rateType = "mcc-specific";
                if (mcc === "4900") {
                    category = "Utility";
                } else if (mcc === "5541" || mcc === "5542") {
                    category = "Fuel";
                } else {
                    category = rate === 0 ? "Excluded Category" : "Category Spend";
                }
            }

            let points = Math.floor(amount * rate);

            // Apply capping
            const cappingCategory = amexCardRewards["Gold"].capping.categories[category];
            if (cappingCategory) {
                points = Math.min(points, cappingCategory.points, Math.floor(cappingCategory.maxSpent * rate));
            }

            const cashbackValue = {
                airMiles: points * amexCardRewards["Gold"].redemptionRate.airMiles,
                cashValue: points * amexCardRewards["Gold"].redemptionRate.cashValue
            };

            const rewardText = `You earned ${points} Membership Rewards points in the ${category} category`;

            return { points, rate, rateType, category, rewardText, cashbackValue, cardType: amexCardRewards["Gold"].cardType };
        },
        dynamicInputs: (currentInputs, onChange) => [
            {
                type: 'radio',
                label: 'Is this a Reward Multiplier transaction?',
                name: 'isRewardMultiplier',
                options: [
                    { label: 'Yes', value: true },
                    { label: 'No', value: false }
                ],
                value: currentInputs.isRewardMultiplier || false,
                onChange: (value) => onChange('isRewardMultiplier', value === 'true')
            }
        ]
    }
};

export const calculateAmexRewards = (cardName, amount, mcc, additionalParams = {}) => {
    const cardReward = amexCardRewards[cardName];
    if (!cardReward) {
        return {
            points: 0,
            cashback: 0,
            rewardText: "Card not found",
            category: "Unknown",
            cashbackValue: 0,
            cardType: "unknown",
        };
    }

    return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
    const cardReward = amexCardRewards[cardName];
    return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};