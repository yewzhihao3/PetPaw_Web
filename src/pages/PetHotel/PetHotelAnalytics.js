import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import { fetchAllBookings, fetchHotels } from "./pet_hotel_apiService";
import { useAuth } from "../../AuthContext";
import styles from "../../styles/PetHotelAnalytics.module.css";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const PetHotelAnalytics = () => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("year");
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bookingsData, hotelsData] = await Promise.all([
          fetchAllBookings(user.token),
          fetchHotels(user.token),
        ]);
        setBookings(bookingsData);
        setHotels(
          hotelsData.reduce((acc, hotel) => {
            acc[hotel.id] = hotel.name;
            return acc;
          }, {})
        );
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.token]);

  const processBookingData = () => {
    const monthlyData = {};
    bookings.forEach((booking) => {
      const date = new Date(booking.start_date);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { bookings: 0, revenue: 0 };
      }
      monthlyData[monthYear].bookings += 1;
      monthlyData[monthYear].revenue += booking.total_price;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      bookings: data.bookings,
      revenue: data.revenue,
    }));
  };

  const processHotelData = () => {
    const hotelData = {};
    bookings.forEach((booking) => {
      const date = new Date(booking.start_date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      if (
        (selectedTimeFrame === "year" && year === currentYear) ||
        (selectedTimeFrame === "month" &&
          year === currentYear &&
          month === currentMonth)
      ) {
        if (!hotelData[booking.hotel_id]) {
          hotelData[booking.hotel_id] = { bookings: 0, revenue: 0 };
        }
        hotelData[booking.hotel_id].bookings += 1;
        hotelData[booking.hotel_id].revenue += booking.total_price;
      }
    });

    return Object.entries(hotelData).map(([hotelId, data]) => ({
      name: hotels[hotelId] || `Hotel ${hotelId}`,
      value: data.bookings,
      revenue: data.revenue,
    }));
  };

  const analyticsData = processBookingData();
  const hotelData = processHotelData();
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.total_price,
    0
  );
  const averageBookingsPerMonth = totalBookings / (analyticsData.length || 1);

  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`Bookings ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`Revenue RM${payload.revenue} (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Loading analytics data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pet Hotel Business Analytics</h2>
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h3>Total Bookings</h3>
          <p>{totalBookings}</p>
        </div>
        <div className={styles.card}>
          <h3>Total Revenue</h3>
          <p>RM {totalRevenue.toLocaleString()}</p>
        </div>
        <div className={styles.card}>
          <h3>Avg. Bookings/Month</h3>
          <p>{averageBookingsPerMonth.toFixed(2)}</p>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <h3>Monthly Bookings and Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="bookings"
              fill="#8884d8"
              name="Bookings"
              animationBegin={0}
              animationDuration={2000}
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              fill="#82ca9d"
              name="Revenue (RM)"
              animationBegin={1000}
              animationDuration={2000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.chartContainer}>
        <h3>Booking Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={Object.entries(statusCounts).map(([status, count]) => ({
              status,
              count,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              animationBegin={0}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.chartContainer}>
        <h3>Best Selling Hotels</h3>
        <div className={styles.timeFrameSelector}>
          <button
            className={`${styles.timeFrameButton} ${
              selectedTimeFrame === "month" ? styles.active : ""
            }`}
            onClick={() => setSelectedTimeFrame("month")}
          >
            This Month
          </button>
          <button
            className={`${styles.timeFrameButton} ${
              selectedTimeFrame === "year" ? styles.active : ""
            }`}
            onClick={() => setSelectedTimeFrame("year")}
          >
            This Year
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={hotelData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              animationBegin={0}
              animationDuration={2000}
            >
              {hotelData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PetHotelAnalytics;
