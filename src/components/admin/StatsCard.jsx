import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={trend === 'up' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {trendValue}
          </span>
          <span className="text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}
