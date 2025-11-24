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
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* View Selector - Modern styled navigation */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
        padding: '0.5rem',
        display: 'flex',
        gap: '0.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <button
          onClick={() => setCurrentView('cashier')}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: currentView === 'cashier'
              ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              : 'transparent',
            color: currentView === 'cashier' ? 'white' : '#64748b',
            boxShadow: currentView === 'cashier' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          Cashier View
        </button>
        <button
          onClick={() => setCurrentView('kiosk')}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: currentView === 'kiosk'
              ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              : 'transparent',
            color: currentView === 'kiosk' ? 'white' : '#64748b',
            boxShadow: currentView === 'kiosk' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          Customer Kiosk
        </button>
        <button
          onClick={() => setCurrentView('manager')}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: currentView === 'manager'
              ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              : 'transparent',
            color: currentView === 'manager' ? 'white' : '#64748b',
            boxShadow: currentView === 'manager' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          Manager Dashboard
        </button>
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0.25rem 0' }} />
        <button
          onClick={logout}
          style={{
            padding: '0.625rem 1rem',
            borderRadius: '12px',
            border: 'none',
            background: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Render Current View */}
      <div style={{ paddingTop: '5rem' }}>
        {currentView === 'cashier' && <CashierView />}
        {currentView === 'kiosk' && <CustomerKiosk />}
        {currentView === 'manager' && <ManagerDashboard />}
      </div>
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
