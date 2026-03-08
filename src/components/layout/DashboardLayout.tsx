/**
 * ============================================
 * DASHBOARD LAYOUT
 * ============================================
 * Main layout wrapper for authenticated dashboard pages
 */

import { useState, useEffect, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPath?: string;
}

export function DashboardLayout({ children, currentPath }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 960);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Block body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Backdrop overlay for mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentPath={currentPath}
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Header */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300',
          isMobile ? 'pl-0' : sidebarCollapsed ? 'pl-20' : 'pl-sidebar'
        )}
      >
        <div className="container-custom py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
