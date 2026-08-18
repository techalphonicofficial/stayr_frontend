"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Settings, Layers, Code, Mail, DollarSign, Building, Palette, Receipt, XCircle } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

// Tab Components (Inline for simplicity, but can be extracted)
import AutomationsTab from "@/components/admin/settings/AutomationsTab";
import EmailTab from "@/components/admin/settings/EmailTab";
import CompanyTab from "@/components/admin/settings/CompanyTab";
import ThemeTab from "@/components/admin/settings/ThemeTab";
import TaxesTab from "@/components/admin/settings/TaxesTab";
import CancellationTab from "@/components/admin/settings/CancellationTab";
import ApiKeyTab from "@/components/admin/settings/ApiKeyTab";
import CategoryTab from "@/components/admin/settings/CategoryTab";

export default function CRMSettingsPage() {
  const [activeTab, setActiveTab] = useState("automations");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await adminApi.getCrmSettings();
      if (res?.success) {
        setSettings(res.data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveMainSettings = async (updatedSettings) => {
    setSaving(true);
    try {
      const res = await adminApi.updateCrmSettings(updatedSettings);
      if (res?.success) {
        toast.success("Settings saved successfully");
        setSettings({ ...settings, ...updatedSettings });
      }
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "automations", label: "Automations & Defaults", icon: Settings },
    { id: "category", label: "Category Mapping", icon: Layers },
    { id: "api", label: "API Integration", icon: Code },
    { id: "email", label: "Email Credentials", icon: Mail },
    { id: "company", label: "Company Info", icon: Building },
    { id: "theme", label: "Theme Colour", icon: Palette },
    { id: "taxes", label: "Taxes", icon: Receipt },
    { id: "cancellation", label: "Cancellation", icon: XCircle }
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CRM Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Global configuration for lead management and platform settings.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden min-h-[600px]">
        
        {/* Horizontal Navigation */}
        <div className="w-full bg-white border-b border-gray-200 px-4 pt-4 flex flex-wrap gap-2 items-end">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b-2 mb-[-1px] ${
                activeTab === tab.id 
                  ? "border-[#000000] text-[#000000]" 
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg"
              }`}
            >
              <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? "text-[#000000]" : "text-gray-500"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50/30">
          {activeTab === "automations" && <AutomationsTab settings={settings} onSave={handleSaveMainSettings} saving={saving} />}
          {activeTab === "category" && <CategoryTab />}
          {activeTab === "api" && <ApiKeyTab />}
          {activeTab === "email" && <EmailTab settings={settings} onSave={handleSaveMainSettings} saving={saving} />}
          {activeTab === "company" && <CompanyTab settings={settings} onSave={handleSaveMainSettings} saving={saving} />}
          {activeTab === "theme" && <ThemeTab />}
          {activeTab === "taxes" && <TaxesTab />}
          {activeTab === "cancellation" && <CancellationTab />}
        </div>
      </div>
    </div>
  );
}
