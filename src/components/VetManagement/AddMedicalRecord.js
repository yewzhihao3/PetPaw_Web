import React, { useState } from "react";
import {
  createMedicalRecord,
  createMedicalRecordForOtherPet,
} from "../../pages/VetManagement/VetapiService";
import styles from "../../styles/AddMedicalRecord.module.css";

const AddMedicalRecord = ({
  petId,
  otherPetSpecies,
  otherPetBreed,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    date: "",
    expiration_date: "",
    description: "",
    veterinarian: "",
    clinic_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (petId) {
        await createMedicalRecord(petId, formData);
      } else {
        await createMedicalRecordForOtherPet({
          ...formData,
          other_pet_species: otherPetSpecies,
          other_pet_breed: otherPetBreed,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating medical record:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Medical Record</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="expiration_date">Expiration Date:</label>
          <input
            type="date"
            id="expiration_date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="veterinarian">Veterinarian:</label>
          <input
            type="text"
            id="veterinarian"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="clinic_name">Clinic Name:</label>
          <input
            type="text"
            id="clinic_name"
            name="clinic_name"
            value={formData.clinic_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Add Medical Record
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicalRecord;
