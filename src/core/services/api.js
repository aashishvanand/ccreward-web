import axios from 'axios';
import { getAuth, getIdToken } from "firebase/auth";
import { jwtDecode } from "jwt-decode";

// Define the base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Set cache duration to 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Create an axios instance with optimized gzip configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    // Axios automatically handles gzip decompression when these are set
    decompress: true,
    validateStatus: (status) => status < 500, // Don't throw on 4xx errors
    headers: {
        // Critical: Tell server we accept gzip compression
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Add User-Agent for better server compatibility
        'User-Agent': 'CCReward-Web/1.0'
    },
    timeout: 30000,
    responseType: 'json',
    // Enable automatic request/response transformation
    transformRequest: axios.defaults.transformRequest,
    transformResponse: [
        // Custom response transformer to handle potential compression issues
        function (data, headers) {
            // If data is already parsed JSON, return it
            if (typeof data === 'object') {
                return data;
            }
            
            // Try to parse JSON if it's a string
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    console.warn('Failed to parse JSON response:', e);
                    return data;
                }
            }
            
            return data;
        }
    ]
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
    try {
        const cached = localStorage.getItem(key);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }
    } catch (error) {
        console.warn('Cache read error:', error);
    }
    return null;
};

// Helper function to set data to cache
const setToCache = (key, data) => {
    if (typeof localStorage === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (error) {
        console.warn('Cache write error:', error);
    }
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
        return null;
    }
    
    const region = localStorage.getItem('app-region');
    if (!region) {
        console.warn('Region not initialized in localStorage');
        return null;
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

// Enhanced request interceptor with better error handling
api.interceptors.request.use(async (config) => {
    try {
        // Add authentication token
        if (!config.headers['Authorization']) {
            const token = await getToken();
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Only add country parameter if region is initialized
        const countryCode = getCountryCode();
        if (countryCode) {
            if (!config.url.includes('country=')) {
                const separator = config.url.includes('?') ? '&' : '?';
                config.url = `${config.url}${separator}country=${countryCode}`;
            }
        } else {
            console.warn('Skipping API request because region is not initialized:', config.url);
            return Promise.reject(new Error('Region not initialized'));
        }
        
        // Ensure URL has versioning
        if (!config.url.startsWith('/v1/')) {
            config.url = `/v1${config.url}`;
        }
        
        // Log request details in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
    } catch (error) {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
}, (error) => {
    console.error('Request interceptor failed:', error);
    return Promise.reject(error);
});

// Enhanced response interceptor with better compression handling
api.interceptors.response.use(
    (response) => {
        // Log compression info in development
        if (process.env.NODE_ENV === 'development') {
            const contentEncoding = response.headers['content-encoding'];
            const contentLength = response.headers['content-length'];
            if (contentEncoding) {
                console.log(`✅ Response compressed with: ${contentEncoding}${contentLength ? ` (${contentLength} bytes)` : ''}`);
            }
        }
        
        // Verify the response data is properly decompressed and parsed
        if (response.data && typeof response.data === 'string') {
            try {
                response.data = JSON.parse(response.data);
            } catch (e) {
                console.warn('Response data is string but not valid JSON:', e);
            }
        }
        
        return response;
    },
    (error) => {
        // Enhanced error handling for compression issues
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error (possibly compression-related):', error);
        }
        
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            console.error(`API Error ${status}:`, data);
            
            // Handle specific status codes
            if (status === 429) {
                error.message = "You've made too many requests. Please take a coffee break and try again later.";
            } else if (status >= 500) {
                error.message = "Server error. Please try again later.";
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('No response received:', error.request);
            error.message = "Network error. Please check your connection and try again.";
        }
        
        return Promise.reject(error);
    }
);

// Enhanced API error handler
const handleApiError = (error) => {
    console.error("API Error Details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
    });
    
    // Handle compression-specific errors
    if (error.message?.includes('decompress') || 
        error.message?.includes('compression') ||
        error.code === 'ERR_CONTENT_DECODING_FAILED') {
        throw new Error("Server response format error. Please try again.");
    }
    
    if (error.response?.status === 429) {
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

// Rest of your functions remain the same...
export const fetchBanks = async () => {
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch banks: Region not initialized');
        return [];
    }
    
    const region = getCountryCode();
    const cacheKey = `banks_${region}`;
    
    console.log(`Fetching banks for region: ${region} (Cache key: ${cacheKey})`);
    
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
        console.log(`Using cached banks for region ${region}`);
        return cachedData;
    }

    try {
        const response = await api.get(`/bank?country=${region}`);
        const data = response.data;
        setToCache(cacheKey, data);
        return data;
    } catch (error) {
        if (error.message === 'Region not initialized') {
            return [];
        }
        return handleApiError(error);
    }
};

export const fetchCards = async (bank) => {
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch cards: Region not initialized');
        return [];
    }
    
    const region = getCountryCode();
    const cacheKey = `cards_${region}_${bank}`;
    
    console.log(`Fetching cards for bank: ${bank} in region: ${region}`);
    
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await api.get(`/card?bank=${bank}&country=${region}`);
        setToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        if (error.message === 'Region not initialized') {
            return [];
        }
        return handleApiError(error);
    }
};

// Cancel token for MCC requests
let mccCancelToken = null;

export const fetchMCC = async (search) => {
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

export const fetchCardQuestions = async (bank, card) => {
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
        if (error.message === 'Region not initialized') {
            return [];
        }
        return handleApiError(error);
    }
};

export const calculateRewards = async (data) => {
    if (!isRegionInitialized()) {
        console.warn('Cannot calculate rewards: Region not initialized');
        throw new Error('Region not initialized. Please refresh the page and try again.');
    }
    
    try {
        const response = await api.post('/calculateRewards', data);
        return response.data;
    } catch (error) {
        if (error.message === 'Region not initialized') {
            throw new Error('Region not initialized. Please refresh the page and try again.');
        }
        return handleApiError(error);
    }
};

export const fetchBestCardQuestions = async (cards) => {
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch best card questions: Region not initialized');
        return [];
    }
    
    try {
        const response = await authenticatedRequest('post', '/bestCardQuestions', { cards });
        return response;
    } catch (error) {
        if (error.message === 'Region not initialized') {
            return [];
        }
        return handleApiError(error);
    }
};

export const calculateBestCard = async (data) => {
    if (!isRegionInitialized()) {
        console.warn('Cannot calculate best card: Region not initialized');
        throw new Error('Region not initialized. Please refresh the page and try again.');
    }
    
    try {
        const response = await authenticatedRequest('post', '/calculateBestCard', data);
        return response;
    } catch (error) {
        if (error.message === 'Region not initialized') {
            throw new Error('Region not initialized. Please refresh the page and try again.');
        }
        return handleApiError(error);
    }
};

export { api };