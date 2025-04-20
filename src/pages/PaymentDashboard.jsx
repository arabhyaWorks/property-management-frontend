import React from 'react';
import TransactionHistory from '../components/TransactionHistory/TransactionHistory';
import { DashboardLayout } from '../components/layout/DashboardLayout';

function PaymentDashboard() {
  // return (
  //   <DashboardLayout>
  //     <div className="p-8 bg-gray-50 dark:bg-gray-900">
  //     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  //       <TransactionHistory />
  //     </main>
  //   </div>
  //   <DashboardLayout />
  // );

  return(
    <DashboardLayout>
      <div className="p-8 bg-gray-50 dark:bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TransactionHistory />
        </main>
      </div>
    </DashboardLayout>
  )
}

export default PaymentDashboard;