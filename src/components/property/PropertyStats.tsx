import React from 'react';
import { IndianRupee, Building2, Wallet, CreditCard, ParkingCircle, CornerUpRight } from 'lucide-react';

interface PropertyStatsProps {
  registrationAmount: number;
  freeholdAmount: number;
  leaseRent: number;
  serviceCharge: number;
  parkCharge: number;
  cornerCharge: number;
}

export function PropertyStats({
  registrationAmount,
  freeholdAmount,
  leaseRent,
  serviceCharge,
  parkCharge,
  cornerCharge
}: PropertyStatsProps) {
  const stats = [
    {
      label: 'Total Registration Amount',
      value: `₹${registrationAmount.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Freehold Amount',
      value: `₹${freeholdAmount.toLocaleString()}`,
      icon: Building2,
      color: 'bg-green-500'
    },
    {
      label: 'Total Lease Rent',
      value: `₹${leaseRent.toLocaleString()}`,
      icon: Wallet,
      color: 'bg-yellow-500'
    },
    {
      label: 'Total Service Charge',
      value: `₹${serviceCharge.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-purple-500'
    },
    {
      label: 'Total Park Charge',
      value: `₹${parkCharge.toLocaleString()}`,
      icon: ParkingCircle,
      color: 'bg-indigo-500'
    },
    {
      label: 'Total Corner Charge',
      value: `₹${cornerCharge.toLocaleString()}`,
      icon: CornerUpRight,
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3"
        >
          <div className="flex items-center space-x-3">
            <div className={`${stat.color} p-2 rounded-lg`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}