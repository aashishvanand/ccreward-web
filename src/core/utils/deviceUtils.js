// Search crawlers and link-preview fetchers. They must get the full page
// content: no app-download screen, no region picker.
const CRAWLER_UA = /bot|crawl|spider|slurp|mediapartners|google-inspectiontool|lighthouse|facebookexternalhit|embedly|whatsapp/i;

export const isCrawler = () =>
    typeof navigator !== "undefined" && CRAWLER_UA.test(navigator.userAgent || "");

export const detectDevice = () => {
    // Crawlers (Googlebot crawls as a smartphone) get the full desktop page,
    // not the mobile app-download screen.
    if (typeof window === "undefined" || isCrawler()) {
        return { isMobile: false, isAndroid: false, isIOS: false, isTablet: false };
    }

    const userAgent =
        window.navigator.userAgent || window.navigator.vendor || window.opera;
    const ua = userAgent.toLowerCase();

    const isAndroid = /android/.test(ua);
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isMobile =
        /iphone|ipad|ipod|android|blackberry|windows phone/.test(ua);
    const isTablet = /ipad/.test(ua) || (isAndroid && !/mobile/.test(ua));

    return {
        isMobile,
        isAndroid,
        isIOS,
        isTablet,
    };
};

export const getAppStoreUrl = () =>
    "https://apps.apple.com/in/app/ccreward/id6736835206";
export const getPlayStoreUrl = () =>
    "https://play.google.com/store/apps/details?id=app.ccreward";
