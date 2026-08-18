"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import { use } from 'react';
import PropertyForm from '@/components/admin/property/PropertyForm';

export default function EditPropertyPage({ params }) {
  const unwrappedParams = use(params);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await adminApi.getPropertyById(unwrappedParams.id);
        setProperty(res.data);
      } catch (err) {
        console.error('Failed to fetch property:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [unwrappedParams.id]);

  if (loading) return <div className="p-10 text-center">Loading property...</div>;
  if (!property) return <div className="p-10 text-center text-red-500">Property not found</div>;

  return <PropertyForm initialData={property} isEdit={true} />;
}
