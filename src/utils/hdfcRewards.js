export const hdfcCardRewards = {
  "6E Rewards – IndiGo": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "6E Rewards XL – IndiGo": {
    defaultRate: 2 / 100,
    mccRates: {
      "4511": 5 / 100,
      "5411": 3 / 100,
      "5812": 3 / 100,
      "7832": 3 / 100
    }
  },
  "Biz Black": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Diners Club Black Metal": {
    defaultRate: 5 / 150,
    mccRates: {}
  },
  "Diners Club Privilege": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Freedom": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "H.O.G Diners": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Harley Davidson": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "IndianOil": {
    defaultRate: 1 / 100,
    mccRates: {
      "5541": 5 / 100,
      "5411": 5 / 100
    }
  },
  "Infinia Metal": {
    defaultRate: 5 / 150,
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
    }
  },
  "IRCTC HDFC": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Marriott Bonvoy": {
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
    }
  },
  "Millennia": {
    defaultRate: 1 / 100,
    mccRates: {
      // Accelerated Rewards (5% cashback) for select merchants
      // Using example MCCs; adjust as needed for accurate merchant categorization
      "5399": 5 / 100,  // Amazon, Flipkart (Misc. General Merchandise Stores)
      "7829": 5 / 100,  // BookMyShow (Motion Picture Distribution)
      "7298": 5 / 100,  // Cult.fit (Health and Beauty Spas)
      "5691": 5 / 100,  // Myntra (Men's and Women's Clothing Stores)
      "4899": 5 / 100,  // Sony LIV (Cable and Other Pay Television Services)
      "5814": 5 / 100,  // Swiggy, Zomato (Fast Food Restaurants)
      "5311": 5 / 100,  // Tata CLiQ (Department Stores)
      "4121": 5 / 100   // Uber (Taxicabs and Limousines)
    },
  },
  "MoneyBack Plus": {
    defaultRate: 2 / 150,
    mccRates: {
      "5399": 10 / 150,
      "5310": 5 / 150
    }
  },
  "Paytm": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Paytm Select": {
    defaultRate: 1 / 100,
    mccRates: {
      "5399": 5 / 100,
      "5735": 2 / 100
    }
  },
  "Regalia": {
    defaultRate: 4 / 150,
    mccRates: {
      "6513": 0,
      "7399": 0,
      "4214": 0,
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0
    }
  },
  "Regalia Gold": {
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
    }
  },
  "Shoppers Stop": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Shoppers Stop Black": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Swiggy": {
    defaultRate: 0.01, // 1% cashback as default
    mccRates: {
      "5814": 0.10, // 10% cashback for Swiggy app (assuming this MCC, please verify)
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
    }
  },
  "Tata Neu Infinity": {
    defaultRate: 1 / 66.66,
    mccRates: {}
  },
  "Tata Neu Plus": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Times": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "Times Platinum": {
    defaultRate: 1 / 100,
    mccRates: {}
  },
  "UPI RuPay": {
    defaultRate: 0,
    mccRates: {
      "5411": 3 / 100,
      "5812": 3 / 100,
      "5311": 3 / 100,
      "4900": 2 / 100
    }
  }
};

export const calculateHDFCRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = hdfcCardRewards[cardName];
  if (!cardReward) {
    return {
      points: 0,
      rewardText: "Card not found",
      uncappedPoints: 0,
      cappedPoints: 0,
      appliedCap: null
    };
  }

  let rate = cardReward.defaultRate;
  let rateType = "default";

  // Check for international rate
  if (additionalParams.isInternational && cardReward.internationalRate) {
    rate = cardReward.internationalRate;
    rateType = "international";
  }
  // Check for MCC-specific rate
  else if (mcc && cardReward.mccRates && cardReward.mccRates[mcc]) {
    rate = cardReward.mccRates[mcc];
    rateType = "mcc-specific";
  }

  let points = Math.floor(amount * rate);
  let cappedPoints = points;
  let appliedCap = null;

  // Apply category-specific capping if available
  if (cardReward.capping && cardReward.capping.categories && mcc) {
    const mccName = mcc.toLowerCase();
    const cappingCategories = cardReward.capping.categories;

    const matchingCategory = Object.keys(cappingCategories).find(cat =>
      mccName.includes(cat.toLowerCase())
    );

    if (matchingCategory) {
      const { points: catPoints, maxSpent: catMaxSpent } = cappingCategories[matchingCategory];
      const cappedAmount = Math.min(amount, catMaxSpent);
      cappedPoints = Math.min(points, catPoints, Math.floor(cappedAmount * rate));

      if (cappedPoints < points) {
        appliedCap = {
          category: matchingCategory,
          maxPoints: catPoints,
          maxSpent: catMaxSpent
        };
      }
    }
  }

  // Default reward text
  let rewardText = `${cappedPoints} HDFC Points`;

  // Bank-specific logic (to be customized for each bank)
  switch (cardName) {
    case "HDFC Swiggy":
      rewardText = `₹${cappedPoints} Cashback`;
      break;
    default:
      // Default case if no specific logic is needed
      break;
  }

  return {
    points: cappedPoints,
    rewardText,
    uncappedPoints: points,
    cappedPoints,
    appliedCap,
    rateUsed: rate,
    rateType
  };
};