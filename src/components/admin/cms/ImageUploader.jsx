"use client";
import { useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Image as ImageIcon, UploadCloud, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ImageUploader({ value, onChange, label = "Featured Image" }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await adminApi.uploadPageImage(file);
      const url = res.url || res.data?.url || res.secure_url || res.data?.companyLogo || res.data?.itsLogo || res.data?.currencyLogo || res.data?.[Object.keys(res.data || {})[0]];
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      let errorMessage = err.message;
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors.join(', ');
      }
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition-colors text-center">
        {value ? (
          <div className="relative group rounded-lg overflow-hidden border border-gray-200">
            <img src={value} alt="Preview" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <label className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100 transition-colors shadow-sm text-gray-900">
                <UploadCloud className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
              </label>
              <button 
                type="button" 
                onClick={() => onChange('')}
                className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center h-40">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <span className="text-sm font-medium text-[var(--brand-primary)]">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </span>
            <span className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 2MB</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}
