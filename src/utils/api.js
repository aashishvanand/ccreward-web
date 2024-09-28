import axios from 'axios';
import { getAuth, getIdToken } from "firebase/auth";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = 'https://api.ccreward.app';

const api = axios.create({
    baseURL: API_BASE_URL,
});

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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

const setToCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

const refreshAuthToken = async () => {
    const auth = getAuth();
    if (auth.currentUser) {
        try {
            const token = await getIdToken(auth.currentUser, true);
            setAuthToken(token);
            return token;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }
    throw new Error('No user is currently signed in');
};

const handleApiError = (error) => {
    if (error.response && error.response.status === 429) {
        throw new Error("You've made too many requests. Please take a coffee break and try again later.");
    }
    throw error;
};

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Helper function for making authenticated requests
const authenticatedRequest = async (method, url, data = null) => {
    const currentToken = api.defaults.headers.common['Authorization']?.split(' ')[1];

    if (isTokenExpired(currentToken)) {
        try {
            await refreshAuthToken();
        } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            throw refreshError;
        }
    }

    try {
        const config = { method, url };
        if (data) {
            config.data = data;
        }
        const response = await api(config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token might be expired (edge case), try to refresh
            try {
                await refreshAuthToken();
                // Retry the request with the new token
                return await authenticatedRequest(method, url, data);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                throw refreshError;
            }
        }
        return handleApiError(error);
    }
};

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

let mccCancelToken = null;

export const fetchMCC = async (search) => {
    if (mccCancelToken) {
        mccCancelToken.cancel('Operation canceled due to new request.');
    }

    mccCancelToken = axios.CancelToken.source();

    try {
        const response = await api.get(`/mcc?search=${search}`, {
            cancelToken: mccCancelToken.token
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
        } else {
            return handleApiError(error);
        }
    }
};

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

export const calculateRewards = async (data) => {
    try {
        return await authenticatedRequest('post', '/calculateRewards', data);
    } catch (error) {
        return handleApiError(error);
    }
};

export const fetchBestCardQuestions = async (cards) => {
    try {
        const response = await authenticatedRequest('post', '/bestCardQuestions', { cards });
        return response;
    } catch (error) {
        return handleApiError(error);
    }
};

export const calculateBestCard = async (data) => {
    try {
        const response = await authenticatedRequest('post', '/calculateBestCard', data);
        return response;
    } catch (error) {
        return handleApiError(error);
    }
};