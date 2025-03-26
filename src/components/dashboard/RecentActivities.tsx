import React from 'react';
import { Clock } from 'lucide-react';

interface Activity {
  id: number;
  description: string;
  timeAgo: string;
}

const activities: Activity[] = [
  { id: 1, description: "New plot allotment in Jamunipur Scheme", timeAgo: "2 hours ago" },
  { id: 2, description: "Payment received for Rajpura Phase-2", timeAgo: "3 hours ago" },
  { id: 3, description: "Document verification completed for Hariyanv", timeAgo: "5 hours ago" },
  { id: 4, description: "New application submitted for Bida Mart", timeAgo: "6 hours ago" },
];

export function RecentActivities() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
      <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{activity.description}</p>
              <p className="text-sm text-gray-600">{activity.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}