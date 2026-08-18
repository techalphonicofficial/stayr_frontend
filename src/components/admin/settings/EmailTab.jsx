import { useState } from "react";
import { Save } from "lucide-react";

export default function EmailTab({ settings, onSave, saving }) {
  const [formData, setFormData] = useState({
    smtpHost: settings?.smtpHost || "",
    smtpPort: settings?.smtpPort || 587,
    smtpSecure: settings?.smtpSecure ?? true,
    fromName: settings?.fromName || "",
    fromEmail: settings?.fromEmail || "",
    smtpUser: settings?.smtpUser || "",
    smtpPassword: settings?.smtpPassword ? "********" : "",
  });

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Email Credentials</h3>
        <p className="text-sm text-gray-500">Configure SMTP settings for outgoing system emails.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
          <input 
            type="text" name="smtpHost" value={formData.smtpHost} onChange={handleChange}
            placeholder="e.g., smtp.gmail.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input 
              type="number" name="smtpPort" value={formData.smtpPort} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
            />
          </div>
          <div className="flex flex-col items-center justify-center pt-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="smtpSecure" checked={formData.smtpSecure} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">SSL/TLS</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
          <input 
            type="text" name="fromName" value={formData.fromName} onChange={handleChange}
            placeholder="e.g., STAYR Support"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
          <input 
            type="email" name="fromEmail" value={formData.fromEmail} onChange={handleChange}
            placeholder="noreply@stayr.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username / Email</label>
          <input 
            type="text" name="smtpUser" value={formData.smtpUser} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">App Password</label>
          <input 
            type="password" name="smtpPassword" value={formData.smtpPassword} onChange={handleChange}
            placeholder={formData.smtpPassword === '********' ? '********' : 'Enter new password'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Leave as ******** to keep existing password.</p>
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
