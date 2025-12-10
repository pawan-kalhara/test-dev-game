/*
  Simulated User Service (Virtual Identity)
  Uses localStorage to simulate a database.
  This is for prototype purposes only.
*/
/*const DB_USERS = 'monkey_game_users';
const DB_DATA = 'monkey_game_data';
const SESSION_KEY = 'monkey_game_session';

const getDb = (key) => JSON.parse(localStorage.getItem(key) || '{}');
const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

const commitUsers = (users) => localStorage.setItem(DB_USERS, JSON.stringify(users));
const commitData = (data) => localStorage.setItem(DB_DATA, JSON.stringify(data));
const commitSession = (user) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const authService = {
  register(email, password) {
    return new Promise((resolve, reject) => {
      const users = getDb(DB_USERS);
      if (users[email]) {
        return reject(new Error("User already exists. Please login."));
      }
      
    
      users[email] = password;
      commitUsers(users);
      
      const data = getDb(DB_DATA);
      data[email] = { avatar: null, highScore: 0 };
      commitData(data);
      
      const newUser = { email, ...data[email] };
      commitSession(newUser);
      resolve(newUser);
    });
  },

  login(email, password) {
    return new Promise((resolve, reject) => {
      const users = getDb(DB_USERS);
      const storedPassword = users[email];
      
      if (!storedPassword || storedPassword !== password) {
        return reject(new Error("Invalid email or password."));
      }
      
      const data = getDb(DB_DATA);
      const userData = data[email] || { avatar: null, highScore: 0 };
      const user = { email, ...userData };
      commitSession(user);
      resolve(user);
    });
  },

  logout() {
    commitSession(null);
  },

  getCurrentUser() {
    return getSession();
  },

  saveUserData(email, data) {
    return new Promise((resolve) => {
      const allData = getDb(DB_DATA);
      allData[email] = data;
      commitData(allData);
      
      // Also update the active session
      const session = getSession();
      if (session && session.email === email) {
        commitSession({ email, ...data });
      }
      resolve(data);
    });
  }
};*/
// src/services/authService.js

import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  query,
  orderBy,
  limit,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';


/**
 * Firebase-backed Authentication Service
 * 
 * Firestore structure:
 * users/{uid} => { email, avatar, highScore }
 */


const USERS_COLLECTION = 'users';


// Helper to get user document reference
const getUserDocRef = (uid) => doc(db, USERS_COLLECTION, uid);


export const authService = {
  /**
   * Register a new user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{uid: string, email: string, avatar: string|null, highScore: number}>}
   */
  async register(email, password) {
    try {
      // Create Firebase auth account
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = cred.user;

      // Create user profile in Firestore
      const userDocRef = getUserDocRef(uid);
      const defaultData = { 
        email, 
        avatar: null, 
        highScore: 0,
        createdAt: Date.now()
      };

      await setDoc(userDocRef, defaultData);

      return { uid, ...defaultData };
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use. Please login instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      }
      throw new Error(error.message);
    }
  },

  /**
   * Login existing user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{uid: string, email: string, avatar: string|null, highScore: number}>}
   */
  async login(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const { uid } = cred.user;

      // Get user profile from Firestore
      const userDocRef = getUserDocRef(uid);
      const snap = await getDoc(userDocRef);

      if (!snap.exists()) {
        // Create default profile if missing (shouldn't happen normally)
        const defaultData = { 
          email: cred.user.email, 
          avatar: null, 
          highScore: 0,
          createdAt: Date.now()
        };
        await setDoc(userDocRef, defaultData);
        return { uid, ...defaultData };
      }

      return { uid, ...snap.data() };
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid credentials. Please check your email and password.');
      }
      throw new Error(error.message);
    }
  },

  /**
   * Login with Google (OAuth)
   * @returns {Promise<{uid: string, email: string, avatar: string|null, highScore: number}>}
   */
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const { uid, email } = cred.user;

      // Check if user profile exists
      const userDocRef = getUserDocRef(uid);
      const snap = await getDoc(userDocRef);

      if (!snap.exists()) {
        // Create profile for new Google user
        const defaultData = { 
          email, 
          avatar: null, 
          highScore: 0,
          createdAt: Date.now()
        };
        await setDoc(userDocRef, defaultData);
        return { uid, ...defaultData };
      }

      return { uid, ...snap.data() };
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed. Please try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled.');
      }
      throw new Error(error.message);
    }
  },

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error('Failed to logout: ' + error.message);
    }
  },

  /**
   * Subscribe to authentication state changes (session management)
   * @param {Function} callback - Called with user data or null
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        callback(null);
        return;
      }

      try {
        const userDocRef = getUserDocRef(user.uid);
        const snap = await getDoc(userDocRef);

        if (!snap.exists()) {
          // Create default profile if it doesn't exist
          const defaultData = { 
            email: user.email, 
            avatar: null, 
            highScore: 0,
            createdAt: Date.now()
          };
          await setDoc(userDocRef, defaultData);
          callback({ uid: user.uid, ...defaultData });
        } else {
          callback({ uid: user.uid, ...snap.data() });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        callback(null);
      }
    });
  },

  /**
   * Get currently logged-in user (one-time check)
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    return auth.currentUser;
  },

  /**
   * Save/update user data (avatar, highScore, etc.)
   * @param {string} uid - User ID
   * @param {Object} partialData - Data to update { avatar?, highScore? }
   * @returns {Promise<{uid: string, ...data}>}
   */
  async saveUserData(uid, partialData) {
    try {
      const userDocRef = getUserDocRef(uid);
      
      // Update only the provided fields
      await updateDoc(userDocRef, {
        ...partialData,
        updatedAt: Date.now()
      });

      // Fetch and return updated data
      const snap = await getDoc(userDocRef);
      return { uid, ...snap.data() };
    } catch (error) {
      throw new Error('Failed to save user data: ' + error.message);
    }
  },

  /**
   * Get user profile data by UID
   * @param {string} uid 
   * @returns {Promise<{email: string, avatar: string|null, highScore: number}>}
   */
  async getUserData(uid) {
    try {
      const userDocRef = getUserDocRef(uid);
      const snap = await getDoc(userDocRef);
      
      if (!snap.exists()) {
        throw new Error('User profile not found');
      }

      return snap.data();
    } catch (error) {
      throw new Error('Failed to get user data: ' + error.message);
    }
  },

  /**
   * Get top N players by high score
   * @param {number} limitCount - Number of top players to fetch
   * @returns {Promise<Array>}
   */
  async getTopPlayers(limitCount = 3) {
    try {
      const usersRef = collection(db, USERS_COLLECTION);
      
      // Query users ordered by high score in descending order
      const q = query(
        usersRef,
        orderBy('highScore', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const players = [];
      
      snapshot.forEach((doc) => {
        players.push({
          uid: doc.id,
          email: doc.data().email,
          highScore: doc.data().highScore || 0,
          avatar: doc.data().avatar
        });
      });
      
      return players;
    } catch (error) {
      console.error('Error fetching top players:', error);
      return [];
    }
  }
};
