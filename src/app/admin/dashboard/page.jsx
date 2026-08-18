"use client";

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import StatsCard from '@/components/admin/StatsCard';
import ChartCard from '@/components/admin/ChartCard';
import { 
  Users, Home, Calendar, CreditCard, Star, RefreshCw 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, revenueRes, bookingsRes] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getAnalyticsRevenue(),
          adminApi.getAnalyticsBookings()
        ]);
        
        setStats(statsRes.data);
        
        // Map backend revenue structure [{ date: '...', revenue: 100 }] to Recharts format
        const formattedRevenue = (revenueRes.data || []).map(item => ({
          name: item.date,
          revenue: item.revenue
        }));
        setRevenueData(formattedRevenue);

        // Map backend bookings structure [{ month: '...', bookings: 10 }] to Recharts format
        const formattedBookings = (bookingsRes.data || []).map(item => ({
          name: item.month,
          bookings: item.bookings
        }));
        setBookingsData(formattedBookings);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!stats) return null;

  const COLORS = ['var(--brand-primary)', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers || 0} 
          icon={Users} 
          color="blue" 
          trend="up" 
          trendValue="12%" 
        />
        <StatsCard 
          title="Total Properties" 
          value={stats.totalProperties || 0} 
          icon={Home} 
          color="purple" 
          trend="up" 
          trendValue="5%" 
        />
        <StatsCard 
          title="Total Bookings" 
          value={stats.totalBookings || 0} 
          icon={Calendar} 
          color="green" 
          trend="up" 
          trendValue="18%" 
        />
        <StatsCard 
          title="Total Revenue" 
          value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} 
          icon={CreditCard} 
          color="red" 
        />
        <StatsCard 
          title="Pending Approvals" 
          value={stats.pendingProperties || 0} 
          icon={RefreshCw} 
          color="orange" 
        />
        <StatsCard 
          title="Total Reviews" 
          value={stats.totalReviews || 0} 
          icon={Star} 
          color="blue" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ChartCard title="Revenue Overview">
          <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="revenue" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Weekly Bookings">
          <LineChart data={bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}
