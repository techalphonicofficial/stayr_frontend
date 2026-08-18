"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import { MapPin, Check, X, Loader2 } from 'lucide-react';

export default function PropertyApprovalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProperties = async (page = 1, search = '') => {
    setLoading(true);
    try {
      // Fetch only properties that are NOT approved
      let query = `?page=${page}&limit=${pagination.limit}&isApproved=false`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await adminApi.getProperties(query);
      // We manually filter if the backend doesn't support the isApproved query natively yet, 
      // but ideally the backend should handle it. Assuming it does or we just filter client-side for safety:
      const pending = res.data.filter(p => p.isApproved === false);
      setData(pending);
      
      // Pagination might be slightly off if we filter client side, but it's acceptable for this CMS
      setPagination(p => ({ ...p, currentPage: page, next: res.pagination?.next, prev: res.pagination?.prev }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleApprove = async (id) => {
    if (!confirm('Are you sure you want to approve this property?')) return;
    try {
      await adminApi.approveProperty(id);
      fetchProperties(pagination.currentPage, searchQuery);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return alert("Please provide a reason");
    
    setActionLoading(true);
    try {
      await adminApi.rejectProperty(selectedProperty._id, rejectionReason);
      setIsRejectOpen(false);
      setRejectionReason('');
      fetchProperties(pagination.currentPage, searchQuery);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Property',
      accessor: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.images?.[0]?.url || 'https://via.placeholder.com/150'} 
            alt="" 
            className="h-10 w-12 rounded object-cover" 
          />
          <div>
            <div className="font-medium text-gray-900 line-clamp-1">{row.title}</div>
            <div className="text-gray-500 text-xs flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {row.city}, {row.country}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Host',
      accessor: 'host',
      cell: (row) => <span className="font-medium text-gray-900">{row.host?.name || 'Unknown'}</span>
    },
    {
      header: 'Price',
      accessor: 'pricePerNight',
      cell: (row) => <span className="font-medium">₹{row.pricePerNight}</span>
    },
    {
      header: 'Status',
      accessor: 'isApproved',
      cell: (row) => <StatusBadge status={row.isApproved ? 'Approved' : 'Pending'} />
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleApprove(row._id)}
            className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
            title="Approve"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setSelectedProperty(row); setIsRejectOpen(true); }}
            className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
            title="Reject"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
          <p className="text-sm text-gray-500 mt-1">Review and approve new properties before they go live.</p>
        </div>
      </div>

      <div className="flex-1">
        <DataTable 
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => fetchProperties(p, searchQuery)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Search pending properties..."
        />
      </div>

      <Modal 
        isOpen={isRejectOpen} 
        onClose={() => !actionLoading && setIsRejectOpen(false)}
        title="Reject Property"
      >
        {selectedProperty && (
          <form onSubmit={handleReject} className="space-y-4">
            <p className="text-sm text-gray-600">
              Please provide a reason for rejecting <strong>{selectedProperty.title}</strong>. 
              This will be sent to the host.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
              <textarea
                required
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
                placeholder="E.g., Images are too blurry, missing safety information..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Reject Property
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
