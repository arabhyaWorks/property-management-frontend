import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, Users } from 'lucide-react';

const metrics = [
  {
    label: 'Total Revenue',
    value: '₹24.5L',
    trend: { value: 12.5, up: true },
    icon: IndianRupee,
  },
  {
    label: 'New Allotments',
    value: '156',
    trend: { value: 8.2, up: true },
    icon: Users,
  },
  {
    label: 'Collection Rate',
    value: '85%',
    trend: { value: 5.1, up: false },
    icon: TrendingUp,
  },
];

export function ReportMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <metric.icon className="h-6 w-6 text-blue-600" />
            <div className="flex items-center gap-1">
              {metric.trend.up ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={metric.trend.up ? 'text-green-500' : 'text-red-500'}>
                {metric.trend.value}%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
          <p className="text-gray-600">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}