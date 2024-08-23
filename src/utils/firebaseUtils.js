import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

// Function to add a card for a user
export const addCardForUser = async (userId, cardData) => {
  try {
    const cardRef = await addDoc(collection(db, 'users', userId, 'cards'), {
      ...cardData,
      createdAt: serverTimestamp()
    });
    return cardRef.id;
  } catch (error) {
    console.error("Error adding card:", error);
    throw error;
  }
};

// Function to get all cards for a user
export const getCardsForUser = async (userId) => {
    try {
      const cardsRef = collection(db, 'users', userId, 'cards');
      const cardsSnapshot = await getDocs(cardsRef);
      
      if (cardsSnapshot.empty) {
        console.log('No cards found for user');
        return [];
      }
  
      return cardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching cards:", error);
      throw error; // Re-throw the error to be handled in the component
    }
  };

// Function to delete a card for a user
export const deleteCardForUser = async (userId, cardId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'cards', cardId));
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};