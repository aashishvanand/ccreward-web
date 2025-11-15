export const getCurrencySymbol = (regionOrCurrency) => {
    switch (regionOrCurrency) {
        case "SG":
        case "SGD":
            return "S$";
        case "IN":
        case "INR":
            return "₹";
        default:
            return "$";
    }
};