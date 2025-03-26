import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface TableControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleColumns: () => void;
  onToggleFilters: () => void;
}

export default function TableControls({
  searchTerm,
  onSearchChange,
  onToggleColumns,
  onToggleFilters
}: TableControlsProps) {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between bg-white">
      <div className="flex items-center space-x-2 flex-grow">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button 
          className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          onClick={onToggleColumns}
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span>Columns</span>
        </button>
        <button 
          className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          onClick={onToggleFilters}
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}