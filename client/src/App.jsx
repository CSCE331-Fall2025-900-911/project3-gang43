import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import CashierView from './components/CashierView';
import CustomerKiosk from './components/CustomerKiosk';
import ManagerDashboard from './components/ManagerDashboard';
import { LogOut } from 'lucide-react';
import './App.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('cashier');

  if (!user) {
    return <Login />;
  }

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
        <button
          onClick={logout}
          className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-2"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Customer Kiosk */}
      <section className="border rounded-lg shadow bg-white p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Customer Kiosk</h2>
        <CustomerKiosk />
      </section>
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
