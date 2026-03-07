import { firebaseApp } from '@/firebase';
import { recordError } from './errorTracking';

const CACHE_KEY = 'userCardsCache';
const CACHE_TIMESTAMP_KEY = 'userCardsCacheTimestamp';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Helper function to get cached data
const getCachedData = (userId) => {
  if (typeof window === 'undefined') return null;
  const cachedData = localStorage.getItem(`${CACHE_KEY}_${userId}`);
  const cacheTimestamp = localStorage.getItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);

  if (cachedData && cacheTimestamp) {
    const now = new Date().getTime();
    if (now - parseInt(cacheTimestamp) < CACHE_DURATION) {
      return JSON.parse(cachedData);
    } else {
      // Clean up stale cache
      localStorage.removeItem(`${CACHE_KEY}_${userId}`);
      localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);
    }
  }

  return null;
};

// Helper function to set cached data
const setCachedData = (userId, data) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(data));
  localStorage.setItem(`${CACHE_TIMESTAMP_KEY}_${userId}`, new Date().getTime().toString());
};

// Sanitization helpers
const sanitizeString = (str, maxLength = 100) => {
  if (str === null || str === undefined) return str;
  if (typeof str === 'number') return str.toString();
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
};


const sanitizeNumber = (num) => {
  const parsed = Number(num);
  if (isNaN(parsed)) return null;
  return parsed;
};

// Helper to load firestore dynamically
const loadFirestore = async () => {
  if (typeof window === 'undefined') return { db: null, funcs: null };
  const funcs = await import('firebase/firestore');
  const db = funcs.getFirestore(firebaseApp);
  return { db, funcs };
};

// Function to add a card for a user
export const addCardForUser = async (userId, cardData) => {
  try {
    const { db, funcs } = await loadFirestore();
    if (!db || !funcs) throw new Error("Firestore not initialized");
    const { doc, getDoc, setDoc, serverTimestamp, updateDoc, FieldPath } = funcs;

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create the user document if it doesn't exist
      await setDoc(userRef, { createdAt: serverTimestamp() });
    }

    // Get country from region context or local storage
    const country = localStorage.getItem('app-region')?.toLowerCase() || 'in';

    // Create a new object with only essential and sanitized fields
    const bankStr = sanitizeString(cardData.bank);
    const cardNameStr = sanitizeString(cardData.cardName);

    if (!bankStr || !cardNameStr) {
      throw new Error("Invalid card data: missing required fields");
    }

    const cardToAdd = {
      bank: bankStr,
      cardName: cardNameStr,
      country: sanitizeString(country, 10)
    };

    // Conditionally add optional fields only if they exist
    if (cardData.network) cardToAdd.network = sanitizeString(cardData.network, 50);
    if (cardData.billingDate) cardToAdd.billingDate = sanitizeNumber(cardData.billingDate);
    if (cardData.limit) cardToAdd.limit = sanitizeNumber(cardData.limit);
    if (cardData.since) cardToAdd.since = sanitizeString(cardData.since, 20);

    // Add server timestamp
    cardToAdd.addedAt = serverTimestamp();

    const cardKey = `${bankStr}_${cardNameStr}`;
    // Use FieldPath to treat the key as a literal string, not a dot-separated path
    await updateDoc(userRef, {
      [new FieldPath('cards', cardKey)]: cardToAdd
    });

    // Clear cache to force a fresh fetch next time
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
    localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);

    // Return the card key
    return cardKey;
  } catch (error) {
    recordError('firebase_add_card_error', { error: error.message }, false);
    throw error;
  }
};

