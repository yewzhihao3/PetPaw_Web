import React, { useState } from "react";
import {
  createPrescription,
  createPrescriptionForOtherPet,
} from "../../pages/VetManagement/VetapiService";
import styles from "../../styles/AddPrescription.module.css";

const AddPrescription = ({
  petId,
  otherPetSpecies,
  otherPetBreed,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    instructions: "",
    start_date: "",
    end_date: "",
    veterinarian: "",
    refill_status: "refillable",
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
        await createPrescription(petId, formData);
      } else {
        await createPrescriptionForOtherPet({
          ...formData,
          other_pet_species: otherPetSpecies,
          other_pet_breed: otherPetBreed,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating prescription:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Prescription</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="medication_name">Medication Name:</label>
          <input
            type="text"
            id="medication_name"
            name="medication_name"
            value={formData.medication_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dosage">Dosage:</label>
          <input
            type="text"
            id="dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="instructions">Instructions:</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="end_date">End Date:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
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
          <label htmlFor="refill_status">Refill Status:</label>
          <select
            id="refill_status"
            name="refill_status"
            value={formData.refill_status}
            onChange={handleChange}
          >
            <option value="refillable">Refillable</option>
            <option value="non-refillable">Non-refillable</option>
          </select>
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Add Prescription
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

export default AddPrescription;
