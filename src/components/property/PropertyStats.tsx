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

export  function PropertyStats({
  registrationAmount,
  freeholdAmount,
  leaseRent,
  serviceCharge,
  parkCharge,
  cornerCharge
}: PropertyStatsProps) {
  const stats = [
    {
      label: 'Registration Amount',
      value: registrationAmount,
      icon: IndianRupee,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      label: 'Freehold Amount',
      value: freeholdAmount,
      icon: Building2,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      label: 'Lease Rent',
      value: leaseRent,
      icon: Wallet,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600'
    },
    {
      label: 'Service Charge',
      value: serviceCharge,
      icon: CreditCard,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    // {
    //   label: 'Park Charge',
    //   value: parkCharge,
    //   icon: ParkingCircle,
    //   color: 'bg-indigo-500',
    //   hoverColor: 'hover:bg-indigo-600'
    // },
    // {
    //   label: 'Corner Charge',
    //   value: cornerCharge,
    //   icon: CornerUpRight,
    //   color: 'bg-teal-500',
    //   hoverColor: 'hover:bg-teal-600'
    // }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className={`${stat.color} h-2 w-full`}></div>
          <div className="p-5">
            <div className="flex items-center mb-3">
              <div className={`${stat.color} ${stat.hoverColor} p-3 rounded-lg transition-colors duration-300`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</h3>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}