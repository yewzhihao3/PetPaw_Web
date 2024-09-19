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

export const getServices = async () => {
  try {
    const response = await api.get("/appointments/services", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getVeterinarians = async () => {
  try {
    const response = await api.get("/appointments/veterinarians", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching veterinarians:", error);
    throw error;
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const getPetDetails = async (pet_id) => {
  try {
    const response = await api.get(`/pets/${pet_id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pet details:", error);
    throw error;
  }
};

export const getUserAppointments = async () => {
  try {
    const response = await api.get("/appointments", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw error;
  }
};

export const getAllAppointmentsData = async () => {
  try {
    const response = await api.get("/appointments/all", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all appointments data:", error);
    throw error;
  }
};

export const getBookedAppointments = async (date) => {
  try {
    const malaysiaDate = new Date(date);
    malaysiaDate.setUTCHours(0, 0, 0, 0);
    const formattedDate = malaysiaDate.toISOString().split("T")[0];
    const response = await api.get(
      `/appointments/booked?date=${formattedDate}`,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching booked appointments:", error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post(
      "/appointments/appointments",
      appointmentData,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await api.put(
      `/appointments/${appointmentId}`,
      appointmentData,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await api.delete(`/appointments/${appointmentId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};

export const declineAppointment = async (appointmentId, declineReason) => {
  try {
    const response = await api.post(
      `/appointments/${appointmentId}/decline`,
      { decline_reason: declineReason },
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error declining appointment:", error);
    throw error;
  }
};

export const createMedicalRecord = async (token, petId, medicalRecordData) => {
  try {
    const response = await axios.post(
      `${API_URL}/pets/${petId}/medical-records`,
      medicalRecordData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating medical record:", error);
    throw error;
  }
};

export const createPrescription = async (token, petId, prescriptionData) => {
  try {
    const response = await api.post(
      `/prescriptions/${petId}`,
      {
        medication_name: prescriptionData.medication_name,
        dosage: prescriptionData.dosage,
        instructions: prescriptionData.instructions,
        start_date: prescriptionData.start_date,
        end_date: prescriptionData.end_date,
        veterinarian_id: parseInt(prescriptionData.veterinarian_id, 10),
        refill_status: prescriptionData.refill_status,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating prescription:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
};

export const createMedicalRecordForOtherPet = async (medicalRecordData) => {
  try {
    const response = await api.post(
      `/medical-records/other-pet`,
      medicalRecordData,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating medical record for other pet:", error);
    throw error;
  }
};

export const createPrescriptionForOtherPet = async (prescriptionData) => {
  try {
    const response = await api.post(
      `/prescriptions/other-pet`,
      prescriptionData,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating prescription for other pet:", error);
    throw error;
  }
};

//Veterinary Management
export const getAllVeterinarians = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/veterinarians`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching veterinarians:", error);
    throw error;
  }
};

export const createVeterinarian = async (token, veterinarianData) => {
  try {
    const formData = new FormData();
    for (const key in veterinarianData) {
      formData.append(key, veterinarianData[key]);
    }
    const response = await axios.post(`${API_URL}/veterinarians`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating veterinarian:", error);
    throw error;
  }
};

export const updateVeterinarian = async (token, id, veterinarianData) => {
  try {
    const formData = new FormData();
    for (const key in veterinarianData) {
      formData.append(key, veterinarianData[key]);
    }
    const response = await axios.put(
      `${API_URL}/veterinarians/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating veterinarian:", error);
    throw error;
  }
};

export const deleteVeterinarian = async (token, id) => {
  try {
    const response = await axios.delete(`${API_URL}/veterinarians/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting veterinarian:", error);
    throw error;
  }
};

export const getVeterinarian = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/veterinarians/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching veterinarian:", error);
    throw error;
  }
};
