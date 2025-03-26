import React from 'react';
import { Column } from '../hooks/useTableState';
// import { PropertyRecord } from '../../../types';

// interface ColumnSelectorProps {
//   columns: Column[];
//   onToggleColumn: (key: keyof PropertyRecord) => void;
//   show: boolean;
// }

export default function ColumnSelector({ columns, onToggleColumn, show }) {
  if (!show) return null;

  return (
    <div className="absolute right-4 mt-2 w-64 bg-white rounded-lg shadow-lg z-30 border border-gray-200">
      <div className="p-2">
        <div className="text-sm font-medium text-gray-900 p-3 border-b">
          Toggle Columns
        </div>
        <div className="mt-2 space-y-2">
          {columns.map(column => (
            <label key={column.key} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={column.visible}
                onChange={() => onToggleColumn(column.key)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
              />
              <span className="ml-2 text-sm text-gray-700">{column.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}