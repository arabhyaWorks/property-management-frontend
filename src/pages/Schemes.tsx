import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { SchemeCategory } from '../components/schemes/SchemeCategory';
import { schemeCategories } from '../data/schemes';
import { Search } from 'lucide-react';

export function Schemes() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Schemes</h1>
            <p className="text-gray-600 mt-1">View and manage all BIDA development schemes</p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search schemes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
            />
          </div>
        </div>

        <div className="space-y-12">
          {schemeCategories.map((category, index) => (
            <SchemeCategory key={index} category={category} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}