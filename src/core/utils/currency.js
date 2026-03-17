// Supported currencies for the v4 API
export const SUPPORTED_CURRENCIES = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'THB', 'MYR', 'INR', 'SGD',
];

// Map of currency codes to their display symbols
const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '\u20AC',
    GBP: '\u00A3',
    JPY: '\u00A5',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    THB: '\u0E3F',
    MYR: 'RM',
    INR: '\u20B9',
    SGD: 'S$',
};

// Map of currency codes to their display names
const CURRENCY_NAMES = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    THB: 'Thai Baht',
    MYR: 'Malaysian Ringgit',
    INR: 'Indian Rupee',
    SGD: 'Singapore Dollar',
};

// Map region codes to their native currency
const REGION_NATIVE_CURRENCY = {
    IN: 'INR',
    SG: 'SGD',
};

/**
 * Get the currency symbol for a region code or currency code.
 * Supports both region codes (IN, SG) and currency codes (INR, SGD, USD, etc.)
 */
export const getCurrencySymbol = (regionOrCurrency) => {
    // If it's a currency code, look up directly
    if (CURRENCY_SYMBOLS[regionOrCurrency]) {
        return CURRENCY_SYMBOLS[regionOrCurrency];
    }
    // If it's a region code, get the native currency first
    const nativeCurrency = REGION_NATIVE_CURRENCY[regionOrCurrency];
    if (nativeCurrency) {
        return CURRENCY_SYMBOLS[nativeCurrency];
    }
    return '$';
};

/**
 * Get the display name for a currency code.
 */
export const getCurrencyName = (currencyCode) => {
    return CURRENCY_NAMES[currencyCode] || currencyCode;
};

/**
 * Get the native currency code for a region.
 */
export const getNativeCurrency = (region) => {
    return REGION_NATIVE_CURRENCY[region] || 'INR';
};

/**
 * Check if a currency is the native currency for a given region.
 */
export const isNativeCurrency = (currency, region) => {
    return currency === getNativeCurrency(region);
};
