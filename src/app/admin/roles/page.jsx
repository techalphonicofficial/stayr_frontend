"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import { Plus, Shield, CheckSquare, Square, Trash2, Edit2 } from 'lucide-react';

export default function RolesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState(new Set());

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const [rolesRes, modulesRes, permsRes] = await Promise.all([
        adminApi.getRoles(),
        adminApi.getModules(),
        adminApi.getPermissions()
      ]);
      setData(rolesRes.data);
      setModules(modulesRes.data);
      setPermissions(permsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenModal = (role = null) => {
    setSelectedRole(role);
    if (role) {
      setFormData({ name: role.name, description: role.description || '' });
      setSelectedPermissionIds(new Set(role.permissions.map(p => p.permissionId)));
    } else {
      setFormData({ name: '', description: '' });
      setSelectedPermissionIds(new Set());
    }
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permId) => {
    const newSet = new Set(selectedPermissionIds);
    if (newSet.has(permId)) {
      newSet.delete(permId);
    } else {
      newSet.add(permId);
    }
    setSelectedPermissionIds(newSet);
  };

  const handleToggleModule = (moduleId, modulePerms) => {
    const newSet = new Set(selectedPermissionIds);
    const allSelected = modulePerms.every(p => newSet.has(p.id));
    
    if (allSelected) {
      // Deselect all
      modulePerms.forEach(p => newSet.delete(p.id));
    } else {
      // Select all
      modulePerms.forEach(p => newSet.add(p.id));
    }
    setSelectedPermissionIds(newSet);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Role name is required");
    
    setActionLoading(true);
    try {
      const payload = {
        ...formData,
        permissionIds: Array.from(selectedPermissionIds)
      };

      if (selectedRole) {
        await adminApi.updateRole(selectedRole.id, payload);
      } else {
        await adminApi.createRole(payload);
      }
      
      fetchRoles();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRole) return;
    setActionLoading(true);
    try {
      await adminApi.deleteRole(selectedRole.id);
      fetchRoles();
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Role Name',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Shield className={`h-4 w-4 ${row.name === 'Admin' ? 'text-[var(--brand-primary)]' : 'text-gray-400'}`} />
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (row) => <span className="text-gray-500 text-sm">{row.description || '-'}</span>
    },
    {
      header: 'Permissions',
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {row.permissions?.length || 0} assigned
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
            title="Edit Role"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          {row.name !== 'Admin' && (
            <button
              onClick={() => { setSelectedRole(row); setIsDeleteModalOpen(true); }}
              className="text-gray-500 hover:text-red-600 transition-colors"
              title="Delete Role"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
          <p className="text-sm text-gray-500 mt-1">Define and manage user roles and their associated permissions.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Role
        </button>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <DataTable 
          columns={columns}
          data={data}
          loading={loading}
          pagination={null} // show all roles without pagination for now
          searchPlaceholder="Search roles..."
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? "Edit Role" : "Create New Role"}
        size="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
              <input
                type="text"
                required
                disabled={selectedRole?.name === 'Admin'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Assign Permissions</h4>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {modules.map(module => {
                const modulePerms = permissions.filter(p => p.moduleId === module.id);
                if (modulePerms.length === 0) return null;
                
                const allSelected = modulePerms.every(p => selectedPermissionIds.has(p.id));
                const someSelected = modulePerms.some(p => selectedPermissionIds.has(p.id));
                
                return (
                  <div key={module.id} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center cursor-pointer select-none"
                      onClick={() => handleToggleModule(module.id, modulePerms)}
                    >
                      <h5 className="font-semibold text-gray-800">{module.name}</h5>
                      <button type="button" className="text-gray-500 hover:text-[var(--brand-primary)]">
                        {allSelected ? <CheckSquare className="h-5 w-5 text-[var(--brand-primary)]" /> : (someSelected ? <div className="h-5 w-5 rounded border-2 border-[var(--brand-primary)] bg-[var(--brand-primary)] flex items-center justify-center"><div className="h-0.5 w-3 bg-white rounded-full"></div></div> : <Square className="h-5 w-5" />)}
                      </button>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white">
                      {modulePerms.map(perm => (
                        <label key={perm.id} className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            className="rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                            checked={selectedPermissionIds.has(perm.id)}
                            onChange={() => handleTogglePermission(perm.id)}
                          />
                          <span className="text-sm text-gray-700">{perm.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
              {modules.length === 0 && (
                <div className="text-gray-500 text-sm py-4">No modules found. Please create modules and permissions first.</div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end gap-3">
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
              {actionLoading ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Role"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the role <strong>{selectedRole?.name}</strong>? This action cannot be undone and may affect users assigned to this role.
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
