import { getTurnstileToken } from './turnstile';
import { handleSuccessHeaders, handleLimitExceeded } from './usageLimitService';
import { initAppCheck } from '@/firebase';
import { safeSetItem } from '@/core/utils/storage';

/**
 * Firebase App Check token (Turnstile-backed custom provider) for the API, so it can
 * tell the genuine site from scripts. The SDK caches and refreshes it. Never throws:
 * without a token the request goes out without the header and the server decides.
 */
const getAppCheckHeaderToken = async () => {
    try {
        const appCheck = await initAppCheck();
        if (!appCheck) return null;
        const { getToken } = await import('firebase/app-check');
        const { token } = await getToken(appCheck, false);
        return token;
    } catch {
        return null;
    }
};

// Firebase auth is dynamically imported to reduce initial bundle size
let _authModule = null;
const getAuthModule = async () => {
    if (!_authModule) {
        _authModule = await import("firebase/auth");
    }
    return _authModule;
};

// Define the base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Set cache duration to 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const TIMEOUT_MS = 10_000;
const MAX_RETRIES = 3;

/**
 * Firebase ID token for the signed-in user, or null when nobody is signed in
 * (public endpoints are called without an Authorization header). The SDK
 * caches and refreshes the token itself: getIdToken(user) returns the cached
 * token and only hits the network when it's about to expire.
 */
const getToken = async () => {
    const { getAuth, getIdToken } = await getAuthModule();
    const user = getAuth().currentUser;
    if (!user) return null;
    return getIdToken(user);
};

