import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, LogOut, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPageTitleByPath } from './navItems';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const location = useLocation();
  const { user, adminProfile, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const pageTitle = getPageTitleByPath(location.pathname);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  // Determine user display initial and name
  const displayName = adminProfile?.name || user?.email?.split('@')[0] || 'Admin';
  const displayEmail = user?.email || 'admin@taazatokari.com';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="admin-header" aria-label="Admin Dashboard Header">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenMobile}
          aria-label="Open mobile navigation menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="header-page-title">{pageTitle}</h1>
      </div>

      {/* Right: Authenticated Admin Identity & Logout Action */}
      <div className="header-right">
        {/* Admin User Info */}
        <div className="header-user-badge" title={`Logged in as ${displayEmail}`}>
          <div className="user-avatar" aria-hidden="true">
            {initial ? initial : <UserIcon size={18} />}
          </div>
          <div className="user-info">
            <span className="user-email-text">{displayEmail}</span>
            <span className="user-role-pill">Admin</span>
          </div>
        </div>

        {/* Logout Action */}
        <button
          type="button"
          className="header-logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
          title="Sign out of Admin Dashboard"
          aria-label="Logout"
        >
          {loggingOut ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
