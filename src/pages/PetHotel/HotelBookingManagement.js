import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import {
  fetchAllBookings,
  updateBooking,
  deleteBooking,
  acceptBooking,
  declineBooking,
  fetchPets,
  fetchUsers,
} from "./pet_hotel_apiService";
import { useAuth } from "../../AuthContext";
import styles from "../../styles/HotelBookingManagement.module.css";
import AddAppointment from "./AddAppointment";

const HotelBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [pets, setPets] = useState({});
  const [users, setUsers] = useState({});
  const [editingBooking, setEditingBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDecline, setConfirmDecline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [user.token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, petsData, usersData] = await Promise.all([
        fetchAllBookings(user.token),
        fetchPets(user.token),
        fetchUsers(user.token),
      ]);
      setBookings(bookingsData);

      const petsLookup = petsData.reduce((acc, pet) => {
        acc[pet.id] = pet.name;
        return acc;
      }, {});
      setPets(petsLookup);

      const usersLookup = usersData.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});
      setUsers(usersLookup);

      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking({ ...booking });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const updatedBooking = await updateBooking(
        editingBooking.id,
        editingBooking,
        user.token
      );
      setBookings(
        bookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
      );
      setIsModalOpen(false);
      setEditingBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
      setError("Failed to update booking. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete) {
      setEditingBooking(bookings.find((b) => b.id === id));
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteBooking(id, user.token);
      setBookings(bookings.filter((b) => b.id !== id));
      setConfirmDelete(false);
      setDeleteReason("");
      setEditingBooking(null);
    } catch (error) {
      console.error("Error deleting booking:", error);
      setError("Failed to delete booking. Please try again.");
    }
  };

  const handleStatusChange = async (id, status) => {
    if (status === "CANCELLED" && !confirmDecline) {
      setEditingBooking(bookings.find((b) => b.id === id));
      setConfirmDecline(true);
      return;
    }
    try {
      let updatedBooking;
      if (status === "CONFIRMED") {
        updatedBooking = await acceptBooking(id, user.token);
      } else if (status === "CANCELLED") {
        updatedBooking = await declineBooking(id, declineReason, user.token);
        setConfirmDecline(false);
        setDeclineReason("");
      }
      setBookings(bookings.map((b) => (b.id === id ? updatedBooking : b)));
    } catch (error) {
      console.error("Error updating booking status:", error);
      setError("Failed to update booking status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return styles.statusPending;
      case "CONFIRMED":
        return styles.statusConfirmed;
      case "CHECKED_IN":
        return styles.statusCheckedIn;
      case "CHECKED_OUT":
        return styles.statusCheckedOut;
      case "CANCELLED":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      pets[booking.pet_id]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users[booking.user_id]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAppointmentAdded = () => {
    loadData();
  };

  if (loading) {
    return <div className={styles.loading}>Loading bookings...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Hotel Booking Management</h2>
      <div className={styles.actionBar}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by pet or owner name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button
          onClick={() => setIsAddAppointmentOpen(true)}
          className={styles.addButton}
        >
          <FaPlus /> Add Appointment
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.bookingTable}>
          <thead>
            <tr>
              <th>Pet Name</th>
              <th>Owner Name</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className={styles.bookingRow}>
                <td>{pets[booking.pet_id] || "Unknown Pet"}</td>
                <td>{users[booking.user_id] || "Unknown User"}</td>
                <td>{new Date(booking.start_date).toLocaleDateString()}</td>
                <td>{new Date(booking.end_date).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`${styles.status} ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(booking)}
                    className={styles.actionButton}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className={styles.actionButton}
                  >
                    <FaTrash />
                  </button>
                  {booking.status === "PENDING" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "CONFIRMED")
                        }
                        className={styles.actionButton}
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "CANCELLED")
                        }
                        className={styles.actionButton}
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Edit Booking</h3>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>Pet:</label>
                <select
                  value={editingBooking.pet_id}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      pet_id: parseInt(e.target.value),
                    })
                  }
                  className={styles.select}
                >
                  {Object.entries(pets).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Owner:</label>
                <select
                  value={editingBooking.user_id}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      user_id: parseInt(e.target.value),
                    })
                  }
                  className={styles.select}
                >
                  {Object.entries(users).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Check-In:</label>
                <input
                  type="date"
                  value={editingBooking.start_date.split("T")[0]}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      start_date: e.target.value,
                    })
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Check-Out:</label>
                <input
                  type="date"
                  value={editingBooking.end_date.split("T")[0]}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      end_date: e.target.value,
                    })
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status:</label>
                <select
                  value={editingBooking.status}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      status: e.target.value,
                    })
                  }
                  className={styles.select}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CHECKED_IN">Checked In</option>
                  <option value="CHECKED_OUT">Checked Out</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSave} className={styles.saveButton}>
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Confirm Delete</h3>
            <p>Are you sure you want to delete this booking?</p>
            <input
              type="text"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Reason for deletion (optional)"
              className={styles.input}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => handleDelete(editingBooking.id)}
                className={styles.deleteButton}
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDecline && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Decline Booking</h3>
            <p>Please provide a reason for declining this booking:</p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason for declining"
              className={styles.textarea}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() =>
                  handleStatusChange(editingBooking.id, "CANCELLED")
                }
                className={styles.declineButton}
              >
                Confirm Decline
              </button>
              <button
                onClick={() => setConfirmDecline(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AddAppointment
        isOpen={isAddAppointmentOpen}
        onClose={() => setIsAddAppointmentOpen(false)}
        onAppointmentAdded={handleAppointmentAdded}
      />
    </div>
  );
};

export default HotelBookingManagement;
