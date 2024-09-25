export const dbsCardRewards = {
    "Spark": {
        cardType: "points",
        defaultRate: 2 / 200, // 2 Cash Points for every ₹200 spent
        redemptionRate: {
            cashValue: 0.20 // 1 Cash Point = ₹0.20
        },
        mccRates: {
            // Excluded categories
            "5541": 0, "5542": 0, "5983": 0, "5172": 0, // Fuel
            "6540": 0, // Wallet Load
            "6513": 0, // Rent
            "5944": 0, // Jewellery
        },
        variants: {
            "Spark*5": {
                monthlyMilestone: {
                    threshold: 10000,
                    rate: 10 / 200, // 5X points (2 base + 8 accelerated)
                    cap: 3000
                },
                quarterlyMilestone: {
                    threshold: 50000,
                    points: 2500
                }
            },
            "Spark*10": {
                monthlyMilestone: {
                    threshold: 15000,
                    onlineRate: 20 / 200, // 10X points (2 base + 18 accelerated)
                    offlineRate: 10 / 200, // 5X points (2 base + 8 accelerated)
                    cap: 5000
                },
                quarterlyMilestone: {
                    threshold: 75000,
                    points: 3500
                }
            },
            "Spark*20": {
                monthlyMilestone: {
                    threshold: 20000,
                    specialRate: 40 / 200, // 20X points (2 base + 38 accelerated) for Utility, Dining & Grocery
                    onlineRate: 30 / 200, // 15X points (2 base + 28 accelerated) for other online
                    offlineRate: 10 / 200, // 5X points (2 base + 8 accelerated) for offline
                    cap: 7000
                },
                quarterlyMilestone: {
                    threshold: 100000,
                    points: 5000
                }
            }
        },
        calculateRewards: (amount, mcc, additionalParams = {}) => {
            const variant = additionalParams.variant || "Spark*5";
            const variantDetails = dbsCardRewards["Spark"].variants[variant];

            let rate = dbsCardRewards["Spark"].defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (dbsCardRewards["Spark"].mccRates[mcc] !== undefined) {
                rate = dbsCardRewards["Spark"].mccRates[mcc];
                category = rate === 0 ? "Excluded Category" : "Category Spend";
                rateType = "mcc-specific";
            } else if (additionalParams.monthlySpend >= variantDetails.monthlyMilestone.threshold) {
                if (variant === "Spark*20") {
                    if (["Utility", "Dining", "Grocery"].includes(additionalParams.category)) {
                        rate = variantDetails.monthlyMilestone.specialRate;
                        category = "Special Category (20X)";
                    } else if (additionalParams.isOnline) {
                        rate = variantDetails.monthlyMilestone.onlineRate;
                        category = "Online Spend (15X)";
                    } else {
                        rate = variantDetails.monthlyMilestone.offlineRate;
                        category = "Offline Spend (5X)";
                    }
                } else if (variant === "Spark*10") {
                    if (additionalParams.isOnline) {
                        rate = variantDetails.monthlyMilestone.onlineRate;
                        category = "Online Spend (10X)";
                    } else {
                        rate = variantDetails.monthlyMilestone.offlineRate;
                        category = "Offline Spend (5X)";
                    }
                } else {
                    rate = variantDetails.monthlyMilestone.rate;
                    category = "Milestone Spend (5X)";
                }
                rateType = "milestone";
            }

            let points = Math.floor(amount * rate);

            // Apply monthly cap
            points = Math.min(points, variantDetails.monthlyMilestone.cap);

            const cashbackValue = {
                cashValue: points * dbsCardRewards["Spark"].redemptionRate.cashValue
            };

            let rewardText = rate === 0
                ? `No Cash Points earned for this transaction (${category})`
                : `${points} Cash Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

            return { points, rate, rateType, category, rewardText, cashbackValue, cardType: dbsCardRewards["Spark"].cardType };
        },
        dynamicInputs: (currentInputs, onChange) => [
            {
                type: 'select',
                label: 'Card Variant',
                name: 'variant',
                options: [
                    { label: 'Spark*5', value: 'Spark*5' },
                    { label: 'Spark*10', value: 'Spark*10' },
                    { label: 'Spark*20', value: 'Spark*20' }
                ],
                value: currentInputs.variant || 'Spark*5',
                onChange: (value) => onChange('variant', value)
            },
            {
                type: 'number',
                label: 'Monthly Spend So Far',
                name: 'monthlySpend',
                value: currentInputs.monthlySpend || 0,
                onChange: (value) => onChange('monthlySpend', parseInt(value))
            },
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
                label: 'Category (for Spark*20)',
                name: 'category',
                options: [
                    { label: 'Other', value: 'Other' },
                    { label: 'Utility', value: 'Utility' },
                    { label: 'Dining', value: 'Dining' },
                    { label: 'Grocery', value: 'Grocery' }
                ],
                value: currentInputs.category || 'Other',
                onChange: (value) => onChange('category', value),
                condition: (inputs) => inputs.variant === 'Spark*20'
            }
        ]
    },
    "Vantage": {
        cardType: "hybrid",
        defaultRate: 4 / 200, // 4 Vantage Points for every ₹200 spent domestically
        internationalRate: 8 / 200, // 8 Vantage Points for every ₹200 spent internationally
        singaporeRate: 4 / 200, // 4 Vantage Points for every ₹200 spent in Singapore
        redemptionRate: {
            cashValue: 1 // 1 Vantage Point = ₹1
        },
        mccRates: {
            // Excluded categories
            "5541": 0, "5542": 0, "5983": 0, "5172": 0, // Fuel
            "6540": 0, // Wallet Load
            "6513": 0, // Rent
            "5309": 0, // Duty Free stores (for Vantage Points, but eligible for cashback)
        },
        dutyFreeCashback: {
            rate: 0.10,
            cap: 1500,
            period: "monthly"
        },
        milestones: {
            quarterly: [
                { spend: 300000, reward: { points: 5000 } },
                { spend: 500000, reward: { points: 10000 } }
            ],
            yearly: [
                { spend: 2000000, reward: { points: 40000 } }
            ]
        },
        annualFeeWaiver: {
            spend: 1000000
        },
        calculateRewards: (amount, mcc, additionalParams = {}) => {
            let rate = dbsCardRewards["Vantage"].defaultRate;
            let category = "Domestic Purchase";
            let rateType = "default";
            let points = 0;
            let cashback = 0;

            // Determine the rate based on transaction type
            if (additionalParams.isInternational) {
                if (additionalParams.isSingapore) {
                    rate = dbsCardRewards["Vantage"].singaporeRate;
                    category = "Singapore Purchase";
                } else {
                    rate = dbsCardRewards["Vantage"].internationalRate;
                    category = "International Purchase";
                }
                rateType = "international";
            }

            // Check for excluded categories
            if (dbsCardRewards["Vantage"].mccRates[mcc] !== undefined) {
                rate = dbsCardRewards["Vantage"].mccRates[mcc];
                category = rate === 0 ? "Excluded Category" : "Category Spend";
                rateType = "mcc-specific";
            }

            // Calculate points
            if (rate > 0) {
                points = Math.floor(amount / 200) * Math.floor(rate * 200);
            }

            // Calculate cashback for duty-free purchases
            if (mcc === "5309") {
                cashback = Math.min(
                    amount * dbsCardRewards["Vantage"].dutyFreeCashback.rate,
                    dbsCardRewards["Vantage"].dutyFreeCashback.cap
                );
                category = "Duty Free Purchase";
            }

            const cashbackValue = {
                cashValue: points * dbsCardRewards["Vantage"].redemptionRate.cashValue
            };

            let rewardText = "";
            if (points > 0) {
                rewardText += `${points} Vantage Points earned (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}. `;
            }
            if (cashback > 0) {
                rewardText += `₹${cashback.toFixed(2)} Cashback earned on Duty Free purchase. `;
            }
            if (rewardText === "") {
                rewardText = `No rewards earned for this transaction (${category})`;
            }

            return { points, cashback, rate, rateType, category, rewardText, cashbackValue, cardType: dbsCardRewards["Vantage"].cardType };
        },
        dynamicInputs: (currentInputs, onChange) => {
            const inputs = [
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
                        if (value === 'false') {
                            onChange('isSingapore', false);
                        }
                    }
                }
            ];

            if (currentInputs.isInternational === true) {
                inputs.push({
                    type: 'radio',
                    label: 'Is this a Singapore transaction?',
                    name: 'isSingapore',
                    options: [
                        { label: 'Yes', value: true },
                        { label: 'No', value: false }
                    ],
                    value: currentInputs.isSingapore || false,
                    onChange: (value) => onChange('isSingapore', value === 'true')
                });
            }

            return inputs;
        }
    }
};

export const calculateDBSRewards = (cardName, amount, mcc, additionalParams = {}) => {
    const cardReward = dbsCardRewards[cardName];
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
    const cardReward = dbsCardRewards[cardName];
    return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange, selectedMcc) : [];
};