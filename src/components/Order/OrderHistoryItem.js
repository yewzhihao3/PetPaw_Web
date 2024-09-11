import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaShoppingCart,
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../../styles/OrderHistoryItem.css";

const OrderHistoryItem = ({ order, products }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  const getProductName = (sanityId) => {
    const product = products.find((p) => p.sanity_id === sanityId);
    return product ? product.name : "Unknown Product";
  };

  if (!order) {
    return null;
  }

  return (
    <div className="orderItem">
      <div className="orderSummary" onClick={toggleExpand}>
        <div className="orderInfoLeft">
          <span className="orderNumber">Order #{order.id || "N/A"}</span>
          <span className="orderDate">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="orderInfoRight">
          <span className={`statusBadge status${order.status}`}>
            {order.status}
          </span>
          <span className="orderAmount">
            RM {order.total_amount?.toFixed(2) || "N/A"}
          </span>
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      {expanded && (
        <div className="orderDetails">
          <div className="customerInfoContainer">
            <div className="customerInfo">
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
            </div>
            {order.delivery_address && (
              <div className="addressInfo">
                <h4>
                  <FaMapMarkerAlt /> Delivery Address
                </h4>
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
          <div className="itemList">
            <h4>
              <FaShoppingCart /> Order Items
            </h4>
            <ul>
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <li key={index}>
                    <span className="itemName">
                      {getProductName(item.product_id)}
                    </span>
                    <span className="itemQuantity">
                      x{item.quantity || "N/A"}
                    </span>
                    <span className="itemPrice">
                      RM {item.price?.toFixed(2) || "N/A"}
                    </span>
                  </li>
                ))
              ) : (
                <li>No items available</li>
              )}
            </ul>
          </div>
          <div className="orderSummaryDetails">
            <h4>
              <FaMoneyBillWave /> Order Summary
            </h4>
            <p>
              <span>Subtotal:</span>
              <span className="summaryItem">
                RM{" "}
                {(
                  (order.total_amount || 0) - (order.delivery_fee || 0)
                ).toFixed(2)}
              </span>
            </p>
            <p>
              <span>Delivery Fee:</span>
              <span className="summaryItem">
                RM {order.delivery_fee?.toFixed(2) || "N/A"}
              </span>
            </p>
            <p>
              <span>Total:</span>
              <span className="summaryItem">
                RM {order.total_amount?.toFixed(2) || "N/A"}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryItem;
