import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const recentPayments = [
  {
    id: 1,
    status: 'paid',
    amount: 39983.00,
    dueDate: '1 Jan 2024',
    lateFee: null
  },
  {
    id: 2,
    status: 'late',
    amount: 39983.00,
    dueDate: '1 Feb 2024',
    lateFee: 799.00
  },
  {
    id: 3,
    status: 'paid',
    amount: 39983.00,
    dueDate: '1 Mar 2024',
    lateFee: null
  },
  {
    id: 4,
    status: 'paid',
    amount: 39983.00,
    dueDate: '1 Apr 2024',
    lateFee: null
  },
  {
    id: 5,
    status: 'late',
    amount: 39983.00,
    dueDate: '1 May 2024',
    lateFee: 799.00
  }
];

export function RecentPayments() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {recentPayments.map((payment) => (
          <div key={payment.id} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {payment.status === 'paid' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className={cn(
                  "text-sm font-medium",
                  payment.status === 'paid' ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'
                )}>
                  Payment {payment.status}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Due: {payment.dueDate}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ₹{payment.amount.toLocaleString()}
              </p>
              {payment.lateFee && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  +₹{payment.lateFee.toLocaleString()} fee
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}