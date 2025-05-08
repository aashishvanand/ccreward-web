import axios from 'axios';
import { getAuth, getIdToken } from "firebase/auth";
import { jwtDecode } from "jwt-decode";

// Define the base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Set cache duration to 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Create an axios instance with the base URL
const api = axios.create({
    baseURL: API_BASE_URL,
});

let currentToken = null;
let tokenRefreshPromise = null;

const getToken = async () => {
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
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
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
    
    // Ensure URL has versioning
    if (!config.url.startsWith('/v1/')) {
        config.url = `/v1${config.url}`;
    }
    
    return config;
}, (error) => Promise.reject(error));

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

// Fetch banks with region initialization check
export const fetchBanks = async () => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch banks: Region not initialized');
        return [];
    }
    
    const region = getCountryCode();
    
    // Create a region-specific cache key
    const cacheKey = `banks_${region}`;
    
    console.log(`Fetching banks for region: ${region} (Cache key: ${cacheKey})`);
    
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
        console.log(`Using cached banks for region ${region}`);
        return cachedData;
    }

    try {
        // Explicitly include region in request
        const response = await api.get(`/bank?country=${region}`);
        const data = response.data;
        
        // Store with region-specific cache key
        setToCache(cacheKey, data);
        
        return data;
    } catch (error) {
        // If error is about region not being initialized, return empty array
        if (error.message === 'Region not initialized') {
            return [];
        }
        return handleApiError(error);
    }
};

// Fetch cards for a specific bank
export const fetchCards = async (bank) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch cards: Region not initialized');
        return [];
    }
    
    const region = getCountryCode();
    
    // Create a region-specific cache key for this bank
    const cacheKey = `cards_${region}_${bank}`;
    
    console.log(`Fetching cards for bank: ${bank} in region: ${region}`);
    
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await api.get(`/card?bank=${bank}&country=${region}`);
        setToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        // If error is about region not being initialized, return empty array
        if (error.message === 'Region not initialized') {
            return [];
        }
        return handleApiError(error);
    }
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
            console.log('Request canceled:', error.message);
        } else if (error.message === 'Region not initialized') {
            return [];
        } else {
            console.error('Error fetching MCC data:', error);
        }
        return [];
    }
};

// Fetch card questions for a specific bank and card
export const fetchCardQuestions = async (bank, card) => {
    // Check if region is initialized
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch card questions: Region not initialized');
        return [];
    }
    
    const encodedBank = encodeURIComponent(bank);
    const encodedCard = encodeURIComponent(card);
    const cacheKey = `questions_${bank}_${card}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await api.get(`/cardQuestions?bank=${encodedBank}&card=${encodedCard}`);
        setToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        // If error is about region not being initialized, return empty array
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

// Export the API instance
export { api };