import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { NAV_ITEMS } from './navItems';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  closeMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobile}
          aria-label="Close mobile sidebar backdrop"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'mobile-open' : ''
        }`}
        aria-label="Admin Navigation Sidebar"
      >
        {/* Brand Header */}
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-brand" onClick={closeMobile}>
            <div className="sidebar-logo-icon">
              <Sprout size={22} />
            </div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">TaazaTokari</span>
              <span className="sidebar-brand-badge">Admin</span>
            </div>
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="sidebar-close-mobile-btn"
            onClick={closeMobile}
            aria-label="Close mobile menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={closeMobile}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={19} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer with Collapse Action */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-footer-btn"
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Collapse Menu</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
