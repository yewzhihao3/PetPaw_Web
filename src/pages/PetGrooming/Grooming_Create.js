import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { createBooking, fetchAvailableSlots } from "./Grooming_apiService";
import TimeSlotModal from "./TimeSlotModal";
import stylesBase from "../../styles/GroomingBase.module.css";
import stylesCreate from "../../styles/GroomingCreate.module.css";
import { Droplet, Scissors, Fingerprint, Brush, Ear, X } from "lucide-react";

const Grooming_Create = ({ services, users, pets, onClose }) => {
  const [newBooking, setNewBooking] = useState({
    pet_id: "",
    user_id: "",
    date: "",
    start_time: "",
    service_ids: [],
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const calculateTotalDuration = (selectedServiceIds) => {
    const totalMinutes = selectedServiceIds.reduce((total, id) => {
      const service = services.find((s) => s.id === id);
      return total + (service ? service.duration : 0);
    }, 0);

    return Math.ceil(totalMinutes / 60) * 60;
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const totalDuration = calculateTotalDuration(newBooking.service_ids);
      const bookingData = {
        ...newBooking,
        duration: totalDuration,
        date: new Date(newBooking.date).toISOString().split("T")[0],
      };
      await createBooking(bookingData, user.token);
      setNewBooking({
        pet_id: "",
        user_id: "",
        date: "",
        start_time: "",
        service_ids: [],
      });
      setError(null);
      alert("Booking created successfully!");
    } catch (err) {
      setError(err.detail || "Failed to create booking");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  const handleServiceChange = (serviceId) => {
    setNewBooking((prev) => {
      const updatedServiceIds = prev.service_ids.includes(serviceId)
        ? prev.service_ids.filter((id) => id !== serviceId)
        : [...prev.service_ids, serviceId];
      return { ...prev, service_ids: updatedServiceIds };
    });
  };

  const handleTimeClick = async () => {
    if (!newBooking.date) {
      alert("Please select a date first");
      return;
    }
    if (newBooking.service_ids.length === 0) {
      alert("Please select at least one service");
      return;
    }
    try {
      const slots = await fetchAvailableSlots(newBooking.date, user.token);
      setAvailableSlots(slots);
      setIsTimeModalOpen(true);
    } catch (err) {
      setError("Failed to fetch available slots");
    }
  };

  const handleSelectTime = (time) => {
    setNewBooking((prev) => ({ ...prev, start_time: time }));
    setIsTimeModalOpen(false);
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "water-outline":
        return <Droplet />;
      case "cut-outline":
        return <Scissors />;
      case "finger-print-outline":
        return <Fingerprint />;
      case "brush-outline":
        return <Brush />;
      case "ear-outline":
        return <Ear />;
      default:
        return null;
    }
  };

  return (
    <div className={stylesCreate.createBookingContainer}>
      <div className={stylesCreate.createBookingHeader}>
        <h3 className={stylesCreate.createBookingTitle}>Create New Booking</h3>
        <button onClick={onClose} className={stylesCreate.closeButton}>
          <X size={24} />
        </button>
      </div>
      {error && <div className={stylesBase.error}>{error}</div>}
      <form onSubmit={handleCreateBooking} className={stylesCreate.form}>
        <select
          name="user_id"
          value={newBooking.user_id}
          onChange={handleInputChange}
          className={stylesCreate.input}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <select
          name="pet_id"
          value={newBooking.pet_id}
          onChange={handleInputChange}
          className={stylesCreate.input}
          required
        >
          <option value="">Select Pet</option>
          {pets
            .filter((pet) => pet.owner_id === parseInt(newBooking.user_id))
            .map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
        </select>
        <div className={stylesCreate.servicesGrid}>
          {services.map((service) => (
            <div
              key={service.id}
              className={`${stylesCreate.serviceCard} ${
                newBooking.service_ids.includes(service.id)
                  ? stylesCreate.selected
                  : ""
              }`}
              onClick={() => handleServiceChange(service.id)}
            >
              <div className={stylesCreate.serviceIcon}>
                {getIconComponent(service.icon)}
              </div>
              <h4 className={stylesCreate.serviceName}>{service.name}</h4>
              <p className={stylesCreate.serviceDetails}>
                Duration: {service.duration} min | Price: ${service.price}
              </p>
            </div>
          ))}
        </div>
        <p className={stylesCreate.totalDuration}>
          Total Duration: {calculateTotalDuration(newBooking.service_ids)}{" "}
          minutes
        </p>
        <input
          type="date"
          name="date"
          value={newBooking.date}
          onChange={handleInputChange}
          className={stylesCreate.input}
          required
        />
        <div className={stylesCreate.timeInputWrapper}>
          <input
            type="text"
            name="start_time"
            value={newBooking.start_time}
            readOnly
            className={stylesCreate.input}
            placeholder="Select Time"
            required
          />
          <button
            type="button"
            onClick={handleTimeClick}
            className={stylesCreate.timeSelectButton}
          >
            Select Time
          </button>
        </div>
        <button type="submit" className={stylesCreate.submitButton}>
          Create Booking
        </button>
      </form>
      <TimeSlotModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        availableSlots={availableSlots}
        onSelectTime={handleSelectTime}
        duration={calculateTotalDuration(newBooking.service_ids)}
      />
    </div>
  );
};

export default Grooming_Create;
