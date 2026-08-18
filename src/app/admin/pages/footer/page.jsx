"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import { 
  Info, Link as LinkIcon, Image as ImageIcon, 
  Menu, Lightbulb, Trash2, Plus, ArrowUp, ArrowDown
} from 'lucide-react';

export default function FooterSettings() {
  const [data, setData] = useState({ settings: {}, columns: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingType, setUploadingType] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Local state for URLs to allow typing before saving
  const [logoUrls, setLogoUrls] = useState({
    companyLogo: '',
    itsLogo: '',
    currencyLogo: ''
  });

  const [copyright, setCopyright] = useState('');

  // New Column/Link State
  const [newColumn, setNewColumn] = useState('');
  const [newLink, setNewLink] = useState({ columnId: '', title: '', url: '', target: '_self' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await adminApi.getFooterSettings();
      setData(res.data);
      setLogoUrls({
        companyLogo: res.data.settings.companyLogo || '',
        itsLogo: res.data.settings.itsLogo || '',
        currencyLogo: res.data.settings.currencyLogo || ''
      });
      setCopyright(res.data.settings.copyright || '');
    } catch (err) {
      alert('Failed to load footer settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllBasicSettings = async () => {
    try {
      setSaving(true);
      await adminApi.updateFooterSettings({
        copyright,
        companyLogo: logoUrls.companyLogo,
        itsLogo: logoUrls.itsLogo,
        currencyLogo: logoUrls.currencyLogo,
      });
      alert('Footer settings saved successfully!');
      fetchData(); // Refresh to sync any backend changes
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingType(type);
      const res = await adminApi.uploadFooterLogo(file, type);
      // Immediately fetch data to see the new uploaded logo
      await fetchData();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingType(null);
    }
  };

  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newColumn.trim()) return;
    try {
      await adminApi.createFooterColumn({ title: newColumn, sortOrder: data.columns.length });
      setNewColumn('');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteColumn = async (id) => {
    if (!confirm('Are you sure? This will delete all links inside it.')) return;
    try {
      await adminApi.deleteFooterColumn(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.columnId || !newLink.title || !newLink.url) return;
    
    try {
      await adminApi.createFooterLink(newLink);
      setNewLink({ columnId: '', title: '', url: '', target: '_self' });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLink = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await adminApi.deleteFooterLink(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Footer Settings...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      {/* Top Banner */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <h2 className="text-[#1e293b] font-bold text-xl">Footer Settings</h2>
      </div>

      <div className="px-8 max-w-[1400px] mx-auto mt-8">
        
        {/* Header Text */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#1e293b]">Footer Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage company logo, copyright notice, and dynamic links shown in the website footer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          
          {/* Main Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex items-center px-6 pt-6 border-b border-gray-200 gap-6">
              <button 
                onClick={() => setActiveTab('basic')}
                className={`flex items-center pb-4 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === 'basic' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Info className="w-4 h-4 mr-2" /> Basic Footer Info
              </button>
              <button 
                onClick={() => setActiveTab('columns')}
                className={`flex items-center pb-4 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === 'columns' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <LinkIcon className="w-4 h-4 mr-2" /> Footer Columns
              </button>
            </div>

            <div className="p-6 space-y-8">
              
              {activeTab === 'basic' && (
                <>
                  {/* Logos */}
                  {['companyLogo'].map((type) => (
                    <div key={type} className="space-y-2">
                      <label className="block text-sm font-bold text-gray-900">
                        {type === 'companyLogo' ? 'Company Logo' : type === 'itsLogo' ? 'ITS Logo' : 'Currency Logo'}
                      </label>
                      <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        
                        {/* Logo Preview Square */}
                        <div className="w-32 h-32 bg-[#0f172a] rounded-xl flex-shrink-0 flex items-center justify-center p-2 shadow-inner border border-gray-800">
                          {logoUrls[type] ? (
                            <img src={logoUrls[type]} alt={type} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-600" />
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex-1 space-y-4 w-full">
                          <div>
                            <label className="block text-[13px] font-semibold text-amber-500 mb-1.5">Upload New Image File</label>
                            <div className="flex items-center">
                              <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-l-md hover:bg-gray-50 transition font-medium">
                                {uploadingType === type ? 'Uploading...' : 'Choose file'}
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => handleLogoUpload(e, type)}
                                />
                              </label>
                              <div className="border border-l-0 border-gray-300 bg-white text-gray-500 text-sm px-4 py-2 rounded-r-md flex-1">
                                {uploadingType === type ? 'Please wait...' : 'No file chosen'}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[13px] font-semibold text-amber-500 mb-1.5">Or Enter External Logo URL</label>
                            <input
                              type="text"
                              value={logoUrls[type]}
                              onChange={(e) => setLogoUrls({ ...logoUrls, [type]: e.target.value })}
                              className="w-full text-sm border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                              placeholder="https://example.com/logo.png"
                            />
                          </div>

                          <p className="text-xs text-gray-500">
                            Supported types: PNG, JPEG, SVG, WebP, AVIF. Keep file size under 2MB.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Copyright Text */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">Footer Copyright Text</label>
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <textarea
                        value={copyright}
                        onChange={(e) => setCopyright(e.target.value)}
                        rows="3"
                        className="w-full text-sm border-none px-4 py-3 focus:outline-none focus:ring-0 bg-white resize-y"
                        placeholder="© 2028 All Rights Reserved."
                      ></textarea>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This text is shown at the bottom of public pages.</p>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-amber-500 flex items-center">
                      <Info className="w-3.5 h-3.5 mr-1" /> Settings are synced immediately (click Save to confirm URL changes)
                    </p>
                    <button
                      onClick={handleSaveAllBasicSettings}
                      disabled={saving}
                      className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-900 transition shadow-sm disabled:opacity-70"
                    >
                      {saving ? 'Saving...' : 'Save Footer Settings'}
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'columns' && (
                <div className="space-y-6">
                  {/* Create New Column */}
                  <form onSubmit={handleAddColumn} className="flex gap-2">
                    <input
                      type="text"
                      value={newColumn}
                      onChange={e => setNewColumn(e.target.value)}
                      placeholder="New Column Title (e.g. Explore)"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 text-sm font-medium">
                      Add Column
                    </button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.columns.map((col) => (
                      <div key={col.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        
                        {/* Column Header */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-sm flex items-center">
                            <Menu className="w-4 h-4 mr-2 text-gray-400" /> {col.title}
                          </h3>
                          <button onClick={() => handleDeleteColumn(col.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Links List */}
                        <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
                          {col.links?.map((link) => (
                            <div key={link.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group text-sm border border-transparent hover:border-gray-100 transition">
                              <div className="flex items-center overflow-hidden">
                                <GripVertical className="w-4 h-4 text-gray-300 mr-2 cursor-grab flex-shrink-0" />
                                <div className="truncate">
                                  <p className="font-medium text-gray-800 truncate">{link.title}</p>
                                  <p className="text-xs text-gray-400 truncate">{link.url}</p>
                                </div>
                              </div>
                              <button onClick={() => handleDeleteLink(link.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          
                          {(!col.links || col.links.length === 0) && (
                            <div className="p-4 text-center text-xs text-gray-400">No links added yet.</div>
                          )}
                        </div>

                        {/* Add Link Form */}
                        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                          <h4 className="text-xs font-semibold text-gray-600 mb-2">Add New Link</h4>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Link Title (e.g. About Us)"
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              value={newLink.columnId === col.id ? newLink.title : ''}
                              onChange={e => setNewLink({ ...newLink, columnId: col.id, title: e.target.value })}
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="URL (/about or https://...)"
                                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                                value={newLink.columnId === col.id ? newLink.url : ''}
                                onChange={e => setNewLink({ ...newLink, columnId: col.id, url: e.target.value })}
                              />
                              <button
                                onClick={handleAddLink}
                                className="px-3 py-1.5 bg-[#5d5fef] text-white rounded-md hover:bg-[#4b4dc4] text-xs font-medium"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#f0f9ff] rounded-xl border border-blue-100 p-5 shadow-sm">
              <h3 className="flex items-center text-sm font-bold text-blue-900 mb-4">
                <Info className="w-4 h-4 mr-2 text-blue-600" /> About Footer Settings
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-50">
                  <h4 className="text-[13px] font-bold text-gray-800 flex items-center mb-1.5">
                    <ImageIcon className="w-4 h-4 mr-2 text-gray-500" /> Footer Logos
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Use high-resolution PNG or SVG files with transparent backgrounds for Company, ITS, and Currency logos.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-50">
                  <h4 className="text-[13px] font-bold text-gray-800 flex items-center mb-1.5">
                    <Menu className="w-4 h-4 mr-2 text-gray-500" /> Column Structure
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Footer links are categorized into four columns. You can define custom titles, target paths (e.g. <code className="text-pink-500 bg-pink-50 px-1 rounded">/about-us</code> or external links), and emoji indicators.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-50">
                  <h4 className="text-[13px] font-bold text-gray-800 flex items-center mb-1.5">
                    <Lightbulb className="w-4 h-4 mr-2 text-gray-500" /> Dynamic Emojis
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    The Trust & Safety column supports an additional Icon Emoji field to make trust badges stand out in the footer layout.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
