import React, { useState } from 'react';
import CashierView from './components/CashierView';
import CustomerKiosk from './components/CustomerKiosk';
import ManagerDashboard from './components/ManagerDashboard';
import './App.css';

function App() {
  // Removed unused 'count' state variable
  const [currentView, setCurrentView] = useState('cashier');

  return (
   <div>
      {/* View Selector */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-full shadow-lg p-2 flex gap-2">
        <button
          onClick={() => setCurrentView('cashier')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            currentView === 'cashier' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cashier View
        </button>
        <button
          onClick={() => setCurrentView('kiosk')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            currentView === 'kiosk' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Customer Kiosk
        </button>
        <button
          onClick={() => setCurrentView('manager')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            currentView === 'manager' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Manager Dashboard
        </button>
      </div>

      {/* Render Current View */}
      <div className="pt-16">
        {currentView === 'cashier' && <CashierView />}
        {currentView === 'kiosk' && <CustomerKiosk />}
        {currentView === 'manager' && <ManagerDashboard />}
      </div>
    </div>
  );
}

export default App
