import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

export default function TaxesTab() {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newTax, setNewTax] = useState({ name: "", defaultPercentage: 0 });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      const res = await adminApi.getTaxes();
      if (res?.success) {
        setTaxes(res.data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load taxes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTax = async (e) => {
    e.preventDefault();
    if (!newTax.name.trim()) return toast.error("Tax name is required");
    if (newTax.defaultPercentage < 0 || newTax.defaultPercentage > 100) {
      return toast.error("Percentage must be between 0 and 100");
    }
    
    setAdding(true);
    try {
      const res = await adminApi.createTax(newTax);
      if (res?.success) {
        toast.success("Tax added successfully");
        setNewTax({ name: "", defaultPercentage: 0 });
        fetchTaxes();
      }
    } catch (err) {
      toast.error(err.message || "Failed to add tax");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteTax = async (id) => {
    if (!confirm("Are you sure you want to delete this tax?")) return;
    try {
      const res = await adminApi.deleteTax(id);
      if (res?.success) {
        toast.success("Tax deleted");
        fetchTaxes();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete tax");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Tax Configurations</h3>
        <p className="text-sm text-gray-500">Manage dynamic tax types like GST, IGST, VAT, etc.</p>
      </div>

      <form onSubmit={handleAddTax} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
          <input 
            type="text" value={newTax.name} onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
            placeholder="e.g., GST"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">Default %</label>
          <input 
            type="number" step="0.1" value={newTax.defaultPercentage} onChange={(e) => setNewTax({ ...newTax, defaultPercentage: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>
        <button type="submit" disabled={adding} className="flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-primary-hover)] transition-colors disabled:opacity-50 h-[42px]">
          <Plus className="w-4 h-4 mr-2" />
          Add Tax
        </button>
      </form>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading taxes...</div>
      ) : taxes.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          No taxes configured yet.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxes.map((tax) => (
                <tr key={tax.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tax.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tax.defaultPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tax.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {tax.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDeleteTax(tax.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