/** Error carrying the parts of an HTTP response that the app reads. */
class ApiError extends Error {
    constructor(message, { response, code, isTimeout, isNetwork, cancelled } = {}) {
        super(message);
        this.name = 'ApiError';
        if (response) this.response = response;
        if (code) this.code = code;
        if (isTimeout) {
            this.isTimeout = true;
            this.code = 'ECONNABORTED';
        }
        if (isNetwork) {
            this.isNetwork = true;
            // axios set error.request on requests that never got a response;
            // handleApiError and mcpApi branch on it
            this.request = 'fetch';
        }
        if (cancelled) this.cancelled = true;
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Base + /v4-prefixed path + query string. Empty values are skipped (axios
// did the same for params).
const buildUrl = (url, params = {}) => {
    const path = url.startsWith('/v4/') ? url : `/v4${url}`;
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            search.append(key, value);
        }
    }
    const qs = search.toString();
    return `${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`;
};

/**
 * One HTTP request through fetch, replicating the old axios interceptors:
 * the region gate, the auth/App Check/Turnstile headers, the 10s timeout,
 * and the usage-limit bookkeeping on the response.
 */
const requestOnce = async (config) => {
    const method = (config.method || 'get').toLowerCase();
    const isPost = method === 'post';

    // Add the country unless the caller passed one. Without a region, cancel the
    // request before spending a Turnstile token on it.
    const hasCountry = config.params?.country || (config.url || '').includes('country=');
    let params = config.params;
    if (!hasCountry) {
        const countryCode = getCountryCode();
        if (!countryCode) {
            console.warn('Skipping API request because region is not initialized:', config.url);
            throw new Error('Region not initialized');
        }
        params = { ...params, country: countryCode };
    }

    // Auth, App Check and Turnstile (POST only) are independent, so fetch them together.
    // App Check and Turnstile are non-blocking: without them the request still goes out.
    const [authToken, appCheckToken, turnstileToken] = await Promise.all([
        config.headers?.Authorization ? null : getToken(),
        getAppCheckHeaderToken(),
        isPost ? getTurnstileToken().catch(() => null) : null,
    ]);

    const url = buildUrl(config.url, params);

    const headers = { Accept: 'application/json' };
    for (const [key, value] of Object.entries(config.headers || {})) {
        if (value !== undefined) headers[key] = value;
    }
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    if (appCheckToken) headers['X-Firebase-AppCheck'] = appCheckToken;
    if (turnstileToken) headers['X-Turnstile-Token'] = turnstileToken;

    const hasBody = config.data !== undefined && config.data !== null;
    if (hasBody) headers['Content-Type'] = 'application/json';

    // One controller per request: the timeout aborts it, and an external
    // config.signal is bridged in so callers can cancel too.
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, TIMEOUT_MS);
    if (config.signal) {
        if (config.signal.aborted) controller.abort();
        else config.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    let response;
    try {
        response = await fetch(url, {
            method: method.toUpperCase(),
            headers,
            body: hasBody ? JSON.stringify(config.data) : undefined,
            signal: controller.signal,
        });
    } catch (error) {
        if (controller.signal.aborted && !timedOut) {
            // cancelled by the caller, not by the timeout
            throw new ApiError('Request cancelled', { cancelled: true });
        }
        if (timedOut) {
            throw new ApiError('Request timed out', { isTimeout: true });
        }
        throw new ApiError('Network request failed', { isNetwork: true });
    } finally {
        clearTimeout(timer);
    }

    // Plain object of response headers: the usage-limit service reads them
    // with bracket access.
    const responseHeaders = {};
    response.headers.forEach((value, key) => { responseHeaders[key] = value; });

    let body = null;
    if (response.status !== 204) {
        const text = await response.text();
        if (text) {
            try { body = JSON.parse(text); } catch { body = text; }
        }
    }

    if (response.ok) {
        handleSuccessHeaders(responseHeaders);
        return { data: body, headers: responseHeaders, status: response.status };
    }

    throw new ApiError(`Request failed with status code ${response.status}`, {
        response: { status: response.status, data: body, headers: responseHeaders },
    });
};

// Idempotent methods only. A POST that timed out may already have reached the
// API, so retrying it could add a card twice, double-send feedback or create a
// second payment order. (The one-shot retry for a rejected Turnstile token
// below is unaffected: that request was rejected by the server, never
// processed.)
const RETRYABLE_METHODS = new Set(['get', 'head', 'options', 'put', 'delete']);

/**
 * The request entry point: a rejected Turnstile token gets one deliberate
 * retry with a fresh one, network errors and timeouts are retried for
 * idempotent methods with exponential backoff, and 429 FEATURE_LIMIT_EXCEEDED
 * feeds the usage-limit service.
 */
const request = async (config) => {
    const method = (config.method || 'get').toLowerCase();

    for (let attempt = 0; ; attempt++) {
        try {
            return await requestOnce(config);
        } catch (error) {
            if (error.cancelled) throw error;

            // A rejected Turnstile token (expired or already used): retry once.
            // requestOnce fetches a fresh token for the repeat.
            const errorCode = error.response?.data?.code;
            if (error.response?.status === 403 && errorCode === 'TURNSTILE_FAILED'
                && !config._turnstileRetried) {
                return request({ ...config, _turnstileRetried: true });
            }

            if (error.response?.status === 429) {
                const code = error.response.data?.code || error.response.data?.error;
                if (code === 'FEATURE_LIMIT_EXCEEDED') {
                    handleLimitExceeded(error.response.headers);
                }
            }

            const canRetry = attempt < MAX_RETRIES
                && RETRYABLE_METHODS.has(method)
                && (!error.response && (error.isNetwork || error.isTimeout));
            if (!canRetry) throw error;

            await sleep(1000 * 2 ** attempt); // ~1s, 2s, 4s
        }
    }
};

// axios-shaped facade so mcpApi.js keeps working unchanged.
export const api = {
    request: (config) => request(config),
    get: (url, config = {}) => request({ ...config, method: 'get', url }),
    post: (url, data, config = {}) => request({ ...config, method: 'post', url, data }),
    patch: (url, data, config = {}) => request({ ...config, method: 'patch', url, data }),
    delete: (url, config = {}) => request({ ...config, method: 'delete', url, data: config.data }),
};

// Handle API errors
const handleApiError = (error) => {
    console.error("API Error:", error.response ? error.response.data : error.message);

    if (error.code === 'ECONNABORTED') {
        throw new Error("Request timed out. Please check your internet connection and try again.");
    }

    // Currency-specific errors from v4 API
    if (error.response && error.response.status === 400) {
        const body = error.response.data;
        const code = body?.code || body?.error;
        if (code === 'UNSUPPORTED_CURRENCY') {
            throw new Error("Unsupported currency. Please select a valid currency and try again.");
        }
    }

    if (error.response && error.response.status === 503) {
        const body = error.response.data;
        const code = body?.code || body?.error;
        if (code === 'EXCHANGE_RATES_UNAVAILABLE') {
            throw new Error("Exchange rates are temporarily unavailable. Please try again later or use your local currency.");
        }
    }

    if (error.response && error.response.status === 429) {
        const body = error.response.data;
        const message = body?.message || body?.error || '';
        if (typeof message === 'string' && message.toLowerCase().includes('daily limit')) {
            throw new Error("Daily limit reached. Please use the CCReward app for more.");
        }
        const limit = body?.limit;
        const period = body?.period;
        if (limit && period) {
            throw new Error(`Too many requests. Limited to ${limit} per ${period}.`);
        }
        throw new Error("You've made too many requests. Please take a coffee break and try again later.");
    }

    if (error.response && error.response.status === 401) {
        throw new Error("Please sign in first, then try again.");
    }

    if (!error.response && error.request) {
        throw new Error("Network error. Please check your internet connection.");
    }

    throw error;
};

// Helper function to get data from cache
const getFromCache = (key) => {
    if (typeof localStorage === 'undefined') {
        return null;
    }
    const cached = localStorage.getItem(key);
    if (cached) {
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        } catch (e) {
            // If cache is corrupted, ignore it
            return null;
        }
    }
    return null;
};

