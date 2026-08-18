"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import { ArrowLeft, Save, Layout, Settings, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import SeoPanel from './SeoPanel';
import ContentBlockEditor from './ContentBlockEditor';
import ImageUploader from './ImageUploader';

export default function PageForm({ id, isNew = false }) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    pageType: 'standard',
    featuredImage: '',
    status: 'Draft',
    visibility: 'Public', // Frontend only if backend ignores it
    seo: {},
    contentBlocks: []
  });

  useEffect(() => {
    if (!isNew) fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const res = await adminApi.getPageById(id);
      const data = res.data;
      
      let parsedBlocks = [];
      
      if (data.content) {
        if (typeof data.content === 'string') {
          try {
            if (data.content.startsWith('[')) {
              parsedBlocks = JSON.parse(data.content);
            } else {
              parsedBlocks = [{ id: 'legacy-1', key: 'legacy-1', title: 'Legacy Content', heading: '', description: data.content, layout: 'Text', order: 0 }];
            }
          } catch(e) {}
        } else if (Array.isArray(data.content)) {
          parsedBlocks = data.content;
        }
      }

      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        pageType: data.pageType || 'standard',
        featuredImage: data.featuredImage || '',
        status: data.status || 'Draft',
        visibility: data.visibility || 'Public',
        seo: {
          metaTitle: data.seoTitle || '',
          metaDescription: data.seoDescription || '',
          metaKeywords: data.seoKeywords || '',
          canonical: data.canonicalUrl || '',
          robots: data.robots || '',
          schema: data.jsonLd || '',
          openGraph: {
            title: data.ogTitle || '',
            description: data.ogDescription || '',
            image: data.ogImage || ''
          },
          twitter: {
            title: data.twitterTitle || '',
            description: data.twitterDescription || ''
          }
        },
        contentBlocks: parsedBlocks
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (statusOverride = null) => {
    if (!formData.title || !formData.slug) {
      toast.error("Page Title and Slug are required.");
      return;
    }
    if (formData.contentBlocks.length === 0) {
      toast.error("Please add at least one content block.");
      return;
    }

    try {
      setSaving(true);
      
      const payloadStatus = statusOverride || formData.status;
      
      const cleanBlocks = formData.contentBlocks.map(b => ({
        id: b.id, key: b.key, title: b.title, heading: b.heading, 
        description: b.description, layout: b.layout, order: b.order, 
        status: b.status, fields: b.fields
      }));

      // We no longer stringify objects because Prisma supports JSON column type for content,
      // and we have dedicated text fields for SEO metadata.
      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        pageType: formData.pageType,
        status: payloadStatus,
        featuredImage: formData.featuredImage,
        content: cleanBlocks,
        seoTitle: formData.seo?.metaTitle || formData.title,
        seoDescription: formData.seo?.metaDescription || '',
        seoKeywords: formData.seo?.metaKeywords || '',
        canonicalUrl: formData.seo?.canonical || '',
        robots: formData.seo?.robots || '',
        jsonLd: formData.seo?.schema || '',
        ogTitle: formData.seo?.openGraph?.title || '',
        ogDescription: formData.seo?.openGraph?.description || '',
        ogImage: formData.seo?.openGraph?.image || '',
        twitterTitle: formData.seo?.twitter?.title || '',
        twitterDescription: formData.seo?.twitter?.description || ''
      };

      const payloadString = JSON.stringify(payload);
      const payloadSize = new Blob([payloadString]).size;
      console.log(`[CMS Save] Payload Size: ${(payloadSize / 1024).toFixed(2)} KB`);
      // Note: Previous payload size with Base64 image was often 2-3 MB.

      if (isNew) {
        await adminApi.createPage(payload);
        toast.success('Page created successfully');
      } else {
        await adminApi.updatePage(id, payload);
        toast.success('Page updated successfully');
      }
      
      router.push('/admin/pages');
    } catch (err) {
      let errorMessage = err.message;
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors.join(', ');
      }
      toast.error('Save failed: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-24 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-[var(--brand-primary)]" />
      Loading page data...
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 border border-red-200 text-red-600 rounded-xl m-8">
      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
      <h3 className="font-bold">Error loading page</h3>
      <p>{error}</p>
      <Link href="/admin/pages" className="mt-4 inline-block text-sm underline">Return to pages</Link>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-gray-50 z-10 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 hover:bg-gray-200 rounded-lg transition-colors shadow-sm bg-white border border-gray-200">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{isNew ? 'Create New Page' : 'Edit Page'}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
              {saving ? <span className="text-orange-500 flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Saving...</span> : 'All changes saved locally'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave('Draft')}
            disabled={saving}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 shadow-sm"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave('Published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] font-medium disabled:opacity-50 shadow-sm transition-colors"
          >
            <Save className="h-4 w-4" />
            {isNew ? 'Publish Page' : 'Update Page'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: Main Editing */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 text-gray-800 font-semibold">
              <Layout className="h-5 w-5 text-gray-400" />
              Basic Information
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  if (isNew && !formData.slug) {
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData({ ...formData, title, slug });
                  } else {
                    setFormData({ ...formData, title });
                  }
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:bg-white transition-colors"
                placeholder="e.g. Host Guarantee"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug <span className="text-red-500">*</span></label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-mono">
                  stayr.com/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:bg-white font-mono transition-colors"
                  placeholder="host-guarantee"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">General Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:bg-white transition-colors"
                placeholder="Internal description or summary of this page's purpose..."
              />
            </div>
          </div>

          <ContentBlockEditor 
            blocks={formData.contentBlocks} 
            onChange={(blocks) => setFormData({ ...formData, contentBlocks: blocks })} 
          />

        </div>

        {/* RIGHT COLUMN: Settings & SEO */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <ImageUploader 
              label="Featured Image"
              value={formData.featuredImage}
              onChange={(url) => setFormData({ ...formData, featuredImage: url })}
            />
            
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="Public">Public (Visible to everyone)</option>
                <option value="Private">Private (Admins only)</option>
                <option value="Password">Password Protected</option>
              </select>
            </div>
          </div>

          <SeoPanel 
            data={formData.seo}
            onChange={(seo) => setFormData({ ...formData, seo })}
          />

        </div>
      </div>
    </div>
  );
}
