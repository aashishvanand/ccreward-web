import { firebaseApp } from '@/firebase';
import { recordError } from './errorTracking';

// Helper to load firestore dynamically
const loadFirestore = async () => {
  if (typeof window === 'undefined') return { db: null, funcs: null };
  const funcs = await import('firebase/firestore');
  const db = funcs.getFirestore(firebaseApp);
  return { db, funcs };
};

// Function to delete user data
export const deleteUserData = async (userId) => {
  try {
    const { db, funcs } = await loadFirestore();
    if (!db || !funcs) throw new Error("Firestore not initialized");
    const { doc, deleteDoc } = funcs;

    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    recordError('firebase_delete_user_error', { error: error.message }, false);
    throw error;
  }
};
