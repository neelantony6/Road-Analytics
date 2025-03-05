import { apiRequest } from "./queryClient";

export const api = {
  // Traffic Reports
  async getTrafficReports() {
    const res = await apiRequest("GET", "/api/reports");
    return res.json();
  },

  async createTrafficReport(data: any) {
    const res = await apiRequest("POST", "/api/reports", data);
    return res.json();
  },

  // Safety Suggestions
  async getSafetySuggestions() {
    const res = await apiRequest("GET", "/api/suggestions");
    return res.json();
  },

  async createSafetySuggestion(data: any) {
    const res = await apiRequest("POST", "/api/suggestions", data);
    return res.json();
  },

  async upvoteSuggestion(id: number) {
    const res = await apiRequest("POST", `/api/suggestions/${id}/upvote`);
    return res.json();
  },

  // Traffic Conditions
  async getTrafficConditions() {
    const res = await apiRequest("GET", "/api/conditions");
    return res.json();
  },

  async createTrafficCondition(data: any) {
    const res = await apiRequest("POST", "/api/conditions", data);
    return res.json();
  }
};
