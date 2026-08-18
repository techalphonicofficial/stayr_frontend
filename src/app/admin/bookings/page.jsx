"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import { Calendar, Users } from 'lucide-react';

export default function BookingsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async (page = 1, search = '') => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=${pagination.limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await adminApi.getBookings(query);
      setData(res.data);
      setPagination(p => ({ ...p, currentPage: page, next: res.pagination?.next, prev: res.pagination?.prev }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      await adminApi.updateBookingStatus(selectedBooking._id, newStatus);
      fetchBookings(pagination.currentPage, searchQuery);
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Booking ID',
      accessor: '_id',
      cell: (row) => <span className="font-mono text-xs text-gray-500 uppercase">{row._id.slice(-8)}</span>
    },
    {
      header: 'Property',
      accessor: 'property',
      cell: (row) => <span className="font-medium text-gray-900">{row.property?.title || 'Unknown'}</span>
    },
    {
      header: 'Guest',
      accessor: 'user',
      cell: (row) => <span className="text-gray-900">{row.user?.name || 'Unknown'}</span>
    },
    {
      header: 'Dates',
      cell: (row) => (
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(row.checkIn).toLocaleDateString()} - {new Date(row.checkOut).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Total',
      accessor: 'totalPrice',
      cell: (row) => <span className="font-medium">₹{row.totalPrice}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => { setSelectedBooking(row); setIsModalOpen(true); }}
          className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium text-sm transition-colors"
        >
          View / Edit
        </button>
      )
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage guest reservations.</p>
        </div>
      </div>

      <div className="flex-1">
        <DataTable 
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => fetchBookings(p, searchQuery)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Search bookings..."
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Manage Booking"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Property</p>
                  <p className="font-medium text-gray-900">{selectedBooking.property?.title}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Guest</p>
                  <p className="font-medium text-gray-900">{selectedBooking.user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Dates</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedBooking.checkIn).toLocaleDateString()} to {new Date(selectedBooking.checkOut).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Current Status</p>
                  <StatusBadge status={selectedBooking.status} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Override Status</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleStatusUpdate('Confirmed')}
                  disabled={actionLoading || selectedBooking.status === 'Confirmed'}
                  className="flex-1 py-2 px-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => handleStatusUpdate('Cancelled')}
                  disabled={actionLoading || selectedBooking.status === 'Cancelled'}
                  className="flex-1 py-2 px-3 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                >
                  Cancel Booking
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Warning: Overriding status does not automatically process refunds. Go to Payments for refunds.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
