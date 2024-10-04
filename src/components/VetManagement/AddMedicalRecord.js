import React, { useState, useEffect } from "react";
import {
  createMedicalRecord,
  createMedicalRecordForOtherPet,
  getAllVeterinarians,
} from "../../pages/VetManagement/VetapiService";
import styles from "../../styles/AddMedicalRecord.module.css";
import { useAuth } from "../../AuthContext";

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
    veterinarian_id: "",
    clinic_name: "",
  });
  const [veterinarians, setVeterinarians] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      const data = await getAllVeterinarians(user.token);
      setVeterinarians(data);
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };

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
      const medicalRecordData = {
        ...formData,
        veterinarian_id: parseInt(formData.veterinarian_id, 10),
      };

      console.log("Submitting medical record data:", medicalRecordData);

      if (petId) {
        await createMedicalRecord(user.token, petId, medicalRecordData);
      } else {
        await createMedicalRecordForOtherPet(user.token, {
          ...medicalRecordData,
          other_pet_species: otherPetSpecies,
          other_pet_breed: otherPetBreed,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating medical record:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to create medical record: ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Failed to create medical record: No response from server");
      } else {
        console.error("Error:", error.message);
        alert(`Failed to create medical record: ${error.message}`);
      }
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
          <label htmlFor="veterinarian_id">Veterinarian:</label>
          <select
            id="veterinarian_id"
            name="veterinarian_id"
            value={formData.veterinarian_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a veterinarian</option>
            {veterinarians.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.name}
              </option>
            ))}
          </select>
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
