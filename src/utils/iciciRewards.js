import { mccList } from '../data/mccData';

export const iciciCardRewards = {
  "AmazonPay": {
    defaultRate: 1 / 100,
    mccRates: {
      "5399": 3 / 100,
      "5735": 2 / 100
    },
    amazonPrimeRate: {
      "5399": 5 / 100
    }
  },
  "Coral": {
    defaultRate: 1 / 50,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    }
  },
  "Emeralde Private": {
    defaultRate: 6 / 200,
    mccRates: {
      "6513": 0,
      "5541": 0
    },
    capping: {
      categories: {
        "Insurance": { points: 5000, maxSpent: 166666.67 },
        "Grocery": { points: 1000, maxSpent: 33333.33 },
        "Utilities": { points: 1000, maxSpent: 33333.33 },
        "Education": { points: 1000, maxSpent: 33333.33 }
      }
    }
  },
  "Emeralde": {
    defaultRate: 4 / 100,
    mccRates: {
      "5541": 1 / 100,
      "4900": 1 / 100
    }
  },
  "Coral Rupay": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Rubyx": {
    defaultRate: 1 / 50,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    },
    internationalRate: 4 / 100
  },
  "Sapphiro": {
    defaultRate: 1 / 50,
    mccRates: {
      "4900": 1 / 100,
      "6300": 1 / 100
    },
    internationalRate: 4 / 100
  },
  "HPCL Super Saver": {
    defaultRate: 2 / 100,
    mccRates: {
      "5541": 4 / 100,
      "4900": 5 / 100,
      "5311": 5 / 100
    }
  },
  "HPCL Coral": {
    defaultRate: 2 / 100,
    mccRates: {
      "5541": 0
    }
  },
  "Mine": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "MakeMyTrip Signature": {
    defaultRate: 1.25 / 200,
    mccRates: {
      "7011": 4 / 200,
      "4511": 2 / 200
    }
  },
  "MMT": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "MMT Black": {
    defaultRate: 1 / 100,
    mccRates: {}
  }
};

export const calculateICICIRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = iciciCardRewards[cardName];
  if (!cardReward) return { points: 0, rewardText: "Card not found" };

  let points = 0;
  let rewardText = "";
  let rate = cardReward.defaultRate;
  let appliedCap = null;
  let uncappedPoints = null;

  // Find MCC name
  const mccName = mcc ? mccList.find(item => item.mcc === mcc)?.name.toLowerCase() : null;

  if (cardName === "AmazonPay") {
    const isPrimeMember = additionalParams.isPrimeMember || false;
    
    if (isPrimeMember && cardReward.amazonPrimeRate && cardReward.amazonPrimeRate[mcc]) {
      rate = cardReward.amazonPrimeRate[mcc];
    } else if (cardReward.mccRates && cardReward.mccRates[mcc]) {
      rate = cardReward.mccRates[mcc];
    }

    points = Math.floor(amount * rate);
    const cashback = points / 100;
    rewardText = `₹${cashback.toFixed(2)} Cashback`;
  } else {
    if (additionalParams.isInternational && cardReward.internationalRate) {
      rate = cardReward.internationalRate;
    } else if (mcc && cardReward.mccRates && cardReward.mccRates[mcc]) {
      rate = cardReward.mccRates[mcc];
    }

    points = Math.floor(amount * rate);
    uncappedPoints = points;
    
    // Apply capping logic if needed
    if (cardReward.capping && cardReward.capping.categories && mccName) {
      const cappingCategories = cardReward.capping.categories;
      
      const matchingCategory = Object.keys(cappingCategories).find(cat => 
        mccName.includes(cat.toLowerCase())
      );
    
      if (matchingCategory) {
        const { points: catPoints, maxSpent: catMaxSpent } = cappingCategories[matchingCategory];
        const cappedAmount = Math.min(amount, catMaxSpent);
        const cappedPoints = Math.min(points, catPoints, Math.floor(cappedAmount * rate));
        
        if (cappedPoints < points) {
          points = cappedPoints;
          appliedCap = {
            category: matchingCategory,
            maxPoints: catPoints,
            maxSpent: catMaxSpent
          };
        }
      }
    }
  
    rewardText = `${points} ICICI Reward Points`;
  }

  return { 
    points, 
    rewardText,
    rate,
    ...(uncappedPoints !== points && { uncappedPoints }),
    ...(appliedCap && { appliedCap })
  };
};