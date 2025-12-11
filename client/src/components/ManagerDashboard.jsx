import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  UtensilsCrossed,
  Settings,
  Search,
  Bell,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  ClipboardList,
  Smile,
  AlertCircle,
  AlertTriangle,
  Menu,
  Edit2, 
  Save,  
  X,     
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Analytics");
  const [products, setProducts] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reorderItem, setReorderItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [topItems, setTopItems] = useState([]);
  
  // Employee State
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employee_name: "",
    role: "",
  });

  // --- UPDATED: State for Editing Employees now includes active ---
  const [editingEmployee, setEditingEmployee] = useState(null); 
  const [updatedEmployee, setUpdatedEmployee] = useState({
    employee_name: "",
    role: "",
    active: true // Default to true to prevent null errors
  });

  const openReorderModal = (item) => {
    setReorderItem(item);
    setIsModalOpen(true);
  };

  const closeReorderModal = () => {
    setIsModalOpen(false);
    setReorderItem(null);
    setNewQuantity("");
  };

  const [dashboardStats, setDashboardStats] = useState({
    todayRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    itemsSold: 0,
    itemsSoldChange: 0,
  });

  const handleReorder = async () => {
    try {
      const response = await axios.post("/api/products/inventory/reorder", {
        inventoryId: reorderItem.inventory_id,
        newQuantity: parseFloat(newQuantity),
      });

      if (response.data.success) {
        setInventoryData(
          inventoryData.map((item) =>
            item.inventory_id === reorderItem.inventory_id
              ? { ...response.data.data }
              : item
          )
        );
        closeReorderModal();
        alert("Reorder successful!");
      }
    } catch (error) {
      console.error("Error reordering inventory:", error);
      alert("Failed to reorder. Please try again.");
    }
  };

  // Initialize stats with default values
  const stats = [
    {
      title: "Today's Revenue",
      value: `$${parseFloat(dashboardStats.todayRevenue).toFixed(2)}`,
      delta: `${dashboardStats.revenueChange.toFixed(1)}% from yesterday`,
      isPositive: dashboardStats.revenueChange >= 0,
      icon: DollarSign,
      bg: "#dbeafe",
      color: "#2563eb",
    },
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders.toString(),
      delta: `${dashboardStats.ordersChange.toFixed(1)}% from yesterday`,
      isPositive: dashboardStats.ordersChange >= 0,
      icon: ShoppingBag,
      bg: "#dcfce7",
      color: "#16a34a",
    },
    {
      title: "Items Sold",
      value: dashboardStats.itemsSold.toString(),
      delta: `${dashboardStats.itemsSoldChange.toFixed(1)}% from yesterday`,
      isPositive: dashboardStats.itemsSoldChange >= 0,
      icon: ShoppingCart,
      bg: "#fef3c7",
      color: "#d97706",
    },
    {
      title: "Customer Satisfaction",
      value: "4.8",
      subtext: "⭐ Based on 45 reviews",
      icon: Smile,
      bg: "#ede9fe",
      color: "#7c3aed",
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          productsRes,
          ordersHistoryRes,
          inventoryRes,
          statsRes,
          recentOrdersRes,
          weeklyRevenueRes,
          topItemsRes,
          employeesRes,
        ] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/orders/history"),
          axios.get("/api/products/inventory/alerts"),
          axios.get("/api/products/dashboard/stats"),
          axios.get("/api/products/orders/recent"),
          axios.get("/api/products/revenue/last7days"),
          axios.get("/api/products/orders/top-items/last7days"),
          axios.get("/api/products/employees"),
        ]);

        setProducts(productsRes.data.data || []);
        setOrderHistory(ordersHistoryRes.data.data || []);
        setInventoryData(inventoryRes.data.data || []);
        setDashboardStats(statsRes.data.data);
        setRecentOrders(recentOrdersRes.data.data || []);
        setWeeklyRevenue(weeklyRevenueRes.data.data || []);
        setTopItems(topItemsRes.data.data || []);
        setEmployees(employeesRes.data.data || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchXReport = async () => {
    try {
      const response = await axios.get("/api/products/reports/x-report-pdf", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "x-report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching X-Report PDF:", error);
    }
  };

  const generateZReport = async () => {
    try {
      const response = await axios.post(
        "/api/products/reports/z-report-pdf",
        null,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "z-report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching Z-Report PDF:", error);
    }
  };

  const getLowStockItems = () => {
    const lowStockItems = inventoryData.filter((item) => {
      const quantity = parseFloat(item.quantity);
      const reorderLevel = parseFloat(item.reorder_level);
      const isLowStock =
        !isNaN(quantity) && (isNaN(reorderLevel) || quantity <= reorderLevel);
      return isLowStock;
    });
    return lowStockItems;
  };

  // Chart Configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        grid: { color: "#f1f5f9", borderDash: [4, 4] },
        ticks: { color: "#64748b", font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  const lineData = {
    labels: weeklyRevenue.map((item) => item.day),
    datasets: [
      {
        label: "Revenue",
        data: weeklyRevenue.map((item) => Number(item.revenue)),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#6366f1",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const barData = {
    labels: topItems.map((item) => item.product_name),
    datasets: [
      {
        label: "Orders",
        data: topItems.map((item) => Number(item.total_sold)),
        backgroundColor: "#8b5cf6",
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  };

  // --- EMPLOYEE HANDLERS ---

  const handleAddEmployee = async () => {
    if (!newEmployee.employee_name.trim() || !newEmployee.role.trim()) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const res = await axios.post("/api/products/employees", newEmployee);

      if (res.data.success) {
        setEmployees([...employees, res.data.data]);
        setNewEmployee({ employee_name: "", role: "" });
      }
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Failed to add employee.");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to remove this employee?"))
      return;

    try {
      const res = await axios.delete(`/api/products/employees/${id}`);

      if (res.data.success) {
        setEmployees(employees.filter((emp) => emp.employee_id !== id));
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee.");
    }
  };

  // --- UPDATED: Edit Employee Handlers (Fixes NULL error) ---

  const handleEditClick = (employee) => {
    setEditingEmployee(employee.employee_id);
    // Important: We must preserve the existing 'active' status
    setUpdatedEmployee({
      employee_name: employee.employee_name,
      role: employee.role,
      active: employee.active !== undefined ? employee.active : true // Fallback to true if missing
    });
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setUpdatedEmployee({ employee_name: "", role: "", active: true });
  };

  const handleUpdateEmployee = async (id) => {
    if (!updatedEmployee.employee_name.trim() || !updatedEmployee.role.trim()) {
      alert("Please fill out all fields");
      return;
    }

    try {
      // API call to update employee
      const res = await axios.put(`/api/products/employees/${id}`, updatedEmployee);

      if (res.data.success) {
        // Update local state
        setEmployees(
          employees.map((emp) =>
            emp.employee_id === id ? { ...emp, ...updatedEmployee } : emp
          )
        );
        setEditingEmployee(null);
        alert("Employee updated successfully!");
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      alert("Failed to update employee.");
    }
  };

  // Removed "Staff" from the sidebar items
  const sidebarItems = [
    { name: "Analytics", icon: LayoutDashboard },
  ];

  // Loading state
  if (loading && !stats.length) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1.25rem",
          color: "#64748b",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        minHeight: "calc(100vh - 5rem)",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          background: "linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)",
          color: "white",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              <LayoutDashboard size={24} color="white" />
            </div>
            <div>
              <h1
                style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}
              >
                BubblePOS
              </h1>
              <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                Manager Dashboard
              </span>
            </div>
          </div>

          <nav
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    activeTab === item.name
                      ? "rgba(255, 255, 255, 0.15)"
                      : "transparent",
                  color: "white",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.9375rem",
                  fontWeight: activeTab === item.name ? "600" : "500",
                  transition: "all 0.2s",
                }}
              >
                <item.icon
                  size={20}
                  style={{ opacity: activeTab === item.name ? 1 : 0.7 }}
                />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            background: "rgba(0,0,0,0.1)",
            borderRadius: "12px",
          }}
        >
          <img
            src={
              user?.picture ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Manager"
            }
            alt="Manager"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#fff",
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.875rem", fontWeight: "600" }}>
              {user?.name || "Manager"}
            </div>
            <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
              {user?.role || "Manager"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: "2rem", overflowY: "auto" }}>
        {/* Top Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Dashboard Overview
            </h2>
            <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>
              Welcome back, {user?.name || "Manager"}! Here's what's happening
              at your store today.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  padding: "0.625rem 1rem 0.625rem 2.5rem",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  outline: "none",
                  width: "240px",
                  fontSize: "0.875rem",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              />
            </div>
            <button
              style={{
                position: "relative",
                padding: "0.625rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "white",
                cursor: "pointer",
              }}
            >
              <Bell size={20} color="#64748b" />
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  width: "8px",
                  height: "8px",
                  background: "#ef4444",
                  borderRadius: "50%",
                }}
              ></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#64748b",
                      margin: 0,
                    }}
                  >
                    {stat.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: "bold",
                      color: "#0f172a",
                      marginTop: "0.5rem",
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
                <div
                  style={{
                    background: stat.bg,
                    padding: "0.75rem",
                    borderRadius: "12px",
                  }}
                >
                  <stat.icon size={24} color={stat.color} />
                </div>
              </div>
              {stat.subtext ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.875rem",
                    color: "#f59e0b",
                    fontWeight: "600",
                  }}
                >
                  {stat.subtext}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.875rem",
                    color: stat.isPositive ? "#10b981" : "#ef4444",
                    fontWeight: "600",
                  }}
                >
                  <TrendingUp size={16} />
                  {stat.delta}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Line Chart */}
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Sales Trend (Last 7 Days)
              </h3>
              <Menu size={20} color="#94a3b8" style={{ cursor: "pointer" }} />
            </div>
            <div style={{ height: "250px" }}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          {/* Bar Chart */}
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Popular Items
              </h3>
              <Menu size={20} color="#94a3b8" style={{ cursor: "pointer" }} />
            </div>
            <div style={{ height: "250px" }}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Recent Orders Table */}
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "bold",
                color: "#0f172a",
                marginBottom: "1.25rem",
              }}
            >
              Recent Orders
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    background: "#f8fafc",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#e0e7ff",
                        padding: "0.5rem",
                        borderRadius: "50%",
                      }}
                    >
                      <Users size={20} color="#6366f1" />
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "#0f172a" }}>
                        Order {order.id}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                        {order.item}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", color: "#0f172a" }}>
                      {order.amount}
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "100px",
                        background: order.statusColor,
                        color: order.statusText,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* ===========================
    EMPLOYEE MANAGEMENT SECTION
   =========================== */}
          <div
            style={{
              marginTop: "3rem",
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#0f172a",
              }}
            >
              Employee Roster
            </h2>

            {/* Add Employee */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.5rem",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Employee Name"
                value={newEmployee.employee_name}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    employee_name: e.target.value,
                  })
                }
                style={{
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  flex: 1,
                }}
              />

              <input
                type="text"
                placeholder="Role"
                value={newEmployee.role}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, role: e.target.value })
                }
                style={{
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  flex: 1,
                }}
              />

              <button
                onClick={handleAddEmployee}
                style={{
                  background: "#6366f1",
                  color: "white",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Add
              </button>
            </div>

            {/* Employee List */}
            <h3 style={{ marginBottom: "0.5rem", color: "#1e293b" }}>
              Current Employees
            </h3>

            {employees.length === 0 ? (
              <p style={{ color: "#64748b" }}>No employees found.</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "1rem",
                }}
              >
                <thead style={{ background: "#f1f5f9" }}>
                  <tr>
                    <th style={{ padding: "0.75rem", textAlign: "left" }}>
                      Name
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "left" }}>
                      Role
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "right" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr
                      key={emp.employee_id}
                      style={{ borderBottom: "1px solid #e2e8f0" }}
                    >
                      {/* Check if this row is currently being edited */}
                      {editingEmployee === emp.employee_id ? (
                        <>
                          <td style={{ padding: "0.75rem" }}>
                            <input
                              type="text"
                              value={updatedEmployee.employee_name}
                              onChange={(e) =>
                                setUpdatedEmployee({
                                  ...updatedEmployee,
                                  employee_name: e.target.value,
                                })
                              }
                              style={{
                                padding: "0.5rem",
                                borderRadius: "6px",
                                border: "1px solid #6366f1",
                                width: "100%",
                              }}
                            />
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <input
                              type="text"
                              value={updatedEmployee.role}
                              onChange={(e) =>
                                setUpdatedEmployee({
                                  ...updatedEmployee,
                                  role: e.target.value,
                                })
                              }
                              style={{
                                padding: "0.5rem",
                                borderRadius: "6px",
                                border: "1px solid #6366f1",
                                width: "100%",
                              }}
                            />
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "right" }}>
                            <button
                              onClick={() => handleUpdateEmployee(emp.employee_id)}
                              style={{
                                background: "#16a34a",
                                color: "white",
                                padding: "0.5rem",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                                marginRight: "0.5rem",
                              }}
                              title="Save Changes"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              style={{
                                background: "#94a3b8",
                                color: "white",
                                padding: "0.5rem",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                              }}
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </>
                      ) : (
                        // Normal Display Mode
                        <>
                          <td style={{ padding: "0.75rem", color: "black" }}>
                            {emp.employee_name}
                          </td>
                          <td style={{ padding: "0.75rem", color: "black" }}>
                            {emp.role}
                          </td>
                          <td
                            style={{ padding: "0.75rem", textAlign: "right" }}
                          >
                            <button
                              onClick={() => handleEditClick(emp)}
                              style={{
                                background: "#3b82f6",
                                color: "white",
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                                cursor: "pointer",
                                border: "none",
                                marginRight: "0.5rem",
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Edit2 size={16} /> Edit
                              </div>
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.employee_id)}
                              style={{
                                background: "#ef4444",
                                color: "white",
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                                cursor: "pointer",
                                border: "none",
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Inventory Alerts */}
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "bold",
                color: "#0f172a",
                marginBottom: "1.25rem",
              }}
            >
              Inventory Alerts
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {getLowStockItems().length > 0 ? (
                getLowStockItems().map((item) => (
                  <div
                    key={item.inventory_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      borderRadius: "12px",
                      background:
                        parseFloat(item.quantity) <= 0 ? "#fee2e2" : "#fef3c7",
                      border:
                        parseFloat(item.quantity) <= 0
                          ? "1px solid #fecaca"
                          : "1px solid #fde68a",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      {parseFloat(item.quantity) <= 0 ? (
                        <AlertCircle color="#dc2626" />
                      ) : (
                        <AlertTriangle color="#d97706" />
                      )}
                      <div>
                        <div style={{ fontWeight: "600", color: "#0f172a" }}>
                          {item.item_name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color:
                              parseFloat(item.quantity) <= 0
                                ? "#dc2626"
                                : "#d97706",
                          }}
                        >
                          {parseFloat(item.quantity) <= 0
                            ? `Out of stock: ${Math.abs(
                                parseFloat(item.quantity)
                              )} ${item.unit} needed`
                            : `Only ${item.quantity} ${item.unit} remaining`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => openReorderModal(item)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border: "none",
                        background:
                          parseFloat(item.quantity) <= 0
                            ? "#dc2626"
                            : "#d97706",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      Reorder
                    </button>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "2rem",
                  }}
                >
                  No low stock items at the moment.
                </div>
              )}
            </div>
          </div>
          {isModalOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "8px",
                  width: "300px",
                }}
              >
                <h4>Reorder {reorderItem?.item_name}</h4>
                <p>
                  Current quantity: {reorderItem?.quantity} {reorderItem?.unit}
                </p>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  placeholder="Enter new quantity"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    onClick={closeReorderModal}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      border: "none",
                      background: "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReorder}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      border: "none",
                      background: "#3b82f6",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Confirm Reorder
                  </button>
                </div>
              </div>
            </div>
          )}
          <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
            <button
              onClick={fetchXReport}
              style={{
                padding: "10px 18px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Download X Report
            </button>

            <button
              onClick={generateZReport}
              style={{
                padding: "10px 18px",
                background: "#F44336",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Download Z Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;