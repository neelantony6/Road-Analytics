// Firebase configuration and service
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, query, orderByChild } from "firebase/database";

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

// Firebase Data Service
export const firebaseService = {
  // Get all accident data
  async getAccidentData() {
    try {
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
  },
  // Submit accident report
  async submitAccidentReport(data) {
    try {
      const reportsRef = ref(db, 'accident_reports');
      await push(reportsRef, {
        ...data,
        timestamp: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error submitting accident report:', error);
      throw error;
    }
  },

  // Get all accident reports
  async getAccidentReports() {
    try {
      const reportsRef = ref(db, 'accident_reports');
      const snapshot = await get(reportsRef);
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      }
      return [];
    } catch (error) {
      console.error('Error fetching accident reports:', error);
      throw error;
    }
  },

  // Submit traffic report
  async submitTrafficReport(data) {
    try {
      const reportsRef = ref(db, 'traffic_reports');
      await push(reportsRef, {
        ...data,
        timestamp: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error submitting traffic report:', error);
      throw error;
    }
  },

  // Submit safety suggestion
  async submitSafetySuggestion(data) {
    try {
      const suggestionsRef = ref(db, 'safety_suggestions');
      await push(suggestionsRef, {
        ...data,
        timestamp: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error submitting safety suggestion:', error);
      throw error;
    }
  },

  // Get analytics data
  async getAnalyticsData() {
    try {
      const accidentReportsRef = ref(db, 'accident_reports');
      const trafficReportsRef = ref(db, 'traffic_reports');
      const suggestionsRef = ref(db, 'safety_suggestions');

      const [accidentSnapshot, trafficSnapshot, suggestionsSnapshot] = await Promise.all([
        get(accidentReportsRef),
        get(trafficReportsRef),
        get(suggestionsRef)
      ]);

      return {
        accidentReports: accidentSnapshot.exists() ? Object.values(accidentSnapshot.val()) : [],
        trafficReports: trafficSnapshot.exists() ? Object.values(trafficSnapshot.val()) : [],
        safetySuggestions: suggestionsSnapshot.exists() ? Object.values(suggestionsSnapshot.val()) : []
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }
};

export { db };