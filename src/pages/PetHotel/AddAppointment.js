import React, { useState, useEffect } from "react";
import {
  fetchUsers,
  fetchPets,
  createBooking,
  fetchHotels,
} from "./pet_hotel_apiService";
import { useAuth } from "../../AuthContext";
import styles from "../../styles/AddAppointment.module.css";

const AddAppointment = ({ isOpen, onClose, onAppointmentAdded }) => {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    pet_id: "",
    hotel_id: "",
    start_date: "",
    end_date: "",
    pet_size: "",
    dietary_needs: "",
    medication_needs: "",
    special_requests: "",
    emergency_contact: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [usersData, petsData, hotelsData] = await Promise.all([
        fetchUsers(user.token),
        fetchPets(user.token),
        fetchHotels(user.token),
      ]);
      setUsers(usersData);
      setPets(petsData);
      setHotels(hotelsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUserSelect = (userId) => {
    const selectedUser = users.find((u) => u.id === parseInt(userId));
    setFormData((prev) => ({
      ...prev,
      user_id: userId,
      pet_id: "",
      emergency_contact: `${selectedUser.name} ${selectedUser.phone_number}`,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        user_id: parseInt(formData.user_id),
        pet_id: parseInt(formData.pet_id),
        hotel_id: parseInt(formData.hotel_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        pet_size: formData.pet_size,
        dietary_needs: formData.dietary_needs,
        medication_needs: formData.medication_needs,
        special_requests: formData.special_requests,
        emergency_contact: formData.emergency_contact,
      };

      console.log("Submitting appointment:", bookingData);
      const result = await createBooking(bookingData, user.token);
      console.log("Booking created:", result);
      onAppointmentAdded();
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      // Add error handling here, e.g., show an error message to the user
    }
  };

  const getUserPets = (userId) => {
    return pets.filter((pet) => pet.owner_id === parseInt(userId));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Book Pet Hotel</h2>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="user_id">Select User</label>
            <select
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={(e) => handleUserSelect(e.target.value)}
              required
              className={styles.select}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {formData.user_id && (
            <div className={styles.formGroup}>
              <label htmlFor="pet_id">Select Pet</label>
              <select
                id="pet_id"
                name="pet_id"
                value={formData.pet_id}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value="">Select a pet</option>
                {getUserPets(formData.user_id).map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="pet_size">Pet Size</label>
            <select
              id="pet_size"
              name="pet_size"
              value={formData.pet_size}
              onChange={handleInputChange}
              required
              className={styles.select}
            >
              <option value="">Select size</option>
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="hotel_id">Select Hotel</label>
            <select
              id="hotel_id"
              name="hotel_id"
              value={formData.hotel_id}
              onChange={handleInputChange}
              required
              className={styles.select}
            >
              <option value="">Select a hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dateGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="start_date">Check-in Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="end_date">Check-out Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dietary_needs">Dietary Needs</label>
            <textarea
              id="dietary_needs"
              name="dietary_needs"
              value={formData.dietary_needs}
              onChange={handleInputChange}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="medication_needs">Medication Needs</label>
            <textarea
              id="medication_needs"
              name="medication_needs"
              value={formData.medication_needs}
              onChange={handleInputChange}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="special_requests">Special Requests</label>
            <textarea
              id="special_requests"
              name="special_requests"
              value={formData.special_requests}
              onChange={handleInputChange}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="emergency_contact">Emergency Contact</label>
            <input
              type="text"
              id="emergency_contact"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;
