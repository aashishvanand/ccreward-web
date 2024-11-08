export const detectDevice = () => {
    if (typeof window === 'undefined') {
        return { isMobile: false, isAndroid: false, isIOS: false };
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
    const isAndroid = /android/g.test(userAgent);
    const isIOS = /iphone|ipod/g.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/g.test(userAgent);

    return {
        isMobile,
        isAndroid,
        isIOS,
        isTablet
    };
};

export const getAppStoreUrl = () => "https://apps.apple.com/in/app/ccreward/id6736835206";
export const getPlayStoreUrl = () => "https://play.google.com/store/apps/details?id=app.ccreward";