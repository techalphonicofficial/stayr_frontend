"use client";

import { use } from 'react';
import PageForm from '@/components/admin/cms/PageForm';

export default function EditPage({ params }) {
  const { id } = use(params);
  
  return <PageForm id={id} isNew={false} />;
}
