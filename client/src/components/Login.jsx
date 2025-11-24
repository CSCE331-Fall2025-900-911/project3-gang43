import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../services/routes';
import { getTranslation } from '../utils/translations';
import { LogIn, Shield, Sparkles } from 'lucide-react';

const Login = ({ onSuccess }) => {
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en');
  const { login } = useAuth();

  const t = (key) => getTranslation(key, language);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        if (onSuccess) onSuccess();
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to authenticate. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      {/* Language toggle in top right */}
      <button
        onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          fontWeight: '600',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.3s',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'none';
        }}
      >
        {language === 'en' ? '🇺🇸 English' : '🇪🇸 Español'}
      </button>

      <div style={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '3rem',
        maxWidth: '480px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative gradient bar at top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)'
        }} />

        {/* Decorative corner elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          opacity: '0.1'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          opacity: '0.1'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo and header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
              position: 'relative'
            }}>
              <span style={{
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }}>B</span>
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#10b981',
                border: '3px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles style={{ width: '12px', height: '12px', color: 'white' }} />
              </div>
            </div>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              {t("welcomeTo")} {t("bubblePOS")}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              {t("signIn")}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              borderLeft: '4px solid #ef4444',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              <p style={{ fontWeight: '600', margin: '0 0 0.25rem 0' }}>Error</p>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Login buttons container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Google login */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0.5rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>

            {/* Divider */}
            <div style={{ position: 'relative', margin: '0.5rem 0' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '100%',
                  borderTop: '2px solid #e2e8f0'
                }} />
              </div>
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '0.875rem'
              }}>
                <span style={{
                  padding: '0 1rem',
                  background: 'white',
                  color: '#64748b',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {language === 'en' ? 'or continue with' : 'o continuar con'}
                </span>
              </div>
            </div>

            {/* Demo button */}
            <button
              onClick={() => {
                login({
                  name: 'Demo User',
                  email: 'demo@bubblepos.com',
                  picture: '',
                  role: 'cashier'
                });
                if (onSuccess) onSuccess();
              }}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
              }}
            >
              <LogIn style={{ width: '20px', height: '20px' }} />
              {t("continueDemo")}
            </button>
          </div>

          {/* Demo mode info card */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '12px',
            border: '1px solid #fbbf24',
            display: 'flex',
            alignItems: 'start',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Shield style={{ width: '18px', height: '18px', color: 'white' }} />
            </div>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#92400e',
                margin: '0 0 0.25rem 0'
              }}>
                {t("demoMode")}
              </p>
              <p style={{
                fontSize: '0.8125rem',
                color: '#b45309',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {t("demoDescription")}
              </p>
            </div>
          </div>

          {/* Terms and privacy */}
          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#94a3b8',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: 0 }}>
              {t("agreeText")}{' '}
              <a
                href="#"
                style={{
                  color: '#8b5cf6',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8b5cf6'}
              >
                {t("termsOfService")}
              </a>
              {' '}{t("and")}{' '}
              <a
                href="#"
                style={{
                  color: '#8b5cf6',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8b5cf6'}
              >
                {t("privacyPolicy")}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Add keyframes animation via style tag */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
      `}} />
    </div>
  );
};

export default Login;
