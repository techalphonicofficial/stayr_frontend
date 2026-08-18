"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import { Plus, KeySquare, Trash2, Edit2, ShieldAlert } from 'lucide-react';

export default function PermissionsPage() {
  const [data, setData] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', moduleId: '' });

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const [permsRes, modulesRes] = await Promise.all([
        adminApi.getPermissions(),
        adminApi.getModules()
      ]);
      setData(permsRes.data);
      setModules(modulesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleOpenModal = (permissionItem = null) => {
    setSelectedPermission(permissionItem);
    if (permissionItem) {
      setFormData({ name: permissionItem.name, moduleId: permissionItem.moduleId });
    } else {
      setFormData({ name: '', moduleId: modules[0]?.id || '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.moduleId) return alert("Name and Module are required");
    
    setActionLoading(true);
    try {
      if (selectedPermission) {
        await adminApi.updatePermission(selectedPermission.id, formData);
      } else {
        await adminApi.createPermission(formData);
      }
      
      fetchPermissions();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPermission) return;
    setActionLoading(true);
    try {
      await adminApi.deletePermission(selectedPermission.id);
      fetchPermissions();
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Permission Name',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <KeySquare className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-sm text-gray-900 font-medium">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Module',
      accessor: 'module',
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
          {row.module?.name || 'Unknown'}
        </span>
      )
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal(row)}
            className="text-gray-500 hover:text-[var(--brand-primary)] transition-colors"
            title="Edit Permission"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => { setSelectedPermission(row); setIsDeleteModalOpen(true); }}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Delete Permission"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Permission Management</h2>
          <p className="text-sm text-gray-500 mt-1">Define granular permissions and assign them to various system modules.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Permission
        </button>
      </div>

      {modules.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">No Modules Found</h3>
            <p className="text-sm text-yellow-700 mt-1">You must create at least one Module before you can create Permissions.</p>
          </div>
        </div>
      )}

      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <DataTable 
          columns={columns}
          data={data}
          loading={loading}
          pagination={null} // load all
          searchPlaceholder="Search permissions..."
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedPermission ? "Edit Permission" : "Create New Permission"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Module *</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              value={formData.moduleId}
              onChange={e => setFormData({ ...formData, moduleId: e.target.value })}
            >
              <option value="" disabled>Select a module</option>
              {modules.map(mod => (
                <option key={mod.id} value={mod.id}>{mod.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permission Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., create_user"
              className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '') })}
            />
            <p className="text-xs text-gray-500 mt-1">Use lowercase and underscores (e.g., view_users, edit_package)</p>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end gap-3 mt-6">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2 px-4 border shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={actionLoading}
              className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] focus:outline-none transition-colors"
            >
              {actionLoading ? 'Saving...' : 'Save Permission'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Permission"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the permission <strong>{selectedPermission?.name}</strong>? 
            Users in roles with this permission will immediately lose access.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="py-2 px-4 border shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={actionLoading}
              className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              {actionLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
