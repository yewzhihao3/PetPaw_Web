import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  fetchOrders,
  fetchAllOrders,
  fetchProducts,
  fetchCategories,
  handleOrderAction,
} from "../apiService";
import Sidebar from "./Sidebar";
import OrderItem from "../components/Order/OrderItem";
import OrderHistoryItem from "../components/Order/OrderHistoryItem";
import MoneyEarned from "../components/Order/MoneyEarned";
import Appointments from "../pages/VetManagement/Appointments";
import VeterinaryManagement from "./VetManagement/VeterinaryManagement";
import RefillRequestManagement from "./VetManagement/RefillRequestManagement";
import MedicalRecords from "./VetManagement/MedicalRecords";
import HotelBookingManagement from "./PetHotel/HotelBookingManagement";
import PetHotelAnalytics from "./PetHotel/PetHotelAnalytics";
import { FaShoppingBag, FaHistory, FaSpinner, FaHotel } from "react-icons/fa";
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

  const fetchData = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    if (user?.token) {
      fetchData();
    } else {
      setError("No user token available. Please log in again.");
    }
  }, [user, fetchData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRefresh = async () => {
    await fetchData();
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await handleOrderAction(orderId, "accept", user.token);
      await fetchData();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order. Please try again.");
    }
  };

  const handleDeclineOrder = async (orderId, declineReason) => {
    try {
      await handleOrderAction(orderId, "decline", user.token, declineReason);
      await fetchData();
    } catch (error) {
      console.error("Error declining order:", error);
      alert("Failed to decline order. Please try again.");
    }
  };

  const renderShopContent = () => {
    switch (activeSubMenuItem) {
      case "Order Management":
        return (
          <div className={styles.orderList}>
            <h2>Pending Orders</h2>
            {pendingOrders.length > 0 ? (
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
            )}
          </div>
        );
      case "Order History":
        return (
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
        );
      case "Money Earned":
        return (
          <MoneyEarned
            allOrders={allOrders}
            products={products}
            categories={
              categories.length > 0
                ? categories
                : [{ _id: "uncategorized", name: "Uncategorized" }]
            }
          />
        );
      default:
        return null;
    }
  };

  const renderClinicContent = () => {
    switch (activeSubMenuItem) {
      case "Appointments":
        return <Appointments />;
      case "Veterinary Management":
        return <VeterinaryManagement />;
      case "Prescriptions & Refill Requests":
        return <RefillRequestManagement />;
      case "Medical Records":
        return <MedicalRecords />;
      default:
        return null;
    }
  };

  const renderHotelContent = () => {
    switch (activeSubMenuItem) {
      case "Hotel Booking Management":
        return <HotelBookingManagement />;
      case "Pet Hotel Analytics":
        return <PetHotelAnalytics />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case "Shop":
        return renderShopContent();
      case "Clinics":
        return renderClinicContent();
      case "Hotel":
        return renderHotelContent();
      case "Grooming Service":
        return (
          <div className={styles.noData}>
            <FaHotel className={styles.noDataIcon} />
            <p>Pet Grooming coming soon!</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <FaSpinner className={styles.spinner} /> Loading...
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        activeSubMenuItem={activeSubMenuItem}
        setActiveSubMenuItem={setActiveSubMenuItem}
      />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>
            PetPaw {activeMenuItem} - {activeSubMenuItem}
          </h1>
          <div>
            <button onClick={handleRefresh} className={styles.refreshButton}>
              Refresh
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </header>
        <div className={styles.content}>{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
