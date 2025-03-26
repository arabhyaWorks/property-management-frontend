import React from 'react';
import { Calendar, Filter } from 'lucide-react';

export function ReportFilters() {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
        <Calendar className="h-5 w-5 text-gray-500" />
        <select className="border-none bg-transparent focus:ring-0">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last 6 months</option>
          <option>Last year</option>
        </select>
      </div>

      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
        <Filter className="h-5 w-5 text-gray-500" />
        <select className="border-none bg-transparent focus:ring-0">
          <option>All Schemes</option>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Industrial</option>
        </select>
      </div>
    </div>
  );
}