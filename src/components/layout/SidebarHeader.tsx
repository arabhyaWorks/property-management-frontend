import React from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-blue-700">
      <div className={cn(
        "flex items-center",
        isCollapsed ? "justify-center" : "space-x-3"
      )}>
        <div className="p-2 bg-white/10 rounded-lg">
          <Building2 className="h-6 w-6" />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="font-bold text-lg">BIDA Admin</h1>
            <p className="text-sm text-blue-200">Property Management</p>
          </div>
        )}
      </div>
    </div>
  );
}