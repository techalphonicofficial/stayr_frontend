"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";
import Link from "next/link";

export default function StoryForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    currency: initialData?.currency || "INR",
    packageText: initialData?.packageText || "Complete Package",
    image: initialData?.image || "",
    isActive: initialData?.isActive || false,
    timeline: initialData?.timeline || []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    setFormData(prev => ({ ...prev, timeline: newTimeline }));
  };

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { time: "", title: "", desc: "" }]
    }));
  };

  const removeTimelineItem = (index) => {
    const newTimeline = [...formData.timeline];
    newTimeline.splice(index, 1);
    setFormData(prev => ({ ...prev, timeline: newTimeline }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await adminApi.updateExperienceStory(initialData.id, formData);
        toast.success("Story updated successfully!");
      } else {
        await adminApi.createExperienceStory(formData);
        toast.success("Story created successfully!");
      }
      router.push("/admin/experiences");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/experiences" className="text-gray-400 hover:text-gray-600 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1c29]">
            {initialData ? "Edit Story" : "New Story"}
          </h1>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center px-6 py-2 bg-[#5d5fef] text-white rounded-lg text-sm font-medium hover:bg-[#4b4dc4] transition shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Story"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input 
                  type="text" required name="title" value={formData.title} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-[#5d5fef] focus:border-[#5d5fef]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input 
                  type="text" name="subtitle" value={formData.subtitle} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-[#5d5fef] focus:border-[#5d5fef]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea 
                required name="description" value={formData.description} onChange={handleChange} rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#5d5fef] focus:border-[#5d5fef]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input 
                type="url" required name="image" value={formData.image} onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#5d5fef] focus:border-[#5d5fef]"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold">Timeline Itinerary</h3>
              <button type="button" onClick={addTimelineItem} className="text-[#5d5fef] flex items-center text-sm font-medium hover:underline">
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.timeline.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" placeholder="Time (e.g. 8:00 AM)" value={item.time} required
                        onChange={(e) => handleTimelineChange(index, 'time', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border rounded-md"
                      />
                      <input 
                        type="text" placeholder="Title" value={item.title} required
                        onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border rounded-md"
                      />
                    </div>
                    <textarea 
                      placeholder="Description" value={item.desc} required rows={2}
                      onChange={(e) => handleTimelineChange(index, 'desc', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md"
                    />
                  </div>
                  <button type="button" onClick={() => removeTimelineItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.timeline.length === 0 && (
                <p className="text-sm text-gray-400 italic">No timeline items added. Add some itinerary details.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Pricing & Status</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input 
                type="number" required name="price" value={formData.price} onChange={handleChange} min={0}
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#5d5fef] focus:border-[#5d5fef]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <input 
                type="text" name="currency" value={formData.currency} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#5d5fef] focus:border-[#5d5fef]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Text</label>
              <input 
                type="text" name="packageText" value={formData.packageText} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#5d5fef] focus:border-[#5d5fef]"
              />
            </div>

            <div className="pt-4 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}
                  className="w-4 h-4 text-[#5d5fef] rounded focus:ring-[#5d5fef]"
                />
                <span className="text-sm font-medium text-gray-700">Set as Active Story</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Active stories are displayed on the public frontend. Activating this will deactivate others.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
