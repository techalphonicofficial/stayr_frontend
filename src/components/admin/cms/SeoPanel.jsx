"use client";
import { Settings, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function SeoPanel({ data, onChange }) {
  const [openSections, setOpenSections] = useState({ meta: true, og: false, twitter: false, advanced: false });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 text-gray-800 font-semibold">
        <Settings className="h-5 w-5 text-gray-400" />
        SEO & Meta
      </div>

      {/* Meta Tags */}
      <div className="space-y-4 border-b border-gray-100 pb-4">
        <button type="button" onClick={() => toggleSection('meta')} className="flex items-center justify-between w-full text-sm font-semibold text-gray-700">
          General SEO
          {openSections.meta ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {openSections.meta && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-xs font-medium text-gray-700">Meta Title</label>
                <span className={`text-[10px] ${(data?.metaTitle?.length || 0) > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                  {data?.metaTitle?.length || 0}/60
                </span>
              </div>
              <input
                type="text"
                value={data?.metaTitle || ''}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
                placeholder="Ideal length is 50-60 characters"
              />
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-xs font-medium text-gray-700">Meta Description</label>
                <span className={`text-[10px] ${(data?.metaDescription?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                  {data?.metaDescription?.length || 0}/160
                </span>
              </div>
              <textarea
                value={data?.metaDescription || ''}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
                placeholder="Brief summary for search engines (150-160 characters)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Keywords</label>
              <input
                type="text"
                value={data?.metaKeywords || ''}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
                placeholder="Comma separated keywords"
              />
            </div>
          </div>
        )}
      </div>

      {/* Open Graph */}
      <div className="space-y-4 border-b border-gray-100 pb-4">
        <button type="button" onClick={() => toggleSection('og')} className="flex items-center justify-between w-full text-sm font-semibold text-gray-700">
          Open Graph (Facebook)
          {openSections.og ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {openSections.og && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">OG Title</label>
              <input
                type="text"
                value={data?.openGraph?.title || ''}
                onChange={(e) => handleChange('openGraph', { ...data?.openGraph, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">OG Description</label>
              <textarea
                value={data?.openGraph?.description || ''}
                onChange={(e) => handleChange('openGraph', { ...data?.openGraph, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">OG Image URL</label>
              <input
                type="text"
                value={data?.openGraph?.image || ''}
                onChange={(e) => handleChange('openGraph', { ...data?.openGraph, image: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Twitter */}
      <div className="space-y-4 border-b border-gray-100 pb-4">
        <button type="button" onClick={() => toggleSection('twitter')} className="flex items-center justify-between w-full text-sm font-semibold text-gray-700">
          Twitter Cards
          {openSections.twitter ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {openSections.twitter && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Twitter Title</label>
              <input
                type="text"
                value={data?.twitter?.title || ''}
                onChange={(e) => handleChange('twitter', { ...data?.twitter, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Twitter Description</label>
              <textarea
                value={data?.twitter?.description || ''}
                onChange={(e) => handleChange('twitter', { ...data?.twitter, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Advanced */}
      <div className="space-y-4 pb-2">
        <button type="button" onClick={() => toggleSection('advanced')} className="flex items-center justify-between w-full text-sm font-semibold text-gray-700">
          Advanced Settings
          {openSections.advanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {openSections.advanced && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Canonical URL</label>
              <input
                type="text"
                value={data?.canonical || ''}
                onChange={(e) => handleChange('canonical', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Robots Meta</label>
              <input
                type="text"
                value={data?.robots || ''}
                onChange={(e) => handleChange('robots', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                placeholder="e.g. index, follow"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">JSON-LD Schema</label>
              <textarea
                value={data?.schema || ''}
                onChange={(e) => handleChange('schema', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-200 rounded-lg"
                placeholder="{ ... }"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
