import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, CheckCircle, AlertCircle } from 'lucide-react';

const VoiceControlPanel = ({
  isListening,
  transcript,
  isSupported,
  error,
  onToggle,
  lastCommand,
  commandFeedback
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    if (commandFeedback) {
      setFeedbackMessage(commandFeedback);
      const timer = setTimeout(() => setFeedbackMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [commandFeedback]);

  if (!isSupported) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '12px',
        padding: '1rem',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <AlertCircle size={20} color="#f59e0b" />
          <strong style={{ color: '#92400e' }}>Voice Control Unavailable</strong>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>
          Please use Chrome, Edge, or Safari for voice control.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000
      }}>
        <button
          onClick={onToggle}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: 'none',
            background: isListening
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            cursor: 'pointer',
            boxShadow: isListening
              ? '0 0 20px rgba(239, 68, 68, 0.5), 0 4px 12px rgba(0, 0, 0, 0.2)'
              : '0 4px 12px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isListening ? 'pulse 1.5s infinite' : 'none'
          }}
          title={isListening ? 'Stop voice control' : 'Start voice control'}
        >
          {isListening ? <Mic size={28} /> : <MicOff size={28} />}
        </button>

        <button
          onClick={() => setShowHelp(!showHelp)}
          style={{
            position: 'absolute',
            bottom: '-12px',
            right: '-12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid white',
            background: '#8b5cf6',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Voice commands help"
        >
          ?
        </button>
      </div>

      {/* Transcript Display */}
      {isListening && transcript && (
        <div style={{
          position: 'fixed',
          bottom: '8rem',
          right: '2rem',
          background: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          maxWidth: '350px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 999,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Volume2 size={18} />
            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Listening...</span>
          </div>
          <p style={{ margin: 0, fontSize: '1rem' }}>
            "{transcript}"
          </p>
        </div>
      )}

      {feedbackMessage && (
        <div style={{
          position: 'fixed',
          bottom: '8rem',
          right: '2rem',
          background: feedbackMessage.success ? '#10b981' : '#ef4444',
          color: 'white',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          maxWidth: '350px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 999,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {feedbackMessage.success ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span style={{ fontSize: '0.9375rem', fontWeight: '500' }}>
              {feedbackMessage.message}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          position: 'fixed',
          bottom: '8rem',
          right: '2rem',
          background: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '1rem',
          maxWidth: '350px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 999
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.875rem', color: '#92400e' }}>{error}</span>
          </div>
        </div>
      )}

      {showHelp && (
        <div style={{
          position: 'fixed',
          bottom: '8rem',
          right: '2rem',
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '400px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          zIndex: 1001,
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#0f172a' }}>
              Voice Commands
            </h3>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
            <p style={{ marginTop: 0, marginBottom: '1rem', fontWeight: '500' }}>
              Try saying these commands:
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#0f172a' }}>Add to Cart:</strong>
              <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                <li>"Add [drink name]"</li>
                <li>"I want [drink name]"</li>
                <li>"Order [drink name]"</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#0f172a' }}>Remove from Cart:</strong>
              <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                <li>"Remove [drink name]"</li>
                <li>"Delete [drink name]"</li>
                <li>"Clear cart"</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#0f172a' }}>Navigation:</strong>
              <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                <li>"Show all items"</li>
                <li>"Show milk tea"</li>
                <li>"Show fruit tea"</li>
                <li>"Checkout" or "Place order"</li>
              </ul>
            </div>

            <div style={{
              padding: '0.75rem',
              background: '#f1f5f9',
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569' }}>
                <strong>Tip:</strong> Speak clearly and wait for the command to be processed.
                The system will give you feedback for each command.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.7), 0 4px 16px rgba(0, 0, 0, 0.3);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default VoiceControlPanel;
