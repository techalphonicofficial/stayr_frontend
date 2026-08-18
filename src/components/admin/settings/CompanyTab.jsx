import { useState } from "react";
import { Save } from "lucide-react";

export default function CompanyTab({ settings, onSave, saving }) {
  const [formData, setFormData] = useState({
    companyName: settings?.companyName || "",
    razorpayKeyId: settings?.razorpayKeyId || "",
    razorpaySecret: settings?.razorpaySecret ? "********" : "",
    phone: settings?.phone || "",
    whatsapp: settings?.whatsapp || "",
    email: settings?.email || "",
    address: settings?.address || "",
    mapUrl: settings?.mapUrl || "",
    facebookLink: settings?.facebookLink || "",
    twitterLink: settings?.twitterLink || "",
    youtubeLink: settings?.youtubeLink || "",
    instagramLink: settings?.instagramLink || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Company & Payment Info</h3>
        <p className="text-sm text-gray-500">Configure global company contact details and payment gateways.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input 
            type="text" name="companyName" value={formData.companyName} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key ID</label>
          <input 
            type="text" name="razorpayKeyId" value={formData.razorpayKeyId} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key Secret</label>
          <input 
            type="password" name="razorpaySecret" value={formData.razorpaySecret} onChange={handleChange}
            placeholder={formData.razorpaySecret === '********' ? '********' : 'Enter new secret'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="text" name="phone" value={formData.phone} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
          <input 
            type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
          <textarea 
            name="address" value={formData.address} onChange={handleChange} rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Map Embed URL</label>
          <input 
            type="text" name="mapUrl" value={formData.mapUrl} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Link</label>
          <input 
            type="url" name="facebookLink" value={formData.facebookLink} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X Link</label>
          <input 
            type="url" name="twitterLink" value={formData.twitterLink} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Link</label>
          <input 
            type="url" name="instagramLink" value={formData.instagramLink} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link</label>
          <input 
            type="url" name="youtubeLink" value={formData.youtubeLink} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" disabled={saving} className="flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-primary-hover)] transition-colors disabled:opacity-50">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
