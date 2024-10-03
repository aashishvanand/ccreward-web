import axios from 'axios';
import { getAuth, getIdToken } from "firebase/auth";
import { jwtDecode } from "jwt-decode";

// Define the base URL for API calls
const API_BASE_URL = 'https://api.ccreward.app';

// Create an axios instance with the base URL
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Set cache duration to 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Helper function to get data from cache
const getFromCache = (key) => {
    const cached = localStorage.getItem(key);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
        }
    }
    return null;
};

// Helper function to set data to cache
const setToCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

// Function to get a custom token for embeddable calculator
export const getCustomToken = async (apiKey) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/createCustomToken`, { apiKey });
        return response.data.token;
    } catch (error) {
        console.error('Error getting custom token:', error);
        throw error;
    }
};

// Function to set the authentication token
export const setAuthToken = (token, isCustomToken = false) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = isCustomToken ? `Bearer ${token}` : `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
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

// Initialize authentication
export const initializeAuth = async () => {
    const auth = getAuth();
    if (auth.currentUser) {
        try {
            const token = await getIdToken(auth.currentUser, true);
            setAuthToken(token);
            localStorage.setItem('authToken', token);
        } catch (error) {
            console.error('Error initializing auth:', error);
        }
    }
};

// Interceptor to add the token to each request
api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    if (auth.currentUser) {
        try {
            const token = await getIdToken(auth.currentUser, true);
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log("Token added to request:", token.substring(0, 10) + "...");  // Log first 10 characters of token
        } catch (error) {
            console.error('Error getting token:', error);
        }
    } else {
        console.warn('No authenticated user found when making request');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle API errors
const handleApiError = (error) => {
    console.error("API Error:", error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 429) {
        throw new Error("You've made too many requests. Please take a coffee break and try again later.");
    }
    throw error;
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

// Fetch banks
export const fetchBanks = async () => {
    const cacheKey = 'banks';
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await authenticatedRequest('get', '/bank');
        setToCache(cacheKey, response);
        return response;
    } catch (error) {
        return handleApiError(error);
    }
};

// Fetch cards for a specific bank
export const fetchCards = async (bank) => {
    const cacheKey = `cards_${bank}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await authenticatedRequest('get', `/card?bank=${bank}`);
        setToCache(cacheKey, response);
        return response;
    } catch (error) {
        return handleApiError(error);
    }
};

// Cancel token for MCC requests
let mccCancelToken = null;

// Fetch MCC (Merchant Category Code) data
export const fetchMCC = async (search) => {
    if (mccCancelToken) {
        mccCancelToken.cancel('Operation canceled due to new request.');
    }

    mccCancelToken = axios.CancelToken.source();

    try {
        const response = await api.get(`/mcc?search=${search}`, {
            cancelToken: mccCancelToken.token
        });
        return response.data; // Make sure this is returning the array of MCC objects
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
        } else {
            console.error('Error fetching MCC data:', error);
        }
        return []; // Return an empty array in case of error or cancellation
    }
};

// Fetch card questions for a specific bank and card
export const fetchCardQuestions = async (bank, card) => {
    const encodedBank = encodeURIComponent(bank);
    const encodedCard = encodeURIComponent(card);
    const cacheKey = `questions_${bank}_${card}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await authenticatedRequest('get', `/cardQuestions?bank=${encodedBank}&card=${encodedCard}`);
        setToCache(cacheKey, response);
        return response;
    } catch (error) {
        return handleApiError(error);
    }
};

// Calculate rewards based on provided data
export const calculateRewards = async (data) => {
    try {
        return await authenticatedRequest('post', '/calculateRewards', data);
    } catch (error) {
        return handleApiError(error);
    }
};

// Fetch questions for best card calculation
export const fetchBestCardQuestions = async (cards) => {
    try {
        const response = await authenticatedRequest('post', '/bestCardQuestions', { cards });
        return response;
    } catch (error) {
        return handleApiError(error);
    }
};

// Calculate the best card based on provided data
export const calculateBestCard = async (data) => {
    try {
        const response = await authenticatedRequest('post', '/calculateBestCard', data);
        return response;
    } catch (error) {
        return handleApiError(error);
    }
};