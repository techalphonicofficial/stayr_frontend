"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import TopNav from '@/components/admin/TopNav';
import { AdminAuthError } from '@/lib/adminApi';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check auth on mount and route change
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    
    if (!token || !userStr) {
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        throw new Error('Not an admin');
      }
      setIsAuthenticated(true);
      
      // If they are on /admin/login while authenticated, push to dashboard
      if (pathname === '/admin/login') {
        router.replace('/admin/dashboard');
      }
    } catch (err) {
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [pathname, router]);

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  // Standalone layout for login
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans flex">
      <Toaster position="top-right" />
      {/* Sidebar - Desktop */}
      {!isDesktopSidebarCollapsed && (
        <div className="hidden md:flex">
          <Sidebar />
        </div>
      )}

      {/* Sidebar - Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNav 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onDesktopMenuClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
