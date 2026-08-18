import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

export default function CancellationTab() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newRule, setNewRule] = useState({ 
    minDays: 0, maxDays: 0, refundPercentage: 0, cancelPercentage: 0, description: "" 
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await adminApi.getCancellationRules();
      if (res?.success) {
        setRules(res.data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load cancellation rules");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (newRule.minDays > newRule.maxDays) return toast.error("Min days cannot be greater than max days");
    
    setAdding(true);
    try {
      const res = await adminApi.createCancellationRule(newRule);
      if (res?.success) {
        toast.success("Rule added successfully");
        setNewRule({ minDays: 0, maxDays: 0, refundPercentage: 0, cancelPercentage: 0, description: "" });
        fetchRules();
      }
    } catch (err) {
      toast.error(err.message || "Failed to add rule");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteRule = async (id) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;
    try {
      const res = await adminApi.deleteCancellationRule(id);
      if (res?.success) {
        toast.success("Rule deleted");
        fetchRules();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete rule");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Cancellation Policy Builder</h3>
        <p className="text-sm text-gray-500">Define dynamic rules for refunds and cancellation charges based on days to check-in.</p>
      </div>

      <form onSubmit={handleAddRule} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Add New Rule</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Days Before Check-in</label>
            <input 
              type="number" value={newRule.minDays} onChange={(e) => setNewRule({ ...newRule, minDays: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Days Before Check-in</label>
            <input 
              type="number" value={newRule.maxDays} onChange={(e) => setNewRule({ ...newRule, maxDays: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Refund to Guest (%)</label>
            <input 
              type="number" value={newRule.refundPercentage} onChange={(e) => setNewRule({ ...newRule, refundPercentage: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Cancellation Charge (%)</label>
            <input 
              type="number" value={newRule.cancelPercentage} onChange={(e) => setNewRule({ ...newRule, cancelPercentage: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Description (Optional)</label>
          <input 
            type="text" value={newRule.description} onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
            placeholder="e.g., Free cancellation up to 7 days before check-in"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none text-sm"
          />
        </div>
        <div className="flex justify-end mt-2">
          <button type="submit" disabled={adding} className="flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-primary-hover)] transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading rules...</div>
      ) : rules.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          No cancellation rules configured.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rule.minDays} - {rule.maxDays} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{rule.refundPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{rule.cancelPercentage}%</td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{rule.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDeleteRule(rule.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
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
