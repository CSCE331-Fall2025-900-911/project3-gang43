import React, { useState } from "react";
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
  Menu
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("Analytics");

  // Mock Data matching the screenshot
  const stats = [
    { 
      title: "Today's Revenue", 
      value: "$2,847", 
      delta: "+12.5% from yesterday", 
      isPositive: true, 
      icon: DollarSign, 
      color: "#10b981", 
      bg: "#d1fae5" 
    },
    { 
      title: "Orders Completed", 
      value: "184", 
      delta: "+8.2% from yesterday", 
      isPositive: true, 
      icon: ShoppingCart, 
      color: "#3b82f6", 
      bg: "#dbeafe" 
    },
    { 
      title: "Average Order", 
      value: "$15.47", 
      delta: "+3.1% from yesterday", 
      isPositive: true, 
      icon: ClipboardList, 
      color: "#8b5cf6", 
      bg: "#ede9fe" 
    },
    { 
      title: "Customer Satisfaction", 
      value: "4.8", 
      subtext: "Based on 127 reviews", 
      icon: Smile, 
      color: "#f59e0b", 
      bg: "#fef3c7" 
    },
  ];

  const inventoryAlerts = [
    { id: 1, name: "Tapioca Pearls", status: "Only 2 bags remaining", type: "critical" },
    { id: 2, name: "Green Tea Powder", status: "Running low - 5 units left", type: "warning" },
  ];

  const recentOrders = [
    { id: "#1847", item: "Taro Milk Tea + Tapioca", amount: "$6.50", status: "Completed", statusColor: "#d1fae5", statusText: "#065f46" },
    { id: "#1846", item: "Mango Green Tea + Jelly", amount: "$5.75", status: "Preparing", statusColor: "#fef3c7", statusText: "#92400e" },
  ];

  // Chart Configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: { 
        grid: { color: '#f1f5f9', borderDash: [4, 4] },
        ticks: { color: '#64748b', font: { size: 11 } },
        beginAtZero: true
      },
    },
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [2100, 2300, 2150, 2500, 2800, 3200, 2850],
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
    labels: ["Taro Milk", "Brown Sugar", "Mango Green", "Thai Tea", "Matcha"],
    datasets: [
      {
        label: "Orders",
        data: [45, 38, 32, 28, 25],
        backgroundColor: "#8b5cf6",
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  };

  const sidebarItems = [
    { name: "Analytics", icon: LayoutDashboard },
    { name: "Orders", icon: ShoppingCart },
    { name: "Inventory", icon: Package },
    { name: "Staff", icon: Users },
    { name: "Menu", icon: UtensilsCrossed },
    { name: "Settings", icon: Settings },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "calc(100vh - 5rem)", backgroundColor: "#f8fafc" }}>
      
      {/* Sidebar - Matches the purple gradient in screenshot */}
      <div style={{ 
        background: "linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)", 
        color: "white",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "rgba(255,255,255,0.2)", padding: "0.5rem", borderRadius: "8px" }}>
              <LayoutDashboard size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>BubblePOS</h1>
              <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Manager Dashboard</span>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
                  background: activeTab === item.name ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  color: "white",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.9375rem",
                  fontWeight: activeTab === item.name ? "600" : "500",
                  transition: "all 0.2s"
                }}
              >
                <item.icon size={20} style={{ opacity: activeTab === item.name ? 1 : 0.7 }} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", background: "rgba(0,0,0,0.1)", borderRadius: "12px" }}>
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" 
            alt="Manager" 
            style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff" }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.875rem", fontWeight: "600" }}>Sarah Chen</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Store Manager</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: "2rem", overflowY: "auto" }}>
        
        {/* Top Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Dashboard Overview</h2>
            <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>Welcome back, Sarah! Here's what's happening at your store today.</p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ 
                  padding: "0.625rem 1rem 0.625rem 2.5rem", 
                  borderRadius: "10px", 
                  border: "1px solid #e2e8f0", 
                  outline: "none",
                  width: "240px",
                  fontSize: "0.875rem"
                }} 
              />
            </div>
            <button style={{ position: "relative", padding: "0.625rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}>
              <Bell size={20} color="#64748b" />
              <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }}></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ background: "white", padding: "1.5rem", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#64748b", margin: 0 }}>{stat.title}</h3>
                  <div style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a", marginTop: "0.5rem" }}>{stat.value}</div>
                </div>
                <div style={{ background: stat.bg, padding: "0.75rem", borderRadius: "12px" }}>
                  <stat.icon size={24} color={stat.color} />
                </div>
              </div>
              {stat.subtext ? (
                 <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", color: "#f59e0b", fontWeight: "600" }}>
                   {stat.subtext}
                 </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", color: stat.isPositive ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                  <TrendingUp size={16} />
                  {stat.delta}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Line Chart */}
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Sales Trend (Last 7 Days)</h3>
                <Menu size={20} color="#94a3b8" style={{ cursor: "pointer" }} />
             </div>
             <div style={{ height: "250px" }}>
                <Line data={lineData} options={chartOptions} />
             </div>
          </div>

          {/* Bar Chart */}
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Popular Items</h3>
                <Menu size={20} color="#94a3b8" style={{ cursor: "pointer" }} />
             </div>
             <div style={{ height: "250px" }}>
                <Bar data={barData} options={chartOptions} />
             </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
          
          {/* Recent Orders Table */}
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0f172a", marginBottom: "1.25rem" }}>Recent Orders</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {recentOrders.map((order) => (
                <div key={order.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "#f8fafc", borderRadius: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ background: "#e0e7ff", padding: "0.5rem", borderRadius: "50%" }}>
                       <Users size={20} color="#6366f1" />
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "#0f172a" }}>Order {order.id}</div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{order.item}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", color: "#0f172a" }}>{order.amount}</div>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "600", 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "100px", 
                      background: order.statusColor, 
                      color: order.statusText 
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0f172a", marginBottom: "1.25rem" }}>Inventory Alerts</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {inventoryAlerts.map((alert) => (
                <div key={alert.id} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  padding: "1rem", 
                  borderRadius: "12px",
                  background: alert.type === "critical" ? "#fef2f2" : "#fefce8",
                  border: `1px solid ${alert.type === "critical" ? "#fee2e2" : "#fef9c3"}`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {alert.type === "critical" ? <AlertCircle color="#ef4444" /> : <AlertTriangle color="#eab308" />}
                    <div>
                      <div style={{ fontWeight: "600", color: "#0f172a" }}>{alert.name}</div>
                      <div style={{ fontSize: "0.875rem", color: alert.type === "critical" ? "#ef4444" : "#b45309" }}>{alert.status}</div>
                    </div>
                  </div>
                  <button style={{ 
                    padding: "0.5rem 1rem", 
                    borderRadius: "8px", 
                    border: "none", 
                    background: alert.type === "critical" ? "#ef4444" : "#eab308", 
                    color: "white", 
                    fontWeight: "600", 
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  }}>
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;