"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, Plus, Edit, Trash2, Search, 
  ChevronLeft, ChevronRight, Eye, Copy, 
  MoreVertical, RefreshCw, LayoutTemplate, 
  CheckCircle, XCircle, Archive, EyeOff 
} from 'lucide-react';
import Image from 'next/image';

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

const StatusBadge = ({ status }) => {
  const styles = {
    Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Draft: "bg-amber-50 text-amber-700 border-amber-200",
    Hidden: "bg-gray-50 text-gray-700 border-gray-200",
    Archived: "bg-rose-50 text-rose-700 border-rose-200"
  };
  
  const icons = {
    Published: <CheckCircle className="w-3 h-3 mr-1" />,
    Draft: <Edit className="w-3 h-3 mr-1" />,
    Hidden: <EyeOff className="w-3 h-3 mr-1" />,
    Archived: <Archive className="w-3 h-3 mr-1" />
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.Draft}`}>
      {icons[status]}
      {status || 'Draft'}
    </span>
  );
};

const ActionTooltip = ({ text, children }) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-900 text-white text-xs font-medium py-1 px-2 rounded shadow-sm">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4 py-4">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
        <div className="w-32 h-16 bg-gray-100 rounded-lg hidden md:block"></div>
        <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
      <LayoutTemplate className="w-12 h-12 text-gray-300" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">No Pages Found</h3>
    <p className="text-gray-500 mb-6 max-w-sm">
      You haven't created any pages yet, or no pages match your current search criteria.
    </p>
    <Link 
      href="/admin/pages/new"
      className="inline-flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] font-medium transition-colors"
    >
      <Plus className="w-4 h-4 mr-2" />
      Create First Page
    </Link>
  </div>
);

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function PagesCMS() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      // We pass status filter directly. If backend doesn't support 'sort', we might sort locally, 
      // but assuming backend sorts by newest by default. We'll handle local sort if needed, 
      // but let's pass query params appropriately.
      const query = new URLSearchParams({
        page: currentPage,
        limit: limit,
        search: search,
      });
      if (statusFilter) query.append('status', statusFilter);
      
      const res = await adminApi.getPages(`?${query.toString()}`);
      
      let fetchedPages = res.data || [];
      
      // Local Sorting since API might only return by createdAt desc
      if (sortBy === 'oldest') {
        fetchedPages = fetchedPages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy === 'alphabetical') {
        fetchedPages = fetchedPages.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        // newest
        fetchedPages = fetchedPages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setPages(fetchedPages);
      setTotal(res.pagination?.total || fetchedPages.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [currentPage, search, statusFilter, sortBy, limit]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;
    try {
      await adminApi.deletePage(id);
      fetchPages();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      setLoading(true);
      await adminApi.duplicatePage(id);
      fetchPages();
    } catch (err) {
      alert('Duplicate failed: ' + err.message);
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* 1. TOP SECTION & SUMMARY CARD */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Website Pages</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your website content, SEO and dynamic sections.</p>
        </div>
        <Link 
          href="/admin/pages/create"
          className="inline-flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] font-medium shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Page
        </Link>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white w-full md:w-72 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4">
          <FileText className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <p className="text-gray-300 text-sm font-medium mb-1">Total Pages</p>
          <p className="text-4xl font-bold">{total}</p>
          <div className="mt-4 flex items-center text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
            Live and Draft pages
          </div>
        </div>
      </div>

      {/* 2. ERROR STATE */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center text-red-700">
            <XCircle className="w-5 h-5 mr-3" />
            <span className="font-medium">Failed to load pages: {error}</span>
          </div>
          <button onClick={fetchPages} className="px-3 py-1.5 bg-white text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50">
            Retry
          </button>
        </div>
      )}

      {/* 3. FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Title, Slug, SEO..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] outline-none"
          />
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-3">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          >
            <option value="">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Hidden">Hidden</option>
            <option value="Archived">Archived</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 md:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* 4. TABLE AREA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="px-6">
              <SkeletonLoader />
            </div>
          ) : pages.length === 0 ? (
            <EmptyState />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Page Details</th>
                  <th className="px-6 py-4">SEO Preview</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pages.map((page, idx) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {(currentPage - 1) * limit + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                        {page.featuredImage ? (
                          <img src={page.featuredImage} alt={page.title} className="w-full h-full object-cover" />
                        ) : (
                          <LayoutTemplate className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500 font-mono mt-0.5">/{page.slug}</div>
                      <div className="text-xs text-gray-400 mt-1 capitalize">{page.pageType || 'Standard'} Page</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs bg-white border border-gray-200 rounded p-2 shadow-sm">
                        <div className="text-[10px] text-gray-500 truncate mb-1">stayr.com › {page.slug}</div>
                        <div className="text-xs text-blue-700 hover:underline cursor-pointer truncate font-medium">
                          {page.seoTitle || page.title}
                        </div>
                        <div className="text-[10px] text-gray-600 line-clamp-2 leading-snug mt-1">
                          {page.seoDescription || "No meta description provided for this page."}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{new Date(page.updatedAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(page.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-xs text-gray-400 mt-1">By Admin</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionTooltip text="View Live">
                          <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </a>
                        </ActionTooltip>
                        
                        <ActionTooltip text="Edit Page">
                          <Link href={`/admin/pages/edit/${page.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </Link>
                        </ActionTooltip>

                        <ActionTooltip text="Duplicate">
                          <button onClick={() => handleDuplicate(page.id)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                        </ActionTooltip>

                        <ActionTooltip text="Delete">
                          <button onClick={() => handleDelete(page.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </ActionTooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 5. PAGINATION */}
        {!loading && pages.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-3">Rows per page:</span>
              <select 
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1); }}
                className="border-none bg-transparent font-medium text-gray-700 cursor-pointer focus:ring-0 p-0 pr-6"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
