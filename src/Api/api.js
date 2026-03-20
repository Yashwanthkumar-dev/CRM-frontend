import axios from "axios";

const BASE_URL = "http://localhost:8081";
const dashboardUrl = `${BASE_URL}/dashboardStatus`;

// dashboard url

export const dashboardAnalytics = async () => {
  try {
    const respone = await axios.get(dashboardUrl);
    return respone.data;
  } catch (error) {
    throw error;
  }
};
