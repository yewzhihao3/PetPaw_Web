import React, { useState } from "react";
import styles from "../../styles/DeclineModal.module.css";

const DeclineModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    } else {
      alert("Please provide a reason for declining the order.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Decline Order</h2>
        <p>Please provide a reason for declining this order:</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason here..."
          className={styles.reasonInput}
        />
        <div className={styles.modalActions}>
          <button onClick={handleConfirm} className={styles.confirmButton}>
            Confirm Decline
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineModal;
