// Firebase configuration and service
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: "https://alt-coursework-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Initialize anonymous authentication on load
signInAnonymously(auth)
  .then(() => {
    console.log('Anonymous authentication successful');
  })
  .catch((error) => {
    console.error('Anonymous authentication failed:', error);
  });

// Firebase Data Service
export const firebaseService = {
  // Get all accident data
  async getAccidentData() {
    try {
      // Wait for auth to initialize
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user);
        });
      });

      const accidentRef = ref(db, 'accident_data');
      const snapshot = await get(accidentRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.error('No data available in the database');
        return {};
      }
    } catch (error) {
      console.error('Error fetching accident data:', error);
      throw error;
    }
  },

  // Search accident data
  async searchAccidentData(searchTerm) {
    try {
      const accidentRef = ref(db, 'accident_data');
      const snapshot = await get(accidentRef);

      if (!snapshot.exists()) {
        return [];
      }

      const data = snapshot.val();
      const searchTermLower = searchTerm.toLowerCase();

      return Object.entries(data)
        .filter(([state]) => state.toLowerCase().includes(searchTermLower))
        .map(([state, data]) => ({
          state,
          ...data
        }));
    } catch (error) {
      console.error('Error searching accident data:', error);
      throw error;
    }
  },

  // Get yearly trend data
  async getYearlyTrends() {
    try {
      const trendsRef = ref(db, 'yearly_trends');
      const snapshot = await get(trendsRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.error('No trend data available');
        return {};
      }
    } catch (error) {
      console.error('Error fetching trend data:', error);
      throw error;
    }
  }
};

export { db };