// Helper function to set data to cache. Never throws: a full or blocked
// storage quota must not fail a request that already succeeded.
const setToCache = (key, data) => {
    safeSetItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

// Helper function to check if region is initialized
const isRegionInitialized = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    return !!localStorage.getItem('app-region');
};

// Enhanced getCountryCode that waits for region to be initialized
const getCountryCode = () => {
    if (typeof localStorage === 'undefined') {
        return null; // Return null during SSR
    }

    const region = localStorage.getItem('app-region');
    if (!region) {
        console.warn('Region not initialized in localStorage');
        return null; // Return null if region not initialized
    }

    return region.toLowerCase();
};

// Generic fetch with cache helper
const fetchWithCache = async (key, apiCall) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn(`Cannot fetch ${key}: Region not initialized`);
        return [];
    }

    const cachedData = getFromCache(key);
    if (cachedData) {
        return cachedData;
    }

    try {
        const data = await apiCall();
        setToCache(key, data);
        return data;
    } catch (error) {
        if (error.message === 'Region not initialized') {
            return [];
        }
        return handleApiError(error);
    }
};

// Helper function for making authenticated requests
const authenticatedRequest = async (method, url, data = null) => {
    try {
        const config = { method, url };
        if (data) {
            config.data = data;
        }
        const response = await request(config);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

// Fetch banks with region initialization check
export const fetchBanks = async () => {
    const region = getCountryCode();
    if (!region) return []; // Early exit if no region

    const cacheKey = `bankImages_${region}`;

    return fetchWithCache(cacheKey, async () => {
        // Explicitly include region in request
        const response = await api.get('/bank', { params: { country: region } });
        return response.data;
    });
};

// Fetch cards for a specific bank
export const fetchCards = async (bank) => {
    const region = getCountryCode();
    if (!region) return [];

    const cacheKey = `cards_${region}_${bank}`;

    return fetchWithCache(cacheKey, async () => {
        const response = await api.get('/card', { params: { bank, country: region } });
        return response.data;
    });
};

// Abort controller for MCC requests — a new search cancels the previous one
let mccAbortController = null;

// Fetch MCC (Merchant Category Code) data
export const fetchMCC = async (search) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch MCC: Region not initialized');
        return [];
    }

    if (mccAbortController) {
        mccAbortController.abort();
    }
    mccAbortController = new AbortController();

    try {
        const response = await request({
            method: 'get',
            url: '/mcc',
            params: { search },
            signal: mccAbortController.signal,
        });
        return response.data;
    } catch (error) {
        if (error.cancelled) {
            // Request canceled
            return [];
        }

        if (error.message === 'Region not initialized') {
            return [];
        }

        console.error('Error fetching MCC data:', error);
        return [];
    }
};

