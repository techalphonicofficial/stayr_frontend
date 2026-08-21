"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { MapPin, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function PropertiesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProperties = async (page = 1, search = '') => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=${pagination.limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await adminApi.getProperties(query);
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
      fetchProperties(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const columns = [
    {
      header: 'Property',
      accessor: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80'} 
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80"; e.currentTarget.onerror = null; }}
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
      cell: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{row.host?.name || 'Unknown'}</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
    },
    {
      header: 'Price/Night',
      accessor: 'pricePerNight',
      cell: (row) => <span className="font-medium">₹{row.pricePerNight}</span>
    },
    {
      header: 'Approved',
      accessor: 'isApproved',
      cell: (row) => <StatusBadge status={row.isApproved} />
    },
    {
      header: 'Listed On',
      accessor: 'createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/property/${row.id}`} target="_blank" className="p-1 text-gray-500 hover:text-blue-500 transition-colors" title="View Public Page">
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link href={`/admin/properties/edit/${row.id}`} className="p-1 text-gray-500 hover:text-primary transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={async () => {
              if (confirm('Are you sure you want to delete this property?')) {
                await adminApi.deleteProperty(row.id);
                fetchProperties(pagination.currentPage, searchQuery);
              }
            }}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-500 mt-1">View all listed properties on the platform.</p>
        </div>
        <Link 
          href="/admin/properties/create" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
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
          searchPlaceholder="Search properties by title, city, or country..."
        />
      </div>
    </div>
  );
}
