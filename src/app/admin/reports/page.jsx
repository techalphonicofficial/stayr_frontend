"use client";

import { Download, FileText } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { useState } from 'react';

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);

  const downloadCSV = (data, filename) => {
    if (!data || !data.length) return alert('No data to export');
    
    // Convert JSON to CSV
    const headers = Object.keys(data[0]).join(',');
    const csvRows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'object' ? `"${JSON.stringify(value).replace(/"/g, '""')}"` : `"${value}"`
      ).join(',')
    );
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async (type) => {
    setLoading(true);
    try {
      let res;
      let filename;
      
      // Fetch maximum limit just for exporting purposes
      const query = '?limit=1000';
      
      switch (type) {
        case 'users':
          res = await adminApi.getUsers(query);
          filename = 'stayr_users_report';
          break;
        case 'properties':
          res = await adminApi.getProperties(query);
          filename = 'stayr_properties_report';
          break;
        case 'bookings':
          res = await adminApi.getBookings(query);
          filename = 'stayr_bookings_report';
          break;
        case 'payments':
          res = await adminApi.getPayments(query);
          filename = 'stayr_payments_report';
          break;
        default:
          return;
      }

      downloadCSV(res.data, filename);
    } catch (err) {
      alert(err.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Exports</h2>
        <p className="text-sm text-gray-500 mt-1">Download comprehensive CSV reports for offline analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Report */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Users Report</h3>
              <p className="text-sm text-gray-500 mt-1">Contains all registered hosts and guests, their verification status, and join dates.</p>
            </div>
          </div>
          <button 
            onClick={() => handleExport('users')}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Properties Report */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Properties Report</h3>
              <p className="text-sm text-gray-500 mt-1">Detailed list of all properties, pricing, host mapping, and approval statuses.</p>
            </div>
          </div>
          <button 
            onClick={() => handleExport('properties')}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Bookings Report */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bookings Report</h3>
              <p className="text-sm text-gray-500 mt-1">Historical booking data, guest assignments, dates, and total revenue per booking.</p>
            </div>
          </div>
          <button 
            onClick={() => handleExport('bookings')}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Payments Report */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payments & Refunds</h3>
              <p className="text-sm text-gray-500 mt-1">Transaction ledgers, Razorpay order IDs, and completed/refunded statuses.</p>
            </div>
          </div>
          <button 
            onClick={() => handleExport('payments')}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
