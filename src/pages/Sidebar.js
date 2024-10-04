import React from "react";
import { FaShoppingBag, FaClinicMedical, FaHotel } from "react-icons/fa";
import styles from "../styles/Sidebar.module.css";

const Sidebar = ({
  activeMenuItem,
  setActiveMenuItem,
  activeSubMenuItem,
  setActiveSubMenuItem,
}) => {
  const menuItems = [
    {
      name: "Shop",
      icon: <FaShoppingBag />,
      subItems: ["Order Management", "Order History", "Money Earned"],
    },
    {
      name: "Clinics",
      icon: <FaClinicMedical />,
      subItems: [
        "Appointments",
        "Veterinary Management",
        "Prescriptions & Refill Requests",
        "Medical Records",
      ],
    },
    {
      name: "Hotel",
      icon: <FaHotel />,
      subItems: ["Hotel Booking Management", "Pet Hotel Analytics"],
    },
    { name: "Grooming Service", icon: <FaHotel /> },
  ];

  return (
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
  );
};

export default Sidebar;
