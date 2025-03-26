import React from 'react';
import { Building2, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Scheme } from '../../types/scheme';
import { cn } from '../../utils/cn';

interface SchemeCardProps {
  scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const statusColors = {
    ACTIVE: 'bg-green-50 text-green-700 border border-green-200',
    UPCOMING: 'bg-blue-50 text-blue-700 border border-blue-200',
    COMPLETED: 'bg-gray-50 text-gray-700 border border-gray-200'
  };

  return (
    <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{scheme.name}</h3>
          <p className="text-gray-600 mt-1">{scheme.nameHindi}</p>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          statusColors[scheme.status]
        )}>
          {scheme.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="flex items-start space-x-3">
          <Building2 className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Total Plots</p>
            <p className="text-xl font-semibold text-gray-900">{scheme.totalPlots}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Occupied</p>
            <p className="text-xl font-semibold text-gray-900">{scheme.occupiedPlots}</p>
          </div>
        </div>
      </div>

      <Link 
        to={`/schemes/${scheme.id}`}
        className="flex items-center justify-center space-x-2 w-full bg-blue-50 text-blue-600 py-3 rounded-lg hover:bg-blue-100 transition-colors group"
      >
        <span>View Details</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}