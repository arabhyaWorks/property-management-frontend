import React from 'react';
import { Clock, Phone, MapPin } from 'lucide-react';

export function TopBar() {
  return (
    <div className="bg-gray-100 py-2 text-sm border-b">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="text-gray-600">
          26/12/2024, 11:11:19
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-[#1e3a8a]" />
            <span>+91 542 236 7568</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-[#1e3a8a]" />
            <span>Mon-Sat: 9:00-17:00</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-[#1e3a8a]" />
            <span>Bhadohi, UP 221401</span>
          </div>
        </div>
      </div>
    </div>
  );
}