import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, push, query, orderByChild } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Firebase Data Service with TypeScript interfaces
interface TrafficReport {
  date: string;
  location: string;
  severity: number;
  description: string;
  timestamp?: number;
}

interface SafetySuggestion {
  suggestion: string;
  category: 'infrastructure' | 'education' | 'enforcement';
  timestamp?: number;
  upvotes?: number;
}

export const firebaseService = {
  // Fetch all accident data
  async getAccidentData() {
    try {
      const accidentRef = ref(db, 'accident_data');
      const snapshot = await get(accidentRef);
      if (!snapshot.exists()) {
        console.log('No data available. Initializing with sample data...');
        await initializeFirebaseData();
        return (await get(accidentRef)).val();
      }
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching accident data:', error);
      throw error;
    }
  },

  // Submit a new traffic report
  async submitTrafficReport(report: TrafficReport) {
    const reportsRef = ref(db, 'traffic_reports');
    return push(reportsRef, {
      ...report,
      timestamp: Date.now()
    });
  },

  // Submit a safety suggestion
  async submitSafetySuggestion(suggestion: SafetySuggestion) {
    const suggestionsRef = ref(db, 'safety_suggestions');
    return push(suggestionsRef, {
      ...suggestion,
      timestamp: Date.now(),
      upvotes: 0
    });
  },

  // Get all traffic reports
  async getTrafficReports() {
    const reportsRef = ref(db, 'traffic_reports');
    const reportsQuery = query(reportsRef, orderByChild('timestamp'));
    const snapshot = await get(reportsQuery);
    return snapshot.val();
  },

  // Get all safety suggestions
  async getSafetySuggestions() {
    const suggestionsRef = ref(db, 'safety_suggestions');
    const suggestionsQuery = query(suggestionsRef, orderByChild('timestamp'));
    const snapshot = await get(suggestionsQuery);
    return snapshot.val();
  },

  // Upvote a safety suggestion
  async upvoteSuggestion(suggestionId: string) {
    const suggestionRef = ref(db, `safety_suggestions/${suggestionId}`);
    const snapshot = await get(suggestionRef);
    const currentUpvotes = snapshot.val()?.upvotes || 0;
    return set(suggestionRef, {
      ...snapshot.val(),
      upvotes: currentUpvotes + 1
    });
  }
};

// Sample data structure for initial setup in Firebase:
const sampleData = {
  accident_data: {
    "Maharashtra": { 
      "total_accidents": 15234, 
      "fatal_accidents": 3400,
      "yearly_data": {
        "2019": { "total": 12187, "fatal": 2720 },
        "2020": { "total": 12950, "fatal": 2890 },
        "2021": { "total": 13710, "fatal": 3060 },
        "2022": { "total": 14472, "fatal": 3230 },
        "2023": { "total": 15234, "fatal": 3400 }
      }
    },
    "Delhi": { 
      "total_accidents": 12000, 
      "fatal_accidents": 2800,
      "yearly_data": {
        "2019": { "total": 9600, "fatal": 2240 },
        "2020": { "total": 10200, "fatal": 2380 },
        "2021": { "total": 10800, "fatal": 2520 },
        "2022": { "total": 11400, "fatal": 2660 },
        "2023": { "total": 12000, "fatal": 2800 }
      }
    },
    "Tamil Nadu": { 
      "total_accidents": 18050, 
      "fatal_accidents": 4000,
      "yearly_data": {
        "2019": { "total": 14440, "fatal": 3200 },
        "2020": { "total": 15342, "fatal": 3400 },
        "2021": { "total": 16245, "fatal": 3600 },
        "2022": { "total": 17147, "fatal": 3800 },
        "2023": { "total": 18050, "fatal": 4000 }
      }
    }
  }
};

export const initializeFirebaseData = async () => {
  // Only use this function once to initialize the database
  const rootRef = ref(db);
  await set(rootRef, sampleData);
};

try {
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