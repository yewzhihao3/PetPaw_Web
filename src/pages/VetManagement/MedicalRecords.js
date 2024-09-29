import React, { useState, useEffect } from "react";
import {
  getAllMedicalRecords,
  deleteMedicalRecord,
  updateMedicalRecord,
  getUserDetails,
  getPetDetails,
  getVeterinarianDetails,
  getAllVeterinarians,
} from "./VetapiService";
import styles from "../../styles/MedicalRecords.module.css";

const MedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await getAllMedicalRecords();
      const recordsWithDetails = await Promise.all(
        records.map(async (record) => {
          const petDetails = await getPetDetails(record.pet_id);
          const userDetails = await getUserDetails(petDetails.owner_id);
          let veterinarianDetails = { name: "N/A" };
          if (record.veterinarian_id) {
            veterinarianDetails = await getVeterinarianDetails(
              record.veterinarian_id
            );
          }
          return {
            ...record,
            customerName: userDetails.name,
            petName: petDetails.name,
            veterinarianName: veterinarianDetails.name,
          };
        })
      );
      setMedicalRecords(recordsWithDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setEditMode(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      await deleteMedicalRecord(selectedRecord.pet_id, selectedRecord.id);
      setMedicalRecords(
        medicalRecords.filter((r) => r.id !== selectedRecord.id)
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting medical record:", error);
      setError("Failed to delete medical record. Please try again.");
    }
  };

  const handleUpdate = async (updatedRecord) => {
    try {
      const updated = await updateMedicalRecord(
        selectedRecord.pet_id,
        selectedRecord.id,
        updatedRecord
      );
      setMedicalRecords(
        medicalRecords.map((r) =>
          r.id === updated.id ? { ...r, ...updated } : r
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating medical record:", error);
      setError("Failed to update medical record. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Medical Records</h2>
      <div className={styles.recordGrid}>
        {medicalRecords.map((record) => (
          <div
            key={record.id}
            className={styles.recordCard}
            onClick={() => handleRecordClick(record)}
          >
            <div className={styles.cardHeader}>
              <h3>{record.petName}</h3>
              <span className={styles.date}>{formatDate(record.date)}</span>
            </div>
            <p className={styles.customerName}>{record.customerName}</p>
            <p className={styles.description}>
              {record.description.substring(0, 100)}
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedRecord && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Medical Record Details</h3>
            {editMode ? (
              <EditForm
                record={selectedRecord}
                onUpdate={handleUpdate}
                onCancel={() => setEditMode(false)}
              />
            ) : (
              <>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Customer:</span>
                    <span className={styles.detailValue}>
                      {selectedRecord.customerName}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Pet:</span>
                    <span className={styles.detailValue}>
                      {selectedRecord.petName}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date:</span>
                    <span className={styles.detailValue}>
                      {formatDate(selectedRecord.date)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Expiration Date:</span>
                    <span className={styles.detailValue}>
                      {formatDate(selectedRecord.expiration_date)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Veterinarian:</span>
                    <span className={styles.detailValue}>
                      {selectedRecord.veterinarianName}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Clinic Name:</span>
                    <span className={styles.detailValue}>
                      {selectedRecord.clinic_name}
                    </span>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Description:</span>
                  <p className={styles.detailValue}>
                    {selectedRecord.description}
                  </p>
                </div>
                <div className={styles.modalActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.closeButton}
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const EditForm = ({ record, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    date: record.date,
    expiration_date: record.expiration_date,
    description: record.description,
    clinic_name: record.clinic_name,
    veterinarian_id: record.veterinarian_id,
  });
  const [veterinarians, setVeterinarians] = useState([]);

  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        const vets = await getAllVeterinarians();
        setVeterinarians(vets);
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
      }
    };
    fetchVeterinarians();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
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
      <div>
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
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
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
      <div>
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
      <div className={styles.formActions}>
        <button type="submit">Update</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MedicalRecords;
