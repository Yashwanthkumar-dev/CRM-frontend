import axios from "axios";
import { param } from "framer-motion/client";

const BASE_URL = "https://yash-crm-backend.loca.lt";
const dashboardUrl = `${BASE_URL}/dashboardStatus`;
const customerUrl = `${BASE_URL}/customer`;
const leadUrl = `${BASE_URL}/lead`;
const leadActivityUrl = `${BASE_URL}/viewLeadActivitiesById`;
const employeeUrl = `${BASE_URL}/employee`;
//  -- global token getting --

const globalToken = () => {
  const token = localStorage.getItem("token");
  console.log("Token", token);

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Bypass-Tunnel-Reminder": "true",
    },
  };
};

// dashboard url

export const dashboardAnalytics = async () => {
  try {
    const respone = await axios.get(dashboardUrl, globalToken());
    return respone.data;
  } catch (error) {
    throw error;
  }
};

export const viewAllCustomerDetails = async () => {
  try {
    const response = await axios.get(
      `${customerUrl}/viewAllCustomer`,
      globalToken(),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteSingleCustomer = async (id) => {
  try {
    const response = await axios.delete(
      `${customerUrl}/deleteSingleCustomerById/${id}`,
      globalToken(),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const leadSourceAnalytics = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/leadSourceAnalytics`,
      globalToken(),
    );
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
      globalToken(),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const viewAllLead = async () => {
  try {
    const respone = await axios.get(`${leadUrl}/viewLeads`, globalToken());
    console.log(respone.data);
    return respone.data;
  } catch (error) {
    throw error;
  }
};

export const createLead = async (addLead) => {
  try {
    const response = await axios.post(
      `${leadUrl}/addLead`,
      addLead,
      globalToken(),
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSingleLead = async (id) => {
  try {
    const response = await axios.delete(
      `${leadUrl}/deleteSingleLead/${id}`,
      globalToken(),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFollowUps = async (id, status) => {
  try {
    const response = await axios.patch(`${leadUrl}/updateStatus/${id}`, null, {
      ...globalToken(),
      params: {
        status: status,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const convertConversion = async (id) => {
  try {
    const response = await axios.post(
      `${leadUrl}/convert/${id}`,
      null,
      globalToken(),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const viewLeadActivities = async (id) => {
  try {
    const response = await axios.get(`${leadUrl}/${id}`, globalToken()); // /leads/{id}
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createActivity = async (leadId, activityData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/activity/${leadId}`,
      activityData,
      globalToken(),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTime = async (leadId, timeString) => {
  try {
    const response = await axios.patch(
      `${leadUrl}/updateNextTime/${leadId}`,
      null,
      {
        ...globalToken(),
        params: {
          time: timeString,
        },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const leadsAnalytics = async () => {
  try {
    const response = await axios.get(
      `${leadUrl}/leadsAnalytics`,
      globalToken(),
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const convertion = async (id) => {
  try {
    const response = await axios.post(
      `${leadUrl}/convert/${id}`,
      globalToken(),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStatusApi = async (id, updateStatus) => {
  try {
    const response = await axios.patch(`${leadUrl}/updateStatus/${id}`, null, {
      ...globalToken(),
      params: {
        status: updateStatus,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const viewLeadActivitiesById = async (id) => {
  try {
    const response = await axios.get(`${leadActivityUrl}/${id}`, globalToken());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSourceDataApi = async () => {
  try {
    const response = await axios.get(`${leadUrl}/leadSource`, globalToken());

    return response.data;
  } catch (error) {
    throw error;
  }
};

//  ---- login api ----

export const loginApi = async (loginData) => {
  try {
    const respone = await axios.post(`${BASE_URL}/login`, loginData, {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    if (respone.data) {
      localStorage.setItem("token", respone.data.token);
      localStorage.setItem("role", respone.data.role);
    }
    return respone.data;
  } catch (error) {
    throw error;
  }
};

//  ---- registration api ----

export const registrationApi = async (registerData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, registerData, {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    if (response.ok) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

// fetch employee details
export const fetchEmployeeProfile = async () => {
  try {
    const response = await axios.get(
      `${employeeUrl}/fetchEmployeeProfile`,
      globalToken(),
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// uploade image api

export const uploadImageApi = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      `${employeeUrl}/uploadEmployeeImage`,
      formData,
      {
        headers: {
          ...globalToken().headers, //
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

//  --- fetch all employee ---

export const fetchAllEmployeeDetailsApi = async () => {
  try {
    const response = await axios.get(
      `${employeeUrl}/fetchEmployee`,
      globalToken(),
    );
    return response.data;
  } catch (error) {
    console.log("Api error :", error);

    throw error;
  }
};

//  --- delete employee by id ---

export const deleteEmployeeDetailsApi = async (id) => {
  try {
    const response = await axios.delete(
      `${employeeUrl}/deleteEmployeeById/${id}`,
      globalToken(),
    );
    return response.data;
  } catch (error) {
    console.log("System error : ", error);

    throw error;
  }
};

//  --- role accesss ---

export const updateRoleApi = async (id, roleData) => {
  try {
    const response = await axios.patch(
      `${employeeUrl}/updateEmployeeToAdmin/${id}`,
      null,
      {
        ...globalToken(),
        params: {
          role: roleData,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log("Api error :", error);
    throw error;
  }
};
