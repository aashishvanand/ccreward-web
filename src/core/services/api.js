import axios from 'axios';
import axiosRetry from 'axios-retry';
import { jwtDecode } from "jwt-decode";
import { getTurnstileToken } from './turnstile';
import { updateFromResponseHeaders } from './usageLimitService';

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

let currentToken = null;
let tokenRefreshPromise = null;

const getToken = async () => {
    const { getAuth, getIdToken } = await getAuthModule();
    const auth = getAuth();
    if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
    }
    if (currentToken && !isTokenExpired(currentToken)) {
        return currentToken;
    }
    if (!tokenRefreshPromise) {
        tokenRefreshPromise = getIdToken(auth.currentUser, true)
            .then(token => {
                currentToken = token;
                tokenRefreshPromise = null;
                return token;
            })
            .catch(error => {
                tokenRefreshPromise = null;
                throw error;
            });
    }
    return tokenRefreshPromise;
};

// Function to check if a token is expired
export const isTokenExpired = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp * 1000 < Date.now();
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

// Helper function to set data to cache
const setToCache = (key, data) => {
    if (typeof localStorage === 'undefined') {
        return;
    }
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
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

// Function to set the authentication token
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Initialize authentication
export const initializeAuth = async () => {
    const { getAuth, getIdToken } = await getAuthModule();
    const auth = getAuth();
    if (auth.currentUser) {
        try {
            const token = await getIdToken(auth.currentUser, true);
            setAuthToken(token);
            // Firebase Auth SDK manages token caching internally via IndexedDB.
            // Do NOT store tokens in localStorage — they would be accessible to
            // any JS on the page (XSS, third-party scripts).
        } catch (error) {
            console.error('Error initializing auth:', error);
        }
    }
};

// Interceptor to add the token to each request
api.interceptors.request.use(async (config) => {
    if (!config.headers['Authorization']) {
        const token = await getToken();
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Only add country parameter if region is initialized
    const countryCode = getCountryCode();
    if (countryCode) {
        // Add country parameter to each request if not already present
        if (!config.url.includes('country=')) {
            const separator = config.url.includes('?') ? '&' : '?';
            config.url = `${config.url}${separator}country=${countryCode}`;
        }
    } else {
        console.warn('Skipping API request because region is not initialized:', config.url);
        // Cancel the request
        return Promise.reject(new Error('Region not initialized'));
    }

    // Attach Turnstile token for bot protection on POST requests only (non-blocking)
    if (config.method && config.method.toLowerCase() === 'post') {
        try {
            const turnstileToken = await getTurnstileToken();
            if (turnstileToken) {
                config.headers['X-Turnstile-Token'] = turnstileToken;
            }
        } catch {
            // Non-critical — API should still work without Turnstile during rollout
        }
    }

    // Ensure URL has versioning — all endpoints now use v4
    if (!config.url.startsWith('/v4/')) {
        config.url = `/v4${config.url}`;
    }

    return config;
}, (error) => Promise.reject(error));

// Response interceptor: extract usage limit headers from every response
api.interceptors.response.use(
  (response) => {
    updateFromResponseHeaders(response.headers);
    return response;
  },
  (error) => {
    // Also read headers from error responses (e.g. 429)
    if (error.response?.headers) {
      updateFromResponseHeaders(error.response.headers);
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

    const cacheKey = `banks_${region}`;

    return fetchWithCache(cacheKey, async () => {
        // Explicitly include region in request
        const response = await api.get(`/bank?country=${region}`);
        return response.data;
    });
};

// Fetch cards for a specific bank
export const fetchCards = async (bank) => {
    const region = getCountryCode();
    if (!region) return [];

    const cacheKey = `cards_${region}_${bank}`;

    return fetchWithCache(cacheKey, async () => {
        const response = await api.get(`/card?bank=${bank}&country=${region}`);
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
        const response = await api.get(`/mcc?search=${search}`, {
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
    const encodedBank = encodeURIComponent(bank);
    const encodedCard = encodeURIComponent(card);
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
        const response = await api.get(`/cardQuestions?bank=${encodedBank}&card=${encodedCard}`, {
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

// Fetch Card Details
export const fetchCardDetails = async (bank, card, country) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
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
        const response = await api.get(`/v4/card/detail?bank=${bank}&card=${encodedCard}&country=${region}`);
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
        const response = await api.get(`/v4/goals?bank=${bank}&card=${encodedCard}&country=${region}`);
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
 * GET /v4/user/cards?country=xx  (country is optional)
 */
export const getUserCards = async (country) => {
    try {
        const url = country
            ? `/v4/user/cards?country=${encodeURIComponent(country)}`
            : '/v4/user/cards';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Bulk sync (full replace) cards for the authenticated user.
 * Intended for Firestore-to-D1 migration, not day-to-day use.
 * PUT /v4/user/cards
 */
export const bulkSyncUserCards = async ({ cards, country }) => {
    try {
        const response = await api.put('/v4/user/cards', { cards, country });
        return response.data;
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

// Export the API instance
export { api };