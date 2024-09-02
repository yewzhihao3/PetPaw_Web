import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  fetchOrders,
  fetchAllOrders,
  fetchProducts,
  fetchCategories,
  handleOrderAction,
} from "../apiService";
import OrderItem from "../components/OrderItem";
import OrderHistoryItem from "../components/OrderHistoryItem";
import MoneyEarned from "../components/MoneyEarned";
import {
  FaShoppingBag,
  FaHistory,
  FaSpinner,
  FaClinicMedical,
  FaHotel,
} from "react-icons/fa";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("Shop");
  const [activeSubMenuItem, setActiveSubMenuItem] =
    useState("Order Management");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Shop",
      icon: <FaShoppingBag />,
      subItems: ["Order Management", "Order History", "Money Earned"],
    },
    { name: "Clinics", icon: <FaClinicMedical /> },
    { name: "Hotel", icon: <FaHotel /> },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pendingOrdersData, allOrdersData, productsData, categoriesData] =
          await Promise.all([
            fetchOrders(user.token),
            fetchAllOrders(user.token),
            fetchProducts(user.token),
            fetchCategories(user.token),
          ]);
        setPendingOrders(pendingOrdersData);
        setAllOrders(allOrdersData);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      loadData();
    } else {
      setError("No user token available. Please log in again.");
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await handleOrderAction(orderId, "accept", user.token);
      const [updatedPendingOrders, updatedAllOrders] = await Promise.all([
        fetchOrders(user.token),
        fetchAllOrders(user.token),
      ]);
      setPendingOrders(updatedPendingOrders);
      setAllOrders(updatedAllOrders);
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleDeclineOrder = async (orderId) => {
    try {
      await handleOrderAction(orderId, "decline", user.token);
      const [updatedPendingOrders, updatedAllOrders] = await Promise.all([
        fetchOrders(user.token),
        fetchAllOrders(user.token),
      ]);
      setPendingOrders(updatedPendingOrders);
      setAllOrders(updatedAllOrders);
    } catch (error) {
      console.error("Error declining order:", error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [pendingOrdersData, allOrdersData, productsData, categoriesData] =
        await Promise.all([
          fetchOrders(user.token),
          fetchAllOrders(user.token),
          fetchProducts(user.token),
          fetchCategories(user.token),
        ]);
      setPendingOrders(pendingOrdersData);
      setAllOrders(allOrdersData);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to refresh data");
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className={styles.loading}>
        <FaSpinner className={styles.spinner} /> Loading...
      </div>
    );
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2>PETPAW Dashboard</h2>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <span
                  className={activeMenuItem === item.name ? styles.active : ""}
                  onClick={() => {
                    setActiveMenuItem(item.name);
                    if (item.subItems) {
                      setActiveSubMenuItem(item.subItems[0]);
                    }
                  }}
                >
                  {item.icon}
                  {item.name}
                </span>
                {item.subItems && activeMenuItem === item.name && (
                  <ul>
                    {item.subItems.map((subItem) => (
                      <li
                        key={subItem}
                        className={
                          activeSubMenuItem === subItem ? styles.active : ""
                        }
                        onClick={() => setActiveSubMenuItem(subItem)}
                      >
                        {subItem}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>PetPaw Shop {activeSubMenuItem}</h1>
          <div>
            <button onClick={handleRefresh} className={styles.refreshButton}>
              Refresh
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </header>
        <div className={styles.orderList}>
          {activeMenuItem === "Shop" &&
            activeSubMenuItem === "Order Management" &&
            (pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  products={products}
                  onAccept={handleAcceptOrder}
                  onDecline={handleDeclineOrder}
                />
              ))
            ) : (
              <div className={styles.noData}>
                <FaShoppingBag className={styles.noDataIcon} />
                <p>No pending orders at the moment.</p>
              </div>
            ))}
          {activeMenuItem === "Shop" &&
            activeSubMenuItem === "Order History" && (
              <div className={styles.orderHistory}>
                <h2>Order History</h2>
                {allOrders.length > 0 ? (
                  allOrders.map((order) => (
                    <OrderHistoryItem
                      key={order.id}
                      order={order}
                      products={products}
                    />
                  ))
                ) : (
                  <div className={styles.noData}>
                    <FaHistory className={styles.noDataIcon} />
                    <p>No order history available.</p>
                  </div>
                )}
              </div>
            )}
          {activeMenuItem === "Shop" &&
            activeSubMenuItem === "Money Earned" && (
              <MoneyEarned
                allOrders={allOrders}
                products={products}
                categories={
                  categories.length > 0
                    ? categories
                    : [{ _id: "uncategorized", name: "Uncategorized" }]
                }
              />
            )}
          {activeMenuItem === "Clinics" && (
            <div className={styles.noData}>
              <FaClinicMedical className={styles.noDataIcon} />
              <p>Clinic management coming soon!</p>
            </div>
          )}
          {activeMenuItem === "Hotel" && (
            <div className={styles.noData}>
              <FaHotel className={styles.noDataIcon} />
              <p>Hotel management coming soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
