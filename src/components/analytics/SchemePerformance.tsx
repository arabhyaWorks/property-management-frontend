import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Building2, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const schemeData = [
  { name: 'Jamunipur', value: 85, color: '#3b82f6' },
  { name: 'Rajpura', value: 92, color: '#10b981' },
  { name: 'Hariyanv', value: 78, color: '#f59e0b' },
  { name: 'Bida Mart', value: 88, color: '#8b5cf6' },
];

const metrics = [
  {
    title: 'Best Performing',
    value: 'Rajpura',
    subValue: '92% Efficiency',
    icon: TrendingUp,
    color: 'text-green-600',
  },
  {
    title: 'Most Occupied',
    value: 'Jamunipur',
    subValue: '95% Occupied',
    icon: Building2,
    color: 'text-blue-600',
  },
  {
    title: 'Highest Collection',
    value: 'Bida Mart',
    subValue: '₹2.8Cr Revenue',
    icon: Users,
    color: 'text-purple-600',
  },
];

export function SchemePerformance() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        {t('schemePerformance')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-opacity-20 dark:bg-opacity-10 ${metric.color.replace('text', 'bg')}`}>
                <metric.icon className={`h-5 w-5 ${metric.color} dark:text-gray-300`} />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.title}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.subValue}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={schemeData}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name} (${value}%)`}
            >
              {schemeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(31, 41, 55)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: 'rgb(156, 163, 175)' }}
              formatter={(value: any) => [`${value}%`, 'Efficiency']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}