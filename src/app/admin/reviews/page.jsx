"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import { Star, Trash2 } from 'lucide-react';

export default function ReviewsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = async (page = 1, search = '') => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=${pagination.limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await adminApi.getReviews(query);
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
      fetchReviews(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async () => {
    if (!selectedReview) return;
    
    setActionLoading(true);
    try {
      await adminApi.deleteReview(selectedReview._id);
      fetchReviews(pagination.currentPage, searchQuery);
      setIsDeleteOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Author',
      accessor: 'user',
      cell: (row) => <span className="font-medium text-gray-900">{row.user?.name || 'Unknown'}</span>
    },
    {
      header: 'Property',
      accessor: 'property',
      cell: (row) => <span className="text-gray-900">{row.property?.title || 'Unknown'}</span>
    },
    {
      header: 'Rating',
      accessor: 'rating',
      cell: (row) => (
        <div className="flex items-center">
          <span className="font-medium mr-1">{row.rating}</span>
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      )
    },
    {
      header: 'Review',
      accessor: 'comment',
      cell: (row) => <div className="max-w-xs truncate text-gray-600">{row.comment}</div>
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (row) => <span className="text-sm text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</span>
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => { setSelectedReview(row); setIsDeleteOpen(true); }}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Delete Review"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews & Moderation</h2>
          <p className="text-sm text-gray-500 mt-1">Manage guest reviews and moderate platform content.</p>
        </div>
      </div>

      <div className="flex-1">
        <DataTable 
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => fetchReviews(p, searchQuery)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Search reviews by comment..."
        />
      </div>

      <Modal 
        isOpen={isDeleteOpen} 
        onClose={() => !actionLoading && setIsDeleteOpen(false)}
        title="Delete Review"
      >
        {selectedReview && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>
            <div className="bg-gray-50 p-3 rounded italic text-gray-600 border border-gray-200">
              "{selectedReview.comment}"
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsDeleteOpen(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
              >
                {actionLoading ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
