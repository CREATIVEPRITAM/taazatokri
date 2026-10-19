import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldCheck, Loader2 } from 'lucide-react';

export const DashboardPlaceholderPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--slate-50)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--slate-200)',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
            marginBottom: '20px',
          }}
        >
          <ShieldCheck size={36} />
        </div>

        <h1
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--slate-900)',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          TaazaTokari Admin Dashboard
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--slate-500)',
            marginBottom: '24px',
          }}
        >
          Protected Operational Control Center (Placeholder)
        </p>

        <div
          style={{
            backgroundColor: 'var(--slate-50)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            textAlign: 'left',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              color: 'var(--slate-500)',
            }}
          >
            Authenticated Admin Account
          </span>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--primary-800)',
              wordBreak: 'break-all',
            }}
          >
            {user?.email || 'Unknown Admin'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '14px 24px',
            backgroundColor: 'var(--slate-900)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '15px',
            borderRadius: 'var(--radius-md)',
            transition: 'background-color var(--transition-fast)',
            opacity: loggingOut ? 0.7 : 1,
            cursor: loggingOut ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!loggingOut) (e.currentTarget.style.backgroundColor = 'var(--slate-800)');
          }}
          onMouseLeave={(e) => {
            if (!loggingOut) (e.currentTarget.style.backgroundColor = 'var(--slate-900)');
          }}
        >
          {loggingOut ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Logging out...
            </>
          ) : (
            <>
              <LogOut size={18} />
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
};
