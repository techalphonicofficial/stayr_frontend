"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import { Plus, Folder, Trash2, Edit2 } from 'lucide-react';

export default function ModulesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getModules();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleOpenModal = (moduleItem = null) => {
    setSelectedModule(moduleItem);
    if (moduleItem) {
      setFormData({ name: moduleItem.name, slug: moduleItem.slug });
    } else {
      setFormData({ name: '', slug: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return alert("Name and Slug are required");
    
    setActionLoading(true);
    try {
      if (selectedModule) {
        await adminApi.updateModule(selectedModule.id, formData);
      } else {
        await adminApi.createModule(formData);
      }
      
      fetchModules();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedModule) return;
    setActionLoading(true);
    try {
      await adminApi.deleteModule(selectedModule.id);
      fetchModules();
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Module Name',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Folder className="h-4 w-4" />
          </div>
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Slug / Identifier',
      accessor: 'slug',
      cell: (row) => <span className="font-mono text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">{row.slug}</span>
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
            title="Edit Module"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => { setSelectedModule(row); setIsDeleteModalOpen(true); }}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Delete Module"
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
          <h2 className="text-2xl font-bold text-gray-900">Module Management</h2>
          <p className="text-sm text-gray-500 mt-1">Define organizational modules to group permissions logically.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Module
        </button>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <DataTable 
          columns={columns}
          data={data}
          loading={loading}
          pagination={null} // load all
          searchPlaceholder="Search modules..."
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedModule ? "Edit Module" : "Create New Module"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Module Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., User Management"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              value={formData.name}
              onChange={e => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
                setFormData({ name, slug: selectedModule ? formData.slug : slug });
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Module Slug *</label>
            <input
              type="text"
              required
              placeholder="e.g., user_management"
              className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '') })}
            />
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
              {actionLoading ? 'Saving...' : 'Save Module'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Module"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the module <strong>{selectedModule?.name}</strong>? 
            This will also delete all permissions associated with this module.
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