// Function to get all cards for a user
export const getCardsForUser = async (userId) => {
  try {
    if (typeof window === 'undefined') return [];

    // Get current region/country directly from localStorage (don't use cached value)
    const selectedCountry = localStorage.getItem('app-region')?.toLowerCase() || 'in';

    const { db, funcs } = await loadFirestore();
    if (!db || !funcs) return [];
    const { doc, getDoc } = funcs;

    // If not in cache, fetch from Firebase
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    // If document doesn't exist, this is a new user
    if (!userDoc.exists()) {
      return []; // Return empty array for new users
    }

    const userData = userDoc.data();
    const cards = userData.cards || {};

    // Convert to array for easier processing
    const cardList = Object.entries(cards).map(([key, value]) => ({
      id: key,
      ...value
    }));

    // Filter cards by country - using case-insensitive comparison
    const filteredCardList = cardList.filter(card => {
      // If card has no country, include it in all regions
      if (!card.country) return true;

      // Otherwise do case-insensitive comparison
      return card.country.toLowerCase() === selectedCountry.toLowerCase();
    });

    // Update cache with unfiltered list
    setCachedData(userId, cardList);

    return filteredCardList;
  } catch (error) {
    recordError('firebase_get_cards_error', { error: error.message }, false);
    // Return empty array on error
    return [];
  }
};

//Add updateCardForUser function
export const updateCardForUser = async (userId, cardData) => {
  try {
    const { db, funcs } = await loadFirestore();
    if (!db || !funcs) throw new Error("Firestore not initialized");
    const { doc, updateDoc, FieldPath } = funcs;

    const userRef = doc(db, 'users', userId);

    // Destructure and remove unwanted fields
    const {
      id,
      image,
      orientation,
      updatedAt,
      addedAt,
      ...cardDetails
    } = cardData;

    // Sanitize card details
    const sanitizedDetails = Object.keys(cardDetails).reduce((acc, key) => {
      const val = cardDetails[key];
      if (typeof val === 'string') acc[key] = sanitizeString(val, 200);
      else if (typeof val === 'number') acc[key] = sanitizeNumber(val);
      else if (typeof val === 'boolean') acc[key] = val;
      return acc;
    }, {});

    // Use FieldPath to treat dots in card key as literal characters, not nested paths
    await updateDoc(userRef, {
      [new FieldPath('cards', id)]: {
        ...sanitizedDetails
      }
    });

    // Clear cache to force a fresh fetch next time
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
    localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);

    return id;
  } catch (error) {
    recordError('firebase_update_card_error', { error: error.message }, false);
    throw error;
  }
};

// Function to delete a card for a user
export const deleteCardForUser = async (userId, cardKey) => {
  try {
    const { db, funcs } = await loadFirestore();
    if (!db || !funcs) throw new Error("Firestore not initialized");
    const { doc, updateDoc, deleteField, FieldPath } = funcs;

    const userRef = doc(db, 'users', userId);
    // Use FieldPath to treat dots in card key as literal characters, not nested paths
    await updateDoc(userRef, {
      [new FieldPath('cards', cardKey)]: deleteField()
    });

    // Clear cache to force a fresh fetch next time
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
    localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);
  } catch (error) {
    recordError('firebase_delete_card_error', { error: error.message }, false);
    throw error;
  }
};

// Function to force refresh the cache
export const refreshCardCache = async (userId) => {
  try {
    if (typeof window === 'undefined') return [];

    // Clear cache
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
    localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);

    const { db, funcs } = await loadFirestore();
    if (!db || !funcs) return [];
    const { doc, getDoc } = funcs;

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const cards = userData.cards || {};

    const cardList = Object.entries(cards).map(([key, value]) => ({
      id: key,
      ...value
    }));

    return cardList;
  } catch (error) {
    recordError('firebase_refresh_cache_error', { error: error.message }, false);
    throw error;
  }
};

// Function to delete user data
export const deleteUserData = async (userId) => {
  try {
    const { db, funcs } = await loadFirestore();
    if (!db || !funcs) throw new Error("Firestore not initialized");
    const { doc, deleteDoc } = funcs;

    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);

    // Clear cache
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
    localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);
  } catch (error) {
    recordError('firebase_delete_user_error', { error: error.message }, false);
    throw error;
  }
};