import axios from 'axios';
import { getAuth, getIdToken } from "firebase/auth";
import { jwtDecode } from "jwt-decode";

// Define the base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Set cache duration to 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Create an axios instance with proper gzip handling
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'CCReward-Web/1.0'
    },
    // CRITICAL: Ensure axios properly handles compression
    decompress: true,
    responseType: 'json', // Force JSON parsing
    validateStatus: (status) => status < 500,
    
    // Custom response transformation to ensure proper decompression
    transformResponse: [
        // First, let axios handle the default transformation (including decompression)
        ...axios.defaults.transformResponse,
        // Then ensure we have proper JSON
        function (data, headers) {
            // If data is already an object, return it
            if (data && typeof data === 'object') {
                return data;
            }
            
            // If data is a string, try to parse it as JSON
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    console.error('Failed to parse JSON response:', e);
                    console.error('Raw data:', data);
                    throw new Error('Invalid JSON response from server');
                }
            }
            
            // If data is binary/compressed, it means decompression failed
            if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
                console.error('Received binary data - decompression may have failed');
                throw new Error('Received compressed data that could not be decompressed');
            }
            
            console.error('Unexpected data type:', typeof data, data);
            throw new Error('Unexpected response format');
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

// Helper function to validate and clean data before caching
const validateAndCleanData = (data) => {
    // Ensure data is a valid object or array
    if (data === null || data === undefined) {
        throw new Error('Received null or undefined data');
    }
    
    // Check if data is compressed/binary (this shouldn't happen after proper decompression)
    if (typeof data === 'string' && data.charCodeAt(0) === 0x1f && data.charCodeAt(1) === 0x8b) {
        throw new Error('Data appears to be gzip compressed - decompression failed');
    }
    
    // If it's a string, try to parse as JSON
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            throw new Error('Data is not valid JSON');
        }
    }
    
    // If it's already an object/array, return as-is
    if (typeof data === 'object') {
        return data;
    }
    
    throw new Error('Invalid data format');
};

// Helper function to get data from cache
const getFromCache = (key) => {
    if (typeof localStorage === 'undefined') {
        return null;
    }
    try {
        const cached = localStorage.getItem(key);
        if (cached) {
            const parsed = JSON.parse(cached);
            const { data, timestamp } = parsed;
            
            if (Date.now() - timestamp < CACHE_DURATION) {
                // Validate cached data
                const cleanData = validateAndCleanData(data);
                return cleanData;
            }
        }
    } catch (error) {
        console.warn('Cache read error:', error);
        // Clear corrupted cache
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Failed to clear corrupted cache:', e);
        }
    }
    return null;
};

// Helper function to set data to cache
const setToCache = (key, data) => {
    if (typeof localStorage === 'undefined') {
        return;
    }
    try {
        // Validate data before caching
        const cleanData = validateAndCleanData(data);
        
        const cacheObject = {
            data: cleanData,
            timestamp: Date.now()
        };
        
        localStorage.setItem(key, JSON.stringify(cacheObject));
        
        // Log successful cache operation in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Cached data for key: ${key}`, cleanData);
        }
    } catch (error) {
        console.error('Cache write error for key:', key, error);
        // Don't throw - caching failure shouldn't break the app
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

// Enhanced request interceptor
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
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
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

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
    (response) => {
        // Log response details in development
        if (process.env.NODE_ENV === 'development') {
            const contentEncoding = response.headers['content-encoding'];
            const contentLength = response.headers['content-length'];
            const dataType = typeof response.data;
            const isArray = Array.isArray(response.data);
            
            console.log(`✅ API Response:`, {
                status: response.status,
                contentEncoding,
                contentLength,
                dataType,
                isArray,
                dataLength: isArray ? response.data.length : 'N/A'
            });
        }
        
        // Validate response data
        try {
            const validatedData = validateAndCleanData(response.data);
            response.data = validatedData;
        } catch (error) {
            console.error('Response validation failed:', error);
            throw new Error('Invalid response data format');
        }
        
        return response;
    },
    (error) => {
        // Enhanced error handling
        if (error.response) {
            const { status, data, headers } = error.response;
            console.error(`❌ API Error ${status}:`, {
                data,
                headers: headers,
                url: error.config?.url
            });
            
            // Handle specific status codes
            if (status === 429) {
                error.message = "You've made too many requests. Please take a coffee break and try again later.";
            } else if (status >= 500) {
                error.message = "Server error. Please try again later.";
            }
        } else if (error.request) {
            console.error('❌ No response received:', error.request);
            error.message = "Network error. Please check your connection and try again.";
        } else {
            console.error('❌ Request setup error:', error.message);
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

// API functions with better error handling and validation
export const fetchBanks = async () => {
    if (!isRegionInitialized()) {
        console.warn('Cannot fetch banks: Region not initialized');
        return [];
    }
    
    const region = getCountryCode();
    const cacheKey = `banks_${region}`;
    
    console.log(`🔍 Fetching banks for region: ${region}`);
    
    // Try cache first
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
        console.log(`📋 Using cached banks for region ${region}:`, cachedData);
        return cachedData;
    }

    try {
        console.log(`🌐 Making API call for banks in region: ${region}`);
        const response = await api.get(`/bank?country=${region}`);
        
        // Validate response data
        if (!Array.isArray(response.data)) {
            throw new Error('Expected array of banks but received: ' + typeof response.data);
        }
        
        console.log(`✅ Successfully fetched ${response.data.length} banks:`, response.data);
        
        // Cache the validated data
        setToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching banks for region ${region}:`, error);
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
    
    console.log(`🔍 Fetching cards for bank: ${bank} in region: ${region}`);
    
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
        console.log(`📋 Using cached cards for ${bank}:`, cachedData);
        return cachedData;
    }

    try {
        console.log(`🌐 Making API call for cards: ${bank} in region: ${region}`);
        const response = await api.get(`/card?bank=${bank}&country=${region}`);
        
        // Validate response data
        if (!Array.isArray(response.data)) {
            throw new Error('Expected array of cards but received: ' + typeof response.data);
        }
        
        console.log(`✅ Successfully fetched ${response.data.length} cards for ${bank}:`, response.data);
        
        setToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching cards for bank ${bank}:`, error);
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
        
        // Validate response data
        if (!Array.isArray(response.data)) {
            console.warn('Expected array of MCC data but received:', typeof response.data);
            return [];
        }
        
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('MCC request canceled:', error.message);
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
        
        // Validate response data
        if (!Array.isArray(response.data)) {
            console.warn('Expected array of questions but received:', typeof response.data);
            return [];
        }
        
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