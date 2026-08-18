"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Copy, Star, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";
import Link from "next/link";
import Image from "next/image";

export default function BlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await adminApi.getBlogPosts();
      if (res?.success) setPosts(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await adminApi.deleteBlogPost(id);
      if (res?.success) {
        toast.success("Post deleted!");
        fetchPosts();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete post");
    }
  };

  const handleToggleFeatured = async (post) => {
    try {
      const res = await adminApi.updateBlogPost(post.id, { ...post, isFeatured: !post.isFeatured });
      if (res?.success) {
        toast.success(post.isFeatured ? "Removed from featured" : "Marked as featured");
        fetchPosts();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update featured status");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(posts.map(p => p.id));
    else setSelected([]);
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Are you sure you want to delete ${selected.length} posts?`)) return;
    try {
      await Promise.all(selected.map(id => adminApi.deleteBlogPost(id)));
      toast.success(`${selected.length} posts deleted!`);
      setSelected([]);
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete some posts");
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1c29]">Blog Posts</h1>
          <p className="text-[#8c8f9b] text-sm mt-1">Manage your blog content and articles</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDeleteSelected}
            className="flex items-center px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition"
            disabled={selected.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Selected
          </button>
          <Link href="/admin/blogs/create" className="flex items-center px-4 py-2 bg-[#5d5fef] text-white rounded-lg text-sm font-medium hover:bg-[#4b4dc4] transition shadow-sm">
            <Plus className="w-4 h-4 mr-1" /> New Post
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search blog posts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#5d5fef] focus:ring-1 focus:ring-[#5d5fef]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-[#f8f9fc] text-[#6b7280] font-semibold text-xs tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" onChange={handleSelectAll} checked={selected.length === posts.length && posts.length > 0} className="rounded border-gray-300 text-[#5d5fef] focus:ring-[#5d5fef]" />
                </th>
                <th className="px-6 py-4 uppercase">POST</th>
                <th className="px-6 py-4 uppercase">CATEGORY</th>
                <th className="px-6 py-4 uppercase">STATUS</th>
                <th className="px-6 py-4 uppercase">FEATURED</th>
                <th className="px-6 py-4 uppercase text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10 text-gray-400">Loading posts...</td></tr>
              ) : filteredPosts.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-gray-400">No blog posts found.</td></tr>
              ) : (
                filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selected.includes(post.id)}
                        onChange={(e) => setSelected(prev => e.target.checked ? [...prev, post.id] : prev.filter(id => id !== post.id))}
                        className="rounded border-gray-300 text-[#5d5fef] focus:ring-[#5d5fef]" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                          {post.image ? (
                            <Image src={post.image} alt={post.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No img</div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 truncate max-w-[250px]">{post.title}</span>
                          <span className="text-xs text-gray-400">/blog/{post.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.category ? (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        post.status === 'PUBLISHED' 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleFeatured(post)} className="text-gray-300 hover:text-amber-400 transition">
                        <Star className={`w-5 h-5 ${post.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blogs/edit/${post.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-[#5d5fef] hover:bg-blue-50 rounded-lg transition" title="Duplicate">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
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
