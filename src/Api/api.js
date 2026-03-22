import axios from "axios";

const BASE_URL = "http://localhost:8081";
const dashboardUrl = `${BASE_URL}/dashboardStatus`;
const customerUrl = `${BASE_URL}/customer`;
const leadUrl = `${BASE_URL}/lead`;

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

export const leadSourceAnalytics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/leadSourceAnalytics`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCustomerDetails = async (id, updateCustomer) => {
  try {
    const response = await axios.put(
      `${customerUrl}/updateSingleCustomerAllDetails/${id}`,
      updateCustomer,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const viewAllLead = async () => {
  try {
    const respone = await axios.get(`${leadUrl}/viewLeads`);
    console.log(respone.data);
    return respone.data;
  } catch (error) {
    throw error;
  }
};

export const createLead = async () => {
  try {
    const response = await axios.post(`${leadUrl}/addLead`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
