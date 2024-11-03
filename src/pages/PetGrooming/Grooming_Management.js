import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import {
  fetchGroomingServices,
  fetchUsers,
  fetchPets,
} from "./Grooming_apiService";
import GroomingCreate from "./Grooming_Create";
import GroomingList from "./Grooming_List";
import CompletedBookingHistory from "./CompletedBookingHistory";
import stylesBase from "../../styles/GroomingBase.module.css";
import stylesCreate from "../../styles/GroomingCreate.module.css";
import { Plus } from "lucide-react";

const Grooming_Management = () => {
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateTab, setShowCreateTab] = useState(false);
  const [activeTab, setActiveTab] = useState("current"); // 'current' or 'completed'
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, usersData, petsData] = await Promise.all([
          fetchGroomingServices(user.token),
          fetchUsers(user.token),
          fetchPets(user.token),
        ]);
        setServices(servicesData);
        setUsers(usersData);
        setPets(petsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch grooming data");
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  if (loading) return <div className={stylesBase.loading}>Loading...</div>;
  if (error) return <div className={stylesBase.error}>Error: {error}</div>;

  return (
    <div className={`${stylesBase.container} ${stylesBase.fadeIn}`}>
      <h2 className={stylesBase.title}>Grooming Management</h2>
      <div className={stylesBase.content}>
        {showCreateTab ? (
          <GroomingCreate
            services={services}
            users={users}
            pets={pets}
            onClose={() => setShowCreateTab(false)}
          />
        ) : (
          <button
            className={stylesCreate.createButton}
            onClick={() => setShowCreateTab(true)}
          >
            <Plus size={24} />
            Create New Booking
          </button>
        )}
        <div className={stylesBase.tabContainer}>
          <button
            className={`${stylesBase.tabButton} ${
              activeTab === "current" ? stylesBase.activeTab : ""
            }`}
            onClick={() => setActiveTab("current")}
          >
            Current Bookings
          </button>
          <button
            className={`${stylesBase.tabButton} ${
              activeTab === "completed" ? stylesBase.activeTab : ""
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Bookings
          </button>
        </div>
        {activeTab === "current" ? (
          <GroomingList />
        ) : (
          <CompletedBookingHistory />
        )}
      </div>
    </div>
  );
};

export default Grooming_Management;
