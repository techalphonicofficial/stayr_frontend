import { useState, useEffect } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

export default function CategoryTab() {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newMapping, setNewMapping] = useState({ sourceCategory: "", targetCategory: "Apartment" });
  const [adding, setAdding] = useState(false);

  // Hardcoded for now based on Prisma Enum. Alternatively fetch from backend if exposed.
  const stayrCategories = [
    "Apartment", "House", "Villa", "Cabin", "Hotel", 
    "Resort", "Farmhouse", "Cottage"
  ];

  useEffect(() => {
    fetchMappings();
  }, []);

  const fetchMappings = async () => {
    try {
      const res = await adminApi.getCategoryMappings();
      if (res?.success) {
        setMappings(res.data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load category mappings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMapping = async (e) => {
    e.preventDefault();
    if (!newMapping.sourceCategory.trim()) return toast.error("Source category is required");
    
    setAdding(true);
    try {
      const res = await adminApi.createCategoryMapping(newMapping);
      if (res?.success) {
        toast.success("Mapping added");
        setNewMapping({ ...newMapping, sourceCategory: "" });
        fetchMappings();
      }
    } catch (err) {
      toast.error(err.message || "Failed to add mapping");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteMapping = async (id) => {
    if (!confirm("Delete this mapping?")) return;
    try {
      const res = await adminApi.deleteCategoryMapping(id);
      if (res?.success) {
        toast.success("Mapping deleted");
        fetchMappings();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete mapping");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Category Mapping</h3>
        <p className="text-sm text-gray-500">Map external API property categories to internal STAYR categories.</p>
      </div>

      <form onSubmit={handleAddMapping} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">External Category Name</label>
          <input 
            type="text" value={newMapping.sourceCategory} onChange={(e) => setNewMapping({ ...newMapping, sourceCategory: e.target.value })}
            placeholder="e.g., 'Bed and Breakfast'"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>
        <div className="flex items-center justify-center pt-6 px-2 text-gray-400">
          <ArrowRight className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">STAYR Category</label>
          <select 
            value={newMapping.targetCategory} onChange={(e) => setNewMapping({ ...newMapping, targetCategory: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          >
            {stayrCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={adding} className="flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-primary-hover)] transition-colors disabled:opacity-50 h-[42px]">
          <Plus className="w-4 h-4 mr-2" />
          Add Mapping
        </button>
      </form>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading mappings...</div>
      ) : mappings.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          No category mappings configured.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">External Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maps To (STAYR)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mapping.sourceCategory}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-primary)] font-medium">{mapping.targetCategory}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDeleteMapping(mapping.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
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
