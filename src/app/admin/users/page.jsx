"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import { Shield, ShieldAlert, CheckCircle, Plus } from 'lucide-react';

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Employees');
  const [stats, setStats] = useState({ Employees: 0, Users: 0, Vendors: 0, All: 0 });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [roles, setRoles] = useState([]);
  const [createData, setCreateData] = useState({ name: '', email: '', phone: '', role: 'Employee', accessRoleId: '' });

  const fetchUsers = async (page = 1, search = '', type = activeTab) => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=${pagination.limit}&type=${type}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await adminApi.getUsers(query);
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
      fetchUsers(1, searchQuery, activeTab);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  useEffect(() => {
    adminApi.getRoles().then(res => setRoles(res.data)).catch(console.error);
  }, []);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await adminApi.createUser({
        ...createData,
        accessRoleId: createData.accessRoleId || null
      });
      fetchUsers(1, searchQuery, activeTab);
      setIsCreateModalOpen(false);
      setCreateData({ name: '', email: '', phone: '', role: 'Employee', accessRoleId: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAction = async (actionType) => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      if (actionType === 'status') {
        const newStatus = selectedUser.status === 'active' ? 'deactivate' : 'activate';
        await adminApi.updateUserStatus(selectedUser._id, newStatus);
      }
      fetchUsers(pagination.currentPage, searchQuery, activeTab);
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'User Info',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.profileImage || `https://ui-avatars.com/api/?name=${row.name}&background=random`} alt="" className="h-8 w-8 rounded-full" />
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-gray-500 text-xs">{row.email}</div>
            {row.phone && <div className="text-gray-400 text-xs">{row.phone}</div>}
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'role',
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          {row.role === 'Admin' && <Shield className="w-3 h-3 mr-1 text-[var(--brand-primary)]" />}
          {row.role}
        </span>
      )
    },
    {
      header: 'Role/Profile',
      accessor: 'accessRole',
      cell: (row) => (
        <span className="text-sm text-gray-600">
          {row.accessRole?.name || '-'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      cell: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} />
    },
    {
      header: 'Joined Date',
      accessor: 'createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => { setSelectedUser({ ...row, status: row.isActive ? 'active' : 'inactive' }); setIsModalOpen(true); }}
          className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium text-sm transition-colors"
        >
          Manage
        </button>
      )
    }
  ];

  const tabs = [
    { name: 'Employees', count: stats.Employees },
    { name: 'Users', count: stats.Users },
    { name: 'Vendors', count: stats.Vendors },
    { name: 'All', count: stats.All }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">Employees are shown by default. Regular users and vendors stay separated in their own tabs.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
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
              {tab.name}
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
          onPageChange={(p) => fetchUsers(p, searchQuery, activeTab)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Search users by name, email or phone..."
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Manage User"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedUser.profileImage || `https://ui-avatars.com/api/?name=${selectedUser.name}`} alt="" className="h-16 w-16 rounded-full" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={selectedUser.status} />
                  <span className="text-xs text-gray-500 border rounded px-1.5 py-0.5 bg-gray-50">{selectedUser.role}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => handleAction('status')}
                  disabled={actionLoading}
                  className={`w-full flex justify-center py-2 px-4 border shadow-sm text-sm font-medium rounded-lg focus:outline-none transition-colors ${
                    selectedUser.status === 'active' 
                      ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100' 
                      : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                  }`}
                >
                  {actionLoading ? 'Updating...' : (selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User')}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Employee"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              value={createData.name}
              onChange={e => setCreateData({ ...createData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              value={createData.email}
              onChange={e => setCreateData({ ...createData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              value={createData.phone}
              onChange={e => setCreateData({ ...createData, phone: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
                value={createData.role}
                onChange={e => setCreateData({ ...createData, role: e.target.value })}
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role / Profile</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
                value={createData.accessRoleId}
                onChange={e => setCreateData({ ...createData, accessRoleId: e.target.value })}
              >
                <option value="">None (Base Access)</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex justify-end gap-3 mt-6">
            <button 
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="py-2 px-4 border shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={actionLoading}
              className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] focus:outline-none transition-colors"
            >
              {actionLoading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
