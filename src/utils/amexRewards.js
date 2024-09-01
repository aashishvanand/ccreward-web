export const amexCardRewards = {
    "SmartEarn": {
        cardType: "hybrid",
        defaultRate: 1 / 50, // 1 Membership Rewards point per Rs. 50 spent
        mccRates: {
            // 10X category (10 points per Rs. 50)
            "5812": 10 / 50, // Restaurants (for Zomato)
            "5651": 10 / 50, // Family Clothing Stores (for Ajio)
            "5977": 10 / 50, // Cosmetic Stores (for Nykaa)
            "7832": 10 / 50, // Motion Picture Theaters (for BookMyShow)
            "4121": 10 / 50, // Taxicabs/Limousines (for Uber)

            // 5X category (5 points per Rs. 50)
            "5399": 5 / 50, // Misc. General Merchandise (for Amazon)

            // Excluded categories
            "5541": 0, "5542": 0, // Fuel
            "6300": 0, "6381": 0, "6399": 0, // Insurance
            "4900": 0, // Utilities
        },
        capping: {
            categories: {
                "10X Zomato": { points: 500, maxSpent: 2500 },
                "10X Others": { points: 500, maxSpent: 2500 },
                "5X Amazon": { points: 250, maxSpent: 2500 }
            }
        },
        calculateRewards: (amount, mcc, additionalParams) => {
            let rate = amexCardRewards.SmartEarn.defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (mcc && amexCardRewards.SmartEarn.mccRates[mcc] !== undefined) {
                rate = amexCardRewards.SmartEarn.mccRates[mcc];
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

            const points = Math.floor(amount * rate);

            return { points, rate, rateType, category };
        },
        dynamicInputs: () => []
    },

    "Membership Rewards": {
        cardType: "points",
        defaultRate: 1 / 50,
        mccRates: {
            "5541": 0, "5542": 0, // Fuel
            "6300": 0, "6381": 0, "6399": 0, // Insurance
            "4900": 0, // Utilities
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

            const points = Math.floor(amount * rate);

            return { points, rate, rateType, category };
        },
        dynamicInputs: () => []
    },

    "Platinum Reserve": {
        cardType: "points",
        defaultRate: 1 / 50,
        mccRates: {
            "5541": 0, "5542": 0, // Fuel
            "6300": 0, "6381": 0, "6399": 0, // Insurance
            "4900": 0, // Utilities
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

            return { points, rate, rateType, category };
        },
        dynamicInputs: () => []
    },

    "Platinum Travel": {
        cardType: "points",
        defaultRate: 1 / 50,
        mccRates: {
            "5541": 0, "5542": 0, // Fuel
            "6300": 0, "6381": 0, "6399": 0, // Insurance
            "4900": 0, // Utilities
        },
        calculateRewards: (amount, mcc, additionalParams) => {
            let rate = amexCardRewards["Platinum Travel"].defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (mcc && amexCardRewards["Platinum Travel"].mccRates[mcc] !== undefined) {
                rate = amexCardRewards["Platinum Travel"].mccRates[mcc];
                rateType = "mcc-specific";
                category = rate === 0 ? "Excluded Category" : "Category Spend";
            }

            const points = Math.floor(amount * rate);

            return { points, rate, rateType, category };
        },
        dynamicInputs: () => []
    },
    "Platinum": {
        cardType: "points",
        defaultRate: 1 / 40, // 1 Membership Reward point for every INR 40 spent
        fuelRate: 5 / 100, // 5 Membership Reward points for every Rs. 100 spent on fuel (1 base + 4 bonus)
        internationalRate: 3 / 40, // 3X points on international spends
        rewardMultiplierRate: 5 / 40, // 5X points through Reward Multiplier
        mccRates: {
            "5541": 5 / 100, "5542": 5 / 100, // Fuel
            "6300": 0, "6381": 0, "6399": 0, // Insurance
            "4900": 0, // Utilities
        },
        capping: {
            categories: {
                "Fuel": { points: 5000, maxSpent: 100000 } // Max 5000 additional points per month on fuel
            }
        },
        calculateRewards: (amount, mcc, additionalParams) => {
            let rate = amexCardRewards.Platinum.defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (additionalParams.isInternational) {
                rate = amexCardRewards.Platinum.internationalRate;
                category = "International Spend";
                rateType = "international";
            } else if (additionalParams.isRewardMultiplier) {
                rate = amexCardRewards.Platinum.rewardMultiplierRate;
                category = "Reward Multiplier";
                rateType = "reward-multiplier";
            } else if (mcc && amexCardRewards.Platinum.mccRates[mcc] !== undefined) {
                rate = amexCardRewards.Platinum.mccRates[mcc];
                rateType = "mcc-specific";
                category = (mcc === "5541" || mcc === "5542") ? "Fuel" : "Excluded Category";
            }

            const points = Math.floor(amount * rate);

            return { points, rate, rateType, category };
        },
        dynamicInputs: (currentInputs, onChange) => [
            {
                type: 'radio',
                label: 'Transaction Type',
                name: 'transactionType',
                options: [
                    { label: 'International', value: 'international' },
                    { label: 'Reward Multiplier', value: 'rewardMultiplier' },
                    { label: 'Regular', value: 'regular' }
                ],
                value: currentInputs.transactionType || 'regular',
                onChange: (value) => {
                    onChange('transactionType', value);
                    onChange('isInternational', value === 'international');
                    onChange('isRewardMultiplier', value === 'rewardMultiplier');
                }
            }
        ],
    },
    "Gold": {
        cardType: "points",
        defaultRate: 1 / 50,
        rewardMultiplierRate: 5 / 50, // 5X points through Reward Multiplier
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
        calculateRewards: (amount, mcc, additionalParams) => {
            let rate = amexCardRewards.Gold.defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (additionalParams.isRewardMultiplier) {
                rate = amexCardRewards.Gold.rewardMultiplierRate;
                category = "Reward Multiplier";
                rateType = "reward-multiplier";
            } else if (mcc && amexCardRewards.Gold.mccRates[mcc] !== undefined) {
                rate = amexCardRewards.Gold.mccRates[mcc];
                rateType = "mcc-specific";
                if (mcc === "4900") {
                    category = "Utility";
                } else if (mcc === "5541" || mcc === "5542") {
                    category = "Fuel";
                } else {
                    category = rate === 0 ? "Excluded Category" : "Category Spend";
                }
            }

            const points = Math.floor(amount * rate);

            return { points, rate, rateType, category };
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
            uncappedPoints: 0,
            cappedPoints: 0,
            appliedCap: null
        };
    }

    const result = cardReward.calculateRewards(amount, mcc, additionalParams);

    return applyPointsCapping(result, cardReward, cardName);
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

const generatePointsRewardText = (cardName, points, rate, rateType, category, appliedCap) => {
    let rewardText = `${points} American Express Membership Rewards Points`;

    if (category !== "Other Spends" && !rewardText.includes(category)) {
        rewardText += ` (${category})`;
    }

    if (appliedCap) {
        rewardText += ` (Capped at ${appliedCap.maxPoints} points)`;
    }

    return rewardText;
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
    const cardReward = amexCardRewards[cardName];
    return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};