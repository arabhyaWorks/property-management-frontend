import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", amount: 450000 },
  { month: "Feb", amount: 520000 },
  { month: "Mar", amount: 480000 },
  { month: "Apr", amount: 600000 },
  { month: "May", amount: 550000 },
  { month: "Jun", amount: 680000 },
];

export function MonthlyRevenue() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Monthly Revenue
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
              tick={{ fill: "currentColor", opacity: 0.5 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", opacity: 0.5 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Bar dataKey="amount" fill="#1e40af" radius={[4, 4, 0, 0]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(31, 41, 55)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "8px 12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "rgb(209, 213, 219)" }}
              formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                "Amount",
              ]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}