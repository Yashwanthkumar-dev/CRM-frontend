import axios from "axios";

const BASE_URL = "http://localhost:8081";
const dashboardUrl = `${BASE_URL}/dashboardStatus`;
const customerUrl = `${BASE_URL}/customer`;

// dashboard url

export const dashboardAnalytics = async () => {
  try {
    const respone = await axios.get(dashboardUrl);
    return respone.data;
  } catch (error) {
    throw error;
  }
};

export const viewAllCustomerDetails = async () => {
  try {
    const response = await axios.get(`${customerUrl}/viewAllCustomer`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteSingleCustomer = async (id) => {
  try {
    const response = await axios.delete(
      `${customerUrl}/deleteSingleCustomerById/${id}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
