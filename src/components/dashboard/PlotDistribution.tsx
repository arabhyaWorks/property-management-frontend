import React from 'react';

interface PlotDistributionProps {
  rentalPlots: number;
  freeholdPlots: number;
  totalPlots: number;
}

export function PlotDistribution({ rentalPlots, freeholdPlots, totalPlots }: PlotDistributionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-6">Plot Distribution</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Rental Plots</span>
          <div className="w-2/3">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${(rentalPlots / totalPlots) * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="font-semibold">{rentalPlots}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Freehold Plots</span>
          <div className="w-2/3">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600"
                style={{ width: `${(freeholdPlots / totalPlots) * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="font-semibold">{freeholdPlots}</span>
        </div>
      </div>
    </div>
  );
}