// Abort controller for card questions requests
let cardQuestionsAbortController = null;

// Fetch card questions for a specific bank and card
export const fetchCardQuestions = async (bank, card) => {
    const cacheKey = `questions_${bank}_${card}`;

    // Check cache first before cancelling — a cache hit needs no network request
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    // Cancel any in-flight card questions request
    if (cardQuestionsAbortController) {
        cardQuestionsAbortController.abort();
    }
    cardQuestionsAbortController = new AbortController();

    try {
        const response = await request({
            method: 'get',
            url: '/cardQuestions',
            params: { bank, card },
            signal: cardQuestionsAbortController.signal,
        });
        setToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        if (error.cancelled) {
            return null;
        }
        if (error.message === 'Region not initialized') {
            return [];
        }
        return handleApiError(error);
    }
};

// Calculate rewards based on provided data
export const calculateRewards = async (data) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot calculate rewards: Region not initialized');
        throw new Error('Region not initialized. Please refresh the page and try again.');
    }

    try {
        const response = await api.post('/calculateRewards', data);
        return response.data;
    } catch (error) {
        // If error is about region not being initialized, throw specific error
        if (error.message === 'Region not initialized') {
            throw new Error('Region not initialized. Please refresh the page and try again.');
        }
        return handleApiError(error);
    }
};

// Fetch questions for best card calculation
export const fetchBestCardQuestions = async (cards) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch best card questions: Region not initialized');
        return [];
    }

    try {
        const response = await authenticatedRequest('post', '/bestCardQuestions', { cards });
        return response;
    } catch (error) {
        // If error is about region not being initialized, return empty array
        if (error.message === 'Region not initialized') {
            return [];
        }
        return handleApiError(error);
    }
};

// Calculate the best card based on provided data
export const calculateBestCard = async (data) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot calculate best card: Region not initialized');
        throw new Error('Region not initialized. Please refresh the page and try again.');
    }

    try {
        const response = await authenticatedRequest('post', '/calculateBestCard', data);
        return response;
    } catch (error) {
        // If error is about region not being initialized, throw specific error
        if (error.message === 'Region not initialized') {
            throw new Error('Region not initialized. Please refresh the page and try again.');
        }
        return handleApiError(error);
    }
};

// Calculate transfer partners based on provided data
export const calculateTransferPartners = async (data) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot calculate transfer partners: Region not initialized');
        throw new Error('Region not initialized. Please refresh the page and try again.');
    }

    try {
        const response = await authenticatedRequest('post', '/v4/transfer', data);
        return response;
    } catch (error) {
        // If error is about region not being initialized, throw specific error
        if (error.message === 'Region not initialized') {
            throw new Error('Region not initialized. Please refresh the page and try again.');
        }
        return handleApiError(error);
    }
};

// Fetch every transfer program (airlines, hotels, other) for the "who transfers to" picker
export const fetchTransferPrograms = async () => {
    const region = getCountryCode();
    if (!region) return [];

    return fetchWithCache(`transferPrograms_${region}`, async () => {
        const response = await api.get('/transfer/partners');
        return response.data.programs;
    });
};

