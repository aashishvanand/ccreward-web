import { firebaseApp } from '@/firebase';

const CACHE_KEY = 'userCardsCache';
const CACHE_TIMESTAMP_KEY = 'userCardsCacheTimestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper function to get cached data
const getCachedData = (userId) => {
  if (typeof window === 'undefined') return null;
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
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(data));
  localStorage.setItem(`${CACHE_TIMESTAMP_KEY}_${userId}`, new Date().getTime().toString());
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
    const { doc, getDoc, setDoc, serverTimestamp, updateDoc } = funcs;

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create the user document if it doesn't exist
      await setDoc(userRef, { createdAt: serverTimestamp() });
    }

    // Get country from region context or local storage
    const country = localStorage.getItem('app-region')?.toLowerCase() || 'in';

    // Create a new object with only essential and provided fields
    const cardToAdd = {
      bank: cardData.bank,
      cardName: cardData.cardName,
      country: country
    };

    // Conditionally add optional fields only if they exist
    if (cardData.network) cardToAdd.network = cardData.network;
    if (cardData.billingDate) cardToAdd.billingDate = cardData.billingDate;
    if (cardData.limit) cardToAdd.limit = cardData.limit;
    if (cardData.since) cardToAdd.since = cardData.since;

    // Add server timestamp
    cardToAdd.addedAt = serverTimestamp();

    const cardKey = `${cardData.bank}_${cardData.cardName}`;
    await updateDoc(userRef, {
      [`cards.${cardKey}`]: cardToAdd
    });

    // Clear cache to force a fresh fetch next time
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
    localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);

    // Return the card key
    return cardKey;
  } catch (error) {
    console.error("Error adding card:", error);
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
    console.error("❌ Error fetching cards:", error);
    // Return empty array on error
    return [];
  }
};

//Add updateCardForUser function
export const updateCardForUser = async (userId, cardData) => {
  try {
    const { db, funcs } = await loadFirestore();
    if (!db || !funcs) throw new Error("Firestore not initialized");
    const { doc, updateDoc } = funcs;

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

    await updateDoc(userRef, {
      [`cards.${id}`]: {
        ...cardDetails
      }
    });

    // Clear cache to force a fresh fetch next time
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
    localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);

    return id;
  } catch (error) {
    console.error("Error updating card:", error);
    throw error;
  }
};

// Function to delete a card for a user
export const deleteCardForUser = async (userId, cardKey) => {
  try {
    const { db, funcs } = await loadFirestore();
    if (!db || !funcs) throw new Error("Firestore not initialized");
    const { doc, updateDoc, deleteField } = funcs;

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`cards.${cardKey}`]: deleteField()
    });

    // Clear cache to force a fresh fetch next time
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
    localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${userId}`);
  } catch (error) {
    console.error("Error deleting card:", error);
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
    console.error("Error refreshing card cache:", error);
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
    console.error("Error deleting user data:", error);
    throw error;
  }
};