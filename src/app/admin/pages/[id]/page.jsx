"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import { ArrowLeft, Save, Layout, Settings } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function PageEditor({ params }) {
  // Unwrap params using React.use() in Next.js 15+
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    pageType: 'standard',
    content: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    status: 'Draft'
  });

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      const res = await adminApi.getPageById(id);
      setFormData(res.data);
    } catch (err) {
      alert('Error loading page: ' + err.message);
      router.push('/admin/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (statusOverride = null) => {
    try {
      setSaving(true);
      const dataToSave = { ...formData };
      if (statusOverride) {
        dataToSave.status = statusOverride;
      }

      if (isNew) {
        await adminApi.createPage(dataToSave);
      } else {
        await adminApi.updatePage(id, dataToSave);
      }
      
      router.push('/admin/pages');
    } catch (err) {
      alert('Error saving page: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Create Page' : 'Edit Page'}</h1>
            <p className="text-gray-500 text-sm mt-1">{isNew ? 'Draft a new page' : 'Update existing page content'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave('Draft')}
            disabled={saving}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('Published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] font-medium disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 text-gray-800 font-semibold">
              <Layout className="h-5 w-5 text-gray-400" />
              Page Content
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  // Auto-generate slug if it's new
                  if (isNew && !formData.slug) {
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData({ ...formData, title, slug });
                  } else {
                    setFormData({ ...formData, title });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                placeholder="e.g. About Us"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rich Text Content (HTML supported)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={16}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] font-mono text-sm"
                placeholder="<p>Enter your content here...</p>"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 text-gray-800 font-semibold">
              <Settings className="h-5 w-5 text-gray-400" />
              Page Settings
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                  /
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="about-us"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
              <select
                value={formData.pageType}
                onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="standard">Standard</option>
                <option value="landing">Landing Page</option>
                <option value="legal">Legal/Policy</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 text-gray-800 font-semibold">
              <Settings className="h-5 w-5 text-gray-400" />
              SEO Optimization
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                placeholder="Optimize for search engines..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                placeholder="Brief description for search results..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                placeholder="vacation, rental, stayr"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
