import { useState } from "react";
import { Save } from "lucide-react";

export default function ForexTab({ settings, onSave, saving }) {
  const [formData, setFormData] = useState({
    baseCurrency: settings?.baseCurrency || "USD",
    forexEnabled: settings?.forexEnabled || false,
    forexProvider: settings?.forexProvider || "",
    forexAutoMode: settings?.forexAutoMode ?? true,
    forexMarkup: settings?.forexMarkup || 0,
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
        <h3 className="text-lg font-medium text-gray-900">Forex Settings</h3>
        <p className="text-sm text-gray-500">Configure multi-currency support and exchange rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
          <select 
            name="baseCurrency" value={formData.baseCurrency} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        <div className="flex items-center pt-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="forexEnabled" checked={formData.forexEnabled} onChange={handleChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Enable Multi-Currency</span>
          </label>
        </div>

        {formData.forexEnabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exchange Rate Provider</label>
              <select 
                name="forexProvider" value={formData.forexProvider} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
              >
                <option value="openexchangerates">Open Exchange Rates</option>
                <option value="fixer">Fixer.io</option>
                <option value="manual">Manual Rates</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="forexAutoMode" checked={formData.forexAutoMode} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">Auto Update Rates Daily</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Markup / Commission (%)</label>
              <input 
                type="number" step="0.1" name="forexMarkup" value={formData.forexMarkup} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Percentage added to base conversion rate.</p>
            </div>
          </>
        )}
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
