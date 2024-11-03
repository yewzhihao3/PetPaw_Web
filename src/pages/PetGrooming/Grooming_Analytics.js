import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { fetchAllBookings } from "./Grooming_apiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import styles from "../../styles/Grooming_Analytics.module.css";

const Grooming_Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await fetchAllBookings(user.token);
        const processedData = processBookingsData(bookings);
        setAnalyticsData(processedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings data");
        setLoading(false);
      }
    };
    fetchData();
  }, [user.token]);

  const processBookingsData = (bookings) => {
    const totalEarnings = bookings.reduce((sum, booking) => {
      return (
        sum +
        booking.services.reduce(
          (serviceSum, service) => serviceSum + service.price,
          0
        )
      );
    }, 0);

    const totalBookings = bookings.length;
    const averageBookingValue = totalEarnings / totalBookings;

    const monthlyEarnings = bookings.reduce((acc, booking) => {
      const month = new Date(booking.date).toLocaleString("default", {
        month: "short",
      });
      const earnings = booking.services.reduce(
        (sum, service) => sum + service.price,
        0
      );
      acc[month] = (acc[month] || 0) + earnings;
      return acc;
    }, {});

    const popularServices = bookings.reduce((acc, booking) => {
      booking.services.forEach((service) => {
        acc[service.name] = (acc[service.name] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      totalEarnings,
      totalBookings,
      averageBookingValue,
      monthlyEarnings: Object.entries(monthlyEarnings).map(
        ([month, earnings]) => ({ month, earnings })
      ),
      popularServices: Object.entries(popularServices).map(
        ([name, bookings]) => ({ name, bookings })
      ),
    };
  };

  if (loading)
    return <div className={styles.loading}>Loading analytics...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.analyticsContainer}>
      <h2 className={styles.title}>Grooming Analytics</h2>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>Total Earnings</h3>
          <p className={styles.metricValue}>
            RM {analyticsData.totalEarnings.toFixed(2)}
          </p>
        </div>
        <div className={styles.metricCard}>
          <h3>Total Bookings</h3>
          <p className={styles.metricValue}>{analyticsData.totalBookings}</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Average Booking Value</h3>
          <p className={styles.metricValue}>
            RM {analyticsData.averageBookingValue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3>Monthly Earnings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.monthlyEarnings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#6200ee"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartContainer}>
        <h3>Popular Services</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.popularServices}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" fill="#6200ee" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Grooming_Analytics;
