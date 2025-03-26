import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', target: 1250000, collected: 1150000 },
  { month: 'Feb', target: 1250000, collected: 980000 },
  { month: 'Mar', target: 1250000, collected: 1250000 },
  { month: 'Apr', target: 1250000, collected: 1100000 },
  { month: 'May', target: 1250000, collected: 950000 },
  { month: 'Jun', target: 1250000, collected: 820000 },
];

export function MonthlyPaymentChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        Monthly Collection Target vs Actual
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              opacity={0.1}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', opacity: 0.5 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', opacity: 0.5 }}
              tickFormatter={(value) => `₹${value/100000}L`}
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
              formatter={(value: number) => [`₹${(value/100000).toFixed(1)}L`]}
            />
            <Bar dataKey="target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="collected" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}