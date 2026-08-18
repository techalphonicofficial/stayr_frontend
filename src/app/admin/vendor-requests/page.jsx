"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import { Store, User, MapPin, Building, CreditCard } from 'lucide-react';

export default function VendorRequestsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING');
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, all: 0 });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async (page = 1, search = '', status = activeTab) => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=${pagination.limit}&status=${status}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await adminApi.getVendorRequests(query);
      setData(res.data);
      if (res.stats) setStats(res.stats);
      setPagination(p => ({ ...p, currentPage: page, next: res.pagination?.next, prev: res.pagination?.prev }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests(1, searchQuery, activeTab);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const handleAction = async (actionType) => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      if (actionType === 'approve') {
        await adminApi.approveVendorRequest(selectedRequest.id);
      } else if (actionType === 'reject') {
        await adminApi.rejectVendorRequest(selectedRequest.id);
      }
      fetchRequests(pagination.currentPage, searchQuery, activeTab);
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Business',
      accessor: 'businessName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.businessName}</div>
            <div className="text-gray-500 text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {row.city}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Owner',
      accessor: 'ownerName',
      cell: (row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.ownerName}</div>
          <div className="text-gray-500 text-xs">{row.email}</div>
          <div className="text-gray-400 text-xs">{row.phone}</div>
        </div>
      )
    },
    {
      header: 'Details',
      accessor: 'pan',
      cell: (row) => (
        <div className="text-xs space-y-1">
          {row.pan && <div className="text-gray-600"><span className="text-gray-400">PAN:</span> {row.pan}</div>}
          {row.gst && <div className="text-gray-600"><span className="text-gray-400">GST:</span> {row.gst}</div>}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const statusMap = {
          'PENDING': 'pending',
          'APPROVED': 'active',
          'REJECTED': 'inactive'
        };
        return <StatusBadge status={statusMap[row.status]} label={row.status} />;
      }
    },
    {
      header: 'Requested',
      accessor: 'createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => { setSelectedRequest(row); setIsModalOpen(true); }}
          className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium text-sm transition-colors"
        >
          Review
        </button>
      )
    }
  ];

  const tabs = [
    { name: 'PENDING', label: 'Pending', count: stats.pending },
    { name: 'APPROVED', label: 'Approved', count: stats.approved },
    { name: 'REJECTED', label: 'Rejected', count: stats.rejected },
    { name: 'ALL', label: 'All', count: stats.all }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Vendor Requests</h2>
        <p className="text-sm text-gray-500 mt-1">Review vendor signup requests, search by business or owner, and approve the account.</p>
      </div>

      <div className="bg-white border-b border-gray-200 mb-4 rounded-t-lg">
        <nav className="flex -mb-px px-4 gap-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => { setActiveTab(tab.name); setPagination(p => ({ ...p, currentPage: 1 })); }}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${activeTab === tab.name 
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              <span className={`
                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                ${activeTab === tab.name ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'bg-gray-100 text-gray-900'}
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 bg-white rounded-b-lg shadow-sm">
        <DataTable 
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => fetchRequests(p, searchQuery, activeTab)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Search by business, owner, email or phone..."
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Review Vendor Request"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex items-start gap-3">
                <Store className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Business Name</div>
                  <div className="text-base text-gray-900">{selectedRequest.businessName}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Owner</div>
                  <div className="text-base text-gray-900">{selectedRequest.ownerName} ({selectedRequest.email})</div>
                  <div className="text-sm text-gray-600">{selectedRequest.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Location</div>
                  <div className="text-base text-gray-900">{selectedRequest.city}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Tax Details</div>
                  <div className="text-sm text-gray-900">PAN: {selectedRequest.pan || 'N/A'}</div>
                  <div className="text-sm text-gray-900">GST: {selectedRequest.gst || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Bank Details</div>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap">{selectedRequest.bankDetails || 'Not provided'}</div>
                </div>
              </div>
            </div>

            {selectedRequest.status === 'PENDING' && (
              <div className="border-t border-gray-200 pt-4 flex gap-3">
                <button 
                  onClick={() => handleAction('reject')}
                  disabled={actionLoading}
                  className="flex-1 justify-center py-2 px-4 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none transition-colors"
                >
                  {actionLoading ? 'Processing...' : 'Reject Request'}
                </button>
                <button 
                  onClick={() => handleAction('approve')}
                  disabled={actionLoading}
                  className="flex-1 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors"
                >
                  {actionLoading ? 'Processing...' : 'Approve & Create Account'}
                </button>
              </div>
            )}
            
            {selectedRequest.status !== 'PENDING' && (
              <div className="border-t border-gray-200 pt-4 text-center">
                <p className="text-sm text-gray-500">This request has already been {selectedRequest.status.toLowerCase()}.</p>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full justify-center py-2 px-4 border shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
