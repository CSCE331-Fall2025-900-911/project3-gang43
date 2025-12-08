import React from 'react';
import { ShoppingCart, User, BarChart3 } from 'lucide-react';

const ViewSelector = ({ onSelectView }) => {
  const views = [
    {
      id: 'kiosk',
      title: 'Customer Kiosk',
      description: 'Self-service ordering experience',
      icon: ShoppingCart,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    {
      id: 'cashier',
      title: 'Cashier View',
      description: 'Process orders and manage transactions',
      icon: User,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
    {
      id: 'manager',
      title: 'Manager Dashboard',
      description: 'View analytics and manage inventory',
      icon: BarChart3,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            🧋 BubblePOS
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
          }}>
            Select your view to get started
          </p>
        </div>

        {/* View Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          {views.map((view) => {
            const IconComponent = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => onSelectView(view.id)}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: view.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: `0 8px 20px ${view.color}40`,
                }}>
                  <IconComponent style={{
                    width: '40px',
                    height: '40px',
                    color: 'white',
                  }} />
                </div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                }}>
                  {view.title}
                </h2>
                <p style={{
                  fontSize: '0.9375rem',
                  color: '#64748b',
                  lineHeight: '1.6',
                }}>
                  {view.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.875rem',
        }}>
          <p>Please select your role to continue</p>
        </div>
      </div>
    </div>
  );
};

export default ViewSelector;