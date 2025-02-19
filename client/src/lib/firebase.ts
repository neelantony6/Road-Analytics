import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.asia-southeast1.firebasedatabase.app`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseAuthVariableOverride: null
};

let db;

try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);

  // Verify database connection
  const dbRef = ref(db);
  get(dbRef).then(() => {
    console.log('Successfully connected to Firebase Realtime Database');
  }).catch((error) => {
    console.error('Error connecting to Firebase:', error.message);
    // Provide more detailed error information
    if (error.code === 'PERMISSION_DENIED') {
      console.error('Firebase permission denied. Please check database rules.');
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network error. Please check your internet connection.');
    }
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { db };