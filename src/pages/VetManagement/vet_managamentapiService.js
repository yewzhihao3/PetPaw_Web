import axios from "axios";
import { API_URL } from "../../config";

const getAuthToken = () => {
  return localStorage.getItem("userToken");
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllVeterinarians = async () => {
  try {
    const response = await api.get("/veterinarians/", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching veterinarians:", error);
    throw error;
  }
};

export const createVeterinarian = async (veterinarianData) => {
  try {
    const formData = new FormData();
    for (const key in veterinarianData) {
      formData.append(key, veterinarianData[key]);
    }
    const response = await api.post("/veterinarians/", formData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating veterinarian:", error);
    throw error;
  }
};

export const getVeterinarian = async (id) => {
  try {
    const response = await api.get(`/veterinarians/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching veterinarian:", error);
    throw error;
  }
};

export const updateVeterinarian = async (id, veterinarianData) => {
  try {
    const formData = new FormData();
    for (const key in veterinarianData) {
      formData.append(key, veterinarianData[key]);
    }
    const response = await api.put(`/veterinarians/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating veterinarian:", error);
    throw error;
  }
};

export const deleteVeterinarian = async (id) => {
  try {
    const response = await api.delete(`/veterinarians/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting veterinarian:", error);
    throw error;
  }
};
