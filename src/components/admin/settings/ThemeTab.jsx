import { useState, useEffect } from "react";
import { Save, Palette, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

const DEFAULT_THEME = {
  // Primary
  "--brand-primary": "var(--brand-primary)",
  "--brand-primary-hover": "var(--brand-primary-hover)",
  "--brand-primary-light": "#FFB3C1",
  "--brand-primary-border": "var(--brand-primary-hover)",
  "--brand-secondary": "#222222",
  "--brand-secondary-hover": "#000000",
  // Aliases
  "--color-primary": "var(--brand-primary)",
  "--color-primary-hover": "var(--brand-primary-hover)",
  "--color-primary-light": "#FFB3C1",
  "--color-secondary": "#222222",
  "--color-secondary-hover": "#000000",
  // Bootstrap
  "--bs-primary": "var(--brand-primary)",
  "--bs-secondary": "#222222",
  "--bs-link-color": "var(--brand-primary)",
  "--bs-link-hover-color": "var(--brand-primary-hover)",
  // Accent
  "--color-accent": "#00a699",
  "--color-accent-hover": "#00887a",
  // Text
  "--color-text-primary": "#222222",
  "--color-text-secondary": "#717171",
  "--color-text-muted": "#9ca3af",
  // Background
  "--color-bg": "#ffffff",
  "--color-bg-soft": "#f7f7f7",
  "--color-bg-card": "#ffffff",
  "--color-bg-overlay": "rgba(0,0,0,0.5)",
  // Borders
  "--color-border": "#e5e7eb",
  "--color-border-focus": "var(--brand-primary)",
  // Shadows
  "--shadow-xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  "--shadow-sm": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  "--shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  "--shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  "--shadow-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "--shadow-card-hover": "0 10px 15px -3px rgba(0,0,0,0.1)",
  // Border radius
  "--radius-sm": "0.125rem",
  "--radius-md": "0.375rem",
  "--radius-lg": "0.5rem",
  "--radius-xl": "0.75rem",
  "--radius-2xl": "1rem",
  "--radius-full": "9999px",
  // Transitions
  "--transition-fast": "150ms ease-in-out",
  "--transition-base": "250ms ease-in-out",
  "--transition-slow": "350ms ease-in-out",
  // Spacing
  "--space-1": "0.25rem",
  "--space-2": "0.5rem",
  "--space-3": "0.75rem",
  "--space-4": "1rem",
  "--space-5": "1.25rem",
  "--space-6": "1.5rem",
  "--space-8": "2rem",
  "--space-10": "2.5rem",
  "--space-12": "3rem",
  "--space-16": "4rem",
  "--space-20": "5rem",
  "--space-24": "6rem",
  // Z-index
  "--z-base": "0",
  "--z-dropdown": "1000",
  "--z-sticky": "1020",
  "--z-modal": "1050",
  "--z-toast": "1100",
  // Gradients
  "--gradient-primary": "linear-gradient(to right, var(--brand-primary), var(--brand-primary-hover))",
  "--gradient-hero": "linear-gradient(to right, #222222, #444444)",
  "--gradient-card": "linear-gradient(to bottom, #ffffff, #f7f7f7)",
  "--gradient-warm": "linear-gradient(to right, #ff9a9e, #fecfef)",
  "--gradient-green": "linear-gradient(to right, #00a699, #00887a)"
};

const GROUPS = [
  {
    title: "PRIMARY PALETTE",
    keys: [
      "--brand-primary", "--brand-primary-hover", "--brand-primary-light", "--brand-primary-border",
      "--brand-secondary", "--brand-secondary-hover",
      "--color-primary", "--color-primary-hover", "--color-primary-light", "--color-secondary",
      "--color-secondary-hover", "--bs-primary", "--bs-secondary", "--bs-link-color",
      "--bs-link-hover-color", "--color-accent", "--color-accent-hover"
    ]
  },
  {
    title: "TEXT",
    keys: ["--color-text-primary", "--color-text-secondary", "--color-text-muted"]
  },
  {
    title: "BACKGROUNDS",
    keys: ["--color-bg", "--color-bg-soft", "--color-bg-card", "--color-bg-overlay"]
  },
  {
    title: "BORDERS",
    keys: ["--color-border", "--color-border-focus"]
  },
  {
    title: "SHADOWS",
    keys: ["--shadow-xs", "--shadow-sm", "--shadow-md", "--shadow-lg", "--shadow-xl", "--shadow-card-hover"]
  },
  {
    title: "BORDER RADIUS",
    keys: ["--radius-sm", "--radius-md", "--radius-lg", "--radius-xl", "--radius-2xl", "--radius-full"]
  },
  {
    title: "TRANSITIONS",
    keys: ["--transition-fast", "--transition-base", "--transition-slow"]
  },
  {
    title: "SPACING SCALE",
    keys: ["--space-1", "--space-2", "--space-3", "--space-4", "--space-5", "--space-6", "--space-8", "--space-10", "--space-12", "--space-16", "--space-20", "--space-24"]
  },
  {
    title: "Z-INDEX LAYERS",
    keys: ["--z-base", "--z-dropdown", "--z-sticky", "--z-modal", "--z-toast"]
  },
  {
    title: "GRADIENTS",
    keys: ["--gradient-primary", "--gradient-hero", "--gradient-card", "--gradient-warm", "--gradient-green"]
  }
];

const formatLabel = (key) => key.replace(/^--/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

export default function ThemeTab() {
  const [variables, setVariables] = useState(DEFAULT_THEME);
  const [themes, setThemes] = useState([]);
  const [activeThemeId, setActiveThemeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const res = await adminApi.getThemes();
      if (res?.success) {
        setThemes(res.data);
        const active = res.data.find(t => t.isActive);
        if (active) {
          setActiveThemeId(active.id);
          const nameInput = document.getElementById('theme-name');
          if (nameInput) nameInput.value = active.name;
          
          if (active.variables && Object.keys(active.variables).length > 0) {
            const merged = { ...DEFAULT_THEME, ...active.variables };
            setVariables(merged);
            applyThemeVariables(merged);
          }
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to load themes");
    } finally {
      setLoading(false);
    }
  };

  const applyThemeVariables = (vars) => {
    Object.entries(vars).forEach(([key, val]) => {
      if (val) document.documentElement.style.setProperty(key, val);
    });
  };

  const handleCreateNewTheme = async () => {
    const nameInput = document.getElementById('theme-name');
    const currentActiveTheme = themes.find(t => t.id === activeThemeId);
    const currentActiveName = currentActiveTheme ? currentActiveTheme.name : "";

    // Step 1: If input matches the active theme name (or is empty), prepare for a new theme
    if (!nameInput.value || nameInput.value === currentActiveName) {
      setVariables(DEFAULT_THEME);
      applyThemeVariables(DEFAULT_THEME);
      nameInput.value = "New Theme";
      nameInput.focus();
      nameInput.select();
      return;
    }

    // Step 2: If the name is different, create and save the theme
    const newName = nameInput.value;
    if (!newName.trim()) {
      return toast.error("Please enter a theme name");
    }
    
    setSaving(true);
    try {
      const res = await adminApi.createTheme({ name: newName, variables });
      if (res?.success) {
        toast.success("Theme saved and activated!");
        await fetchThemes();
      }
    } catch (err) {
      toast.error(err.message || "Failed to create theme");
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = async (e) => {
    const id = e.target.value;
    if (!id) return;
    setLoading(true);
    try {
      await adminApi.activateTheme(id);
      toast.success("Theme switched successfully!");
      await fetchThemes();
    } catch (err) {
      toast.error(err.message || "Failed to switch theme");
    }
  };

  const handleDeleteTheme = async () => {
    if (themes.length <= 1) {
      return toast.error("Cannot delete the only remaining theme.");
    }
    if (!confirm("Are you sure you want to delete this theme?")) return;
    
    setLoading(true);
    try {
      await adminApi.deleteTheme(activeThemeId);
      toast.success("Theme deleted successfully!");
      await fetchThemes();
    } catch (err) {
      toast.error(err.message || "Failed to delete theme");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setVariables({ ...variables, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await adminApi.updateTheme({ variables });
      if (res?.success) {
        toast.success("Theme settings saved. Public frontend will now use these colors.");
        
        // Apply instantly to the Admin UI
        Object.entries(variables).forEach(([key, val]) => {
          if (val) document.documentElement.style.setProperty(key, val);
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-8 text-center text-gray-500">Loading theme...</div>;

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-2 space-y-8 pb-32">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="bg-black p-3 rounded-lg text-white">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Brand Palette</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Theme variables</p>
          </div>
        </div>

        {/* Theme Select */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-blue-100 p-5 rounded-xl shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Saved Theme</label>
            <div className="flex gap-2 items-center">
              <select 
                value={activeThemeId}
                onChange={handleThemeChange}
                className="flex-1 text-[15px] py-2.5 px-3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Select a Theme</option>
                {themes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {themes.length > 1 && (
                <button 
                  type="button"
                  onClick={handleDeleteTheme}
                  title="Delete Theme"
                  className="p-2.5 text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors shadow-sm bg-white"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Theme Name</label>
              <input id="theme-name" type="text" defaultValue="New Theme" className="w-full text-[15px] py-2.5 px-3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white" />
            </div>
            <button 
              type="button"
              onClick={handleCreateNewTheme}
              disabled={saving}
              className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-md text-[15px] font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-1" /> New
            </button>
          </div>
        </div>

        {/* Variable Groups */}
        <form id="theme-form" onSubmit={handleSave} className="space-y-10">
          {GROUPS.map((group) => {
            const groupKeys = group.keys.filter(k => variables[k] !== undefined);
            if (groupKeys.length === 0) return null;

            return (
              <div key={group.title} className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{group.title}</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                  {groupKeys.map((key) => {
                    const value = variables[key];
                    const isColor = /^#([0-9A-F]{3}){1,2}$/i.test(value) || value.startsWith('rgba') || value.startsWith('rgb');
                    const hasValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(value);
                    
                    return (
                      <div key={key} className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-800">
                          {formatLabel(key)}
                        </label>
                        <div className="flex items-center border border-gray-200 rounded-md bg-white focus-within:ring-1 focus-within:ring-black focus-within:border-black overflow-hidden shadow-sm h-10 transition-shadow">
                          {isColor && (
                             <div className="w-10 h-full shrink-0 border-r border-gray-200 bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                                <div className="w-6 h-6 rounded shadow-sm border border-black/10" style={{ backgroundColor: value }}></div>
                                {hasValidHex && (
                                  <input 
                                    type="color" 
                                    name={key} 
                                    value={value} 
                                    onChange={handleChange}
                                    className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer opacity-0"
                                  />
                                )}
                             </div>
                          )}
                          <div className="px-3 text-xs text-gray-500 font-mono border-r border-gray-200 h-full flex items-center bg-gray-50/50 whitespace-nowrap min-w-[140px]">
                            {key}
                          </div>
                          <input 
                            type="text" 
                            name={key} 
                            value={value} 
                            onChange={handleChange}
                            className="flex-1 px-3 py-2 text-xs font-mono text-gray-800 outline-none border-none w-full bg-transparent"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </form>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex items-center justify-between z-10 rounded-b-xl">
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="flex items-center px-6 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm"
        >
          {saving ? 'Saving...' : 'Save CRM Settings'}
        </button>

        <div className="flex items-center gap-6 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
            <span className="text-sm font-bold text-gray-800 tracking-tight">Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors">Primary</button>
            <button className="px-3 py-1 text-xs font-medium text-yellow-600 bg-yellow-50 rounded-full border border-yellow-200 hover:bg-yellow-100 transition-colors">Secondary</button>
            <button className="px-3 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors">Accent</button>
            <button className="px-4 py-1 text-xs font-semibold bg-black text-white rounded-full hover:bg-gray-800 transition-colors">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
