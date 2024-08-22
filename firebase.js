import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBwArCVwu3sDvudkKO5wECRLhoAYmjvNh4",
    authDomain: "ccreward-7cf93.firebaseapp.com",
    projectId: "ccreward-7cf93",
    storageBucket: "ccreward-7cf93.appspot.com",
    messagingSenderId: "942389628088",
    appId: "1:942389628088:web:b409508a50487ddea2384d",
    measurementId: "G-3FTX7LCGBC"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();