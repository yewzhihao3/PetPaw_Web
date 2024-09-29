import React, { useState, useEffect } from "react";
import {
  getAllPrescriptions,
  updateRefillRequest,
  deleteRefillRequest,
  updatePrescription,
  deletePrescription,
} from "./VetapiService";
import PrescriptionList from "../../components/VetManagement/PrescriptionList";
import RefillRequestModal from "../../components/VetManagement/RefillRequestModal";
import styles from "../../styles/RefillRequestManagement.module.css";

const RefillRequestManagement = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const prescriptionsData = await getAllPrescriptions();

      console.log("Prescriptions data:", prescriptionsData);

      const prescriptionsWithRefills = prescriptionsData.map(
        (prescription) => ({
          ...prescription,
          customerName: prescription.owner?.name || "Unknown",
          petName: prescription.pet?.name || "Unknown",
          hasPendingRequests: prescription.refill_requests.some(
            (request) => request.status === "PENDING"
          ),
        })
      );

      setPrescriptions(prescriptionsWithRefills);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const handlePrescriptionSelect = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleCloseModal = () => {
    setSelectedPrescription(null);
  };

  const handleApprove = async (requestId) => {
    try {
      await updateRefillRequest(requestId, { status: "APPROVED" });
      fetchData();
    } catch (error) {
      setError("Failed to approve request. Please try again.");
    }
  };

  const handleDeny = async (requestId) => {
    try {
      await updateRefillRequest(requestId, { status: "DENIED" });
      fetchData();
    } catch (error) {
      setError("Failed to deny request. Please try again.");
    }
  };

  const handleEditPrescription = async (
    prescriptionId,
    updatedPrescription
  ) => {
    try {
      await updatePrescription(prescriptionId, updatedPrescription);
      fetchData();
    } catch (error) {
      setError("Failed to update prescription. Please try again.");
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await deleteRefillRequest(requestId);
      fetchData();
    } catch (error) {
      setError("Failed to delete request. Please try again.");
    }
  };

  const handleDeletePrescription = async (prescriptionId) => {
    try {
      await deletePrescription(prescriptionId);
      fetchData();
      setSelectedPrescription(null);
    } catch (error) {
      setError("Failed to delete prescription. Please try again.");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Refill Request Management</h1>
      <PrescriptionList
        prescriptions={prescriptions}
        onPrescriptionSelect={handlePrescriptionSelect}
      />
      {selectedPrescription && (
        <RefillRequestModal
          prescription={selectedPrescription}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onDeny={handleDeny}
          onEditPrescription={handleEditPrescription}
          onDelete={handleDelete}
          onDeletePrescription={handleDeletePrescription}
        />
      )}
    </div>
  );
};

export default RefillRequestManagement;
