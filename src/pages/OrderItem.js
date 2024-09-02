import React, { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";
import styles from "../styles/Dashboard.module.css";

const OrderItem = ({ order, onAccept, onDecline, products }) => {
  const [expanded, setExpanded] = useState(false);

  const getProductName = (sanityId) => {
    const product = products.find((p) => p.sanity_id === sanityId);
    return product ? product.name : "Unknown Product";
  };

  if (!order) {
    return null;
  }

  const isOrderPending = order.status === "PENDING";

  return (
    <li className={styles.orderItem}>
      <div className={styles.orderSummary}>
        <div className={styles.orderInfo}>
          <strong>Order #{order.id || "N/A"}</strong> - $
          {order.total_amount?.toFixed(2) || "N/A"}
          <span className={styles.orderStatus}>{order.status}</span>
        </div>
        <div className={styles.orderActions}>
          <button
            onClick={() => setExpanded(!expanded)}
            className={styles.expandButton}
          >
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isOrderPending && (
            <>
              <button
                onClick={() => onAccept(order.id)}
                className={styles.acceptButton}
              >
                <FaCheck /> Accept
              </button>
              <button
                onClick={() => onDecline(order.id)}
                className={styles.declineButton}
              >
                <FaTimes /> Decline
              </button>
            </>
          )}
        </div>
      </div>
      {expanded && (
        <div className={styles.orderDetails}>
          <div className={styles.customerInfo}>
            <h4>
              <FaUser /> Customer Information
            </h4>
            <p>
              <strong>Name:</strong> {order.customer_name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {order.customer_email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {order.customer_phone || "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
          {order.delivery_address ? (
            <div className={styles.addressInfo}>
              <h4>Delivery Address:</h4>
              <p>{order.delivery_address.address_line1}</p>
              {order.delivery_address.address_line2 && (
                <p>{order.delivery_address.address_line2}</p>
              )}
              <p>
                {order.delivery_address.city}, {order.delivery_address.state}{" "}
                {order.delivery_address.postal_code}
              </p>
              <p>{order.delivery_address.country}</p>
            </div>
          ) : (
            <div className={styles.addressInfo}>
              <h4>Delivery Address:</h4>
              <p>Address not available</p>
            </div>
          )}
          <div className={styles.itemList}>
            <h4>
              <FaShoppingCart /> Order Items
            </h4>
            <ul>
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <li key={index}>
                    <span className={styles.itemName}>
                      {getProductName(item.product_id)}
                    </span>
                    <span className={styles.itemQuantity}>
                      x{item.quantity || "N/A"}
                    </span>
                    <span className={styles.itemPrice}>
                      ${item.price?.toFixed(2) || "N/A"}
                    </span>
                  </li>
                ))
              ) : (
                <li>No items available</li>
              )}
            </ul>
          </div>
          <div className={styles.orderSummary}>
            <h4>
              <FaMoneyBillWave /> Order Summary
            </h4>
            <p>
              <span>Subtotal:</span>{" "}
              <span>
                $
                {(
                  (order.total_amount || 0) - (order.delivery_fee || 0)
                ).toFixed(2)}
              </span>
            </p>
            <p>
              <span>Delivery Fee:</span>{" "}
              <span>${order.delivery_fee?.toFixed(2) || "N/A"}</span>
            </p>
            <p>
              <span>Total:</span>{" "}
              <span>${order.total_amount?.toFixed(2) || "N/A"}</span>
            </p>
          </div>
        </div>
      )}
    </li>
  );
};

export default OrderItem;
