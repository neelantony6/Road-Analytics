// Firebase configuration and service
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug log to check URL format (without exposing the actual URL)
console.log('Initializing Firebase with database URL pattern:', 
  firebaseConfig.databaseURL?.includes('firebaseio.com') ? 'Valid URL pattern' : 'Invalid URL pattern');

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
      console.log('Submitting accident report:', data); // Debug log
      const reportsRef = ref(db, 'accident_reports');
      const result = await push(reportsRef, {
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log('Successfully submitted report:', result.key); // Debug log
      return true;
    } catch (error) {
      console.error('Error submitting accident report:', error);
      throw new Error('Failed to submit accident report. Please try again.');
    }
  },

  // Get all accident reports
  async getAccidentReports() {
    try {
      console.log('Fetching accident reports'); // Debug log
      const reportsRef = ref(db, 'accident_reports');
      const snapshot = await get(reportsRef);
      if (snapshot.exists()) {
        const reports = Object.values(snapshot.val());
        console.log('Retrieved reports:', reports.length); // Debug log
        return reports;
      }
      console.log('No reports found'); // Debug log
      return [];
    } catch (error) {
      console.error('Error fetching accident reports:', error);
      throw new Error('Failed to fetch accident reports. Please try again.');
    }
  },

  // Submit traffic report
  async submitTrafficReport(data) {
    try {
      console.log('Submitting traffic report:', data); // Debug log
      const reportsRef = ref(db, 'traffic_reports');
      const result = await push(reportsRef, {
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log('Successfully submitted traffic report:', result.key); // Debug log
      return true;
    } catch (error) {
      console.error('Error submitting traffic report:', error);
      throw new Error('Failed to submit traffic report. Please try again.');
    }
  },

  // Get traffic reports
  async getTrafficReports() {
    try {
      const reportsRef = ref(db, 'traffic_reports');
      const snapshot = await get(reportsRef);
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      }
      return [];
    } catch (error) {
      console.error('Error fetching traffic reports:', error);
      throw new Error('Failed to fetch traffic reports. Please try again.');
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