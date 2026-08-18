"use client";

import { use, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import Link from 'next/link';
import { ArrowLeft, Monitor, Smartphone, Tablet } from 'lucide-react';

export default function PreviewPage({ params }) {
  const { id } = use(params);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const res = await adminApi.getPageById(id);
      setPage(res.data);
    } catch (err) {
      alert('Error loading page: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading preview...</div>;
  if (!page) return <div className="p-12 text-center text-red-500">Page not found.</div>;

  let blocks = [];
  try {
    blocks = JSON.parse(page.content || '[]');
  } catch (e) {
    blocks = [{ title: 'Legacy Content', description: page.content }];
  }

  const getWidth = () => {
    if (viewMode === 'mobile') return 'max-w-[375px]';
    if (viewMode === 'tablet') return 'max-w-[768px]';
    return 'max-w-full';
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-gray-100 -m-8">
      {/* Topbar */}
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900">Preview: {page.title}</h1>
            <p className="text-xs text-gray-500">/{page.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setViewMode('desktop')} className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
            <Monitor className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('tablet')} className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
            <Tablet className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('mobile')} className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/admin/pages/edit/${id}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Edit Page
          </Link>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div className={`w-full bg-white shadow-xl transition-all duration-300 min-h-full ${getWidth()} overflow-hidden rounded-sm relative`}>
          
          {/* Mock Header */}
          <header className="h-16 border-b flex items-center px-6">
            <div className="text-xl font-bold text-[var(--brand-primary)]">STAYR</div>
          </header>

          {/* Hero Image if present */}
          {page.featuredImage && (
            <div className="w-full h-[40vh] relative">
              <img src={page.featuredImage} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{page.title}</h1>
              </div>
            </div>
          )}
          
          {/* Page Content Blocks */}
          <main className="p-6 md:p-12 min-h-[50vh]">
            {!page.featuredImage && (
               <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
            )}

            <div className="space-y-12">
              {blocks.map((block, idx) => (
                <div key={idx} className={`block-preview layout-${block.layout?.toLowerCase() || 'text'} ${block.fields?.cssClasses || ''}`} style={{ backgroundColor: block.fields?.background }}>
                  
                  {block.heading && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{block.heading}</h2>
                  )}
                  
                  {block.description && (
                    <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-wrap">
                      {block.description}
                    </div>
                  )}

                  {block.fields?.buttonText && (
                    <div className="mt-6">
                      <a href={block.fields?.buttonLink || '#'} className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        {block.fields.buttonText}
                      </a>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </main>
          
          {/* Mock Footer */}
          <footer className="bg-gray-50 border-t py-12 text-center text-gray-500 text-sm mt-12">
            Mock Footer Area &copy; STAYR
          </footer>

        </div>
      </div>
    </div>
  );
}
