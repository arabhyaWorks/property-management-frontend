import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PaymentStats } from '../components/payments/PaymentStats';
import { LatePaymentsTable } from '../components/payments/LatePaymentsTable';
import { RecentPayments } from '../components/payments/RecentPayments';
import { MonthlyPaymentChart } from '../components/payments/MonthlyPaymentChart';

export function PaymentDetails() {
  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Details</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of all payment activities and statistics
          </p>
        </div>

        <PaymentStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MonthlyPaymentChart />
          <RecentPayments />
        </div>

        <LatePaymentsTable />
      </div>
    </DashboardLayout>
  );
}