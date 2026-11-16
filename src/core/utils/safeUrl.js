/**
 * URLs safe to send to analytics and error reporting: origin + path only.
 * Query strings and fragments can carry secrets (email-link oobCode,
 * checkout session ids), so they are never reported.
 */
export const getSafePageUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}`;
};

export const getSafeReferrer = () => {
    if (typeof document === 'undefined' || !document.referrer) return 'direct';
    try {
        const url = new URL(document.referrer);
        return `${url.origin}${url.pathname}`;
    } catch {
        return 'unknown';
    }
};
