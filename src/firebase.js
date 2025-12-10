import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCDnP_fTTptBzNIIdyqhnLd7ubmjBDt9Kw",
  authDomain: "monkeyquest-2d-game.firebaseapp.com",
  projectId: "monkeyquest-2d-game",
  storageBucket: "monkeyquest-2d-game.firebasestorage.app",
  messagingSenderId: "11649577414",
  appId: "1:11649577414:web:ffbf63078143aa36f982c7",

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;