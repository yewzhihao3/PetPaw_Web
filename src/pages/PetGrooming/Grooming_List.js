import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import {
  fetchAllBookings,
  updateBooking,
  deleteBooking,
  acceptBooking,
  declineBooking,
} from "./Grooming_apiService";
import stylesBase from "../../styles/GroomingBase.module.css";
import stylesList from "../../styles/GroomingList.module.css";

const Grooming_List = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, [user.token]);

  const fetchBookings = async () => {
    try {
      const bookingsData = await fetchAllBookings(user.token);
      const sortedBookings = sortBookings(bookingsData);
      setBookings(sortedBookings);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch bookings");
      setLoading(false);
    }
  };

  const sortBookings = (bookingsArray) => {
    return bookingsArray.sort((a, b) => {
      if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
      if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
      return 0;
    });
  };

  const handleUpdateBooking = async (id, newStatus) => {
    try {
      const updatedBooking = { status: newStatus };
      console.log("Updating booking:", id, "with data:", updatedBooking);
      const updated = await updateBooking(id, updatedBooking, user.token);
      const updatedBookings = bookings.map((booking) =>
        booking.id === id ? updated : booking
      );
      setBookings(sortBookings(updatedBookings));
    } catch (err) {
      console.error("Failed to update booking:", err);
      setError("Failed to update booking");
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await deleteBooking(id, user.token);
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (err) {
      setError("Failed to delete booking");
    }
  };

  const handleAcceptBooking = async (id) => {
    try {
      const updated = await acceptBooking(id, user.token);
      const updatedBookings = bookings.map((booking) =>
        booking.id === id ? updated : booking
      );
      setBookings(sortBookings(updatedBookings));
    } catch (err) {
      setError("Failed to accept booking");
    }
  };

  const handleDeclineBooking = async (id, reason) => {
    try {
      const updated = await declineBooking(id, reason, user.token);
      const updatedBookings = bookings.map((booking) =>
        booking.id === id ? updated : booking
      );
      setBookings(sortBookings(updatedBookings));
    } catch (err) {
      setError("Failed to decline booking");
    }
  };

  const renderButtons = (booking) => {
    switch (booking.status) {
      case "PENDING":
        return (
          <>
            <button
              onClick={() => handleAcceptBooking(booking.id)}
              className={`${stylesList.button} ${stylesList.acceptButton}`}
            >
              Accept
            </button>
            <button
              onClick={() => handleDeclineBooking(booking.id, "Unavailable")}
              className={`${stylesList.button} ${stylesList.declineButton}`}
            >
              Decline
            </button>
            <button
              onClick={() => handleDeleteBooking(booking.id)}
              className={`${stylesList.button} ${stylesList.deleteButton}`}
            >
              Delete
            </button>
          </>
        );
      case "CONFIRMED":
        return (
          <>
            <button
              onClick={() => handleUpdateBooking(booking.id, "IN_PROGRESS")}
              className={`${stylesList.button} ${stylesList.inProgressButton}`}
            >
              Start
            </button>
            <button
              onClick={() => handleUpdateBooking(booking.id, "CANCELLED")}
              className={`${stylesList.button} ${stylesList.cancelButton}`}
            >
              Cancel
            </button>
          </>
        );
      case "IN_PROGRESS":
        return (
          <button
            onClick={() => handleUpdateBooking(booking.id, "COMPLETED")}
            className={`${stylesList.button} ${stylesList.completeButton}`}
          >
            Complete
          </button>
        );
      case "COMPLETED":
      case "CANCELLED":
        return (
          <button
            onClick={() => handleDeleteBooking(booking.id)}
            className={`${stylesList.button} ${stylesList.deleteButton}`}
          >
            Delete
          </button>
        );
      default:
        return null;
    }
  };

  if (loading)
    return <div className={stylesBase.loading}>Loading bookings...</div>;
  if (error) return <div className={stylesBase.error}>{error}</div>;

  return (
    <div className={stylesBase.section}>
      <h3 className={stylesBase.sectionTitle}>Current Bookings</h3>
      <ul className={stylesList.list}>
        {bookings.map((booking) => (
          <li key={booking.id} className={stylesList.listItem}>
            <div className={stylesList.bookingDetails}>
              <span className={stylesList.bookingUser}>{booking.pet_name}</span>
              <span className={stylesList.bookingDateTime}>
                {new Date(booking.date).toLocaleDateString()} -{" "}
                {booking.start_time}
              </span>
              <span
                className={`${stylesList.bookingStatus} ${
                  stylesList[booking.status.toLowerCase()]
                }`}
              >
                {booking.status}
              </span>
            </div>
            <div className={stylesList.buttonContainer}>
              {renderButtons(booking)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Grooming_List;
