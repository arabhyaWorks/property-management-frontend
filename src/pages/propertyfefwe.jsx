import React from 'react';
import { DashboardLayout } from "../components/layout/DashboardLayout";
import TableV3 from "../components/tables/TableV3";

export default function Property() {
  return (
    <DashboardLayout>
      <div className="p-8 relative flex-col overflow-hidden">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-600">
            Welcome to BIDA Property Management System
          </p>
        </div>

        <div className="overflow-hidden">
          <TableV3/>
        </div>
      </div>
    </DashboardLayout>
  );
}