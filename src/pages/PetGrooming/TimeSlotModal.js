import React from "react";
import styles from "../../styles/GroomingTimeSlotModal.module.css";

const TimeSlotModal = ({
  isOpen,
  onClose,
  availableSlots,
  onSelectTime,
  duration,
}) => {
  if (!isOpen) return null;

  const formatTime = (hour, minute = 0) => {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const generateTimeSlots = () => {
    const slots = [];
    const durationInHours = Math.ceil(duration / 60);

    for (let hour = 10; hour < 22 - durationInHours + 1; hour++) {
      const startTime = formatTime(hour);
      const endTime = formatTime(hour + durationInHours);
      slots.push(`${startTime} - ${endTime}`);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const isSlotAvailable = (slot) => {
    const [start] = slot.split(" - ");
    return availableSlots.some(
      (availableSlot) => availableSlot.start_time === start
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Select a Time Slot</h2>
        <div className={styles.timeSlotGrid}>
          {timeSlots.map((slot) => {
            const isAvailable = isSlotAvailable(slot);
            return (
              <button
                key={slot}
                className={`${styles.timeSlot} ${
                  isAvailable ? styles.availableSlot : styles.bookedSlot
                }`}
                onClick={() =>
                  isAvailable && onSelectTime(slot.split(" - ")[0])
                }
                disabled={!isAvailable}
              >
                {slot}
              </button>
            );
          })}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TimeSlotModal;
