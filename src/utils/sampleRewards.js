export const standardizedCardStructure = {
    "CardName": {
        cardType: "points" | "cashback" | "miles" | "hybrid",
        defaultRate: 1 / 100, // Example rate
        mccRates: {
            "1234": 2 / 100, // Example MCC-specific rate
            // ... other MCC rates
        },
        capping: {
            categories: {
                "Category1": { points: 1000, maxSpent: 10000 },
                // ... other category caps
            },
            overall: { points: 5000, period: "monthly" } // Optional overall cap
        },
        redemptionRate: {
            airMiles: 0.75, // Optional, for cashback/miles cards
            cashValue: 0.25 // Optional, for cashback/miles cards
        },
        calculateRewards: (amount, mcc, additionalParams) => {
            // Implementation specific to this card
            // Should return { reward, category, rewardText, cashbackValue }
        },
        dynamicInputs: (currentInputs, onChange) => [
            // Array of dynamic input objects
        ]
    }
};

// Example usage
export const exampleCardRewards = {
    "ExampleCard": {
        cardType: "points",
        defaultRate: 1 / 100,
        mccRates: {
            "5812": 2 / 100, // Restaurants
            "5411": 3 / 100  // Grocery stores
        },
        capping: {
            categories: {
                "Dining": { points: 1000, maxSpent: 50000 },
                "Grocery": { points: 1500, maxSpent: 50000 }
            },
            overall: { points: 5000, period: "monthly" }
        },
        redemptionRate: {
            airMiles: 0.8,
            cashValue: 0.3
        },
        calculateRewards: (amount, mcc, additionalParams) => {
            let rate = exampleCardRewards.ExampleCard.defaultRate;
            let category = "Other Spends";
            let rateType = "default";

            if (mcc && exampleCardRewards.ExampleCard.mccRates[mcc]) {
                rate = exampleCardRewards.ExampleCard.mccRates[mcc];
                category = mcc === "5812" ? "Dining" : "Grocery";
                rateType = "mcc-specific";
            }

            let points = Math.floor(amount * rate);

            // Apply category-specific capping
            const cappingCategory = exampleCardRewards.ExampleCard.capping.categories[category];
            if (cappingCategory) {
                points = Math.min(points, cappingCategory.points, Math.floor(cappingCategory.maxSpent * rate));
            }

            // Apply overall capping
            const overallCap = exampleCardRewards.ExampleCard.capping.overall;
            if (overallCap) {
                points = Math.min(points, overallCap.points);
            }

            const cashbackValue = {
                airMiles: points * exampleCardRewards.ExampleCard.redemptionRate.airMiles,
                cashValue: points * exampleCardRewards.ExampleCard.redemptionRate.cashValue
            };

            //cashback card 
            //const rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;

            //points card
            //const rewardText = `${points} Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
            //const rewardText = `${points} Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} or ${cashbackValue.airMiles.toFixed(2)} Air Miles`;

            //hybrid card
            //const rewardText = cashback > 0 ? `₹${cashback.toFixed(2)} Cashback (${category})`: `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

            //miles card
            //const rewardText = `${miles} Award Miles (${category})`;        

            const rewardText = `You earned ${points} points in the ${category} category`;



            return { points, rate, rateType, category, rewardText, cashbackValue, cardType: exampleCardRewards.ExampleCard.cardType };
        },
        dynamicInputs: (currentInputs, onChange) => [
            {
                type: 'radio',
                label: 'Is this a special promotion period?',
                name: 'isPromotion',
                options: [
                    { label: 'Yes', value: true },
                    { label: 'No', value: false }
                ],
                value: currentInputs.isPromotion || false,
                onChange: (value) => onChange('isPromotion', value === 'true')
            }
        ]
    }
};


export const calculateExampleRewards = (cardName, amount, mcc, additionalParams = {}) => {
    const cardReward = exampleCardRewards[cardName];
    if (!cardReward) {
        return {
            reward: 0,
            rewardText: "Card not found",
            category: "Unknown",
            cashbackValue: { airMiles: 0, cashValue: 0 },
            cardType: "unknown"
        };
    }

    return cardReward.calculateRewards(amount, mcc, additionalParams);
};

export const getCardInputs = (cardName, currentInputs, onChange) => {
    const cardReward = exampleCardRewards[cardName];
    return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange) : [];
};