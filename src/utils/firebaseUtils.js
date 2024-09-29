import { db } from '../../firebase';
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

    const cardKey = `${cardData.bank}_${cardData.cardName}`;
    await updateDoc(userRef, {
      [`cards.${cardKey}`]: {
        ...cardData,
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
    // Check cache first
    const cachedCards = getCachedData(userId);
    if (cachedCards) return cachedCards;

    // If not in cache, fetch from Firebase
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      try {
        await setDoc(userRef, { createdAt: serverTimestamp(), cards: {} });
      } catch (error) {
        console.error('Error creating user document:', error);
        // If we can't create the document, return an empty array
        return [];
      }
      return []; // New user, no cards yet
    }

    const userData = userDoc.data();
    const cards = userData.cards || {};

    const cardList = Object.entries(cards).map(([key, value]) => ({
      id: key,
      ...value
    }));

    // Update cache
    setCachedData(userId, cardList);

    return cardList;
  } catch (error) {
    console.error("Error fetching cards:", error);
    // Instead of throwing the error, return an empty array
    return [];
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