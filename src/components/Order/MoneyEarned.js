import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import {
  FaFileExport,
  FaMoneyBillWave,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";
import "../../styles/MoneyEarned.css";

const COLORS = ["#8884d8", "#9c27b0", "#673ab7", "#4a148c", "#e1bee7"];

const MoneyEarned = ({ allOrders, products, categories }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [earningsData, setEarningsData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  const periods = ["This Week", "This Month", "This Quarter", "This Year"];

  const filterOrdersByPeriod = useCallback((orders, period) => {
    if (orders.length === 0) return [];

    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    const mostRecentDate = new Date(sortedOrders[0].created_at);

    let startDate;
    switch (period) {
      case "This Week":
        startDate = new Date(
          mostRecentDate.getFullYear(),
          mostRecentDate.getMonth(),
          mostRecentDate.getDate() - 7
        );
        break;
      case "This Month":
        startDate = new Date(
          mostRecentDate.getFullYear(),
          mostRecentDate.getMonth(),
          1
        );
        break;
      case "This Quarter":
        startDate = new Date(
          mostRecentDate.getFullYear(),
          Math.floor(mostRecentDate.getMonth() / 3) * 3,
          1
        );
        break;
      case "This Year":
        startDate = new Date(mostRecentDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
    }
    console.log("Start date for filtering:", startDate);
    console.log("Most recent order date:", mostRecentDate);

    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      console.log(
        "Order date:",
        orderDate,
        "Is after start date:",
        orderDate >= startDate
      );
      return orderDate >= startDate;
    });
  }, []);

  const calculateEarnings = useCallback((orders) => {
    console.log("Calculating earnings for orders:", orders);
    const earningsByDate = orders.reduce((acc, order) => {
      const date = new Date(order.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + parseFloat(order.total_amount);
      return acc;
    }, {});
    return Object.entries(earningsByDate).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString(),
      amount,
    }));
  }, []);

  const calculateTopProducts = useCallback(
    (orders) => {
      const productSales = orders.reduce((acc, order) => {
        order.items.forEach((item) => {
          acc[item.product_id] =
            (acc[item.product_id] || 0) + item.quantity * item.price;
        });
        return acc;
      }, {});
      return Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id, sales]) => {
          const product = products.find((p) => p.sanity_id === id);
          return { name: product ? product.name : "Unknown Product", sales };
        });
    },
    [products]
  );

  const calculateRevenueBreakdown = useCallback(
    (orders) => {
      const categoryRevenue = orders.reduce((acc, order) => {
        order.items.forEach((item) => {
          const product = products.find((p) => p.sanity_id === item.product_id);
          if (product && product.category_id) {
            acc[product.category_id] =
              (acc[product.category_id] || 0) + item.quantity * item.price;
          } else {
            acc["uncategorized"] =
              (acc["uncategorized"] || 0) + item.quantity * item.price;
          }
        });
        return acc;
      }, {});

      return Object.entries(categoryRevenue).map(([categoryId, value]) => {
        const category = categories.find((c) => c._id === categoryId);
        return {
          name: category
            ? category.name
            : categoryId === "uncategorized"
            ? "Uncategorized"
            : "Unknown Category",
          value,
        };
      });
    },
    [products, categories]
  );

  const calculateTotals = useCallback((orders) => {
    return orders.reduce(
      (acc, order) => {
        acc.revenue += parseFloat(order.total_amount);
        acc.profit += parseFloat(order.total_amount) * 0.4; // Assuming 40% profit margin
        return acc;
      },
      { revenue: 0, profit: 0 }
    );
  }, []);

  const processData = useCallback(
    (orders, period) => {
      console.log("Processing data for period:", period);
      console.log("Number of orders:", orders.length);
      console.log("Sample order:", orders[0]);

      if (orders.length === 0) {
        console.log("No orders to process");
        setEarningsData([]);
        setTopProducts([]);
        setRevenueBreakdown([]);
        setTotalRevenue(0);
        setTotalProfit(0);
        setProfitMargin(0);
        return;
      }

      const filteredOrders = filterOrdersByPeriod(orders, period);
      console.log("Filtered orders:", filteredOrders.length);
      console.log("Sample filtered order:", filteredOrders[0]);

      const processedEarnings = calculateEarnings(filteredOrders);
      console.log("Processed earnings:", processedEarnings);

      const processedTopProducts = calculateTopProducts(filteredOrders);
      const processedRevenueBreakdown =
        calculateRevenueBreakdown(filteredOrders);
      const { revenue, profit } = calculateTotals(filteredOrders);

      setEarningsData(processedEarnings);
      setTopProducts(processedTopProducts);
      setRevenueBreakdown(processedRevenueBreakdown);
      setTotalRevenue(revenue);
      setTotalProfit(profit);
      setProfitMargin(revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0);
    },
    [
      filterOrdersByPeriod,
      calculateEarnings,
      calculateTopProducts,
      calculateRevenueBreakdown,
      calculateTotals,
    ]
  );

  useEffect(() => {
    if (allOrders.length > 0 && products.length > 0) {
      processData(allOrders, selectedPeriod);
    }
  }, [allOrders, products, categories, selectedPeriod, processData]);

  const handleExport = useCallback(() => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Amount\n" +
      earningsData.map((row) => `${row.date},${row.amount}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "earnings_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [earningsData]);

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
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          fontSize={16}
        >
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
          fontSize={14}
        >{`RM ${value.toFixed(2)}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
          fontSize={14}
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  return (
    <div className="money-earned-container">
      <div className="header">
        <h2>
          <FaMoneyBillWave /> Money Earned
        </h2>
        <button onClick={handleExport} className="export-btn">
          <FaFileExport /> Export
        </button>
      </div>
      <div className="period-tabs">
        {periods.map((period) => (
          <button
            key={period}
            className={`period-tab ${
              selectedPeriod === period ? "active" : ""
            }`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>
      <div className="summary-stats">
        <div className="stat-item">
          <h3>Total Revenue</h3>
          <p>RM {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-item">
          <h3>Total Profit</h3>
          <p>RM {totalProfit.toFixed(2)}</p>
        </div>
        <div className="stat-item">
          <h3>Profit Margin</h3>
          <p>{profitMargin}%</p>
        </div>
      </div>
      <div className="main-chart">
        <h3>
          <FaChartBar /> Earnings Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={earningsData}>
            <XAxis
              dataKey="date"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="additional-insights">
        <div className="insight-card top-products">
          <h3>
            <FaChartBar /> Top Selling Products
          </h3>
          <ul>
            {topProducts.map((product, index) => (
              <li key={index}>
                <span>{product.name}</span>
                <span>RM {product.sales.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="insight-card revenue-breakdown">
          <h3>
            <FaChartPie /> Revenue Breakdown
          </h3>
          <div className="revenue-breakdown-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {revenueBreakdown.map((entry, index) => (
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
      </div>
    </div>
  );
};

export default MoneyEarned;
