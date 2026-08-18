import { useState } from "react";
import { Save } from "lucide-react";

export default function AutomationsTab({ settings, onSave, saving }) {
  const [formData, setFormData] = useState({
    defaultAssignee: settings?.defaultAssignee || "",
    autoAssignRule: settings?.autoAssignRule || "Manual",
    partialBooking: settings?.partialBooking || false,
    partialPercent: settings?.partialPercent || 0,
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
        <h3 className="text-lg font-medium text-gray-900">Automations & Defaults</h3>
        <p className="text-sm text-gray-500">Configure how leads and bookings are handled automatically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Assignee for New Leads</label>
          <select 
            name="defaultAssignee" 
            value={formData.defaultAssignee} 
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          >
            <option value="">Unassigned</option>
            {/* Ideally this would map over fetched users/admins */}
            <option value="admin-id-1">Admin User</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Assignment Rule</label>
          <select 
            name="autoAssignRule" 
            value={formData.autoAssignRule} 
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          >
            <option value="Manual">Manual</option>
            <option value="Round Robin">Round Robin</option>
          </select>
        </div>

        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Partial Booking</h4>
              <p className="text-xs text-gray-500">Allow customers to pay a percentage upfront.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="partialBooking" checked={formData.partialBooking} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
            </label>
          </div>

          {formData.partialBooking && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Percentage (%)</label>
              <input 
                type="number" 
                name="partialPercent" 
                value={formData.partialPercent} 
                onChange={handleChange}
                min="0" max="100"
                className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
              />
            </div>
          )}
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
