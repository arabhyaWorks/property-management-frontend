import React from 'react';
import { Building2, Users, IndianRupee } from 'lucide-react';
import type { Scheme } from '../types';

interface SchemeListProps {
  schemes: Scheme[];
}

export function SchemeList({ schemes }: SchemeListProps) {
  return (
    <div className="grid gap-6">
      {schemes.map((scheme) => (
        <div
          key={scheme.id}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{scheme.name}</h3>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`text-sm px-2 py-1 rounded-full ${
                  scheme.type === 'HOUSING' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {scheme.type}
                </span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  scheme.category === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {scheme.category}
                </span>
                <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {scheme.paymentType}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Pending Payment</p>
              <p className="text-lg font-semibold text-red-600">₹{scheme.pendingPayment.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Plots</p>
                <p className="font-semibold">{scheme.totalPlots}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Allotted</p>
                <p className="font-semibold">{scheme.allottedPlots}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <IndianRupee className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="font-semibold">{scheme.totalPlots - scheme.allottedPlots}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}