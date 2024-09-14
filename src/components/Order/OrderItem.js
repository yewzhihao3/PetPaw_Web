import React, { useState, useCallback } from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import styles from "../../styles/OrderItem.module.css";
import DeclineModal from "./DeclineModal";

const OrderItem = ({ order, onAccept, onDecline, products }) => {
  const [expanded, setExpanded] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const getProductName = useCallback(
    (sanityId) => {
      const product = products.find((p) => p.sanity_id === sanityId);
      return product ? product.name : "Unknown Product";
    },
    [products]
  );

  const handleDeclineClick = () => {
    setIsDeclineModalOpen(true);
  };

  const handleConfirmDecline = (reason) => {
    onDecline(order.id, reason);
    setIsDeclineModalOpen(false);
  };

  if (!order) return null;

  return (
    <div className={styles.orderItem}>
      <div
        className={styles.orderHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <span>
          Order #{order.id} - RM{order.total_amount?.toFixed(2)}
        </span>
        <span className={styles.orderStatus}>{order.status}</span>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {expanded && (
        <div className={styles.orderDetails}>
          <div className={styles.infoSection}>
            <div className={styles.customerInfo}>
              <h3>
                <FaUser /> Customer Information
              </h3>
              <p>
                <strong>Name:</strong> {order.customer_name}
              </p>
              <p>
                <strong>Email:</strong> {order.customer_email}
              </p>
              <p>
                <strong>Phone:</strong> {order.customer_phone}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div className={styles.deliveryInfo}>
              <h3>
                <FaMapMarkerAlt /> Delivery Address
              </h3>
              <p>{order.delivery_address?.address_line1}</p>
              <p>{order.delivery_address?.address_line2}</p>
              <p>
                {order.delivery_address?.city}, {order.delivery_address?.state}{" "}
                {order.delivery_address?.postal_code}
              </p>
              <p>{order.delivery_address?.country}</p>
            </div>
          </div>

          <div className={styles.orderItems}>
            <h3>
              <FaShoppingCart /> Order Items
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{getProductName(item.product_id)}</td>
                    <td>{item.quantity}</td>
                    <td>RM {item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.orderSummary}>
            <h3>
              <FaMoneyBillWave /> Order Summary
            </h3>
            <p>
              <span>Subtotal:</span>{" "}
              <span>
                RM {(order.total_amount - order.delivery_fee).toFixed(2)}
              </span>
            </p>
            <p>
              <span>Delivery Fee:</span>{" "}
              <span>RM {order.delivery_fee.toFixed(2)}</span>
            </p>
            <p>
              <span>Total:</span>{" "}
              <span>RM {order.total_amount.toFixed(2)}</span>
            </p>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={() => onAccept(order.id)}
              className={styles.acceptButton}
            >
              Accept
            </button>
            <button
              onClick={handleDeclineClick}
              className={styles.declineButton}
            >
              Decline
            </button>
          </div>
        </div>
      )}

      <DeclineModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        onConfirm={handleConfirmDecline}
      />
    </div>
  );
};

export default OrderItem;
