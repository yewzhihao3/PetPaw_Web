import React, { useState, useEffect, useCallback } from "react";
import {
  getUserAppointments,
  updateAppointment,
  declineAppointment,
  getUserDetails,
  getPetDetails,
  getServices,
} from "./VetapiService";
import styles from "../../styles/Appointments.module.css";
import Modal from "react-modal";
import AddMedicalRecord from "../../components/VetManagement/AddMedicalRecord";
import AddPrescription from "../../components/VetManagement/AddPrescription";

Modal.setAppElement("#root");

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const [appointmentsData, servicesData] = await Promise.all([
        getUserAppointments(),
        getServices(),
      ]);
      setServices(servicesData);
      const processedAppointments = await processAppointments(
        appointmentsData,
        servicesData
      );
      setAppointments(processedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const processAppointments = useCallback(
    async (appointmentsData, servicesData) => {
      return Promise.all(
        appointmentsData.map(async (appointment) => {
          let petDetails = { name: "N/A", species: "N/A", breed: "N/A" };
          let userDetails = null;

          if (appointment.pet_id) {
            try {
              petDetails = await getPetDetails(appointment.pet_id);
            } catch (error) {
              console.error(
                `Error fetching pet details for pet ID ${appointment.pet_id}:`,
                error
              );
            }
          }

          if (appointment.user_id) {
            try {
              userDetails = await getUserDetails(appointment.user_id);
            } catch (error) {
              console.error(
                `Error fetching user details for user ID ${appointment.user_id}:`,
                error
              );
            }
          }

          const service = servicesData.find(
            (s) => s.id === appointment.service_id
          );
          const appointmentDate = new Date(appointment.date_time);
          return {
            ...appointment,
            petName: appointment.pet_id
              ? petDetails.name
              : appointment.other_pet_species,
            petSpecies: appointment.other_pet_species || petDetails.species,
            petBreed: appointment.other_pet_breed || petDetails.breed,
            serviceName: service ? service.name : "Unknown Service",
            formattedDateTime: appointmentDate.toLocaleString("en-MY", {
              timeZone: "Asia/Kuala_Lumpur",
            }),
            appointmentDate,
            userDetails,
          };
        })
      );
    },
    []
  );

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setDeclineReason("");
    setShowDeclineInput(false);
  };

  const handleUpdateAppointment = async (appointmentId, status) => {
    try {
      await updateAppointment(appointmentId, { status });
      await fetchAppointments();
      setSelectedAppointment((prev) =>
        prev && prev.id === appointmentId ? { ...prev, status } : prev
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError("Failed to update appointment. Please try again.");
    }
  };

  const handleDeclineClick = () => {
    setShowDeclineInput(true);
  };

  const handleConfirmDecline = async (appointmentId) => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining the appointment.");
      return;
    }
    try {
      await declineAppointment(appointmentId, declineReason);
      await fetchAppointments();
      setSelectedAppointment(null);
      setDeclineReason("");
      setShowDeclineInput(false);
    } catch (error) {
      console.error("Error declining appointment:", error);
      setError("Failed to decline appointment. Please try again.");
    }
  };

  const handleAddMedicalRecord = () => {
    setModalType("medicalRecord");
    setIsModalOpen(true);
  };

  const handleAddPrescription = () => {
    setModalType("prescription");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  const handleSuccess = () => {
    fetchAppointments();
  };

  const renderActionButton = (status) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <button
            className={`${styles.actionButton} ${styles.acceptButton}`}
            onClick={() =>
              handleUpdateAppointment(selectedAppointment.id, "CONFIRMED")
            }
          >
            Accept
          </button>
        );
      case "CONFIRMED":
        return (
          <button
            className={`${styles.actionButton} ${styles.arrivedButton}`}
            onClick={() =>
              handleUpdateAppointment(selectedAppointment.id, "IN_PROGRESS")
            }
          >
            Customer Arrived
          </button>
        );
      case "IN_PROGRESS":
        return (
          <button
            className={`${styles.actionButton} ${styles.completeButton}`}
            onClick={() =>
              handleUpdateAppointment(selectedAppointment.id, "COMPLETED")
            }
          >
            Complete
          </button>
        );
      case "COMPLETED":
        return (
          <div className={styles.completedActions}>
            <button
              className={`${styles.actionButton} ${styles.medicalRecordButton}`}
              onClick={handleAddMedicalRecord}
            >
              Add Medical Record
            </button>
            <button
              className={`${styles.actionButton} ${styles.prescriptionButton}`}
              onClick={handleAddPrescription}
            >
              Add Prescription
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.appointmentsContainer}>
      <div className={styles.appointmentsList}>
        <h2>Upcoming Appointments</h2>
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`${styles.appointmentItem} ${
              selectedAppointment?.id === appointment.id ? styles.selected : ""
            }`}
            onClick={() => handleAppointmentSelect(appointment)}
          >
            <div className={styles.appointmentHeader}>
              <span className={styles.dateTime}>
                {appointment.formattedDateTime}
              </span>
              <span
                className={`${styles.status} ${
                  styles[appointment.status.toLowerCase()]
                }`}
              >
                {appointment.status}
              </span>
            </div>
            <div className={styles.appointmentBody}>
              <span className={styles.petName}>{appointment.petName}</span>
              <span className={styles.serviceName}>
                {appointment.serviceName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <div className={styles.appointmentDetails}>
          <h3>Appointment Details</h3>
          <p>
            <strong>Date:</strong>{" "}
            {selectedAppointment.appointmentDate.toLocaleDateString("en-MY", {
              timeZone: "Asia/Kuala_Lumpur",
            })}
          </p>
          <p>
            <strong>Time:</strong>{" "}
            {selectedAppointment.appointmentDate.toLocaleTimeString("en-MY", {
              timeZone: "Asia/Kuala_Lumpur",
            })}
          </p>
          <p>
            <strong>Pet:</strong> {selectedAppointment.petName}
          </p>
          <p>
            <strong>Species:</strong> {selectedAppointment.petSpecies}
          </p>
          <p>
            <strong>Breed:</strong> {selectedAppointment.petBreed}
          </p>
          <p>
            <strong>Service:</strong> {selectedAppointment.serviceName}
          </p>
          <p>
            <strong>Status:</strong> {selectedAppointment.status}
          </p>
          {selectedAppointment.status === "CANCELLED" &&
            selectedAppointment.decline_reason && (
              <p className={styles.declineReason}>
                <strong>Decline Reason:</strong>{" "}
                {selectedAppointment.decline_reason}
              </p>
            )}
          {selectedAppointment.notes && (
            <p>
              <strong>Notes:</strong> {selectedAppointment.notes}
            </p>
          )}
          {selectedAppointment.userDetails && (
            <div>
              <h4>Owner Details</h4>
              <p>
                <strong>Name:</strong> {selectedAppointment.userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedAppointment.userDetails.email}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {selectedAppointment.userDetails.phone_number}
              </p>
            </div>
          )}
          <div className={styles.actionButtons}>
            {renderActionButton(selectedAppointment.status)}
            {selectedAppointment.status !== "CANCELLED" && (
              <div className={styles.declineContainer}>
                {!showDeclineInput ? (
                  <button
                    className={`${styles.actionButton} ${styles.declineButton}`}
                    onClick={handleDeclineClick}
                  >
                    Decline
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Reason for declining"
                      className={styles.declineInput}
                    />
                    <button
                      className={`${styles.actionButton} ${styles.confirmDeclineButton}`}
                      onClick={() =>
                        handleConfirmDecline(selectedAppointment.id)
                      }
                    >
                      Confirm Decline
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Record or Prescription"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        {modalType === "medicalRecord" ? (
          <AddMedicalRecord
            petId={selectedAppointment?.pet_id}
            otherPetSpecies={selectedAppointment?.other_pet_species}
            otherPetBreed={selectedAppointment?.other_pet_breed}
            onClose={closeModal}
            onSuccess={handleSuccess}
          />
        ) : (
          <AddPrescription
            petId={selectedAppointment?.pet_id}
            otherPetSpecies={selectedAppointment?.other_pet_species}
            otherPetBreed={selectedAppointment?.other_pet_breed}
            onClose={closeModal}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>
    </div>
  );
};

export default Appointments;
