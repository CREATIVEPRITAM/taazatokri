import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import '../../styles/layout.css';

export const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="admin-layout">
      {/* Sidebar with desktop collapsible mode and mobile drawer */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        isMobileOpen={isMobileOpen}
        closeMobile={closeMobile}
      />

      {/* Main Content Area */}
      <div className="admin-main">
        <Header onOpenMobile={openMobile} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
