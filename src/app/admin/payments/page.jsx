"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import { CreditCard, DollarSign, Loader2 } from 'lucide-react';

export default function PaymentsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = async (page = 1, search = '') => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=${pagination.limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await adminApi.getPayments(query);
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
      fetchPayments(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRefund = async () => {
    if (!selectedPayment) return;
    if (!confirm('Are you sure you want to process this refund via Razorpay?')) return;
    
    setActionLoading(true);
    try {
      await adminApi.refundPayment(selectedPayment._id);
      fetchPayments(pagination.currentPage, searchQuery);
      setIsModalOpen(false);
      alert('Refund processed successfully!');
    } catch (err) {
      alert(err.message || 'Refund failed');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Payment ID',
      accessor: '_id',
      cell: (row) => <span className="font-mono text-xs text-gray-500">{row.razorpayPaymentId || row._id.slice(-8)}</span>
    },
    {
      header: 'Booking',
      accessor: 'booking',
      cell: (row) => <span className="text-gray-900 text-sm">#{row.booking?.id?.slice(-8) || 'N/A'}</span>
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (row) => (
        <span className="font-medium text-gray-900 flex items-center">
          <DollarSign className="w-3 h-3" />{row.amount}
        </span>
      )
    },
    {
      header: 'Currency',
      accessor: 'currency',
      cell: (row) => <span className="uppercase text-gray-500 text-xs font-semibold">{row.currency}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (row) => <span className="text-sm text-gray-500">{new Date(row.createdAt).toLocaleString()}</span>
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => { setSelectedPayment(row); setIsModalOpen(true); }}
          className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium text-sm transition-colors"
        >
          View / Refund
        </button>
      )
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payments & Refunds</h2>
          <p className="text-sm text-gray-500 mt-1">Manage Razorpay transactions and issue refunds.</p>
        </div>
      </div>

      <div className="flex-1">
        <DataTable 
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => fetchPayments(p, searchQuery)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Search payments..."
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !actionLoading && setIsModalOpen(false)}
        title="Payment Details"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Razorpay Order ID</p>
                  <p className="font-medium text-gray-900 break-all">{selectedPayment.razorpayOrderId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Razorpay Payment ID</p>
                  <p className="font-medium text-gray-900 break-all">{selectedPayment.razorpayPaymentId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Amount</p>
                  <p className="font-bold text-gray-900 text-lg">₹{selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <StatusBadge status={selectedPayment.status} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex flex-col items-center">
              {selectedPayment.status === 'Completed' || selectedPayment.status === 'Captured' ? (
                <>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Issuing a refund will communicate directly with Razorpay and revert the funds to the guest.
                  </p>
                  <button
                    onClick={handleRefund}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                    Issue Full Refund
                  </button>
                </>
              ) : selectedPayment.status === 'Refunded' ? (
                <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg w-full font-medium">
                  This payment has already been refunded.
                </div>
              ) : (
                <div className="text-center p-4 bg-yellow-50 text-yellow-700 rounded-lg w-full font-medium">
                  Refunds can only be processed on completed payments.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
