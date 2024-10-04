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
    console.log("User details response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user details for ID ${userId}:`, error);
    throw error;
  }
};

export const getPetDetails = async (petId) => {
  try {
    const response = await api.get(`/pets/${petId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching pet details for ID ${petId}:`, error);
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

// Medical Records

export const getAllMedicalRecords = async () => {
  try {
    const response = await api.get("/pets/all-medical-records", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all medical records:", error);
    throw error;
  }
};

export const createMedicalRecord = async (token, petId, medicalRecordData) => {
  try {
    console.log("Creating medical record with data:", medicalRecordData);
    const response = await api.post(
      `/pets/${petId}/medical-records`,
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

export const getMedicalRecords = async (petId) => {
  try {
    const response = await api.get(`/pets/${petId}/medical-records`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching medical records:", error);
    throw error;
  }
};

export const updateMedicalRecord = async (
  petId,
  recordId,
  medicalRecordData
) => {
  try {
    const response = await api.put(
      `/pets/${petId}/medical-records/${recordId}`,
      medicalRecordData,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating medical record:", error);
    throw error;
  }
};

export const deleteMedicalRecord = async (petId, recordId) => {
  try {
    const response = await api.delete(
      `/pets/${petId}/medical-records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting medical record:", error);
    throw error;
  }
};

// Prescriptions
export const getPrescriptions = async () => {
  try {
    const response = await api.get("/prescriptions", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    throw error;
  }
};

export const createPrescription = async (token, petId, prescriptionData) => {
  try {
    const response = await api.post(
      `/prescriptions/${petId}`,
      prescriptionData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating prescription:", error);
    throw error;
  }
};

export const updatePrescription = async (prescriptionId, prescriptionData) => {
  try {
    const response = await api.put(
      `/prescriptions/${prescriptionId}`,
      prescriptionData,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating prescription:", error);
    throw error;
  }
};

export const deletePrescription = async (prescriptionId) => {
  try {
    const response = await api.delete(`/prescriptions/${prescriptionId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting prescription:", error);
    throw error;
  }
};

// Refill Requests
export const getAllRefillRequests = async () => {
  try {
    const response = await api.get("/prescriptions/refill/requests", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all refill requests:", error);
    throw error;
  }
};

export const getRefillRequests = async (prescriptionId = null) => {
  try {
    const url = prescriptionId
      ? `/prescriptions/${prescriptionId}/refill-requests`
      : "/prescriptions/refill/requests";
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching refill requests:", error);
    throw error;
  }
};

export const createRefillRequest = async (refillRequestData) => {
  try {
    const response = await api.post(
      "/prescriptions/refill/request",
      refillRequestData,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating refill request:", error);
    throw error;
  }
};

export const updateRefillRequest = async (requestId, refillRequestData) => {
  try {
    const response = await api.put(
      `/prescriptions/refill/request/${requestId}`,
      refillRequestData,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating refill request:", error);
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
export const getVeterinarianDetails = async (veterinarianId) => {
  try {
    const response = await api.get(`/veterinarians/${veterinarianId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching veterinarian details for ID ${veterinarianId}:`,
      error
    );
    throw error;
  }
};

export const getAllVeterinarians = async () => {
  try {
    const response = await api.get("/veterinarians", {
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
    const response = await api.post("/veterinarians", formData, {
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

// Fetch all prescriptions refill status
export const getAllPrescriptions = async () => {
  try {
    const response = await api.get("/prescriptions/", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all prescriptions:", error);
    throw error;
  }
};

export const deleteRefillRequest = async (requestId) => {
  try {
    const response = await api.delete(
      `/prescriptions/refill/request/${requestId}`,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting refill request:", error);
    throw error;
  }
};
