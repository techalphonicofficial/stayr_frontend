"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

export default function BlogCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await adminApi.getBlogCategories();
      if (res?.success) setCategories(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return toast.error("Category name is required");
    try {
      const res = await adminApi.createBlogCategory({ name: newCategory });
      if (res?.success) {
        toast.success("Category created!");
        setNewCategory("");
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.message || "Failed to create category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This might affect posts in this category.")) return;
    try {
      const res = await adminApi.deleteBlogCategory(id);
      if (res?.success) {
        toast.success("Category deleted!");
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
          <p className="text-gray-500 mt-1">Manage categories for your blog posts</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleCreate} className="flex gap-4">
            <input
              type="text"
              placeholder="New Category Name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </button>
          </form>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-md transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No categories found. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
