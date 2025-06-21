export const getCurrencySymbol = (region) => {
    switch (region) {
        case "SG":
            return "S$";
        case "IN":
            return "₹";
        default:
            return "$";
    }
};