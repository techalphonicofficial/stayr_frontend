"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";
import Link from "next/link";
import Image from "next/image";

export default function ExperienceStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await adminApi.getExperienceStories();
      if (res?.success) setStories(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await adminApi.deleteExperienceStory(id);
      if (res?.success) {
        toast.success("Story deleted!");
        fetchStories();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete story");
    }
  };

  const handleToggleActive = async (story) => {
    try {
      const res = await adminApi.updateExperienceStory(story.id, { isActive: !story.isActive });
      if (res?.success) {
        toast.success(story.isActive ? "Story deactivated" : "Story activated");
        fetchStories();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1c29]">Experience Stories</h1>
          <p className="text-[#8c8f9b] text-sm mt-1">Manage dynamic "One Day, One Story" sections</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/experiences/create" className="flex items-center px-4 py-2 bg-[#5d5fef] text-white rounded-lg text-sm font-medium hover:bg-[#4b4dc4] transition shadow-sm">
            <Plus className="w-4 h-4 mr-1" /> New Story
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-[#f8f9fc] text-[#6b7280] font-semibold text-xs tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 uppercase">STORY</th>
                <th className="px-6 py-4 uppercase">PRICE</th>
                <th className="px-6 py-4 uppercase">ACTIVE</th>
                <th className="px-6 py-4 uppercase text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-10 text-gray-400">Loading stories...</td></tr>
              ) : stories.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10 text-gray-400">No stories found.</td></tr>
              ) : (
                stories.map(story => (
                  <tr key={story.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                          {story.image ? (
                            <Image src={story.image} alt={story.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No img</div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 truncate max-w-[250px]">{story.title}</span>
                          <span className="text-xs text-gray-400">{story.subtitle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {story.price} {story.currency}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleActive(story)} className="focus:outline-none">
                        {story.isActive ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/experiences/edit/${story.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(story.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