// Find every card and points balance that can transfer to a target program
export const findTransferRoutes = async (data) => {
    if (!isRegionInitialized()) {
        throw new Error('Region not initialized. Please refresh the page and try again.');
    }
    return authenticatedRequest('post', '/v4/transfer/routes', data);
};

// Fetch Card Details
export const fetchCardDetails = async (bank, card, country) => {
    // Check if region is initialized (an explicit country is enough)
    if (!country && !isRegionInitialized()) {
        console.warn('Cannot fetch card details: Region not initialized');
        return null;
    }

    const region = country || getCountryCode();
    if (!region) return null;

    const encodedCard = encodeURIComponent(card);
    const cacheKey = `card_detail_${bank}_${encodedCard}_${region}`;

    return fetchWithCache(cacheKey, async () => {
        const response = await api.get('/v4/card/detail', { params: { bank, card, country: region } });
        return response.data;
    });
};

// Fetch Card Goals
export const fetchCardGoals = async (bank, card, country) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch card goals: Region not initialized');
        return null;
    }

    const region = country || getCountryCode();
    if (!region) return null;

    const encodedCard = encodeURIComponent(card);
    const cacheKey = `card_goals_${bank}_${encodedCard}_${region}`;

    return fetchWithCache(cacheKey, async () => {
        const response = await api.get('/v4/goals', { params: { bank, card, country: region } });
        return response.data;
    });
};

// ─── User Cards (v4) ────────────────────────────────────────────────
// All /v4/user/cards endpoints require Firebase JWT (set by the request core).
// Only the authenticated user can access their own cards.

/**
 * Add a card to the user's portfolio.
 * POST /v4/user/cards
 */
export const addUserCard = async (cardData) => {
    try {
        const response = await api.post('/v4/user/cards', cardData);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Update an existing card in the user's portfolio.
 * Matches on (bank + cardName + country), updates the rest.
 * PATCH /v4/user/cards
 */
export const updateUserCard = async (cardData) => {
    try {
        const response = await api.patch('/v4/user/cards', cardData);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Remove a card from the user's portfolio.
 * DELETE /v4/user/cards
 */
export const deleteUserCard = async ({ bank, cardName, country }) => {
    try {
        const response = await api.delete('/v4/user/cards', {
            data: { bank, cardName, country },
        });
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Get all cards for the authenticated user.
 * GET /v4/user/cards — the request core already appends the
 * user's current region as `?country=`, so no country needs to be passed here.
 * Returns a flat array (unwrapped from the `{ cards, count }` envelope), with
 * a synthesized `id` (`${bank}_${cardName}`) added to each card so existing
 * UI code that keyed off Firestore's document-key `id` keeps working.
 */
export const getUserCards = async () => {
    try {
        const response = await api.get('/v4/user/cards');
        const cards = response.data?.cards ?? [];
        return cards.map((card) => ({ ...card, id: `${card.bank}_${card.cardName}` }));
    } catch (error) {
        return handleApiError(error);
    }
};

// Submit feedback (POST /v4/feedback): calculation votes and reports, missing
// cards and merchants/MCCs, and general app feedback. Only the fields the
// feedback schema accepts are copied through, and empty values are dropped.
const FEEDBACK_FIELDS = [
    'vote', 'userFeedback', 'calculationId', 'calculationPayload',
    'merchantName', 'mccCode', 'country', 'bin', 'bank', 'cardName', 'feedback',
];

export const submitFeedback = async (payload = {}) => {
    const body = { type: payload.type || 'calculator_feedback' };
    for (const key of FEEDBACK_FIELDS) {
        if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
            body[key] = payload[key];
        }
    }

    try {
        const response = await api.post('/v4/feedback', body);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

// General feedback about the app (same type the iOS/Android apps send). Requires sign-in.
export const APP_FEEDBACK_MAX_LENGTH = 5000;

export const submitAppFeedback = async (feedback) => {
    try {
        const response = await api.post('/v4/feedback', { type: 'app_feedback', feedback });
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
