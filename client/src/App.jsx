import React from 'react';
import CashierView from './components/CashierView';
import CustomerKiosk from './components/CustomerKiosk';
import ManagerDashboard from './components/ManagerDashboard';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 space-y-12">
      {/* Manager Dashboard */}
      <section className="border rounded-lg shadow bg-white p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Manager Dashboard</h2>
        <ManagerDashboard />
      </section>

      {/* Cashier View */}
      <section className="border rounded-lg shadow bg-white p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Cashier View</h2>
        <CashierView />
      </section>

      {/* Customer Kiosk */}
      <section className="border rounded-lg shadow bg-white p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Customer Kiosk</h2>
        <CustomerKiosk />
      </section>
    </div>
  );
}

export default App;
