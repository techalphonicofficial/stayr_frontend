import { useState, useEffect } from "react";
import { Plus, Trash2, Key, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

export default function ApiKeyTab() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await adminApi.getApiKeys();
      if (res?.success) {
        setKeys(res.data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return toast.error("Key name is required");
    setGenerating(true);
    try {
      const res = await adminApi.createApiKey({ name: newKeyName });
      if (res?.success) {
        setNewlyGeneratedKey(res.data.rawKey);
        setNewKeyName("");
        fetchKeys();
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate key");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) return;
    try {
      const res = await adminApi.deleteApiKey(id);
      if (res?.success) {
        toast.success("API Key revoked");
        fetchKeys();
      }
    } catch (err) {
      toast.error(err.message || "Failed to revoke key");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newlyGeneratedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">API Integration</h3>
        <p className="text-sm text-gray-500">Manage API keys for external applications to connect to the CRM.</p>
      </div>

      {newlyGeneratedKey && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h4 className="text-green-800 font-medium mb-2 flex items-center">
            <Key className="w-5 h-5 mr-2" />
            New API Key Generated
          </h4>
          <p className="text-sm text-green-700 mb-4">
            Please copy this key and store it safely. For security reasons, <strong>it will never be shown again</strong>.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-4 py-3 rounded border border-green-300 text-gray-800 font-mono text-sm break-all">
              {newlyGeneratedKey}
            </code>
            <button 
              onClick={copyToClipboard}
              className="px-4 py-3 bg-white border border-green-300 rounded hover:bg-green-50 text-green-700 transition flex items-center justify-center min-w-[100px]"
            >
              {copied ? <><Check className="w-4 h-4 mr-1" /> Copied</> : <><Copy className="w-4 h-4 mr-1" /> Copy</>}
            </button>
          </div>
          <button 
            onClick={() => setNewlyGeneratedKey(null)}
            className="mt-4 text-sm text-green-700 underline hover:text-green-900"
          >
            I have saved the key securely
          </button>
        </div>
      )}

      <form onSubmit={handleGenerate} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Key Name</label>
          <input 
            type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="e.g., Zapier Integration"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
          />
        </div>
        <button type="submit" disabled={generating} className="flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-primary-hover)] transition-colors disabled:opacity-50 h-[42px]">
          <Plus className="w-4 h-4 mr-2" />
          {generating ? 'Generating...' : 'Generate New Key'}
        </button>
      </form>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading keys...</div>
      ) : keys.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          No API keys generated yet.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prefix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {keys.map((key) => (
                <tr key={key.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{key.keyPrefix}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleRevoke(key.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                      <Trash2 className="w-4 h-4 mr-1" /> Revoke
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
