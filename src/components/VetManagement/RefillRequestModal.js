import React, { useState } from "react";
import styles from "../../styles/RefillRequestModal.module.css";

const RefillRequestModal = ({
  prescription,
  onClose,
  onApprove,
  onDeny,
  onEditPrescription,
  onDelete,
  onDeletePrescription,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrescription, setEditedPrescription] = useState({
    medication_name: prescription.medication_name,
    dosage: prescription.dosage,
    instructions: prescription.instructions,
    start_date: prescription.start_date,
    end_date: prescription.end_date,
    refill_status: prescription.refill_status,
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async () => {
    try {
      await onEditPrescription(prescription.id, editedPrescription);
      setMessage("Prescription updated successfully!");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage("Failed to update prescription. Please try again.");
    }
    setIsEditing(false);
  };

  const handleDeletePrescription = () => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      onDeletePrescription(prescription.id);
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {message && <div className={styles.message}>{message}</div>}
        <h2>{prescription.medication_name} - Refill Requests</h2>
        <p>Customer: {prescription.customerName}</p>
        {isEditing ? (
          <div className={styles.editForm}>
            <input
              name="medication_name"
              value={editedPrescription.medication_name}
              onChange={handleInputChange}
              placeholder="Medication Name"
            />
            <input
              name="dosage"
              value={editedPrescription.dosage}
              onChange={handleInputChange}
              placeholder="Dosage"
            />
            <textarea
              name="instructions"
              value={editedPrescription.instructions}
              onChange={handleInputChange}
              placeholder="Instructions"
            />
            <input
              type="date"
              name="start_date"
              value={editedPrescription.start_date}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="end_date"
              value={editedPrescription.end_date}
              onChange={handleInputChange}
            />
            <select
              name="refill_status"
              value={editedPrescription.refill_status}
              onChange={handleInputChange}
            >
              <option value="refillable">Refillable</option>
              <option value="non-refillable">Non-refillable</option>
            </select>
            <button onClick={handleSubmitEdit}>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className={styles.prescriptionDetails}>
            <p>Dosage: {prescription.dosage}</p>
            <p>Instructions: {prescription.instructions}</p>
            <p>Start Date: {prescription.start_date}</p>
            <p>End Date: {prescription.end_date}</p>
            <p>Refill Status: {prescription.refill_status}</p>
            <button onClick={() => setIsEditing(true)}>
              Edit Prescription
            </button>
            <button
              onClick={handleDeletePrescription}
              className={styles.deleteButton}
            >
              Delete Prescription
            </button>
          </div>
        )}
        <h3>Refill Requests</h3>
        <ul>
          {prescription.refill_requests.map((request) => (
            <li key={request.id}>
              <p>
                Status:
                <span
                  className={`
                    ${styles.status} 
                    ${
                      styles[
                        `status${
                          request.status.charAt(0).toUpperCase() +
                          request.status.slice(1).toLowerCase()
                        }`
                      ]
                    }
                  `}
                >
                  {request.status}
                </span>
              </p>
              <p>Created: {new Date(request.created_at).toLocaleString()}</p>
              {request.updated_at && (
                <p>Updated: {new Date(request.updated_at).toLocaleString()}</p>
              )}
              <div className={styles.actions}>
                {request.status === "PENDING" && (
                  <>
                    <button onClick={() => onApprove(request.id)}>
                      Approve
                    </button>
                    <button onClick={() => onDeny(request.id)}>Deny</button>
                  </>
                )}
                <button onClick={() => onDelete(request.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RefillRequestModal;
