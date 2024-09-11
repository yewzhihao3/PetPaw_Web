import React from "react";
import styles from "../../styles/Dashboard.module.css";

const OrderList = ({ orders, onSelectOrder }) => {
  return (
    <div className={styles.orderListCard}>
      <h2>Pending Orders</h2>
      <ul className={styles.orderList}>
        {orders.map((order) => (
          <li
            key={order.id}
            className={styles.orderListItem}
            onClick={() => onSelectOrder(order)}
          >
            <span>Order #{order.id}</span>
            <span>${order.total_amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
