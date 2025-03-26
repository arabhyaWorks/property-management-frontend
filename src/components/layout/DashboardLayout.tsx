import React from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 ml-64 transition-all duration-300 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}