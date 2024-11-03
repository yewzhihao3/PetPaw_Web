import axios from "axios";
import { API_URL } from "../../config";

const API_BASE_URL = `${API_URL}/pet-grooming`;

export const fetchGroomingServices = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching grooming services:", error);
    throw error;
  }
};

export const fetchAllBookings = async (token, skip = 0, limit = 100) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all-bookings`, {
      params: { skip, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all grooming bookings:", error);
    throw error;
  }
};

export const fetchPets = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
};

export const fetchUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchBookings = async (userId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`, {
      params: { user_id: userId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching grooming bookings:", error);
    throw error;
  }
};

export const createBooking = async (bookingData, token) => {
  try {
    console.log("Booking data being sent:", bookingData);
    const formData = new FormData();
    for (const key in bookingData) {
      if (key === "service_ids") {
        formData.append(key, bookingData[key].join(","));
      } else {
        formData.append(key, bookingData[key]);
      }
    }
    const response = await axios.post(`${API_BASE_URL}/bookings`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating grooming booking:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const updateBooking = async (bookingId, bookingData, token) => {
  try {
    console.log("Updating booking with data:", bookingData);
    const formData = new FormData();
    for (const [key, value] of Object.entries(bookingData)) {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    }

    // Log the FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axios.put(
      `${API_BASE_URL}/bookings/${bookingId}`,
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
    console.error("Error updating grooming booking:", error);
    throw error;
  }
};

export const deleteBooking = async (bookingId, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting grooming booking:", error);
    throw error;
  }
};

export const acceptBooking = async (bookingId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/bookings/${bookingId}/accept`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error accepting grooming booking:", error);
    throw error;
  }
};

export const declineBooking = async (bookingId, reason, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/bookings/${bookingId}/decline`,
      { cancel_reason: reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error declining grooming booking:", error);
    throw error;
  }
};

export const fetchAvailableSlots = async (date, token) => {
  try {
    // Convert the date to the format expected by the backend (YYYY-MM-DD)
    const formattedDate = new Date(date).toISOString().split("T")[0];
    console.log("Fetching available slots for date:", formattedDate);

    const response = await axios.get(`${API_BASE_URL}/available-slots`, {
      params: { date: formattedDate },
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Received response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
};
