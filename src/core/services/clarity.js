import Clarity from '@microsoft/clarity';

let isInitialized = false;

export const initializeClarity = () => {
    if (typeof window === 'undefined' || isInitialized) return;

    try {
        Clarity.init('ngsrwjccm4');
        isInitialized = true;
    } catch (error) {
        console.error('Failed to initialize Clarity:', error);
    }
};

export const identifyUser = (userId, sessionId, pageId, friendlyName) => {
    if (!isInitialized) return;
    try {
        Clarity.identify(userId, sessionId, pageId, friendlyName);
    } catch (error) {
        console.error('Failed to identify user in Clarity:', error);
    }
};

export const setCustomTag = (key, value) => {
    if (!isInitialized) return;
    try {
        Clarity.setTag(key, value);
    } catch (error) {
        console.error('Failed to set Clarity tag:', error);
    }
};

export const logEvent = (eventName) => {
    if (!isInitialized) return;
    try {
        Clarity.event(eventName);
    } catch (error) {
        console.error('Failed to log Clarity event:', error);
    }
};

export const upgradeSession = (reason) => {
    if (!isInitialized) return;
    try {
        Clarity.upgrade(reason);
    } catch (error) {
        console.error('Failed to upgrade Clarity session:', error);
    }
};

export const setCookieConsent = (hasConsent = true) => {
    if (!isInitialized) return;
    try {
        Clarity.consent(hasConsent);
    } catch (error) {
        console.error('Failed to set Clarity cookie consent:', error);
    }
};