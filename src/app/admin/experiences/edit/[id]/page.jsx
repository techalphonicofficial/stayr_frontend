"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import StoryForm from "@/components/admin/StoryForm";
import { toast } from "react-hot-toast";

export default function EditExperienceStory() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchStory();
    }
  }, [params.id]);

  const fetchStory = async () => {
    try {
      const res = await adminApi.getExperienceStory(params.id);
      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load story");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">Story not found.</div>;

  return <StoryForm initialData={data} />;
}
