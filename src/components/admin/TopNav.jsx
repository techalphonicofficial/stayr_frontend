"use client";

import { useState, useEffect } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function TopNav({ onMenuClick, onDesktopMenuClick }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('adminUser');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  // Generate simple breadcrumb from pathname
  const pathParts = pathname.split('/').filter(p => p && p !== 'admin');
  const title = pathParts.length > 0 
    ? pathParts[pathParts.length - 1].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        {onDesktopMenuClick && (
          <button 
            onClick={onDesktopMenuClick}
            className="hidden md:block p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] sm:text-sm transition-colors"
            placeholder="Search..."
          />
        </div>

        <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[var(--brand-primary)] ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="flex flex-col items-end hidden md:block">
            <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin User'}</span>
            <span className="text-xs text-gray-500">{user?.role || 'Admin'}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-sm uppercase">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
