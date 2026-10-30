"use client";

import { Suspense } from 'react';
import { PropertiesPageContent } from '../properties/page';

export default function AdminSalePropertiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Sale Properties...</div>}>
      <PropertiesPageContent defaultSection="sale" />
    </Suspense>
  );
}
