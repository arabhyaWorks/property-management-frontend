import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Column, SortConfig } from '../hooks/useTableState';
import { PropertyRecord } from '../../../types';

interface TableHeaderProps {
  columns: Column[];
  sortConfig: SortConfig;
  onSort: (key: keyof PropertyRecord) => void;
}

export default function TableHeader({ columns, sortConfig, onSort }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50 sticky top-0 z-20">
      <tr className="divide-x divide-gray-200">
        {columns.filter(col => col.visible).map((column, index) => (
          <th
            key={column.key}
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 cursor-pointer hover:bg-gray-100 ${
              index === 0 ? 'sticky left-0 z-20' : ''
            }`}
            onClick={() => column.sortable && onSort(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              {column.sortable && (
                <div className="flex flex-col ml-1">
                  <ChevronUp 
                    className={`h-3 w-3 ${
                      sortConfig.key === column.key && sortConfig.direction === 'asc'
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <ChevronDown 
                    className={`h-3 w-3 ${
                      sortConfig.key === column.key && sortConfig.direction === 'desc'
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                    }`}
                  />
                </div>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}