import { mccList } from '../data/mccData';
export const axisCardRewards = {
  "ACE": {
    cardType: "cashback",
    defaultRate: 1.5 / 100,
    googlePayRate: 5 / 100,
    mccRates: {
      // Google Pay bill payments, DTH, and mobile recharges
      "4814": 5 / 100, "4816": 5 / 100, "4899": 5 / 100, "4900": 5 / 100,
      // Swiggy, Zomato & Ola
      "5812": 4 / 100, "5814": 4 / 100, "4121": 4 / 100,
      // Excluded categories
      "5541": 0, "5542": 0, "5983": 0, // Fuel
      "5944": 0, // Jewelry
      "5960": 0, "6300": 0, "6381": 0, // Insurance
      "6011": 0, "6012": 0, "6051": 0, // Financial institutions
      "6513": 0, // Rental payments
      "6540": 0, // Wallet load
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // Educational services
      "9399": 0, "9311": 0, "9222": 0, "9402": 0, // Government services
      "5399": 3 / 100,
      "5735": 2 / 100
    },
    capping: {
      categories: {
        "Google Pay and Food Delivery": { cashback: 500, maxSpent: 10000 },
        "Google Pay Bill Payments": { cashback: 500, maxSpent: 10000 }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.ACE.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isGooglePay && ["4814", "4816", "4899", "4900"].includes(mcc)) {
        rate = axisCardRewards.ACE.googlePayRate;
        category = "Google Pay and Food Delivery";
        rateType = "google-pay";
      } else if (axisCardRewards.ACE.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.ACE.mccRates[mcc];
        rateType = "mcc-specific";
        if (["5812", "5814", "4121"].includes(mcc)) {
          category = "Google Pay and Food Delivery";
        } else if (rate === 0) {
          category = "Excluded Category";
        } else {
          category = "Category Spend";
        }
      }

      let cashback = amount * rate;

      // Apply capping
      if (axisCardRewards.ACE.capping.categories[category]) {
        const cap = axisCardRewards.ACE.capping.categories[category];
        cashback = Math.min(cashback, cap.cashback);
      }

      const rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;

      return { cashback, rate, rateType, category, rewardText, cardType: axisCardRewards.ACE.cardType };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      if (["4814", "4816", "4899", "4900"].includes(selectedMcc)) {
        return [
          {
            type: 'radio',
            label: 'Is this a Google Pay transaction?',
            name: 'isGooglePay',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isGooglePay || false,
            onChange: (value) => onChange('isGooglePay', value === 'true')
          }
        ];
      }
      return [];
    }
  },
  "Atlas": {
    cardType: "points",
    defaultRate: 2 / 100,
    travelRate: 5 / 100,
    travelCapThreshold: 200000,
    travelRateAboveCap: 2 / 100,
    mccRates: {
      // Airlines and Hotels (5X rewards)
      "3000": 5 / 100, "3001": 5 / 100, "3002": 5 / 100, "3003": 5 / 100, "3004": 5 / 100, "3005": 5 / 100,
      "3006": 5 / 100, "3007": 5 / 100, "3008": 5 / 100, "3009": 5 / 100, "3010": 5 / 100, "3011": 5 / 100,
      "3012": 5 / 100, "3013": 5 / 100, "3014": 5 / 100, "3015": 5 / 100, "3016": 5 / 100, "3017": 5 / 100,
      "3018": 5 / 100, "3019": 5 / 100, "3020": 5 / 100, "3021": 5 / 100, "3022": 5 / 100, "3023": 5 / 100,
      "3024": 5 / 100, "3025": 5 / 100, "3026": 5 / 100, "3027": 5 / 100, "3028": 5 / 100, "3029": 5 / 100,
      "3030": 5 / 100, "3031": 5 / 100, "3032": 5 / 100, "3033": 5 / 100, "3034": 5 / 100, "3035": 5 / 100,
      "3036": 5 / 100, "3037": 5 / 100, "3038": 5 / 100, "3039": 5 / 100, "3040": 5 / 100, "3041": 5 / 100,
      "3042": 5 / 100, "3043": 5 / 100, "3044": 5 / 100, "3045": 5 / 100, "3046": 5 / 100, "3047": 5 / 100,
      "3048": 5 / 100, "3049": 5 / 100, "3050": 5 / 100, "3051": 5 / 100, "3052": 5 / 100, "3053": 5 / 100,
      "3054": 5 / 100, "3055": 5 / 100, "3056": 5 / 100, "3057": 5 / 100, "3058": 5 / 100, "3059": 5 / 100,
      "3060": 5 / 100, "3061": 5 / 100, "3062": 5 / 100, "3063": 5 / 100, "3064": 5 / 100, "3065": 5 / 100,
      "3066": 5 / 100, "3067": 5 / 100, "3068": 5 / 100, "3069": 5 / 100, "3070": 5 / 100, "3071": 5 / 100,
      "3072": 5 / 100, "3073": 5 / 100, "3074": 5 / 100, "3075": 5 / 100, "3076": 5 / 100, "3077": 5 / 100,
      "3078": 5 / 100, "3079": 5 / 100, "3080": 5 / 100, "3081": 5 / 100, "3082": 5 / 100, "3083": 5 / 100,
      "3084": 5 / 100, "3085": 5 / 100, "3086": 5 / 100, "3087": 5 / 100, "3088": 5 / 100, "3089": 5 / 100,
      "3090": 5 / 100, "3091": 5 / 100, "3092": 5 / 100, "3093": 5 / 100, "3094": 5 / 100, "3095": 5 / 100,
      "3096": 5 / 100, "3097": 5 / 100, "3098": 5 / 100, "3099": 5 / 100, "3100": 5 / 100, "3101": 5 / 100,
      "3102": 5 / 100, "3103": 5 / 100, "3104": 5 / 100, "3105": 5 / 100, "3106": 5 / 100, "3107": 5 / 100,
      "3108": 5 / 100, "3109": 5 / 100, "3110": 5 / 100, "3111": 5 / 100, "3112": 5 / 100, "3113": 5 / 100,
      "3114": 5 / 100, "3115": 5 / 100, "3116": 5 / 100, "3117": 5 / 100, "3118": 5 / 100, "3119": 5 / 100,
      "3120": 5 / 100, "3121": 5 / 100, "3122": 5 / 100, "3123": 5 / 100, "3124": 5 / 100, "3125": 5 / 100,
      "3126": 5 / 100, "3127": 5 / 100, "3128": 5 / 100, "3129": 5 / 100, "3130": 5 / 100, "3131": 5 / 100,
      "3132": 5 / 100, "3133": 5 / 100, "3134": 5 / 100, "3135": 5 / 100, "3136": 5 / 100, "3137": 5 / 100,
      "3138": 5 / 100, "3139": 5 / 100, "3140": 5 / 100, "3141": 5 / 100, "3142": 5 / 100, "3143": 5 / 100,
      "3144": 5 / 100, "3145": 5 / 100, "3146": 5 / 100, "3147": 5 / 100, "3148": 5 / 100, "3149": 5 / 100,
      "3150": 5 / 100, "3151": 5 / 100, "3152": 5 / 100, "3153": 5 / 100, "3154": 5 / 100, "3155": 5 / 100,
      "3156": 5 / 100, "3157": 5 / 100, "3158": 5 / 100, "3159": 5 / 100, "3160": 5 / 100, "3161": 5 / 100,
      "3162": 5 / 100, "3163": 5 / 100, "3164": 5 / 100, "3165": 5 / 100, "3166": 5 / 100, "3167": 5 / 100,
      "3168": 5 / 100, "3169": 5 / 100, "3170": 5 / 100, "3171": 5 / 100, "3172": 5 / 100, "3173": 5 / 100,
      "3174": 5 / 100, "3175": 5 / 100, "3176": 5 / 100, "3177": 5 / 100, "3178": 5 / 100, "3179": 5 / 100,
      "3180": 5 / 100, "3181": 5 / 100, "3182": 5 / 100, "3183": 5 / 100, "3184": 5 / 100, "3185": 5 / 100,
      "3186": 5 / 100, "3187": 5 / 100, "3188": 5 / 100, "3189": 5 / 100, "3190": 5 / 100, "3191": 5 / 100,
      "3192": 5 / 100, "3193": 5 / 100, "3194": 5 / 100, "3195": 5 / 100, "3196": 5 / 100, "3197": 5 / 100,
      "3198": 5 / 100, "3199": 5 / 100, "3200": 5 / 100, "3201": 5 / 100, "3202": 5 / 100, "3203": 5 / 100,
      "3204": 5 / 100, "3205": 5 / 100, "3206": 5 / 100, "3207": 5 / 100, "3208": 5 / 100, "3209": 5 / 100,
      "3210": 5 / 100, "3211": 5 / 100, "3212": 5 / 100, "3213": 5 / 100, "3214": 5 / 100, "3215": 5 / 100,
      "3216": 5 / 100, "3217": 5 / 100, "3218": 5 / 100, "3219": 5 / 100, "3220": 5 / 100, "3221": 5 / 100,
      "3222": 5 / 100, "3223": 5 / 100, "3224": 5 / 100, "3225": 5 / 100, "3226": 5 / 100, "3227": 5 / 100,
      "3228": 5 / 100, "3229": 5 / 100, "3230": 5 / 100, "3231": 5 / 100, "3232": 5 / 100, "3233": 5 / 100,
      "3234": 5 / 100, "3235": 5 / 100, "3236": 5 / 100, "3237": 5 / 100, "3238": 5 / 100, "3239": 5 / 100,
      "3240": 5 / 100, "3241": 5 / 100, "3242": 5 / 100, "3243": 5 / 100, "3244": 5 / 100, "3245": 5 / 100,
      "3246": 5 / 100, "3247": 5 / 100, "3248": 5 / 100, "3249": 5 / 100, "3250": 5 / 100, "3251": 5 / 100,
      "3252": 5 / 100, "3253": 5 / 100, "3254": 5 / 100, "3255": 5 / 100, "3256": 5 / 100, "3257": 5 / 100,
      "3258": 5 / 100, "3259": 5 / 100, "3260": 5 / 100, "3261": 5 / 100, "3262": 5 / 100, "3263": 5 / 100,
      "3264": 5 / 100, "3265": 5 / 100, "3266": 5 / 100, "3267": 5 / 100, "3268": 5 / 100, "3269": 5 / 100,
      "3270": 5 / 100, "3271": 5 / 100, "3272": 5 / 100, "3273": 5 / 100, "3274": 5 / 100, "3275": 5 / 100,
      "3276": 5 / 100, "3277": 5 / 100, "3278": 5 / 100, "3279": 5 / 100, "3280": 5 / 100, "3281": 5 / 100,
      "3282": 5 / 100, "3283": 5 / 100, "3284": 5 / 100, "3285": 5 / 100, "3286": 5 / 100, "3287": 5 / 100,
      "3288": 5 / 100, "3289": 5 / 100, "3290": 5 / 100, "3291": 5 / 100, "3292": 5 / 100, "3293": 5 / 100,
      "3294": 5 / 100, "3295": 5 / 100, "3296": 5 / 100, "3297": 5 / 100, "3298": 5 / 100, "3299": 5 / 100,
      "3300": 5 / 100, "3301": 5 / 100, "3302": 5 / 100, "3303": 5 / 100, "3304": 5 / 100, "3305": 5 / 100,
      "3306": 5 / 100, "3307": 5 / 100, "3308": 5 / 100, "3309": 5 / 100, "3310": 5 / 100, "3311": 5 / 100,
      "3312": 5 / 100, "3313": 5 / 100, "3314": 5 / 100, "3315": 5 / 100, "3316": 5 / 100, "3317": 5 / 100,
      "3318": 5 / 100, "3319": 5 / 100, "3320": 5 / 100, "3321": 5 / 100, "3322": 5 / 100, "3323": 5 / 100,
      "3324": 5 / 100, "3325": 5 / 100, "3326": 5 / 100, "3327": 5 / 100, "3328": 5 / 100, "3329": 5 / 100,
      "3330": 5 / 100, "3331": 5 / 100, "3332": 5 / 100, "3333": 5 / 100, "3334": 5 / 100, "3335": 5 / 100,
      "3336": 5 / 100, "3337": 5 / 100, "3338": 5 / 100, "3339": 5 / 100, "3340": 5 / 100, "3341": 5 / 100,
      "3342": 5 / 100, "3343": 5 / 100, "3344": 5 / 100, "3345": 5 / 100, "3346": 5 / 100, "3347": 5 / 100,
      "3348": 5 / 100, "3349": 5 / 100, "3350": 5 / 100, "4511": 5 / 100,
      //hotels
      "3501": 5 / 100, "3502": 5 / 100, "3503": 5 / 100, "3504": 5 / 100, "3505": 5 / 100,
      "3506": 5 / 100, "3507": 5 / 100, "3508": 5 / 100, "3509": 5 / 100, "3510": 5 / 100, "3511": 5 / 100,
      "3512": 5 / 100, "3513": 5 / 100, "3514": 5 / 100, "3515": 5 / 100, "3516": 5 / 100, "3517": 5 / 100,
      "3518": 5 / 100, "3519": 5 / 100, "3520": 5 / 100, "3521": 5 / 100, "3522": 5 / 100, "3523": 5 / 100,
      "3524": 5 / 100, "3525": 5 / 100, "3526": 5 / 100, "3527": 5 / 100, "3528": 5 / 100, "3529": 5 / 100,
      "3530": 5 / 100, "3531": 5 / 100, "3532": 5 / 100, "3533": 5 / 100, "3534": 5 / 100, "3535": 5 / 100,
      "3536": 5 / 100, "3537": 5 / 100, "3538": 5 / 100, "3539": 5 / 100, "3540": 5 / 100, "3541": 5 / 100,
      "3542": 5 / 100, "3543": 5 / 100, "3544": 5 / 100, "3545": 5 / 100, "3546": 5 / 100, "3547": 5 / 100,
      "3548": 5 / 100, "3549": 5 / 100, "3550": 5 / 100, "3551": 5 / 100, "3552": 5 / 100, "3553": 5 / 100,
      "3554": 5 / 100, "3555": 5 / 100, "3556": 5 / 100, "3557": 5 / 100, "3558": 5 / 100, "3559": 5 / 100,
      "3560": 5 / 100, "3561": 5 / 100, "3562": 5 / 100, "3563": 5 / 100, "3564": 5 / 100, "3565": 5 / 100,
      "3566": 5 / 100, "3567": 5 / 100, "3568": 5 / 100, "3569": 5 / 100, "3570": 5 / 100, "3571": 5 / 100,
      "3572": 5 / 100, "3573": 5 / 100, "3574": 5 / 100, "3575": 5 / 100, "3576": 5 / 100, "3577": 5 / 100,
      "3578": 5 / 100, "3579": 5 / 100, "3580": 5 / 100, "3581": 5 / 100, "3582": 5 / 100, "3583": 5 / 100,
      "3584": 5 / 100, "3585": 5 / 100, "3586": 5 / 100, "3587": 5 / 100, "3588": 5 / 100, "3589": 5 / 100,
      "3590": 5 / 100, "3591": 5 / 100, "3592": 5 / 100, "3593": 5 / 100, "3594": 5 / 100, "3595": 5 / 100,
      "3596": 5 / 100, "3597": 5 / 100, "3598": 5 / 100, "3599": 5 / 100, "3600": 5 / 100, "3601": 5 / 100,
      "3602": 5 / 100, "3603": 5 / 100, "3604": 5 / 100, "3605": 5 / 100, "3606": 5 / 100, "3607": 5 / 100,
      "3608": 5 / 100, "3609": 5 / 100, "3610": 5 / 100, "3611": 5 / 100, "3612": 5 / 100, "3613": 5 / 100,
      "3614": 5 / 100, "3615": 5 / 100, "3616": 5 / 100, "3617": 5 / 100, "3618": 5 / 100, "3619": 5 / 100,
      "3620": 5 / 100, "3621": 5 / 100, "3622": 5 / 100, "3623": 5 / 100, "3624": 5 / 100, "3625": 5 / 100,
      "3626": 5 / 100, "3627": 5 / 100, "3628": 5 / 100, "3629": 5 / 100, "3630": 5 / 100, "3631": 5 / 100,
      "3632": 5 / 100, "3633": 5 / 100, "3634": 5 / 100, "3635": 5 / 100, "3636": 5 / 100, "3637": 5 / 100,
      "3638": 5 / 100,
      "7011": 5 / 100,
      "6300": 0, "6381": 0, "5960": 0, "6012": 0, "6051": 0, // Insurance
      "6513": 0, // Rent
      "6540": 0, // Wallet
      "9222": 0, "9311": 0, "9399": 0, "9402": 0, // Government services
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utilities
      "5094": 0, "5944": 0, // Gold/Jewellery
      "5541": 0, "5542": 0, "5983": 0 // Fuel
    },
    capping: {
      categories: {
        "Travel": { points: 10000, maxSpent: 200000 }
      }
    },
    redemptionRate: {
      airMiles: 2, // 1 Reward Point = 2 Air mile
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Atlas.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (axisCardRewards.Atlas.mccRates[mcc]) {
        rate = axisCardRewards.Atlas.travelRate;
        category = "Travel";
        rateType = "travel";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      if (category === "Travel") {
        const capThreshold = axisCardRewards.Atlas.travelCapThreshold;
        if (amount > capThreshold) {
          const pointsBelowCap = Math.floor(capThreshold * rate);
          const pointsAboveCap = Math.floor((amount - capThreshold) * axisCardRewards.Atlas.travelRateAboveCap);
          points = pointsBelowCap + pointsAboveCap;
        }
        points = Math.min(points, axisCardRewards.Atlas.capping.categories.Travel.points);
      }

      const cashbackValue = {
        airMiles: points * axisCardRewards.Atlas.redemptionRate.airMiles
      };
      const rewardText = `${points} Atlas Points (${category}) - Worth ₹${cashbackValue.airMiles}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Atlas.cardType };
    },
    dynamicInputs: () => []
  },
  "Aura": {
    cardType: "points",
    defaultRate: 2 / 200, // 2 edge points per ₹200
    specialRate: 5 / 200, // 5 edge points per ₹200 on insurance spends
    mccRates: {
      "6300": 5 / 200, // 5X EDGE REWARDS on insurance spends
    },
    capping: {
      categories: {
        "Insurance": { points: 250, maxSpent: 10000 }, // 5X points, max ₹10,000 spent
      }
    },
    redemptionRate: {
      cashValue: 0.20
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Aura.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && axisCardRewards.Aura.mccRates[mcc]) {
        rate = axisCardRewards.Aura.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Insurance";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      if (category === "Insurance") {
        const cap = axisCardRewards.Aura.capping.categories.Insurance;
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * axisCardRewards.Aura.redemptionRate.cashValue
      };
      const rewardText = `${points} EDGE REWARDS Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Aura.cardType };
    },
    dynamicInputs: () => []
  },
  "Vistara": {
    cardType: "miles",
    defaultRate: 2 / 200, // 2 CV Points for every Rs 200 of eligible spends
    mccRates: {
      // Excluded categories
      "6513": 0, // Rental Payments
      "6540": 0, // Wallet Load Transactions
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utility Services
      "9222": 0, "9311": 0, "9399": 0, "9402": 0, // Government Services
      "5960": 0, "6012": 0, "6051": 0, "6300": 0, "6381": 0, // Insurance Services
      "5094": 0, "5944": 0, // Precious Stones & Metals, Clock, Jewellery, Watch and Silverware Stores
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Vistara.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && axisCardRewards.Vistara.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.Vistara.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const miles = Math.floor(amount * rate);
      const rewardText = `${miles} Club Vistara Points (${category})`;

      return { miles, rate, rateType, category, rewardText, cardType: axisCardRewards.Vistara.cardType };
    },
    dynamicInputs: () => []
  },
  "Vistara Infinite": {
    cardType: "miles",
    defaultRate: 6 / 200, // 6 CV Points for every Rs. 200 of eligible spends
    mccRates: {
      // Excluded categories
      "6513": 0, // Rental Payments
      "6540": 0, // Wallet Load Transactions
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utility Services
      "9222": 0, "9311": 0, "9399": 0, "9402": 0, // Government Services
      "5960": 0, "6012": 0, "6051": 0, "6300": 0, "6381": 0, // Insurance Services
      "5094": 0, "5944": 0, // Precious Stones & Metals, Clock, Jewellery, Watch and Silverware Stores
      "5541": 0, "5542": 0, // Fuel transactions
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards["Vistara Infinite"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && axisCardRewards["Vistara Infinite"].mccRates[mcc] !== undefined) {
        rate = axisCardRewards["Vistara Infinite"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const miles = Math.floor(amount * rate);
      const rewardText = `${miles} Club Vistara Points (${category})`;

      return { miles, rate, rateType, category, rewardText, cardType: axisCardRewards["Vistara Infinite"].cardType };
    },
    dynamicInputs: () => []
  },
  "Vistara Signature": {
    cardType: "miles",
    defaultRate: 4 / 200, // 4 CV Points for every Rs. 200 of eligible spends
    mccRates: {
      // Excluded categories (same as Vistara card)
      "6513": 0, // Rental Payments
      "6540": 0, // Wallet Load Transactions
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utility Services
      "9222": 0, "9311": 0, "9399": 0, "9402": 0, // Government Services
      "5960": 0, "6012": 0, "6051": 0, "6300": 0, "6381": 0, // Insurance Services
      "5094": 0, "5944": 0, // Precious Stones & Metals, Clock, Jewellery, Watch and Silverware Stores
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards["Vistara Signature"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc && axisCardRewards["Vistara Signature"].mccRates[mcc] !== undefined) {
        rate = axisCardRewards["Vistara Signature"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const miles = Math.floor(amount * rate);
      const rewardText = `${miles} Club Vistara Points (${category})`;

      return { miles, rate, rateType, category, rewardText, cardType: axisCardRewards["Vistara Signature"].cardType };
    },
    dynamicInputs: () => []
  },
  "Flipkart": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% cashback
    mccRates: {
      // Flipkart and Cleartrip (assuming e-commerce MCC)
      "5399": 5 / 100, // 5% cashback for general e-commerce
      "4722": 5 / 100, // 5% cashback for travel agencies (Cleartrip)

      // Preferred Merchants (examples, adjust as needed)
      "5812": 4 / 100, "5814": 4 / 100, // 4% cashback for restaurants (e.g., Swiggy)
      "7832": 4 / 100, // 4% cashback for movie theaters (e.g., PVR)
      "4121": 4 / 100, // 4% cashback for taxicabs/limousines (e.g., Uber)
      "7997": 4 / 100, // 4% cashback for gyms/fitness centers (e.g., Cultfit)
    },
    capping: {
      categories: {
        "Travel": { cashback: 5000, maxSpent: 100000 }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Flipkart.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isSwiggyApp) {
        rate = axisCardRewards.Flipkart.swiggyAppRate;
        category = "Swiggy App";
        rateType = "swiggy-app";
      } else if (axisCardRewards.Flipkart.mccRates[mcc]) {
        rate = axisCardRewards.Flipkart.mccRates[mcc];
        rateType = "mcc-specific";
        category = mcc === "4722" ? "Travel" : "Fast Food Restaurants";
      }

      let cashback = amount * rate;

      // Apply capping for travel category
      if (category === "Travel" && axisCardRewards.Flipkart.capping.categories.Travel) {
        const cap = axisCardRewards.Flipkart.capping.categories.Travel;
        cashback = Math.min(cashback, cap.cashback);
      }

      const rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;

      return { cashback, rate, rateType, category, rewardText, cardType: axisCardRewards.Flipkart.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Swiggy app transaction?',
        name: 'isSwiggyApp',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSwiggyApp || false,
        onChange: (value) => onChange('isSwiggyApp', value === 'true')
      }
    ]
  },
  "Flipkart Super Elite": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 SuperCoins per ₹100 on all other spends
    mccRates: {
      "5399": 6 / 100 // 6 SuperCoins per ₹100 for Flipkart purchases (non-Plus members)
    },
    flipkartPlusRate: {
      "5399": 12 / 100 // 12 SuperCoins per ₹100 for Flipkart purchases (Plus members)
    },
    redemptionRate: {
      cashValue: 1 // 1 SuperCoin = ₹1
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards["Flipkart Super Elite"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc === "5399") {
        if (additionalParams.isFlipkartPlusMember) {
          rate = axisCardRewards["Flipkart Super Elite"].flipkartPlusRate["5399"];
          category = "Flipkart Plus Purchase";
          rateType = "flipkart-plus";
        } else {
          rate = axisCardRewards["Flipkart Super Elite"].mccRates["5399"];
          category = "Flipkart Purchase";
          rateType = "flipkart-regular";
        }
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * axisCardRewards["Flipkart Super Elite"].redemptionRate.cashValue
      };
      const rewardText = `${points} SuperCoins (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards["Flipkart Super Elite"].cardType };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      const isFlipkart = selectedMcc
        ? mccList.find(item => item.mcc === selectedMcc)?.name.toLowerCase().includes('flipkart')
        : false;

      if (isFlipkart) {
        return [
          {
            type: 'radio',
            label: 'Are you a Flipkart Plus member?',
            name: 'isFlipkartPlusMember',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isFlipkartPlusMember || false,
            onChange: (value) => onChange('isFlipkartPlusMember', value === 'true')
          }
        ];
      }
      return [];
    }
  },
  "Indian Oil": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 reward point per ₹100
    mccRates: {
      "5541": 20 / 100, // 20 reward points per ₹100 at IOCL fuel outlets
      "5542": 20 / 100,
      "5983": 20 / 100,
    },
    acceleratedRewards: {
      onlineShopping: {
        rate: 5 / 100, // 5 reward points per ₹100
        maxSpend: 5000,
      },
    },
    capping: {
      categories: {
        "Fuel": { points: 1000, maxSpent: 5000 }, // 20 points per 100, max 5000 spent
        "OnlineShopping": { points: 250, maxSpent: 5000 }, // 5 points per 100, max 5000 spent
      }
    },
    redemptionRate: {
      cashValue: 0.25  // 1 point = ₹0.25
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards["Indian Oil"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (["5541", "5542", "5983"].includes(mcc)) {
        rate = axisCardRewards["Indian Oil"].mccRates[mcc];
        rateType = "mcc-specific";
        category = "Fuel";
      } else if (additionalParams.isOnlineShopping) {
        rate = axisCardRewards["Indian Oil"].acceleratedRewards.onlineShopping.rate;
        rateType = "accelerated";
        category = "OnlineShopping";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      if (axisCardRewards["Indian Oil"].capping.categories[category]) {
        const cap = axisCardRewards["Indian Oil"].capping.categories[category];
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * axisCardRewards["Indian Oil"].redemptionRate.cashValue
      };
      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards["Indian Oil"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an online shopping transaction?',
        name: 'isOnlineShopping',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isOnlineShopping || false,
        onChange: (value) => onChange('isOnlineShopping', value === 'true')
      }
    ]
  },
  //TODO: Fix airMiles calculation
  "Indian Oil Premium": {
    cardType: "points",
    defaultRate: 1 / 150, // 1 EDGE MILE per ₹150
    mccRates: {
      "5541": 6 / 150, // 6 EDGE MILES per ₹150 at IOCL fuel outlets
      "5542": 6 / 150,
      "5983": 6 / 150,
      "5411": 2 / 150, // 2 EDGE MILES per ₹150 for Grocery & Supermarket
    },
    capping: {
      categories: {
        "Fuel": { points: 600, maxSpent: 15000 }, // 6 EDGE MILES per 150, max 15000 spent
        "Grocery": { points: 33, maxSpent: 5000 }, // 2 EDGE MILES per 150, max 5000 spent
      }
    },
    redemptionRate: {
      airMiles: 0.50, // 1 EDGE MILE = 0.50 Air Mile
      cashValue: 0.20  // Assuming 1 EDGE MILE = ₹0.20
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards["Indian Oil Premium"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (axisCardRewards["Indian Oil Premium"].mccRates[mcc]) {
        rate = axisCardRewards["Indian Oil Premium"].mccRates[mcc];
        rateType = "mcc-specific";
        category = ["5541", "5542", "5983"].includes(mcc) ? "Fuel" : "Grocery";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      if (axisCardRewards["Indian Oil Premium"].capping.categories[category]) {
        const cap = axisCardRewards["Indian Oil Premium"].capping.categories[category];
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * axisCardRewards["Indian Oil Premium"].redemptionRate.cashValue
      };
      const rewardText = `${points} EDGE MILES (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards["Indian Oil Premium"].cardType };
    },
    dynamicInputs: () => []
  },
  //TODO: Fix airMiles calculation
  "Magnus": {
    cardType: "points",
    defaultRate: 12 / 200, // 12 EDGE Reward Points for every INR 200
    mccRates: {
      // Excluded categories
      "6540": 0, "9222": 0, "9311": 0, "9399": 0, "9402": 0, // Wallet and Government
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utilities
      "6300": 0, "6381": 0, "5960": 0, "6051": 0, "6012": 0, // Insurance
      "5541": 0, "5542": 0, "5983": 0, // Fuel
      "5094": 0, "5944": 0, // Gold & Jewellery
      "6513": 12 / 200, // Rent MCC, same as default rate
    },
    acceleratedRewards: {
      regularSpend: {
        tier1: {
          rate: 12 / 200,
          threshold: 150000
        },
        tier2: {
          rate: 35 / 200
        }
      },
      travelEdgePortal: {
        tier1: {
          rate: 60 / 200,
          threshold: 200000
        },
        tier2: {
          rate: 35 / 200
        }
      }
    },
    capping: {
      categories: {
        "Rent": { points: 3000, maxSpent: 50000 }, // 12 points per 200, max 50000 spent
      }
    },
    redemptionRate: {
      airMiles: 0.40, // 1 EDGE Reward Point = 0.40 Air Mile
      cashValue: 0.20  // 1 point = ₹0.20
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Magnus.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isTravelEdgePortal) {
        const travelEdgeRewards = axisCardRewards.Magnus.acceleratedRewards.travelEdgePortal;
        rate = additionalParams.annualSpend <= travelEdgeRewards.tier1.threshold ? travelEdgeRewards.tier1.rate : travelEdgeRewards.tier2.rate;
        rateType = "travel-edge";
        category = "Travel Edge Portal";
      } else if (additionalParams.annualSpend) {
        const regularRewards = axisCardRewards.Magnus.acceleratedRewards.regularSpend;
        rate = additionalParams.annualSpend <= regularRewards.tier1.threshold ? regularRewards.tier1.rate : regularRewards.tier2.rate;
        rateType = additionalParams.annualSpend > regularRewards.tier1.threshold ? "accelerated" : "default";
      }

      if (mcc && axisCardRewards.Magnus.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.Magnus.mccRates[mcc];
        rateType = "mcc-specific";
        category = mcc === "6513" ? "Rent" : (rate === 0 ? "Excluded Category" : "Category Spend");
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      if (category === "Rent" && axisCardRewards.Magnus.capping.categories.Rent) {
        const cap = axisCardRewards.Magnus.capping.categories.Rent;
        points = Math.min(points, cap.points, Math.floor(cap.maxSpent * rate));
      }

      const cashbackValue = {
        cashValue: points * axisCardRewards.Magnus.redemptionRate.cashValue,
        airMiles: points * axisCardRewards.Magnus.redemptionRate.airMiles
      };

      const rewardText = `${points} EDGE Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)} or ${cashbackValue.airMiles.toFixed(2)} Air Miles`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Magnus.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Travel Edge Portal transaction?',
        name: 'isTravelEdgePortal',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTravelEdgePortal || false,
        onChange: (value) => onChange('isTravelEdgePortal', value === 'true')
      },
      {
        type: 'radio',
        label: 'Annual spend so far',
        name: 'annualSpend',
        options: [
          { label: 'Up to ₹150,000', value: 0 },
          { label: '₹150,001 - ₹200,000', value: 150000 },
          { label: 'Above ₹200,000', value: 200000 }
        ],
        value: currentInputs.annualSpend || 0,
        onChange: (value) => onChange('annualSpend', parseInt(value))
      }
    ]
  },
  "MyZone": {
    cardType: "points",
    defaultRate: 4 / 200,
    mccRates: {},
    redemptionRate: {
      cashValue: 0.20
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = axisCardRewards.MyZone.defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * axisCardRewards.MyZone.redemptionRate.cashValue
      };
      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.MyZone.cardType };
    },
    dynamicInputs: () => []
  },
  "Neo": {
    cardType: "points",
    defaultRate: 1 / 200,
    mccRates: {},
    redemptionRate: {
      cashValue: 0.20
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = axisCardRewards.Neo.defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * axisCardRewards.Neo.redemptionRate.cashValue
      };
      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Neo.cardType };
    },
    dynamicInputs: () => []
  },
  "Privilege": {
    cardType: "points",
    defaultRate: 10 / 200, // 10 points on every Rs. 200 spent
    mccRates: {
      // Excluded categories
      "6300": 0, "6381": 0, "5960": 0, "6012": 0, "6051": 0, // Insurance
      "6513": 0, // Rent
      "5541": 0, "5542": 0, "5983": 0, // Fuel
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, "8220": 0, // Educational services
      "4900": 0, "4814": 0, "4816": 0, "4899": 0, // Utilities
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0 // Government services
    },
    redemptionRate: {
      cashValue: 0.25
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Privilege.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (axisCardRewards.Privilege.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.Privilege.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * axisCardRewards.Privilege.redemptionRate.cashValue
      };
      const rewardText = `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Privilege.cardType };
    },
    dynamicInputs: () => []
  },
  //TODO: Fix airMiles calculation
  "Reserve": {
    cardType: "points",
    defaultRate: 15 / 200, // 15 edge points for every 200 spent
    internationalRate: 30 / 200, // 2x on international spends
    mccRates: {
      // Excluded categories
      "7832": 0, // Motion Picture Theaters
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utilities
      "9222": 0, "9311": 0, "9399": 0, "9402": 0, // Government Institutions
      "6300": 0, "6381": 0, "5960": 0, "6051": 0, "6012": 0, // Insurance
      "6540": 0, // Wallet
      "5094": 0, "5944": 0, // Gold/Jewellery
      "5541": 0, "5542": 0, "5983": 0, // Fuel
      "6010": 0, "6011": 0 // Cash Withdrawal
    },
    redemptionRate: {
      airMiles: 0.40,
      cashValue: 0.20   // Assuming 1 point = ₹1, adjust if different
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Reserve.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isInternational) {
        rate = axisCardRewards.Reserve.internationalRate;
        rateType = "international";
        category = "International Spends";
      } else if (axisCardRewards.Reserve.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.Reserve.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * axisCardRewards.Reserve.redemptionRate.cashValue
      };
      const rewardText = `${points} Edge Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Reserve.cardType };
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
  "Rewards": {
    cardType: "points",
    defaultRate: 2 / 125, // 2 EDGE REWARD points per ₹125
    mccRates: {
      "5311": 10 / 125, // 10X reward points on apparel and departmental stores
      "5651": 10 / 125,
      "5655": 10 / 125,
      "5699": 10 / 125,
    },
    redemptionRate: {
      cashValue: 0.20
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Rewards.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (axisCardRewards.Rewards.mccRates[mcc]) {
        rate = axisCardRewards.Rewards.mccRates[mcc];
        rateType = "mcc-specific";
        category = "Apparel and Departmental Stores";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * axisCardRewards.Rewards.redemptionRate.cashValue
      };
      const rewardText = `${points} EDGE REWARD Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Rewards.cardType };
    },
    dynamicInputs: () => []
  },

  "Select": {
    cardType: "points",
    defaultRate: 10 / 200, // 10 Axis EDGE points on every Rs. 200 spends
    retailRate: 20 / 200, // 2x points for retail spends
    acceleratedRewards: {
      tier1: {
        rate: 20 / 200, // 2X EDGE REWARD Points
        threshold: 20000 // Up to cumulative transactions of Rs.20,000 per month
      },
      tier2: {
        rate: 10 / 200 // 10 EDGE REWARD Points for transactions above Rs.20,000 per month
      }
    },
    mccRates: {
      // Retail Shopping MCCs
      "5311": 20 / 200, // Dept Stores
      "5411": 20 / 200, // Grocery stores
      "5611": 20 / 200, // Clothing and Accessory stores
      "5621": 20 / 200, // Women's wear stores
      "5641": 20 / 200, // Children's wear stores
      "5691": 20 / 200, // Family clothing stores
      "5699": 20 / 200, // Misc apparel and accessory stores

      // Excluded categories
      "6300": 0, "6381": 0, "5960": 0, "6012": 0, "6051": 0, // Insurance
      "6513": 0, // Rent
      "5541": 0, "5542": 0, "5983": 0, // Fuel
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // Educational services
      "4900": 0, "4814": 0, "4816": 0, "4899": 0, // Utilities
      "6540": 0, // Wallet
      "5094": 0, "5944": 0, // Gold/Jewellery
      "9211": 0, "9222": 0, "9223": 0, "9311": 0, "9399": 0, "9402": 0 // Government services
    },
    redemptionRate: {
      cashValue: 0.20
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Select.defaultRate;
      let category = "Other Spends";
      let rateType = "default";
  
      if (axisCardRewards.Select.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.Select.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Retail Shopping";
      } else if (additionalParams.monthlySpend !== undefined) {
        const totalSpend = additionalParams.monthlySpend + amount;
        if (totalSpend <= axisCardRewards.Select.acceleratedRewards.tier1.threshold) {
          rate = axisCardRewards.Select.acceleratedRewards.tier1.rate;
          rateType = "accelerated";
          category = "Accelerated Spend (Tier 1)";
        } else {
          rate = axisCardRewards.Select.acceleratedRewards.tier2.rate;
          rateType = "accelerated";
          category = "Accelerated Spend (Tier 2)";
        }
      }
  
      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * axisCardRewards.Select.redemptionRate.cashValue
      };
      const rewardText = `${points} EDGE REWARD Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;
  
      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Select.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Total monthly spend so far',
        name: 'monthlySpend',
        options: [
          { label: 'Up to ₹20,000', value: 0 },
          { label: '₹20,001 - ₹50,000', value: 20000 },
          { label: 'Above ₹50,000', value: 50000 }
        ],
        value: currentInputs.monthlySpend || 0,
        onChange: (value) => onChange('monthlySpend', parseInt(value))
      }
    ]
  },
  "Voyage": {
    cardType: "miles",
    defaultRate: 3 / 200, // 3 SpiceClub Points for every Rs. 200 spent on other retail spends
    // SpiceJet mobile application & website
    spicejetRate: 18 / 200, // 6 SC Points (card benefit) + 12 SC Points (SpiceClub Silver Membership)
    mccRates: {
      // Online utility bill payment, Online food ordering, Online entertainment
      "4900": 6 / 200, // Online utility bill payment
      "5499": 6 / 200, // Online food ordering
      "5812": 6 / 200, // Online food ordering
      "5814": 6 / 200, // Online food ordering
      "7829": 6 / 200, // Online entertainment
      "7832": 6 / 200, // Online entertainment

      // Excluded categories
      "6012": 0, "6051": 0, "5541": 0, "5983": 0, "5542": 0, "5944": 0, "6011": 0,
      "6540": 0, "6513": 0, "9222": 0, "9311": 0, "9399": 0, "9402": 0, "5960": 0,
      "6300": 0, "6381": 0, "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Voyage.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isSpiceJet) {
        rate = axisCardRewards.Voyage.spicejetRate;
        category = "SpiceJet Transaction";
        rateType = "spicejet";
      } else if (axisCardRewards.Voyage.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.Voyage.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const miles = Math.floor(amount * rate);
      const rewardText = `${miles} SpiceClub Points (${category})`;

      return { miles, rate, rateType, category, rewardText, cardType: axisCardRewards.Voyage.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a SpiceJet transaction?',
        name: 'isSpiceJet',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSpiceJet || false,
        onChange: (value) => onChange('isSpiceJet', value === 'true')
      }
    ]
  },


  "Voyage Black": {
    cardType: "miles",
    defaultRate: 6 / 200, // 6 SpiceClub Points for every Rs. 200 spent on other retail spends
    // SpiceJet mobile application & website
    spicejetRate: 28 / 200, // 12 SC Points (card benefit) + 16 SC Points (SpiceClub Gold Membership)
    mccRates: {
      // Online utility bill payment, Online food ordering, Online entertainment
      "4900": 12 / 200, // Online utility bill payment
      "5499": 12 / 200, // Online food ordering
      "5812": 12 / 200, // Online food ordering
      "5814": 12 / 200, // Online food ordering
      "7829": 12 / 200, // Online entertainment
      "7832": 12 / 200, // Online entertainment

      // Excluded categories
      "6012": 0, "6051": 0, "5541": 0, "5983": 0, "5542": 0, "5944": 0, "6011": 0,
      "6540": 0, "6513": 0, "9222": 0, "9311": 0, "9399": 0, "9402": 0, "5960": 0,
      "6300": 0, "6381": 0, "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards["Voyage Black"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isSpiceJet) {
        rate = axisCardRewards["Voyage Black"].spicejetRate;
        category = "SpiceJet Transaction";
        rateType = "spicejet";
      } else if (axisCardRewards["Voyage Black"].mccRates[mcc] !== undefined) {
        rate = axisCardRewards["Voyage Black"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const miles = Math.floor(amount * rate);
      const rewardText = `${miles} SpiceClub Points (${category})`;

      return { miles, rate, rateType, category, rewardText, cardType: axisCardRewards["Voyage Black"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a SpiceJet transaction?',
        name: 'isSpiceJet',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSpiceJet || false,
        onChange: (value) => onChange('isSpiceJet', value === 'true')
      }
    ]
  },
  //TODO: Fix airMiles calculation
  "Horizon": {
    cardType: "points",
    defaultRate: 2 / 100, // 2 EDGE Miles per INR 100 on all other spends
    mccRates: {
      // Excluded categories
      "4111": 0, "4121": 0, "4131": 0, "4784": 0, // Transportation & Tolls
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utilities
      "6300": 0, "6381": 0, "5960": 0, "6012": 0, "6051": 0, // Insurance
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // Educational Institutions
      "9211": 0, "9222": 0, "9311": 0, "9399": 0, "9402": 0, "9405": 0, "8220": 0, // Govt. Institutions
      "6540": 0, // Wallet
      "6513": 0, // Rent
      "5541": 0, "5542": 0, "5983": 0, "5172": 0, // Fuel

      //airlines
      "3000": 5 / 100, "3001": 5 / 100, "3002": 5 / 100, "3003": 5 / 100, "3004": 5 / 100, "3005": 5 / 100,
      "3006": 5 / 100, "3007": 5 / 100, "3008": 5 / 100, "3009": 5 / 100, "3010": 5 / 100, "3011": 5 / 100,
      "3012": 5 / 100, "3013": 5 / 100, "3014": 5 / 100, "3015": 5 / 100, "3016": 5 / 100, "3017": 5 / 100,
      "3018": 5 / 100, "3019": 5 / 100, "3020": 5 / 100, "3021": 5 / 100, "3022": 5 / 100, "3023": 5 / 100,
      "3024": 5 / 100, "3025": 5 / 100, "3026": 5 / 100, "3027": 5 / 100, "3028": 5 / 100, "3029": 5 / 100,
      "3030": 5 / 100, "3031": 5 / 100, "3032": 5 / 100, "3033": 5 / 100, "3034": 5 / 100, "3035": 5 / 100,
      "3036": 5 / 100, "3037": 5 / 100, "3038": 5 / 100, "3039": 5 / 100, "3040": 5 / 100, "3041": 5 / 100,
      "3042": 5 / 100, "3043": 5 / 100, "3044": 5 / 100, "3045": 5 / 100, "3046": 5 / 100, "3047": 5 / 100,
      "3048": 5 / 100, "3049": 5 / 100, "3050": 5 / 100, "3051": 5 / 100, "3052": 5 / 100, "3053": 5 / 100,
      "3054": 5 / 100, "3055": 5 / 100, "3056": 5 / 100, "3057": 5 / 100, "3058": 5 / 100, "3059": 5 / 100,
      "3060": 5 / 100, "3061": 5 / 100, "3062": 5 / 100, "3063": 5 / 100, "3064": 5 / 100, "3065": 5 / 100,
      "3066": 5 / 100, "3067": 5 / 100, "3068": 5 / 100, "3069": 5 / 100, "3070": 5 / 100, "3071": 5 / 100,
      "3072": 5 / 100, "3073": 5 / 100, "3074": 5 / 100, "3075": 5 / 100, "3076": 5 / 100, "3077": 5 / 100,
      "3078": 5 / 100, "3079": 5 / 100, "3080": 5 / 100, "3081": 5 / 100, "3082": 5 / 100, "3083": 5 / 100,
      "3084": 5 / 100, "3085": 5 / 100, "3086": 5 / 100, "3087": 5 / 100, "3088": 5 / 100, "3089": 5 / 100,
      "3090": 5 / 100, "3091": 5 / 100, "3092": 5 / 100, "3093": 5 / 100, "3094": 5 / 100, "3095": 5 / 100,
      "3096": 5 / 100, "3097": 5 / 100, "3098": 5 / 100, "3099": 5 / 100, "3100": 5 / 100, "3101": 5 / 100,
      "3102": 5 / 100, "3103": 5 / 100, "3104": 5 / 100, "3105": 5 / 100, "3106": 5 / 100, "3107": 5 / 100,
      "3108": 5 / 100, "3109": 5 / 100, "3110": 5 / 100, "3111": 5 / 100, "3112": 5 / 100, "3113": 5 / 100,
      "3114": 5 / 100, "3115": 5 / 100, "3116": 5 / 100, "3117": 5 / 100, "3118": 5 / 100, "3119": 5 / 100,
      "3120": 5 / 100, "3121": 5 / 100, "3122": 5 / 100, "3123": 5 / 100, "3124": 5 / 100, "3125": 5 / 100,
      "3126": 5 / 100, "3127": 5 / 100, "3128": 5 / 100, "3129": 5 / 100, "3130": 5 / 100, "3131": 5 / 100,
      "3132": 5 / 100, "3133": 5 / 100, "3134": 5 / 100, "3135": 5 / 100, "3136": 5 / 100, "3137": 5 / 100,
      "3138": 5 / 100, "3139": 5 / 100, "3140": 5 / 100, "3141": 5 / 100, "3142": 5 / 100, "3143": 5 / 100,
      "3144": 5 / 100, "3145": 5 / 100, "3146": 5 / 100, "3147": 5 / 100, "3148": 5 / 100, "3149": 5 / 100,
      "3150": 5 / 100, "3151": 5 / 100, "3152": 5 / 100, "3153": 5 / 100, "3154": 5 / 100, "3155": 5 / 100,
      "3156": 5 / 100, "3157": 5 / 100, "3158": 5 / 100, "3159": 5 / 100, "3160": 5 / 100, "3161": 5 / 100,
      "3162": 5 / 100, "3163": 5 / 100, "3164": 5 / 100, "3165": 5 / 100, "3166": 5 / 100, "3167": 5 / 100,
      "3168": 5 / 100, "3169": 5 / 100, "3170": 5 / 100, "3171": 5 / 100, "3172": 5 / 100, "3173": 5 / 100,
      "3174": 5 / 100, "3175": 5 / 100, "3176": 5 / 100, "3177": 5 / 100, "3178": 5 / 100, "3179": 5 / 100,
      "3180": 5 / 100, "3181": 5 / 100, "3182": 5 / 100, "3183": 5 / 100, "3184": 5 / 100, "3185": 5 / 100,
      "3186": 5 / 100, "3187": 5 / 100, "3188": 5 / 100, "3189": 5 / 100, "3190": 5 / 100, "3191": 5 / 100,
      "3192": 5 / 100, "3193": 5 / 100, "3194": 5 / 100, "3195": 5 / 100, "3196": 5 / 100, "3197": 5 / 100,
      "3198": 5 / 100, "3199": 5 / 100, "3200": 5 / 100, "3201": 5 / 100, "3202": 5 / 100, "3203": 5 / 100,
      "3204": 5 / 100, "3205": 5 / 100, "3206": 5 / 100, "3207": 5 / 100, "3208": 5 / 100, "3209": 5 / 100,
      "3210": 5 / 100, "3211": 5 / 100, "3212": 5 / 100, "3213": 5 / 100, "3214": 5 / 100, "3215": 5 / 100,
      "3216": 5 / 100, "3217": 5 / 100, "3218": 5 / 100, "3219": 5 / 100, "3220": 5 / 100, "3221": 5 / 100,
      "3222": 5 / 100, "3223": 5 / 100, "3224": 5 / 100, "3225": 5 / 100, "3226": 5 / 100, "3227": 5 / 100,
      "3228": 5 / 100, "3229": 5 / 100, "3230": 5 / 100, "3231": 5 / 100, "3232": 5 / 100, "3233": 5 / 100,
      "3234": 5 / 100, "3235": 5 / 100, "3236": 5 / 100, "3237": 5 / 100, "3238": 5 / 100, "3239": 5 / 100,
      "3240": 5 / 100, "3241": 5 / 100, "3242": 5 / 100, "3243": 5 / 100, "3244": 5 / 100, "3245": 5 / 100,
      "3246": 5 / 100, "3247": 5 / 100, "3248": 5 / 100, "3249": 5 / 100, "3250": 5 / 100, "3251": 5 / 100,
      "3252": 5 / 100, "3253": 5 / 100, "3254": 5 / 100, "3255": 5 / 100, "3256": 5 / 100, "3257": 5 / 100,
      "3258": 5 / 100, "3259": 5 / 100, "3260": 5 / 100, "3261": 5 / 100, "3262": 5 / 100, "3263": 5 / 100,
      "3264": 5 / 100, "3265": 5 / 100, "3266": 5 / 100, "3267": 5 / 100, "3268": 5 / 100, "3269": 5 / 100,
      "3270": 5 / 100, "3271": 5 / 100, "3272": 5 / 100, "3273": 5 / 100, "3274": 5 / 100, "3275": 5 / 100,
      "3276": 5 / 100, "3277": 5 / 100, "3278": 5 / 100, "3279": 5 / 100, "3280": 5 / 100, "3281": 5 / 100,
      "3282": 5 / 100, "3283": 5 / 100, "3284": 5 / 100, "3285": 5 / 100, "3286": 5 / 100, "3287": 5 / 100,
      "3288": 5 / 100, "3289": 5 / 100, "3290": 5 / 100, "3291": 5 / 100, "3292": 5 / 100, "3293": 5 / 100,
      "3294": 5 / 100, "3295": 5 / 100, "3296": 5 / 100, "3297": 5 / 100, "3298": 5 / 100, "3299": 5 / 100,
      "3300": 5 / 100, "3301": 5 / 100, "3302": 5 / 100, "3303": 5 / 100, "3304": 5 / 100, "3305": 5 / 100,
      "3306": 5 / 100, "3307": 5 / 100, "3308": 5 / 100, "3309": 5 / 100, "3310": 5 / 100, "3311": 5 / 100,
      "3312": 5 / 100, "3313": 5 / 100, "3314": 5 / 100, "3315": 5 / 100, "3316": 5 / 100, "3317": 5 / 100,
      "3318": 5 / 100, "3319": 5 / 100, "3320": 5 / 100, "3321": 5 / 100, "3322": 5 / 100, "3323": 5 / 100,
      "3324": 5 / 100, "3325": 5 / 100, "3326": 5 / 100, "3327": 5 / 100, "3328": 5 / 100, "3329": 5 / 100,
      "3330": 5 / 100, "3331": 5 / 100, "3332": 5 / 100, "3333": 5 / 100, "3334": 5 / 100, "3335": 5 / 100,
      "3336": 5 / 100, "3337": 5 / 100, "3338": 5 / 100, "3339": 5 / 100, "3340": 5 / 100, "3341": 5 / 100,
      "3342": 5 / 100, "3343": 5 / 100, "3344": 5 / 100, "3345": 5 / 100, "3346": 5 / 100, "3347": 5 / 100,
      "3348": 5 / 100, "3349": 5 / 100, "3350": 5 / 100, "4511": 5 / 100
    },
    acceleratedRewards: {
      regularSpend: {
        tier1: {
          rate: 2 / 100,
          threshold: 150000
        },
        tier2: {
          rate: 3 / 100
        }
      },
      travelEdgePortal: {
        tier1: {
          rate: 5 / 100,
          threshold: 200000
        },
        tier2: {
          rate: 3 / 100
        }
      }
    },
    redemptionRate: {
      airMiles: 1
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Horizon.defaultRate;
      let category = "Other Spends";
      let rateType = "default";
    
      if (additionalParams.isTravelEdgePortal) {
        const travelEdgeRewards = axisCardRewards.Horizon.acceleratedRewards.travelEdgePortal;
        rate = additionalParams.monthlySpend <= travelEdgeRewards.tier1.threshold ? travelEdgeRewards.tier1.rate : travelEdgeRewards.tier2.rate;
        rateType = "travel-edge";
        category = "Travel Edge Portal";
      } else if (additionalParams.monthlySpend > axisCardRewards.Horizon.acceleratedRewards.regularSpend.tier1.threshold) {
        rate = axisCardRewards.Horizon.acceleratedRewards.regularSpend.tier2.rate;
        rateType = "accelerated";
        category = "Accelerated Spend";
      } else if (axisCardRewards.Horizon.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.Horizon.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Travel";
      }
    
      const points = Math.floor(amount * rate);
      const cashbackValue = {
        airMiles: points * axisCardRewards.Horizon.redemptionRate.airMiles
      };
      const rewardText = `${points} EDGE Miles (${category}) - Worth ${cashbackValue.airMiles.toFixed(2)} Air Miles`;
    
      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Horizon.cardType };
    },
    
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Travel Edge Portal transaction?',
        name: 'isTravelEdgePortal',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isTravelEdgePortal || false,
        onChange: (value) => onChange('isTravelEdgePortal', value === 'true')
      },
      {
        type: 'radio',
        label: 'Monthly spend so far',
        name: 'monthlySpend',
        options: [
          { label: 'Up to ₹150,000', value: 0 },
          { label: '₹150,001 - ₹200,000', value: 150000 },
          { label: 'Above ₹200,000', value: 200000 }
        ],
        value: currentInputs.monthlySpend || 0,
        onChange: (value) => onChange('monthlySpend', parseInt(value))
      }
    ]
  },
  //TODO: Fix Return points or cashback not both
  "Samsung Signature": {
    cardType: "hybrid",
    defaultRate: 5 / 100, // 5 reward points on all domestic & international spends per INR 100 spent
    samsungRate: 10 / 100, // 10% cashback on Samsung purchases
    mccRates: {
      // Preferred merchants
      "5812": 10 / 100, // Eating Places and Restaurants (for Zomato)
      "5411": 10 / 100, // Grocery Stores and Supermarkets (for BigBasket)
      "5651": 10 / 100, // Family Clothing Stores (for Myntra)
      "5912": 10 / 100, // Drug Stores and Pharmacies (for Tata1mg)
      "7299": 10 / 100, // Miscellaneous Personal Services (for Urban Clap)

      // Excluded MCCs
      "6012": 0, "6051": 0, "5541": 0, "5983": 0, "5542": 0, "5944": 0, "6011": 0, "6540": 0, "6513": 0
    },
    capping: {
      samsung: { maxCashback: 2500, period: "monthly" }
    },
    redemptionRate: {
      cashValue: 0.20
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards["Samsung Signature"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let cashback = 0;
      let points = 0;

      if (additionalParams.isSamsungTransaction) {
        rate = axisCardRewards["Samsung Signature"].samsungRate;
        category = "Samsung Purchase";
        rateType = "samsung";
        cashback = Math.min(amount * rate, axisCardRewards["Samsung Signature"].capping.samsung.maxCashback);
      } else if (axisCardRewards["Samsung Signature"].mccRates[mcc] !== undefined) {
        rate = axisCardRewards["Samsung Signature"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Preferred Merchant";
        points = Math.floor(amount * rate);
      } else {
        points = Math.floor(amount * rate);
      }

      const cashbackValue = cashback > 0 ? null : {
        cashValue: points * axisCardRewards["Samsung Signature"].redemptionRate.cashValue
      };

      const rewardText = cashback > 0
        ? `₹${cashback.toFixed(2)} Cashback (${category})`
        : `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, cashback, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards["Samsung Signature"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Samsung purchase?',
        name: 'isSamsungTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isSamsungTransaction || false,
        onChange: (value) => onChange('isSamsungTransaction', value === 'true')
      }
    ]
  },
  //TODO: Fix Return points or cashback not both
  "Samsung Infinite": {
    cardType: "hybrid",
    defaultRate: 5 / 100, // 5 EDGE REWARD POINTS on every Rs. 100 spent on all other domestic transactions
    internationalRate: 15 / 100, // 15 EDGE REWARD POINTS on every Rs 100 spent on all international transactions
    samsungRate: 10 / 100, // 10% cashback on Samsung purchases
    mccRates: {
      // Preferred partners
      "5411": 15 / 100, // Grocery Stores and Supermarkets (for BigBasket)
      "5912": 15 / 100, // Drug Stores and Pharmacies (for Tata1mg)
      "7299": 15 / 100, // Miscellaneous Personal Services (for UrbanCompany)
      "5651": 15 / 100, // Family Clothing Stores (for Myntra)
      "5814": 15 / 100,  // Fast Food Restaurants (for Zomato)

      // Excluded MCCs
      "6012": 0, "6051": 0, "5541": 0, "5983": 0, "5542": 0, "5944": 0, "6011": 0, "6540": 0, "6513": 0
    },
    capping: {
      samsung: { maxCashback: 5000, period: "monthly" }
    },
    redemptionRate: {
      cashValue: 0.20
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards["Samsung Infinite"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";
      let cashback = 0;
      let points = 0;

      if (additionalParams.isSamsungTransaction) {
        rate = axisCardRewards["Samsung Infinite"].samsungRate;
        category = "Samsung Purchase";
        rateType = "cashback";
        cashback = Math.min(amount * rate, axisCardRewards["Samsung Infinite"].capping.samsung.maxCashback);
      } else if (additionalParams.isInternational) {
        rate = axisCardRewards["Samsung Infinite"].internationalRate;
        category = "International Transaction";
        rateType = "international";
        points = Math.floor(amount * rate);
      } else if (axisCardRewards["Samsung Infinite"].mccRates[mcc] !== undefined) {
        rate = axisCardRewards["Samsung Infinite"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Preferred Merchant";
        points = Math.floor(amount * rate);
      } else {
        points = Math.floor(amount * rate);
      }

      const cashbackValue = cashback > 0 ? null : {
        cashValue: points * axisCardRewards["Samsung Infinite"].redemptionRate.cashValue
      };

      const rewardText = cashback > 0
        ? `₹${cashback.toFixed(2)} Cashback (${category})`
        : `${points} Reward Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, cashback, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards["Samsung Infinite"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Transaction Type',
        name: 'transactionType',
        options: [
          { label: 'Samsung Purchase', value: 'samsung' },
          { label: 'International', value: 'international' },
          { label: 'Other', value: 'other' }
        ],
        value: currentInputs.transactionType || 'other',
        onChange: (value) => {
          onChange('transactionType', value);
          onChange('isSamsungTransaction', value === 'samsung');
          onChange('isInternational', value === 'international');
        }
      }
    ]
  },
  "Shoppers Stop": {
    cardType: "points",
    defaultRate: 2 / 200, // 2 FC reward points on every INR 200 spent for all other spends
    shoppersStopExclusiveBrands: 20 / 200, // 20 FC Reward Points per INR 200 spent on Shoppers Stop Exclusive Brands
    shoppersStopOtherBrands: 12 / 200, // 12 FC Reward Points per INR 200 spent on other Shoppers Brands
    mccRates: {
      "5311": 12 / 200, // Default rate for Shoppers Stop purchases (will be overridden if exclusive)
      // Excluded MCCs
      "4111": 0, "4121": 0, "4131": 0, "4784": 0, // Transportation & Tolls
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utilities
      "6300": 0, "6381": 0, "5960": 0, "6012": 0, "6051": 0, // Insurance
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // Educational Institutions
      "9211": 0, "9222": 0, "9311": 0, "9399": 0, "9402": 0, "9405": 0, "8220": 0, // Govt. Institutions
      "6540": 0, // Wallet
      "6513": 0, // Rent
      "5541": 0, "5542": 0, "5983": 0 // Fuel
    },
    redemptionRate: {
      cashValue: 0.6
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards["Shoppers Stop"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (mcc === "5311") {
        if (additionalParams.isShoppersStopExclusive) {
          rate = axisCardRewards["Shoppers Stop"].shoppersStopExclusiveBrands;
          category = "Shoppers Stop Exclusive Brands";
        } else {
          rate = axisCardRewards["Shoppers Stop"].shoppersStopOtherBrands;
          category = "Shoppers Stop Other Brands";
        }
        rateType = "shoppers-stop";
      } else if (axisCardRewards["Shoppers Stop"].mccRates[mcc] !== undefined) {
        rate = axisCardRewards["Shoppers Stop"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      const points = Math.floor(amount * rate);
      const cashbackValue = {
        cashValue: points * axisCardRewards["Shoppers Stop"].redemptionRate.cashValue
      };
      const rewardText = `${points} First Citizen Points (${category}) - Worth ₹${cashbackValue.cashValue.toFixed(2)}`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards["Shoppers Stop"].cardType };
    },
    dynamicInputs: (currentInputs, onChange, selectedMcc) => {
      if (selectedMcc === "5311") {
        return [
          {
            type: 'radio',
            label: 'Is this a Shoppers Stop Exclusive Brand purchase?',
            name: 'isShoppersStopExclusive',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ],
            value: currentInputs.isShoppersStopExclusive || false,
            onChange: (value) => onChange('isShoppersStopExclusive', value === 'true')
          }
        ];
      }
      return [];
    }
  },
  "Airtel": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% cashback on all other merchants/spends
    airtelRate: 25 / 100, // 25% cashback on Airtel Thanks App transactions
    airtelAppNonTelecomRate: 10 / 100,
    mccRates: {
      "4814": 10 / 100, "4816": 10 / 100, "4899": 10 / 100, "4900": 10 / 100,
      "5812": 10 / 100, "5814": 10 / 100, "5411": 10 / 100,
      "6012": 0, "6051": 0, "5541": 0, "5983": 0, "5542": 0, "6513": 0, "6011": 0, "6540": 0,
      "5944": 0, "5960": 0, "6300": 0, "6381": 0, "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0,
      "9222": 0, "9311": 0, "9399": 0, "9402": 0,
    },
    capping: {
      categories: {
        "Airtel Thanks App (Non-Telecom)": { cashback: 500, maxSpent: 5000 },
        "Airtel Thanks App (Telecom)": { cashback: 250, maxSpent: 2500 },
        "Preferred Merchant": { cashback: 500, maxSpent: 5000 },
        "Telecom/Utility Services": { cashback: 250, maxSpent: 2500 }
      }
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      let rate = axisCardRewards.Airtel.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isAirtelApp) {
        if (["4814", "4816", "4899", "4900"].includes(mcc)) {
          rate = axisCardRewards.Airtel.airtelRate;
          category = "Airtel Thanks App (Telecom)";
        } else {
          rate = axisCardRewards.Airtel.airtelAppNonTelecomRate;
          category = "Airtel Thanks App (Non-Telecom)";
        }
        rateType = "airtel-app";
      } else if (axisCardRewards.Airtel.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.Airtel.mccRates[mcc];
        rateType = "mcc-specific";
        if (["4814", "4816", "4899", "4900"].includes(mcc)) {
          category = "Telecom/Utility Services";
        } else if (rate === 0) {
          category = "Excluded Category";
        } else {
          category = "Preferred Merchant";
        }
      }

      let cashback = Number((amount * rate).toFixed(2));

      // Apply capping
      if (axisCardRewards.Airtel.capping.categories[category]) {
        const cap = axisCardRewards.Airtel.capping.categories[category];
        cashback = Math.min(cashback, cap.cashback);
      }

      const rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;

      return { cashback, rate, rateType, category, rewardText, cardType: axisCardRewards.Airtel.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an Airtel Thanks App transaction?',
        name: 'isAirtelApp',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isAirtelApp || false,
        onChange: (value) => onChange('isAirtelApp', value === 'true')
      }
    ]
  },
  "Miles & More World Select": {
    cardType: "miles",
    defaultRate: 6 / 200, // 6 Award Miles per Rs. 200 of eligible spends
    mccRates: {
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = axisCardRewards["Miles & More World Select"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const miles = Math.floor(amount * rate);
      const rewardText = `${miles} Award Miles (${category})`;
      return { miles, rate, rateType, category, rewardText, cardType: axisCardRewards["Miles & More World Select"].cardType };
    },
    dynamicInputs: () => []
  },

  "Miles & More World": {
    cardType: "miles",
    defaultRate: 4 / 200, // 4 Award Miles per Rs. 200 of eligible spends
    mccRates: {
    },
    calculateRewards: (amount, mcc, additionalParams) => {
      const rate = axisCardRewards["Miles & More World"].defaultRate;
      const category = "Other Spends";
      const rateType = "default";
      const miles = Math.floor(amount * rate);
      const rewardText = `${miles} Award Miles (${category})`;
      return { miles, rate, rateType, category, rewardText, cardType: axisCardRewards["Miles & More World"].cardType };
    },
    dynamicInputs: () => []
  },
  "Freecharge": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 EDGE REWARD Point per Rs. 100 spent
    milestoneRewards: {
      tier1: { minSpend: 2000, maxSpend: 4999, points: 100 },
      tier2: { minSpend: 5000, points: 350 }
    },
    mccRates: {
      // Excluded categories
      "6540": 0, // Wallet Load
      "5541": 0, "5542": 0, // Fuel Spends
      "6011": 0, // Cash Withdrawal
      "5944": 0, // Jewelry transactions
      "9222": 0, "9311": 0, "9399": 0, "9402": 0, // Government Services
      "6300": 0, "6381": 0, "5960": 0, // Insurance Services
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // Education Services
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utility Services
      "6513": 0 // Rental Payments
    },
    redemptionRate: {
      cashValue: 0.20
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = axisCardRewards.Freecharge.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (axisCardRewards.Freecharge.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.Freecharge.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      let points = Math.floor(amount * rate);

      // Apply milestone rewards
      if (amount >= 5000) {
        points += axisCardRewards.Freecharge.capping.categories["Milestone Reward Tier 2"].points;
        category = "Milestone Reward Tier 2";
      } else if (amount >= 2000 && amount <= 4999) {
        points += axisCardRewards.Freecharge.capping.categories["Milestone Reward Tier 1"].points;
        category = "Milestone Reward Tier 1";
      }

      const cashbackValue = {
        cashValue: points * axisCardRewards.Freecharge.redemptionRate.cashValue
      };

      const rewardText = `${points} EDGE REWARD Points (${category})`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.Freecharge.cardType };
    },
    dynamicInputs: () => []
  },

  "Freecharge Plus": {
    cardType: "cashback",
    defaultRate: 1 / 100, // 1% cashback on other spends
    freechargeRate: 5 / 100, // 5% cashback on Freecharge transactions
    mccRates: {
      "4121": 2 / 100, "4131": 2 / 100, "4111": 2 / 100, "7512": 2 / 100, // 2% on Local Commute
      // Excluded categories (same as Freecharge card)
      "6540": 0, "5541": 0, "5542": 0, "6011": 0, "5944": 0,
      "9222": 0, "9311": 0, "9399": 0, "9402": 0,
      "6300": 0, "6381": 0, "5960": 0,
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0,
      "4814": 0, "4816": 0, "4899": 0, "4900": 0,
      "6513": 0
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = axisCardRewards["Freecharge Plus"].defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isFreechargeTransaction) {
        rate = axisCardRewards["Freecharge Plus"].freechargeRate;
        category = "Freecharge Transaction";
        rateType = "freecharge";
      } else if (axisCardRewards["Freecharge Plus"].mccRates[mcc] !== undefined) {
        rate = axisCardRewards["Freecharge Plus"].mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : (["4121", "4131", "4111", "7512"].includes(mcc) ? "Local Commute" : "Category Spend");
      }

      let cashback = amount * rate;

      // Apply capping
      if (axisCardRewards["Freecharge Plus"].capping.categories[category]) {
        const cap = axisCardRewards["Freecharge Plus"].capping.categories[category];
        cashback = Math.min(cashback, cap.cashback, cap.maxSpent * rate);
      }

      const rewardText = `₹${cashback.toFixed(2)} Cashback (${category})`;

      return { cashback, rate, rateType, category, rewardText, cardType: axisCardRewards["Freecharge Plus"].cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this a Freecharge transaction?',
        name: 'isFreechargeTransaction',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isFreechargeTransaction || false,
        onChange: (value) => onChange('isFreechargeTransaction', value === 'true')
      }
    ]
  },

  "LIC": {
    cardType: "points",
    defaultRate: 1 / 100, // 1 Reward point for every ₹ 100 spent on all other transactions
    licPremiumRate: 2 / 100, // 2 Reward points for every ₹ 100 spent on LIC Premium payment
    internationalRate: 2 / 100, // 2 Reward points for every ₹ 100 spent on foreign currency transactions
    mccRates: {
      // Excluded categories
      "9222": 0, "9311": 0, "9399": 0, "9402": 0, // Government services
      "8211": 0, "8241": 0, "8244": 0, "8249": 0, "8299": 0, // Education services
      "4814": 0, "4816": 0, "4899": 0, "4900": 0, // Utility Services
      "6513": 0, // Rental payments
      "5541": 0, "5542": 0, // Fuel
      "6540": 0 // Wallet load
    },
    redemptionRate: {
      cashValue: 0.25
    },
    calculateRewards: (amount, mcc, additionalParams = {}) => {
      let rate = axisCardRewards.LIC.defaultRate;
      let category = "Other Spends";
      let rateType = "default";

      if (additionalParams.isLICPremium) {
        rate = axisCardRewards.LIC.licPremiumRate;
        category = "LIC Premium Payment";
        rateType = "lic-premium";
      } else if (additionalParams.isInternational) {
        rate = axisCardRewards.LIC.internationalRate;
        category = "International Transaction";
        rateType = "international";
      } else if (mcc && axisCardRewards.LIC.mccRates[mcc] !== undefined) {
        rate = axisCardRewards.LIC.mccRates[mcc];
        rateType = "mcc-specific";
        category = rate === 0 ? "Excluded Category" : "Category Spend";
      }

      let points = Math.floor(amount * rate);

      // Apply capping
      points = Math.min(points, axisCardRewards.LIC.capping.overall.points);

      const cashbackValue = {
        cashValue: points * axisCardRewards.LIC.redemptionRate.cashValue
      };

      const rewardText = `${points} Reward Points (${category})`;

      return { points, rate, rateType, category, rewardText, cashbackValue, cardType: axisCardRewards.LIC.cardType };
    },
    dynamicInputs: (currentInputs, onChange) => [
      {
        type: 'radio',
        label: 'Is this an LIC Premium payment?',
        name: 'isLICPremium',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: currentInputs.isLICPremium || false,
        onChange: (value) => {
          const isLICPremium = value === 'true';
          onChange('isLICPremium', isLICPremium);
          if (isLICPremium) {
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
          const isInternational = value === 'true';
          onChange('isInternational', isInternational);
          if (isInternational) {
            onChange('isLICPremium', false);
          }
        },
        condition: (inputs) => !inputs.isLICPremium
      }
    ]
  }
};

export const calculateAxisRewards = (cardName, amount, mcc, additionalParams = {}) => {
  const cardReward = axisCardRewards[cardName];
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

export const getAxisCardInputs = (cardName, currentInputs, onChange, selectedMcc) => {
  const cardReward = axisCardRewards[cardName];
  return cardReward && cardReward.dynamicInputs ? cardReward.dynamicInputs(currentInputs, onChange, selectedMcc) : [];
};