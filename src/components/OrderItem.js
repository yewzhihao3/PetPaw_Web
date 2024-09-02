import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaShoppingCart,
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../styles/OrderItem.css";

const OrderItem = ({ order, products, onAccept, onDecline }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  const getProductName = (sanityId) => {
    const product = products.find((p) => p.sanity_id === sanityId);
    return product ? product.name : "Unknown Product";
  };

  if (!order) {
    return null;
  }

  const isOrderPending = order.status === "PENDING";

  return (
    <div className="orderItem">
      <div className="orderHeader" onClick={toggleExpand}>
        <span>
          Order #{order.id || "N/A"} - RM
          {order.total_amount?.toFixed(2) || "N/A"}
        </span>
        <span className="orderStatus">{order.status}</span>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {expanded && (
        <div className="orderDetails">
          <div className="orderInfo">
            <div className="customerInfo">
              <h3>
                <FaUser /> Customer Information
              </h3>
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
            {order.delivery_address && (
              <div className="deliveryInfo">
                <h3>
                  <FaMapMarkerAlt /> Delivery Address
                </h3>
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
            )}
          </div>
          <div className="orderItems">
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
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{getProductName(item.product_id)}</td>
                      <td>{item.quantity || "N/A"}</td>
                      <td>RM {item.price?.toFixed(2) || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No items available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="orderSummary">
            <h3>
              <FaMoneyBillWave /> Order Summary
            </h3>
            <p>
              <span>Subtotal:</span>{" "}
              <span>
                RM
                {(
                  (order.total_amount || 0) - (order.delivery_fee || 0)
                ).toFixed(2)}
              </span>
            </p>
            <p>
              <span>Delivery Fee:</span>{" "}
              <span>RM {order.delivery_fee?.toFixed(2) || "N/A"}</span>
            </p>
            <p>
              <span>Total:</span>{" "}
              <span>RM {order.total_amount?.toFixed(2) || "N/A"}</span>
            </p>
          </div>
          {isOrderPending && (
            <div className="orderActions">
              <button
                onClick={() => onAccept(order.id)}
                className="acceptButton"
              >
                Accept
              </button>
              <button
                onClick={() => onDecline(order.id)}
                className="declineButton"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderItem;
