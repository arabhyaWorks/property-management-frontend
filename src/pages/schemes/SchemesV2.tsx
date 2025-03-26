import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { schemeCategories } from '../../data/schemes';
import { Search, Building2, Users, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SchemesV2() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Development Schemes</h1>
            <p className="text-gray-600 mt-2">Explore and manage BIDA's development initiatives</p>
          </div>
          
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by scheme name or type..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {schemeCategories.map((category, index) => (
          <div key={index} className="mb-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{category.title}</h2>
                <p className="text-gray-600 mt-1">{category.titleHindi}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {category.schemes.map((scheme) => (
                <div 
                  key={scheme.id}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                          {scheme.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{scheme.nameHindi}</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        scheme.status === 'ACTIVE' ? "bg-green-50 text-green-700" :
                        scheme.status === 'UPCOMING' ? "bg-blue-50 text-blue-700" :
                        "bg-gray-50 text-gray-700"
                      )}>
                        {scheme.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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

                  <div className="px-6 py-4 bg-gray-50 group-hover:bg-blue-50 transition-colors">
                    <button className="flex items-center justify-center gap-2 w-full text-gray-600 group-hover:text-blue-600 transition-colors">
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}