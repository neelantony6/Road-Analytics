// Mock Firebase service implementation
export const firebaseService = {
  // Get all accident data
  async getAccidentData() {
    return {
      "Maharashtra": { 
        total_accidents: 15234, 
        fatal_accidents: 3400,
        yearly_data: {
          "2019": { total: 12187, fatal: 2720 },
          "2020": { total: 12950, fatal: 2890 },
          "2021": { total: 13710, fatal: 3060 },
          "2022": { total: 14472, fatal: 3230 },
          "2023": { total: 15234, fatal: 3400 }
        }
      },
      "Delhi": { 
        total_accidents: 12000, 
        fatal_accidents: 2800,
        yearly_data: {
          "2019": { total: 9600, fatal: 2240 },
          "2020": { total: 10200, fatal: 2380 },
          "2021": { total: 10800, fatal: 2520 },
          "2022": { total: 11400, fatal: 2660 },
          "2023": { total: 12000, fatal: 2800 }
        }
      },
      "Tamil Nadu": { 
        total_accidents: 18050, 
        fatal_accidents: 4000,
        yearly_data: {
          "2019": { total: 14440, fatal: 3200 },
          "2020": { total: 15342, fatal: 3400 },
          "2021": { total: 16245, fatal: 3600 },
          "2022": { total: 17147, fatal: 3800 },
          "2023": { total: 18050, fatal: 4000 }
        }
      }
    };
  },

  // Mock other methods with empty implementations
  async submitTrafficReport() {
    return { success: true };
  },

  async submitSafetySuggestion() {
    return { success: true };
  },

  async getTrafficReports() {
    return [];
  },

  async getSafetySuggestions() {
    return [];
  },

  async upvoteSuggestion() {
    return { success: true };
  }
};

// Export mock db
export const db = {};