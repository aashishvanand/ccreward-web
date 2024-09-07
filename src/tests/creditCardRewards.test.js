const fs = require('fs');
const path = require('path');
const { iciciCardRewards, calculateICICIRewards } = require('../utils/iciciRewards');
const { axisCardRewards, calculateAxisRewards } = require('../utils/axisRewards');
const { hdfcCardRewards, calculateHDFCRewards } = require('../utils/hdfcRewards');
const { amexCardRewards, calculateAmexRewards } = require("../utils/amexRewards");
const { hsbcCardRewards, calculateHSBCRewards } = require("../utils/hsbcRewards");
const { idfcFirstCardRewards, calculateIDFCFirstRewards } = require("../utils/idfcfirstRewards");
const { oneCardRewards, calculateOneCardRewards } = require("../utils/onecardRewards");
const { scCardRewards, calculateSCRewards } = require("../utils/scRewards");
const { sbiCardRewards, calculateSBIRewards } = require("../utils/sbiRewards");
const { yesCardRewards, calculateYESRewards } = require("../utils/yesRewards");
const { kotakCardRewards, calculateKotakRewards } = require("../utils/kotakRewards");
const { indusIndCardRewards, calculateIndusIndRewards } = require("../utils/indusindRewards");

const errorLogPath = path.join(__dirname, 'error_log.json');

const bankRewards = {
    ICICI: { rewards: iciciCardRewards, calculate: calculateICICIRewards },
    Axis: { rewards: axisCardRewards, calculate: calculateAxisRewards },
    HDFC: { rewards: hdfcCardRewards, calculate: calculateHDFCRewards },
    Amex: { rewards: amexCardRewards, calculate: calculateAmexRewards },
    HSBC: { rewards: hsbcCardRewards, calculate: calculateHSBCRewards },
    IDFCFirst: { rewards: idfcFirstCardRewards, calculate: calculateIDFCFirstRewards },
    OneCard: { rewards: oneCardRewards, calculate: calculateOneCardRewards },
    SC: { rewards: scCardRewards, calculate: calculateSCRewards },
    SBI: { rewards: sbiCardRewards, calculate: calculateSBIRewards },
    YES: { rewards: yesCardRewards, calculate: calculateYESRewards },
    Kotak: { rewards: kotakCardRewards, calculate: calculateKotakRewards },
    IndusInd: { rewards: indusIndCardRewards, calculate: calculateIndusIndRewards }
};

const calculateExpectedReward = (cardName, amount) => {
    const cardConfig = axisCardRewards[cardName];
    if (!cardConfig) return 0;

    if (cardConfig.cardType === 'cashback') {
        return Math.round(amount * cardConfig.defaultRate * 100) / 100; // Round to 2 decimal places
    } else {
        return Math.floor(amount * cardConfig.defaultRate);
    }
};

let errors = {};

const getRandomTestAmount = () => Math.floor(Math.random() * 24801) + 200;

const defaultRateExcludeList = ['Freecharge', 'Select'];

describe('Credit Card Rewards Tests', () => {
    Object.entries(bankRewards).forEach(([bankName, { rewards, calculate }]) => {
        describe(`${bankName} Credit Card Rewards Tests`, () => {
            Object.entries(rewards).forEach(([cardName, cardConfig]) => {
                describe(`${cardName} Card`, () => {
                    if (cardConfig.mccRates) {
                        Object.entries(cardConfig.mccRates).forEach(([mcc, expectedRate]) => {
                            if (expectedRate === 0) {
                                test(`MCC ${mcc} (Zero Rate)`, () => {
                                    const testAmount = getRandomTestAmount();
                                    const result = calculate(cardName, testAmount, mcc);
                                    const calculatedReward = result.points || result.cashback || 0;

                                    if (calculatedReward !== 0) {
                                        if (!errors[bankName]) errors[bankName] = {};
                                        if (!errors[bankName][cardName]) errors[bankName][cardName] = [];
                                        errors[bankName][cardName].push({
                                            mcc,
                                            testAmount,
                                            expected: 0,
                                            calculated: calculatedReward
                                        });
                                    }

                                    expect(calculatedReward).toBe(0);
                                    expect(result.rewardText).not.toBe("Card not found");
                                });
                            }
                        });
                    } else {
                        test('mccRates object exists', () => {
                            if (!errors[bankName]) errors[bankName] = {};
                            errors[bankName][cardName] = ['mccRates object is missing'];
                            expect(cardConfig.mccRates).toBeDefined();
                        });
                    }
                    //TODO: Fix this for all the banks
                    // Only test default rate for cards not in the exclude list

                    // if (!defaultRateExcludeList.includes(cardName)) {
                    //     test('Default Rate', () => {
                    //         const testAmount = getRandomTestAmount();
                    //         const result = calculate(cardName, testAmount, "1234");
                    //         const expectedReward = calculateExpectedReward(cardName, testAmount);
                    //         const calculatedReward = result.points || result.cashback || 0;
                    //         const expectedRate = cardConfig.defaultRate;
                    //         const calculatedRate = calculatedReward / testAmount;
                    //         const isRateCorrect = Math.abs(expectedRate - calculatedRate) <= 0.0001; // Allow for a small difference in rates
                        
                    //         if (!isRateCorrect) {
                    //             if (!errors[bankName]) errors[bankName] = {};
                    //             if (!errors[bankName][cardName]) errors[bankName][cardName] = [];
                    //             errors[bankName][cardName].push({
                    //                 testAmount,
                    //                 expectedRate,
                    //                 calculatedRate,
                    //                 expectedReward,
                    //                 calculatedReward
                    //             });
                    //         }
                        
                    //         expect(isRateCorrect).toBe(true);
                    //         expect(result.rewardText).not.toBe("Card not found");
                    //     });
                    //}
                });
            });
        });
    });
});

afterAll(() => {
    if (Object.keys(errors).length > 0) {
        const errorLogPath = path.join(__dirname, 'error_log.json');
        fs.writeFileSync(errorLogPath, JSON.stringify(errors, null, 2));
        console.log(`Errors have been logged to ${errorLogPath}`);
    } else {
        console.log('All tests passed successfully!');
    }
});