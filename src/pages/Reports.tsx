import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { BarChart, LineChart, PieChart } from '../components/reports/Charts';
import { ReportFilters } from '../components/reports/ReportFilters';
import { ReportMetrics } from '../components/reports/ReportMetrics';

export function Reports() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">View detailed reports and analytics</p>
        </div>

        <ReportFilters />
        <ReportMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart />
          <LineChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PieChart title="Property Distribution" />
          <PieChart title="Payment Status" />
          <PieChart title="Scheme Types" />
        </div>
      </div>
    </DashboardLayout>
  );
}