import React from 'react';

interface SchemeCategoriesProps {
  newSchemes: number;
  oldSchemes: number;
}

export function SchemeCategories({ newSchemes, oldSchemes }: SchemeCategoriesProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Scheme Categories</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">New Schemes</span>
          <span className="font-semibold">{newSchemes}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Old Schemes</span>
          <span className="font-semibold">{oldSchemes}</span>
        </div>
      </div>
    </div>
  );
}