"use client";
import { ChevronDown, ChevronUp, GripVertical, Trash2, Copy } from 'lucide-react';
import { useState } from 'react';

export default function BlockCard({ block, index, totalBlocks, onChange, onMoveUp, onMoveDown, onDelete, onDuplicate }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...block, [field]: value });
  };

  const handleCustomFieldChange = (key, value) => {
    onChange({ ...block, fields: { ...(block.fields || {}), [key]: value } });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4 transition-all">
      {/* Header / Toolbar */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="cursor-move text-gray-400 hover:text-gray-600">
            <GripVertical className="w-5 h-5" />
          </div>
          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">
            {index + 1}
          </span>
          <select
            value={block.layout}
            onChange={(e) => handleChange('layout', e.target.value)}
            className="text-sm font-semibold text-gray-800 bg-transparent border-none focus:ring-0 p-0 cursor-pointer"
          >
            <option value="Hero">Hero</option>
            <option value="Banner">Banner</option>
            <option value="Text">Text</option>
            <option value="Gallery">Gallery</option>
            <option value="Grid">Grid</option>
            <option value="Cards">Cards</option>
            <option value="FAQ">FAQ</option>
            <option value="Timeline">Timeline</option>
            <option value="CTA">CTA</option>
            <option value="Features">Features</option>
            <option value="Testimonials">Testimonials</option>
            <option value="Video">Video</option>
            <option value="Custom">Custom</option>
          </select>
          {block.title && <span className="text-sm text-gray-500 truncate max-w-[200px]">- {block.title}</span>}
        </div>

        <div className="flex items-center gap-1">
          <button type="button" onClick={onMoveUp} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={index === totalBlocks - 1} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30">
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button type="button" onClick={onDuplicate} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded">
            <Copy className="w-4 h-4" />
          </button>
          <button type="button" onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setExpanded(!expanded)} className="ml-2 px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">
            {expanded ? 'Collapse' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {expanded && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Block Title (Internal)</label>
              <input
                type="text"
                value={block.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Main Hero Section"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={block.status || 'Active'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
              >
                <option value="Active">Active</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={block.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
              placeholder="Display heading for this block"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description / Content</label>
            <textarea
              value={block.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              placeholder="Main text content for this block"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
            />
          </div>

          {/* Dynamic Custom Fields Area */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Custom Attributes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Background Color/Image</label>
                <input
                  type="text"
                  value={block.fields?.background || ''}
                  onChange={(e) => handleCustomFieldChange('background', e.target.value)}
                  placeholder="#ffffff or URL"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Primary Button Text</label>
                <input
                  type="text"
                  value={block.fields?.buttonText || ''}
                  onChange={(e) => handleCustomFieldChange('buttonText', e.target.value)}
                  placeholder="e.g. Learn More"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Primary Button Link</label>
                <input
                  type="text"
                  value={block.fields?.buttonLink || ''}
                  onChange={(e) => handleCustomFieldChange('buttonLink', e.target.value)}
                  placeholder="/some-path"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Additional CSS Classes</label>
                <input
                  type="text"
                  value={block.fields?.cssClasses || ''}
                  onChange={(e) => handleCustomFieldChange('cssClasses', e.target.value)}
                  placeholder="mt-4 text-center"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
