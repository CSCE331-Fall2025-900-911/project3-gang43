import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import CashierView from './components/CashierView';
import CustomerKiosk from './components/CustomerKiosk';
import ManagerDashboard from './components/ManagerDashboard';
import ViewSelector from './components/ViewSelector';
import GoogleTranslate from './components/GoogleTranslate';
import { LogOut } from 'lucide-react';
import './App.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function AppContent() {
  const { user, logout } = useAuth();
  const [selectedView, setSelectedView] = useState(null);

  // Show view selector first if no view is selected
  if (!selectedView) {
    return <ViewSelector onSelectView={setSelectedView} />;
  }

  // Show login after view selection if not authenticated
  if (!user) {
    return <Login />;
  }

  // User is authenticated and view is selected, show the selected view
  const currentView = selectedView;

  // Function to handle view change
  const handleChangeView = () => {
    setSelectedView(null);
    logout();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 1001,
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '0.75rem',
        border: '1px solid #e2e8f0'
      }}>
        <GoogleTranslate />
      </div>

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
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0.25rem 0' }} />
        <button
          onClick={handleChangeView}
          style={{
            padding: '0.625rem 1rem',
            borderRadius: '12px',
            border: 'none',
            background: 'transparent',
            color: '#64748b',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          title="Back to View Selection"
        >
          Change View
        </button>
      </div>

      <div style={{ paddingTop: '5rem' }}>
        {currentView === 'kiosk' && <CustomerKiosk />}
        {currentView === 'cashier' && <CashierView />}
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
