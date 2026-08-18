"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import { Send, Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    target: 'All Users',
    title: '',
    message: ''
  });

  const fetchNotifications = async (page = 1, search = '') => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=${pagination.limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await adminApi.getNotifications(query);
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
      fetchNotifications(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return alert('Fill in all fields');
    
    setActionLoading(true);
    try {
      await adminApi.broadcastNotification(broadcastForm);
      setIsBroadcastOpen(false);
      setBroadcastForm({ target: 'All Users', title: '', message: '' });
      fetchNotifications(1, searchQuery);
      alert('Broadcast sent successfully!');
    } catch (err) {
      alert(err.message || 'Failed to send broadcast');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => <span className="uppercase text-xs font-bold text-gray-500">{row.type}</span>
    },
    {
      header: 'Title',
      accessor: 'title',
      cell: (row) => <span className="font-medium text-gray-900">{row.title}</span>
    },
    {
      header: 'Message',
      accessor: 'message',
      cell: (row) => <div className="max-w-md truncate text-gray-600">{row.message}</div>
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (row) => <span className="text-sm text-gray-500">{new Date(row.createdAt).toLocaleString()}</span>
    }
  ];

  const actions = (
    <button
      onClick={() => setIsBroadcastOpen(true)}
      className="flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-primary-hover)] transition-colors shadow-sm"
    >
      <Send className="w-4 h-4 mr-2" />
      Broadcast Notification
    </button>
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500 mt-1">View system notifications and broadcast alerts.</p>
        </div>
      </div>

      <div className="flex-1">
        <DataTable 
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => fetchNotifications(p, searchQuery)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Search notifications..."
          actions={actions}
        />
      </div>

      <Modal 
        isOpen={isBroadcastOpen} 
        onClose={() => !actionLoading && setIsBroadcastOpen(false)}
        title="Send Broadcast"
      >
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <select
              value={broadcastForm.target}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, target: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
            >
              <option value="All Users">All Users</option>
              <option value="Guests">Guests Only</option>
              <option value="Hosts">Hosts Only</option>
              <option value="Admins">Admins Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              placeholder="E.g., System Maintenance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              placeholder="Enter your message here..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsBroadcastOpen(false)}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[var(--brand-primary)] border border-transparent rounded-lg hover:bg-[var(--brand-primary-hover)]"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Send Broadcast
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
