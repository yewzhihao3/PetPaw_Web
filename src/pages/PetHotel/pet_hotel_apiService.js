import axios from "axios";
import { API_URL } from "../../config";

const API_BASE_URL = `${API_URL}/pet-hotels`;

export const fetchAllBookings = async (token, skip = 0, limit = 100) => {
  const response = await axios.get(`${API_BASE_URL}/bookings/all`, {
    params: { skip, limit },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchHotels = async (token) => {
  const response = await axios.get(`${API_BASE_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPets = async (token) => {
  const response = await axios.get(`${API_URL}/pets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchUsers = async (token) => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchBookings = async (userId, token) => {
  const response = await axios.get(`${API_BASE_URL}/bookings`, {
    params: { user_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createBooking = async (bookingData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in createBooking:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateBooking = async (bookingId, bookingData, token) => {
  const response = await axios.put(
    `${API_BASE_URL}/bookings/${bookingId}`,
    bookingData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteBooking = async (bookingId, token) => {
  await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const acceptBooking = async (bookingId, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/bookings/${bookingId}/accept`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const declineBooking = async (bookingId, reason, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/bookings/${bookingId}/decline`,
    { reason },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
