import { db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, deleteField, serverTimestamp } from 'firebase/firestore';

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
  
      return cardKey;
    } catch (error) {
      console.error("Error adding card:", error);
      throw error;
    }
  };

// Function to get all cards for a user
export const getCardsForUser = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        console.log('No user document found');
        return [];
      }
  
      const userData = userDoc.data();
      const cards = userData.cards || {};
  
      return Object.entries(cards).map(([key, value]) => ({
        id: key,
        ...value
      }));
    } catch (error) {
      console.error("Error fetching cards:", error);
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
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  };