import React from "react";
import {
  Building2,
  IndianRupee,
  Users,
  Clock,
  AlertTriangle,
  Wallet,
  FileCheck,
  Home,
} from "lucide-react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
const schemeDistribution = [
  { name: "Housing", value: 8 },
  { name: "Commercial", value: 4 },
  { name: "Industrial", value: 3 },
];

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useTranslation } from "../hooks/useTranslation";
import { StatsCard } from "../components/dashboard/StatsCard";
import { MonthlyRevenue } from "../components/dashboard/MonthlyRevenue";
import { DefaulterAnalysis } from "../components/analytics/DefaulterAnalysis";
import { SchemePerformance } from "../components/analytics/SchemePerformance";
import DashboardStats from "../components/dashboard/DashboardStats";

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('dashboardOverview')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('welcomeMessage')}
          </p>
        </div>

        {/* Overview Stats */}


        <DashboardStats />
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
          <StatsCard
            title="Total Schemes"
            value="15"
            icon={<Building2 className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Plots"
            value="234"
            icon={<Home className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Pending Payments"
            value="₹45,000"
            icon={<IndianRupee className="h-6 w-6" />}
            trend={{ value: 8, isPositive: false }}
          />
          <StatsCard
            title="Active Rentals"
            value="89"
            icon={<Clock className="h-6 w-6" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="New Schemes"
            value="6"
            icon={<Building2 className="h-6 w-6" />}
          />
          <StatsCard
            title="Old Schemes"
            value="9"
            icon={<Clock className="h-6 w-6" />}
          />
          <StatsCard
            title="Late Payments"
            value="12"
            icon={<AlertTriangle className="h-6 w-6" />}
            trend={{ value: 15, isPositive: false }}
          />
          <StatsCard
            title="Freehold Plots"
            value="145"
            icon={<FileCheck className="h-6 w-6" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Allottees"
            value="350"
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 10, isPositive: true }}
          />
          <StatsCard
            title="Monthly Collections"
            value="₹2.5L"
            icon={<Wallet className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Completed Payments"
            value="78"
            icon={<FileCheck className="h-6 w-6" />}
          />
          <StatsCard
            title="Defaulters"
            value="23"
            icon={<AlertTriangle className="h-6 w-6" />}
            trend={{ value: 5, isPositive: false }}
          />
        </div> */}


        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyRevenue />

          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('schemeDistribution')}
            </h3>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={schemeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {schemeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>


          <DefaulterAnalysis />
          <SchemePerformance />
        </div> */}
      </div>
    </DashboardLayout>
  );
}
