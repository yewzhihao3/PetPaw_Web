import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import {
  getAllVeterinarians,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
} from "./vet_managamentapiService";
import styles from "../../styles/VeterinaryManagement.module.css";
import { FaEdit, FaTrash, FaTimes, FaPlus } from "react-icons/fa";

const VeterinaryManagement = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    specialization: "",
    profile_picture: null,
  });
  const [selectedVet, setSelectedVet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      const data = await getAllVeterinarians();
      setVeterinarians(data);
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedVet) {
        await updateVeterinarian(selectedVet.id, formData);
      } else {
        await createVeterinarian(formData);
      }
      fetchVeterinarians();
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        specialization: "",
        profile_picture: null,
      });
      setSelectedVet(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving veterinarian:", error);
    }
  };

  const handleEdit = (vet) => {
    setSelectedVet(vet);
    setFormData({
      name: vet.name,
      email: vet.email,
      phone_number: vet.phone_number,
      specialization: vet.specialization,
      profile_picture: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteVeterinarian(selectedVet.id);
      fetchVeterinarians();
      setSelectedVet(null);
      setIsModalOpen(false);
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting veterinarian:", error);
    }
  };

  const openModal = () => {
    setSelectedVet(null);
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      specialization: "",
      profile_picture: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVet(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Veterinary Management</h1>
      <button onClick={openModal} className={styles.addButton}>
        <FaPlus /> Add Veterinarian
      </button>
      <div className={styles.veterinarianList}>
        {veterinarians.map((vet) => (
          <div
            key={vet.id}
            className={styles.veterinarianCard}
            onClick={() => handleEdit(vet)}
          >
            {vet.image_url && (
              <img
                src={vet.image_url}
                alt={vet.name}
                className={styles.vetImage}
              />
            )}
            <h3>{vet.name}</h3>
            <p>Email: {vet.email}</p>
            <p>Phone: {vet.phone_number}</p>
            <p>Specialization: {vet.specialization}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button onClick={closeModal} className={styles.closeButton}>
              <FaTimes />
            </button>
            <h2>{selectedVet ? "Edit Veterinarian" : "Add Veterinarian"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required
              />
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="Specialization"
                required
              />
              <input
                type="file"
                name="profile_picture"
                onChange={handleInputChange}
                accept="image/*"
              />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton}>
                  {selectedVet ? "Update" : "Add"} Veterinarian
                </button>
                {selectedVet && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    className={styles.deleteButton}
                  >
                    <FaTrash /> Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {isConfirmDeleteOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this veterinarian?</p>
            <div className={styles.confirmButtons}>
              <button
                onClick={handleDelete}
                className={styles.confirmDeleteButton}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VeterinaryManagement;
