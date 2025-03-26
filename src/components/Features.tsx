import React from 'react';
import { Building2, FileText, Users, Clock, MapPin, Banknote } from 'lucide-react';

const features = [
  {
    icon: <Building2 className="h-8 w-8" />,
    title: "Property Management",
    description: "Efficiently manage multiple housing and commercial schemes"
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Digital Documentation",
    description: "Streamlined digital documentation and record keeping"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "User Management",
    description: "Track allottees and their property details easily"
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Payment Tracking",
    description: "Monitor EMIs, rentals, and pending payments"
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Scheme Mapping",
    description: "Detailed mapping of all property schemes"
  },
  {
    icon: <Banknote className="h-8 w-8" />,
    title: "Financial Overview",
    description: "Comprehensive financial tracking and reporting"
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Property Management Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our system provides all the tools needed for efficient property management,
            from scheme tracking to payment monitoring.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-[#1e3a8a] mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}