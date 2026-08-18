"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";
import { 
  Save, Image as ImageIcon, ArrowLeft, Loader2, Plus, Trash2,
  Undo, Redo, Bold, Italic, Underline, Link as LinkIcon, ImagePlus, Quote, List, ListOrdered, AlignLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPostForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    shortSummary: initialData?.shortSummary || "",
    content: initialData?.content || "",
    categoryId: initialData?.categoryId || "",
    author: initialData?.author || "Regular Employee (employee@example.com)",
    publishDate: initialData?.publishDate ? new Date(initialData.publishDate).toISOString().split('T')[0] : "",
    status: initialData?.status || "Published",
    isFeatured: initialData?.isFeatured || false,
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    metaKeywords: initialData?.metaKeywords || "",
    schemaMarkup: initialData?.schemaMarkup || "",
    image: initialData?.image || "",
    details: initialData?.details || []
  });

  useEffect(() => {
    adminApi.getBlogCategories()
      .then(res => { if(res?.success) setCategories(res.data) })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDetailChange = (index, field, value) => {
    setFormData(prev => {
      const newDetails = [...prev.details];
      newDetails[index][field] = value;
      return { ...prev, details: newDetails };
    });
  };

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, { title: "", content: "" }]
    }));
  };

  const removeDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setImageUploading(true);
    try {
      const res = await adminApi.uploadBlogImage(file);
      if (res?.success) {
        setFormData(prev => ({ ...prev, image: res.url }));
        toast.success("Image uploaded!");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      return toast.error("Title and Content are required");
    }

    setLoading(true);
    try {
      const submitData = { ...formData };
      if (!submitData.publishDate) delete submitData.publishDate;

      let res;
      if (isEdit) {
        res = await adminApi.updateBlogPost(initialData.id, submitData);
      } else {
        res = await adminApi.createBlogPost(submitData);
      }
      
      if (res?.success) {
        toast.success(`Post ${isEdit ? 'updated' : 'created'} successfully!`);
        router.push("/admin/blogs");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      {/* Top Banner similar to mockup */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center mb-6">
        <h2 className="text-gray-800 font-semibold text-lg">{isEdit ? "Edit Blog Post" : "Create Blog Post"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="px-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-transparent mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Post" : "Create Post"}</h1>
            <p className="text-gray-500 text-sm mt-1">Write and publish your latest story</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/admin/blogs" className="flex items-center px-4 py-2 border border-gray-200 text-gray-600 rounded-md text-sm hover:bg-gray-50 transition bg-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Posts
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            {/* Article Content Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 space-y-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-base border-b border-gray-100 pb-3">Article Content</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Post Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="10 Best Places to Visit in Mauritius for Honeymoon Couples"
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 transition outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="10-best-places-to-visit-in-mauritius-for-honeymoon-couples"
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 transition outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Summary</label>
                <textarea
                  name="shortSummary"
                  value={formData.shortSummary}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Discover the most romantic beaches, waterfalls, luxury resorts, and attractions in Mauritius..."
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 transition outline-none resize-y"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Content</label>
                <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm">
                  {/* Fake Rich Text Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center gap-2 flex-wrap">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Undo className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Redo className="w-4 h-4" /></button>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <select className="text-sm bg-transparent border-none outline-none text-gray-700 cursor-pointer">
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                      <option>Paragraph</option>
                    </select>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Bold className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Italic className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Underline className="w-4 h-4" /></button>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><LinkIcon className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><ImagePlus className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Quote className="w-4 h-4" /></button>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><List className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><ListOrdered className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><AlignLeft className="w-4 h-4" /></button>
                  </div>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="14"
                    placeholder="Discover the Magic of Mauritius – A Perfect Honeymoon Escape"
                    className="w-full text-sm py-4 px-4 outline-none border-none resize-y leading-relaxed text-gray-800"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* SEO Metadata Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 space-y-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-base border-b border-gray-100 pb-3">SEO Metadata</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 transition outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows="3"
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 transition outline-none resize-y"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  placeholder="comma, separated, keywords"
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 transition outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Schema Markup (JSON-LD)</label>
                <textarea
                  name="schemaMarkup"
                  value={formData.schemaMarkup}
                  onChange={handleChange}
                  rows="4"
                  placeholder='{"@context": "https://schema.org"...}'
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 transition outline-none font-mono text-xs text-gray-600 bg-gray-50"
                ></textarea>
              </div>
            </div>

            {/* Blog Details (Sections) Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 space-y-5 border border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
                <h3 className="font-semibold text-gray-900 text-base">Blog Details (Sections)</h3>
                <button 
                  type="button" 
                  onClick={addDetail}
                  className="flex items-center text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-100 transition"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Detail
                </button>
              </div>

              {formData.details.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  No sections added yet. Click "Add Detail" to create one.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.details.map((detail, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm relative group">
                      <button 
                        type="button"
                        onClick={() => removeDetail(index)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 border border-transparent hover:border-red-100 hover:bg-red-50"
                        title="Remove section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-4 pr-10">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Section Title</label>
                          <input
                            type="text"
                            value={detail.title}
                            onChange={(e) => handleDetailChange(index, "title", e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2 px-3 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Section Content</label>
                          <textarea
                            value={detail.content}
                            onChange={(e) => handleDetailChange(index, "content", e.target.value)}
                            rows="4"
                            className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2 px-3 outline-none resize-y"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Publishing Settings Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 space-y-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-base border-b border-gray-100 pb-3 mb-2">Publishing Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 outline-none bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Author (Employee)</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Regular Employee (employee@example.com)"
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Publish Date</label>
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2.5 px-3 outline-none bg-white"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 pb-1 border-t border-gray-100 mt-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                  Featured Post
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 space-y-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-base border-b border-gray-100 pb-3 mb-2">Featured Image</h3>
              
              <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex flex-col items-center justify-center group shadow-sm">
                {imagePreview ? (
                  <>
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-gray-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <span className="text-xs font-medium">Upload Cover</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
              </div>
              
              <div className="text-center mt-3">
                <label className="cursor-pointer text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 px-4 py-2 rounded-md hover:bg-blue-100 transition inline-block w-full">
                  {imagePreview ? 'Replace Image' : 'Upload Image'}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button (Matching Mockup exactly) */}
            <button
              type="submit"
              disabled={loading || imageUploading}
              className={`w-full py-3.5 bg-black text-white rounded-full text-sm font-semibold tracking-wide hover:bg-gray-900 transition shadow-md flex items-center justify-center ${
                (loading || imageUploading) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving Post...</>
              ) : imageUploading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Uploading Image...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> {isEdit ? 'Save Post' : 'Save Post'}</>
              )}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}
