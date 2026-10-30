"use client";

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/adminApi';
import StatsCard from '@/components/admin/StatsCard';
import ChartCard from '@/components/admin/ChartCard';
import { 
  Users, Home, Calendar, CreditCard, Star, RefreshCw, 
  Building2, MessageSquare, ArrowRight, MapPin, Eye, ExternalLink, Plus, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import Link from 'next/link';
import { formatIndianPrice, calculatePricePerSqFt } from '@/components/buy/formatters';

function SaleStatusBadge({ status }) {
  switch (status) {
    case 'Published':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle2 size={11} /> Live
        </span>
      );
    case 'PendingReview':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          <Clock size={11} /> Under Review
        </span>
      );
    case 'ChangesRequested':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
          <AlertCircle size={11} /> Action Needed
        </span>
      );
    case 'Sold':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
          Sold
        </span>
      );
    case 'Withdrawn':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
          Withdrawn
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          {status}
        </span>
      );
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [recentSaleListings, setRecentSaleListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const [statsRes, revenueRes, bookingsRes, saleRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getAnalyticsRevenue(),
        adminApi.getAnalyticsBookings(),
        adminApi.getAdminSaleListings('limit=5').catch(() => ({ data: [] }))
      ]);
      
      setStats(statsRes.data);
      setRecentSaleListings(saleRes.data || []);
      
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
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>
          <p className="text-xs text-gray-500 mt-0.5">Comprehensive real-time metrics across rentals and real estate sales</p>
        </div>
      </div>

      {/* Primary KPI Grid */}
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
          title="Rental Properties" 
          value={stats.totalProperties || 0} 
          icon={Home} 
          color="purple" 
          trend="up" 
          trendValue="5%" 
        />
        <StatsCard 
          title="Properties For Sale" 
          value={stats.totalSaleListings || 0} 
          icon={Building2} 
          color="green" 
          trend="up" 
          trendValue={`${stats.publishedSaleListings || 0} Live`} 
        />
        <StatsCard 
          title="Buyer Inquiries" 
          value={stats.totalSaleInquiries || 0} 
          icon={MessageSquare} 
          color="blue" 
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
          value={(stats.pendingProperties || 0) + (stats.pendingSaleListings || 0)} 
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

      {/* Analytics Charts */}
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

      {/* Dedicated Section: Properties Listed For Sale */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-gray-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center font-bold">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Properties For Sale</h3>
              <p className="text-xs text-gray-500">
                Recently listed real estate properties on Stayr Buy & Sell marketplace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/sale-approvals"
              className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5"
            >
              <Clock size={13} className="text-amber-700" />
              <span>Sale Approvals ({stats.pendingSaleListings || 0})</span>
            </Link>

            <Link
              href="/admin/properties?type=sale"
              className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>View All Sale Properties</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Listings Table Preview */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-xs">
            <thead className="bg-gray-50/60 text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Property</th>
                <th className="px-6 py-3 text-left">Seller</th>
                <th className="px-6 py-3 text-left">Asking Price</th>
                <th className="px-6 py-3 text-left">Type & Config</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Inquiries</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {recentSaleListings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                    No sale properties listed yet.
                  </td>
                </tr>
              ) : (
                recentSaleListings.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-12 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80"; }}
                        />
                        <div className="min-w-0">
                          <Link 
                            href={`/buy/${prop.slug || prop.id}`}
                            target="_blank"
                            className="font-semibold text-gray-900 hover:text-[var(--brand-primary)] transition line-clamp-1 block max-w-xs"
                          >
                            {prop.title}
                          </Link>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-gray-400" />
                            {prop.locality ? `${prop.locality}, ` : ''}{prop.city}, {prop.state}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-gray-700">
                      <div className="font-semibold text-gray-900">{prop.seller?.name || 'Seller'}</div>
                      <div className="text-gray-400 text-[11px]">{prop.seller?.phone || prop.seller?.email || '—'}</div>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-sm">{formatIndianPrice(prop.price)}</div>
                      {prop.carpetArea && (
                        <div className="text-[10px] text-gray-400">{calculatePricePerSqFt(prop.price, prop.carpetArea)}</div>
                      )}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-gray-600">
                      <span className="font-medium text-gray-800">{prop.bedrooms ? `${prop.bedrooms} BHK` : prop.propertyType}</span>
                      <span className="text-[11px] text-gray-400 block capitalize">{prop.category} • {prop.propertyType}</span>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <SaleStatusBadge status={prop.status} />
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        <MessageSquare size={11} /> {prop._count?.inquiries || 0} Leads
                      </span>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/buy/${prop.slug || prop.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition"
                          title="View Live Page"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <Link
                          href={`/admin/properties?type=sale`}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] transition"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
