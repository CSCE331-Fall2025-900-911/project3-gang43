// ManagerDashboard.jsx
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend
} from "chart.js";
import '../App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export default function ManagerDashboard() {
  const summary = {
    name: "Sarah",
    revenue: 2847,
    revenueDelta: 12.5,
    orders: 184,
    ordersDelta: 8.2,
    avgOrder: 15.47,
    avgOrderDelta: -3.1,
    satisfaction: 4.8,
    reviews: 127,
  };

  const salesTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [2100, 2350, 2600, 2900, 3200, 3500, 3150],
  };

  const popularItems = [
    { name: "Taro Milk Tea", orders: 48 },
    { name: "Brown Sugar", orders: 42 },
    { name: "Mango Green", orders: 39 },
    { name: "Thai Tea", orders: 33 },
    { name: "Matcha Latte", orders: 31 },
  ];

  const recentOrders = [
    { id: 1847, items: "Taro Milk Tea + Tapioca", total: 6.5, status: "Completed" },
    { id: 1846, items: "Mango Green Tea + Jelly", total: 5.75, status: "Preparing" },
  ];

  const inventoryAlerts = [
    { item: "Tapioca Pearls", note: "Only 2 bags remaining" },
    { item: "Green Tea Powder", note: "Running low - 5 units left" },
  ];

  const lineData = {
    labels: salesTrend.labels,
    datasets: [{
      label: "Revenue ($)",
      data: salesTrend.data,
      borderColor: "#22d3ee",
      backgroundColor: "rgba(34, 211, 238, 0.2)",
      tension: 0.35,
      pointRadius: 3,
    }]
  };

  const barData = {
    labels: popularItems.map(i => i.name),
    datasets: [{
      label: "Orders",
      data: popularItems.map(i => i.orders),
      backgroundColor: "#8b5cf6",
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#9ca3af" }, grid: { display: false } },
      y: { ticks: { color: "#9ca3af" }, grid: { color: "#1f2937" } }
    }
  };

  const StatCard = ({ title, value, delta }) => {
    const isUp = delta >= 0;
    return (
      <div className="card">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-delta ${isUp ? "up" : "down"}`}>
          {isUp ? "↑" : "↓"} {Math.abs(delta)}% from yesterday
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#22d3ee,#8b5cf6)"
          }} />
          <div>
            <div style={{ fontWeight: 700 }}>BubblePOS</div>
            <div className="kicker">Store Manager</div>
          </div>
        </div>
        {["Manager Dashboard", "Analytics", "Orders", "Inventory", "Staff", "Menu", "Settings"].map((label, i) => (
          <div key={label} style={{
            padding: "10px 12px", borderRadius: 8,
            background: i === 0 ? "#0b1324" : "transparent",
            border: i === 0 ? "1px solid #1f2937" : "1px solid transparent",
            cursor: "pointer"
          }}>{label}</div>
        ))}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #1f2937" }}>
          <div style={{ fontWeight: 600 }}>Sarah Chen</div>
          <div className="kicker">Store Manager</div>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="topbar">
        <div style={{
          height: 64, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 16px"
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="kicker">project 3 revised</div>
            <div className="badge">5 / 14</div>
            <div className="badge" style={{ color: "#22d3ee" }}>188%</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn">Export</button>
            <button className="btn">Refresh</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content">
        <div className="section">
          <h2>Dashboard overview</h2>
          <div className="kicker" style={{ marginTop: 6 }}>
            Welcome back, {summary.name}! Here's what's happening at your store today.
          </div>
        </div>

        <div className="grid cols-4">
          <StatCard title="Today's revenue" value={`$${summary.revenue}`} delta={summary.revenueDelta} />
          <StatCard title="Orders completed" value={summary.orders} delta={summary.ordersDelta} />
          <StatCard title="Average order" value={`$${summary.avgOrder.toFixed(2)}`} delta={summary.avgOrderDelta} />
          <div className="card">
            <div className="stat-title">Customer satisfaction</div>
            <div className="stat-value">{summary.satisfaction}</div>
            <div className="kicker" style={{ marginTop: 8 }}>★ Based on {summary.reviews} reviews</div>
          </div>
        </div>

        <div className="grid cols-2">
          <div className="card">
            <div className="section-header"><h3>Sales trend (last 7 days)</h3></div>
            <Line data={lineData} options={chartOptions} />
          </div>
          <div className="card">
            <div className="section-header"><h3>Popular items</h3></div>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="grid cols-2">
          <div className="card">
            <div className="section-header"><h3>Recent orders</h3></div>
            <table className="table">
              <thead>
                <tr><th>Order #</th><th>Items</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.items}</td>
                    <td>${o.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${o.status === "Completed" ? "success" : "progress"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="section-header">
              <h3>Inventory alerts</h3>
              <button className="btn">Reorder</button>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {inventoryAlerts.map(a => (
                <div key={a.item} className="card" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{a.item}</div>
                  <div className="kicker">{a.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
