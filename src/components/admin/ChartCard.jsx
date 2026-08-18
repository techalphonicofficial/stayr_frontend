"use client";

import { ResponsiveContainer } from 'recharts';

export default function ChartCard({ title, children, height = 300 }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="flex-1 w-full" style={{ minHeight: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
