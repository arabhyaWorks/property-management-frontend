import React from 'react';
import { IndianRupee, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const stats = [
  {
    title: "This Month's Collection",
    value: "₹8.2L",
    subStats: [
      { label: "Target", value: "₹12.5L" },
      { label: "Collected", value: "₹8.2L" }
    ],
    icon: IndianRupee,
    color: "bg-blue-500"
  },
  {
    title: "Late Payments",
    value: "23",
    subStats: [
      { label: "Amount", value: "₹16.3L" },
      { label: "Properties", value: "23" }
    ],
    icon: AlertTriangle,
    color: "bg-red-500"
  },
  {
    title: "Collection Rate",
    value: "85%",
    subStats: [
      { label: "On Time", value: "85%" },
      { label: "Delayed", value: "15%" }
    ],
    icon: Clock,
    color: "bg-green-500"
  },
  {
    title: "Completed Payments",
    value: "156",
    subStats: [
      { label: "This Month", value: "156" },
      { label: "Last Month", value: "142" }
    ],
    icon: CheckCircle,
    color: "bg-purple-500"
  }
];

export function PaymentStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
            <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">{stat.title}</h3>
            <div className="space-y-2">
              {stat.subStats.map((subStat, subIndex) => (
                <div key={subIndex} className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{subStat.label}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{subStat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}