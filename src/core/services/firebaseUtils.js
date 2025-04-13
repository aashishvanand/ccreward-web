import { db } from '../../../firebase';
import { doc, getDoc, setDoc, updateDoc, deleteField, serverTimestamp } from 'firebase/firestore';

const CACHE_KEY = 'userCardsCache';
const CACHE_TIMESTAMP_KEY = 'userCardsCacheTimestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper function to get cached data
const getCachedData = (userId) => {
  const cachedData = localStorage.getItem(`${CACHE_KEY}_${userId}`);
  const cacheTimestamp = localStorage.getItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);

  if (cachedData && cacheTimestamp) {
    const now = new Date().getTime();
    if (now - parseInt(cacheTimestamp) < CACHE_DURATION) {
      return JSON.parse(cachedData);
    }
  }
  return null;
};

// Helper function to set cached data
const setCachedData = (userId, data) => {
  localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(data));
  localStorage.setItem(`${CACHE_TIMESTAMP_KEY}_${userId}`, new Date().getTime().toString());
};

// Function to add a card for a user
export const addCardForUser = async (userId, cardData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create the user document if it doesn't exist
      await setDoc(userRef, { createdAt: serverTimestamp() });
    }

    // Get country from region context or local storage
    const country = localStorage.getItem('app-region')?.toLowerCase() || 'in';
    
    const cardKey = `${cardData.bank}_${cardData.cardName}`;
    await updateDoc(userRef, {
      [`cards.${cardKey}`]: {
        ...cardData,
        country: cardData.country || country, // Use provided country or default
        network: cardData.network || 'Visa', // Default to Visa if not provided
        billingDate: cardData.billingDate || 1, // Default to 1st
        limit: cardData.limit || 100000, // Default limit
        since: cardData.since || 'January, 2025', // Default date
        addedAt: serverTimestamp()
      }
    });

    // Update local cache
    const cachedCards = getCachedData(userId) || [];
    cachedCards.push({ id: cardKey, ...cardData });
    setCachedData(userId, cachedCards);

    return cardKey;
  } catch (error) {
    console.error("Error adding card:", error);
    throw error;
  }
};

// Function to get all cards for a user
export const getCardsForUser = async (userId) => {
  try {
    // Get current region/country
    const selectedCountry = localStorage.getItem('app-region')?.toLowerCase() || 'in';
    
    // Check cache first
    const cachedCards = getCachedData(userId);
    if (cachedCards) {
      // Filter cached cards by country
      return cachedCards.filter(card => !card.country || card.country === selectedCountry);
    }

    // If not in cache, fetch from Firebase
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    // If document doesn't exist, this is a new user
    if (!userDoc.exists()) {
      return []; // Return empty array for new users
    }

    const userData = userDoc.data();
    const cards = userData.cards || {};

    const cardList = Object.entries(cards)
      .map(([key, value]) => ({
        id: key,
        ...value
      }))
      // Filter cards by country
      .filter(card => !card.country || card.country === selectedCountry);

    // Update cache
    setCachedData(userId, cardList);

    return cardList;
  } catch (error) {
    // Silently handle any errors and return empty array
    return [];
  }
};

//Add updateCardForUser function
export const updateCardForUser = async (userId, cardData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Prepare updated card data
    const { id, ...cardDetails } = cardData;
    
    await updateDoc(userRef, {
      [`cards.${id}`]: {
        ...cardDetails,
        updatedAt: serverTimestamp()
      }
    });
    
    // Update local cache
    const cachedCards = getCachedData(userId) || [];
    const updatedCache = cachedCards.map(card => 
      card.id === id ? { ...card, ...cardDetails } : card
    );
    setCachedData(userId, updatedCache);
    
    return id;
  } catch (error) {
    console.error("Error updating card:", error);
    throw error;
  }
};

// Function to delete a card for a user
export const deleteCardForUser = async (userId, cardKey) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`cards.${cardKey}`]: deleteField()
    });

    // Update local cache
    const cachedCards = getCachedData(userId) || [];
    const updatedCards = cachedCards.filter(card => card.id !== cardKey);
    setCachedData(userId, updatedCards);
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};

// Function to force refresh the cache
export const refreshCardCache = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      setCachedData(userId, []);
      return [];
    }

    const userData = userDoc.data();
    const cards = userData.cards || {};

    const cardList = Object.entries(cards).map(([key, value]) => ({
      id: key,
      ...value
    }));

    setCachedData(userId, cardList);
    return cardList;
  } catch (error) {
    console.error("Error refreshing card cache:", error);
    throw error;
  }
};