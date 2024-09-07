export const searchMcc = (query, mccList) => {
    const lowercaseQuery = query.toLowerCase();
    return mccList.filter(mcc => {
        const nameMatch = mcc.name.toLowerCase().includes(lowercaseQuery);
        const merchantMatch = mcc.knownMerchants.some(merchant =>
            merchant.toLowerCase().includes(lowercaseQuery)
        );
        return nameMatch || merchantMatch;
    });
};