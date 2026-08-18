"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import BlogPostForm from "@/components/admin/blogs/BlogPostForm";
import { toast } from "react-hot-toast";

export default function EditBlogPost() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getBlogPost(id)
      .then(res => {
        if (res?.success) setInitialData(res.data);
      })
      .catch(err => {
        toast.error("Failed to load post data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!initialData) return <div className="p-10 text-center text-red-500">Post not found.</div>;

  return <BlogPostForm initialData={initialData} isEdit={true} />;
}
