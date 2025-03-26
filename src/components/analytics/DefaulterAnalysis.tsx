import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, IndianRupee } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const defaulterData = [
  { category: 'MIG', count: 45, amount: 1250000 },
  { category: 'LIG', count: 32, amount: 850000 },
  { category: 'EWS', count: 28, amount: 620000 },
  { category: 'Commercial', count: 15, amount: 2100000 },
];

const metrics = [
  {
    title: 'Total Defaulters',
    value: '120',
    trend: { value: 5.2, isPositive: false },
    icon: AlertTriangle,
    color: 'text-red-600',
  },
  {
    title: 'Recovery Rate',
    value: '68%',
    trend: { value: 3.1, isPositive: true },
    icon: TrendingUp,
    color: 'text-green-600',
  },
  {
    title: 'Outstanding Amount',
    value: '₹48.2L',
    trend: { value: 12.5, isPositive: false },
    icon: IndianRupee,
    color: 'text-orange-600',
  },
];

export function DefaulterAnalysis() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        {t('defaulterAnalysis')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`h-5 w-5 ${metric.color} dark:text-gray-300`} />
              <div className={`text-sm ${metric.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend.isPositive ? '+' : '-'}{metric.trend.value}%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {metric.title}
            </div>
          </div>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={defaulterData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', opacity: 0.5 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', opacity: 0.5 }}
              tickFormatter={(value) => `₹${value/1000}K`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(31, 41, 55)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: 'rgb(156, 163, 175)' }}
              formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']}
            />
            <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}