import React from 'react';
import { LogIn, ListFilter, ClipboardCheck, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: <LogIn className="h-12 w-12" />,
    title: "Login to Dashboard",
    description: "Access the system using your administrative credentials"
  },
  {
    icon: <ListFilter className="h-12 w-12" />,
    title: "Select Scheme",
    description: "Choose from various housing and commercial schemes"
  },
  {
    icon: <ClipboardCheck className="h-12 w-12" />,
    title: "Manage Properties",
    description: "Handle property allocations and documentation"
  },
  {
    icon: <CreditCard className="h-12 w-12" />,
    title: "Track Payments",
    description: "Monitor and manage all payment-related activities"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple and efficient process for managing properties and schemes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-[#1e3a8a] bg-blue-50 p-4 rounded-full">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}