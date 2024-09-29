import React from "react";
import styles from "../../styles/PrescriptionList.module.css";

const PrescriptionList = ({ prescriptions, onPrescriptionSelect }) => {
  return (
    <div className={styles.prescriptionList}>
      <h2>Prescriptions</h2>
      <ul>
        {prescriptions.map((prescription) => (
          <li
            key={prescription.id}
            onClick={() => onPrescriptionSelect(prescription)}
            className={
              prescription.hasPendingRequests ? styles.hasPendingRequests : ""
            }
          >
            {prescription.hasPendingRequests && (
              <span className={styles.notificationDot}></span>
            )}
            <h3>{prescription.medication_name}</h3>
            <p>Customer: {prescription.customerName}</p>
            <p>Pet: {prescription.petName}</p>
            <p>Dosage: {prescription.dosage}</p>
            <p>Refill Requests: {prescription.refill_requests.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrescriptionList;
