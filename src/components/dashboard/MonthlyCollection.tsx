import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CollectionData {
  month: string;
  amount: number;
}

interface MonthlyCollectionProps {
  data: CollectionData[];
}

export function MonthlyCollection({ data }: MonthlyCollectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-6">Monthly Collection</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#1e3a8a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}