/**
 * localStorage helpers that never throw.
 *
 * Storage can be full, disabled (private mode, blocked site data) or missing
 * (SSR). A failed cache write must never fail the request that produced the data.
 */

// Cached JSON blobs written as { data, timestamp }. Entries older than this are
// removed when storage fills up, and once per page load in idle time.
const STALE_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Keys that hold { data, timestamp } cache entries
const CACHE_KEY_PREFIXES = [
    'bankImages_',
    'cards_',
    'cardImagesData_',
    'cardsData_',
    'cardCategories_',
    'card_detail_',
    'card_goals_',
    'questions_',
    'transferPrograms_',
    'referral',
    'partnerLogos_',
];

const getStorage = () => {
    try {
        return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
        return null; // Accessing localStorage can throw when site data is blocked
    }
};

/**
 * Remove cache entries older than maxAge. With force, removes every cache entry
 * regardless of age (used to make room when storage is full).
 */
export const pruneCache = ({ maxAge = STALE_CACHE_AGE_MS, force = false } = {}) => {
    const storage = getStorage();
    if (!storage) return;
    try {
        const now = Date.now();
        const keys = Object.keys(storage).filter(key =>
            CACHE_KEY_PREFIXES.some(prefix => key.startsWith(prefix))
        );
        for (const key of keys) {
            if (force) {
                storage.removeItem(key);
                continue;
            }
            try {
                const { timestamp } = JSON.parse(storage.getItem(key));
                if (!timestamp || now - timestamp > maxAge) storage.removeItem(key);
            } catch {
                storage.removeItem(key); // Corrupt entry
            }
        }
    } catch {
        // Ignore: pruning is best-effort
    }
};

let prunedThisSession = false;
const schedulePrune = () => {
    if (prunedThisSession || typeof window === 'undefined') return;
    prunedThisSession = true;
    const run = () => pruneCache();
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(run, { timeout: 10000 });
    } else {
        setTimeout(run, 2000);
    }
};

/**
 * localStorage.setItem that never throws. If storage is full, clears stale
 * cache entries (then all cache entries) and retries. Returns true on success.
 */
export const safeSetItem = (key, value) => {
    const storage = getStorage();
    if (!storage) return false;
    schedulePrune();
    try {
        storage.setItem(key, value);
        return true;
    } catch {
        // Most likely QuotaExceededError: free space and retry
    }
    for (const options of [{}, { force: true }]) {
        pruneCache(options);
        try {
            storage.setItem(key, value);
            return true;
        } catch {
            // Try the next, more aggressive pass
        }
    }
    return false;
};

/** Store data as a { data, timestamp } cache entry. Never throws. */
export const setCachedJson = (key, data) =>
    safeSetItem(key, JSON.stringify({ data, timestamp: Date.now() }));
