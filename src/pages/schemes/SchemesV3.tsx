import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { schemeCategories } from '../../data/schemes';
import { Search, Grid, List, Building2, Users, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SchemesV3() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const allSchemes = schemeCategories.flatMap(category => category.schemes);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BIDA Schemes</h1>
                <p className="text-gray-600 mt-1">Total {allSchemes.length} schemes</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search schemes..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <div className="flex gap-1 border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded",
                      viewMode === 'grid' ? "bg-gray-100" : "hover:bg-gray-50"
                    )}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded",
                      viewMode === 'list' ? "bg-gray-100" : "hover:bg-gray-50"
                    )}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className={cn(
                          "inline-block px-2 py-1 rounded text-xs font-medium mb-2",
                          scheme.type === 'RESIDENTIAL' ? "bg-blue-50 text-blue-700" :
                          scheme.type === 'COMMERCIAL' ? "bg-green-50 text-green-700" :
                          scheme.type === 'INDUSTRIAL' ? "bg-orange-50 text-orange-700" :
                          "bg-purple-50 text-purple-700"
                        )}>
                          {scheme.type}
                        </span>
                        <h3 className="text-lg font-semibold">{scheme.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{scheme.nameHindi}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Total Plots</p>
                          <p className="font-semibold">{scheme.totalPlots}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Occupied</p>
                          <p className="font-semibold">{scheme.occupiedPlots}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t px-6 py-4">
                    <button className="flex items-center text-blue-600 hover:text-blue-700">
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheme Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Plots
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Occupied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allSchemes.map((scheme) => (
                    <tr key={scheme.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{scheme.name}</div>
                          <div className="text-sm text-gray-500">{scheme.nameHindi}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-block px-2 py-1 rounded text-xs font-medium",
                          scheme.type === 'RESIDENTIAL' ? "bg-blue-50 text-blue-700" :
                          scheme.type === 'COMMERCIAL' ? "bg-green-50 text-green-700" :
                          scheme.type === 'INDUSTRIAL' ? "bg-orange-50 text-orange-700" :
                          "bg-purple-50 text-purple-700"
                        )}>
                          {scheme.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {scheme.totalPlots}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {scheme.occupiedPlots}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-block px-2 py-1 rounded text-xs font-medium",
                          scheme.status === 'ACTIVE' ? "bg-green-50 text-green-700" :
                          scheme.status === 'UPCOMING' ? "bg-blue-50 text-blue-700" :
                          "bg-gray-50 text-gray-700"
                        )}>
                          {scheme.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-700">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}