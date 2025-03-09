// Firebase configuration and service
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: "https://alt-coursework-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug log to check URL format (without exposing the actual URL)
console.log('Initializing Firebase with database URL:', firebaseConfig.databaseURL);

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

  // Submit accident report
  async submitAccidentReport(data) {
    try {
      console.log('Submitting accident report:', data);
      const reportsRef = ref(db, 'accident_reports');
      const result = await push(reportsRef, {
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log('Successfully submitted report:', result.key);
      return true;
    } catch (error) {
      console.error('Error submitting accident report:', error);
      throw new Error('Failed to submit accident report. Please try again.');
    }
  },

  // Get all accident reports
  async getAccidentReports() {
    try {
      console.log('Fetching accident reports');
      const reportsRef = ref(db, 'accident_reports');
      const snapshot = await get(reportsRef);
      if (snapshot.exists()) {
        const reports = Object.values(snapshot.val());
        console.log('Retrieved reports:', reports.length);
        return reports;
      }
      console.log('No reports found');
      return [];
    } catch (error) {
      console.error('Error fetching accident reports:', error);
      throw new Error('Failed to fetch accident reports. Please try again.');
    }
  },

  // Submit traffic report
  async submitTrafficReport(data) {
    try {
      console.log('Submitting traffic report:', data);
      const reportsRef = ref(db, 'traffic_reports');
      const result = await push(reportsRef, {
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log('Successfully submitted traffic report:', result.key);
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
  }
};

export { db };