"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Home, CheckSquare,
  Calendar, CreditCard, Star, Bell,
  BarChart, Settings, LogOut, X, RefreshCw, FileText, ChevronDown, ChevronRight, ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    name: 'Access Control',
    icon: ShieldCheck,
    subItems: [
      { name: 'Users', href: '/admin/users' },
      { name: 'Vendor Requests', href: '/admin/vendor-requests' },
      { name: 'Roles', href: '/admin/roles' },
      { name: 'Modules', href: '/admin/modules' },
      { name: 'Permissions', href: '/admin/permissions' }
    ]
  },
  { name: 'Properties', href: '/admin/properties', icon: Home },
  { name: 'Approvals', href: '/admin/property-approvals', icon: CheckSquare },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Refunds', href: '/admin/refunds', icon: RefreshCw },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Reports', href: '/admin/reports', icon: BarChart },
  {
    name: 'Pages',
    icon: FileText,
    subItems: [
      { name: 'All Pages', href: '/admin/pages' },
      { name: 'Footer Settings', href: '/admin/pages/footer' }
    ]
  },
  {
    name: 'Blogs',
    icon: FileText,
    subItems: [
      { name: 'All Posts', href: '/admin/blogs' },
      { name: 'Categories', href: '/admin/blogs/categories' }
    ]
  },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openGroups, setOpenGroups] = useState({ 'Pages': false, 'Blogs': false, 'Access Control': true });

  const toggleGroup = (name) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <div className="h-8 w-8 bg-[var(--brand-primary)] rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">STAYR</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            if (item.subItems) {
              const isActive = item.subItems.some(sub => pathname === sub.href || pathname.startsWith(`${sub.href}/`));
              const isOpen = openGroups[item.name];

              return (
                <div key={item.name} className="mb-1">
                  <button
                    onClick={() => toggleGroup(item.name)}
                    className={`w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'text-[var(--brand-primary)]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <div className="flex items-center">
                      <item.icon className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${isActive ? 'text-[var(--brand-primary)]' : 'text-gray-400 group-hover:text-gray-500'}`} />
                      {item.name}
                    </div>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {isOpen && (
                    <div className="mt-1 ml-8 flex flex-col space-y-1">
                      {item.subItems.map(sub => {
                        const isSubActive = pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={onClose}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isSubActive
                                ? 'bg-gray-100 text-[var(--brand-primary)]'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-gray-100 text-[var(--brand-primary)]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <item.icon
                  className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${isActive ? 'text-[var(--brand-primary)]' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
