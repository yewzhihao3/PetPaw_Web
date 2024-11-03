import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { fetchAllBookings } from "./Grooming_apiService";
import stylesBase from "../../styles/GroomingBase.module.css";
import styles from "../../styles/CompletedBookingHistory.module.css";

const CompletedBookingHistory = () => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchCompletedBookings();
  }, [user.token]);

  const fetchCompletedBookings = async () => {
    try {
      const allBookings = await fetchAllBookings(user.token);
      const completed = allBookings.filter(
        (booking) => booking.status === "COMPLETED"
      );
      setCompletedBookings(completed);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch completed bookings");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className={stylesBase.loading}>Loading completed bookings...</div>
    );
  if (error) return <div className={stylesBase.error}>{error}</div>;

  return (
    <div className={stylesBase.section}>
      <h3 className={stylesBase.sectionTitle}>Completed Booking History</h3>
      {completedBookings.length === 0 ? (
        <p className={styles.noBookings}>No completed bookings found.</p>
      ) : (
        <ul className={styles.bookingList}>
          {completedBookings.map((booking) => (
            <li key={booking.id} className={styles.bookingItem}>
              <div className={styles.bookingHeader}>
                <span className={styles.petName}>{booking.pet_name}</span>
                <span className={styles.bookingDate}>
                  {new Date(booking.date).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.bookingDetails}>
                <span className={styles.bookingTime}>
                  <strong>Time:</strong> {booking.start_time}
                </span>
                <span className={styles.bookingDuration}>
                  <strong>Duration:</strong> {booking.duration} minutes
                </span>
              </div>
              <div className={styles.servicesList}>
                {booking.services.map((service) => (
                  <span key={service.id} className={styles.service}>
                    {service.name}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedBookingHistory;
