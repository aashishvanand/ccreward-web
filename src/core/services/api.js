import axios from 'axios';
import axiosRetry from 'axios-retry';
import { jwtDecode } from "jwt-decode";
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

// Create an axios instance with the base URL
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
});

// Configure retries
axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
    }
});

// Cached ID token, keyed by uid so a different account never reuses it
let currentToken = null; // { uid, token }
let tokenRefreshPromise = null; // { uid, promise }

/**
 * Firebase ID token for the signed-in user, or null when nobody is signed in
 * (public endpoints are called without an Authorization header).
 */
const getToken = async () => {
    const { getAuth, getIdToken } = await getAuthModule();
    const user = getAuth().currentUser;
    if (!user) {
        currentToken = null;
        return null;
    }
    if (currentToken?.uid === user.uid && !isTokenExpired(currentToken.token)) {
        return currentToken.token;
    }
    if (tokenRefreshPromise?.uid !== user.uid) {
        const promise = getIdToken(user, true)
            .then(token => {
                currentToken = { uid: user.uid, token };
                return token;
            })
            .finally(() => {
                if (tokenRefreshPromise?.promise === promise) tokenRefreshPromise = null;
            });
        tokenRefreshPromise = { uid: user.uid, promise };
    }
    return tokenRefreshPromise.promise;
};

/** Forget the cached ID token. Call on logout and account deletion. */
export const clearAuthToken = () => {
    currentToken = null;
    tokenRefreshPromise = null;
};

// Treat tokens as expired a minute early so they don't lapse in flight
const TOKEN_EXPIRY_MARGIN_MS = 60 * 1000;

// Function to check if a token is expired
export const isTokenExpired = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp * 1000 - TOKEN_EXPIRY_MARGIN_MS < Date.now();
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
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

// Interceptor to add the token to each request
api.interceptors.request.use(async (config) => {
    // Add the country unless the caller passed one. Without a region, cancel the
    // request before spending a Turnstile token on it.
    const hasCountry = config.params?.country || config.url.includes('country=');
    if (!hasCountry) {
        const countryCode = getCountryCode();
        if (!countryCode) {
            console.warn('Skipping API request because region is not initialized:', config.url);
            return Promise.reject(new Error('Region not initialized'));
        }
        config.params = { ...config.params, country: countryCode };
    }

    const isPost = config.method?.toLowerCase() === 'post';

    // Auth, App Check and Turnstile (POST only) are independent, so fetch them together.
    // App Check and Turnstile are non-blocking: without them the request still goes out.
    const [authToken, appCheckToken, turnstileToken] = await Promise.all([
        config.headers['Authorization'] ? null : getToken(),
        getAppCheckHeaderToken(),
        isPost ? getTurnstileToken().catch(() => null) : null,
    ]);

    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    if (appCheckToken) {
        config.headers['X-Firebase-AppCheck'] = appCheckToken;
    }
    if (turnstileToken) {
        config.headers['X-Turnstile-Token'] = turnstileToken;
    }

    // Ensure URL has versioning — all endpoints now use v4
    if (!config.url.startsWith('/v4/')) {
        config.url = `/v4${config.url}`;
    }

    return config;
}, (error) => Promise.reject(error));

// Response interceptor: track feature usage from response headers
api.interceptors.response.use(
    (response) => {
        handleSuccessHeaders(response.headers);
        return response;
    },
    (error) => {
        // A rejected Turnstile token (expired or already used): retry once with a fresh one
        const errorCode = error.response?.data?.code;
        if (error.response?.status === 403 && errorCode === 'TURNSTILE_FAILED'
            && error.config && !error.config._turnstileRetried) {
            error.config._turnstileRetried = true;
            delete error.config.headers['X-Turnstile-Token'];
            return api.request(error.config);
        }
        if (error.response?.status === 429) {
            const code = error.response.data?.code || error.response.data?.error;
            if (code === 'FEATURE_LIMIT_EXCEEDED') {
                handleLimitExceeded(error.response.headers);
            }
        }
        return Promise.reject(error);
    }
);

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

    if (!error.response && error.request) {
        throw new Error("Network error. Please check your internet connection.");
    }

    throw error;
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
        const response = await api(config);
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

// Cancel token for MCC requests
let mccCancelToken = null;

// Fetch MCC (Merchant Category Code) data
export const fetchMCC = async (search) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch MCC: Region not initialized');
        return [];
    }

    if (mccCancelToken) {
        mccCancelToken.cancel('Operation canceled due to new request.');
    }

    mccCancelToken = axios.CancelToken.source();

    try {
        const response = await api.get('/mcc', {
            params: { search },
            cancelToken: mccCancelToken.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
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

// Cancel token for card questions requests
let cardQuestionsCancelToken = null;

// Fetch card questions for a specific bank and card
export const fetchCardQuestions = async (bank, card) => {
    const cacheKey = `questions_${bank}_${card}`;

    // Check cache first before cancelling — a cache hit needs no network request
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    // Cancel any in-flight card questions request
    if (cardQuestionsCancelToken) {
        cardQuestionsCancelToken.cancel('Operation canceled due to new request.');
    }
    cardQuestionsCancelToken = axios.CancelToken.source();

    try {
        const response = await api.get('/cardQuestions', {
            params: { bank, card },
            cancelToken: cardQuestionsCancelToken.token,
        });
        setToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
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

    // Note: The country parameter is actually typically handled by the cache key
    // or passed implicitly via the interceptor if not provided,
    // but preserving the signature requested or implied by existing usage.
    // However, existing usage had country passed in query. 
    // The interceptor adds it if missing, but let's be explicit if passed.

    // We'll use the country passed in args if available, or fall back to region.
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
// All /v4/user/cards endpoints require Firebase JWT (set by interceptor).
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
 * GET /v4/user/cards — the request interceptor already appends the
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

// Submit feedback for a calculation
export const submitFeedback = async ({ type = 'calculator_feedback', vote, userFeedback, calculationId, calculationPayload }) => {
    const body = { type };
    if (vote) body.vote = vote;
    if (userFeedback) body.userFeedback = userFeedback;
    if (calculationId) body.calculationId = calculationId;
    if (calculationPayload) body.calculationPayload = calculationPayload;

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

// Export the API instance
export { api };