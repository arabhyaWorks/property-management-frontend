import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Search,
  Grid,
  List,
  Filter,
  Building2,
  Users,
  Plus,
  Clock,
  Calendar,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTranslation } from "../../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../data/endpoint";
import { AddYojnaModal } from "../../components/schemes/AddYojnaModal";
import { Toaster } from "react-hot-toast";

interface Scheme {
  id: string;
  name: string;
  interestRate: string;
  timePeriod: number;
  installments: {
    count: number;
    frequency: string;
  };
  propertyTypes: string[];
  totalPlots: number;
}

export function SchemesV1() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const token = localStorage.getItem("authToken") || "<auth-token>"; // Replace with your token retrieval logic
        const response = await fetch(`${BASE_URL}/api/yojna`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch schemes");
        }

        const result = await response.json();
        // Assuming the API returns an array of yojna objects directly
        const mappedSchemes = result.data.map((item: any) => ({
          id: item.yojna_id,
          name: item.yojna_name,
          interestRate: item.interest_rate,
          timePeriod: item.time_period,
          installments: {
            count: item.number_of_installments,
            frequency: item.installment_frequency,
          },
          propertyTypes: item.sampatti_sreni_list,
          totalPlots: item.property_count || 0, // Default to 0 if not provided
        }));

        setSchemes(mappedSchemes);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6 md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("schemesDirectory")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("browseSchemes")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Yojna</span>
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder={t("searchSchemes")}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {scheme.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      ID: {scheme.id}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {scheme.interestRate}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Interest Rate
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Plots
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {scheme.totalPlots}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Time Period
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {scheme.timePeriod} Year{scheme.timePeriod > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {scheme.installments.count} {scheme.installments.frequency} installments
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scheme.propertyTypes.map((type, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/yojna/${scheme.id}`)}
                  className="w-full py-2 bg-gray-50 dark:bg-gray-700/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 text-gray-600 dark:text-gray-400 rounded-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {t("viewDetails")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddYojnaModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            const fetchSchemes = async () => {
              try {
                const token = localStorage.getItem("authToken") || "<auth-token>";
                const response = await fetch(`${BASE_URL}/api/yojna`, {
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                  },
                });
                if (!response.ok) throw new Error("Failed to fetch schemes");
                const result = await response.json();
                const mappedSchemes = result.map((item: any) => ({
                  id: item.yojna_id,
                  name: item.yojna_name,
                  interestRate: item.interest_rate,
                  timePeriod: item.time_period,
                  installments: {
                    count: item.number_of_installments,
                    frequency: item.installment_frequency,
                  },
                  propertyTypes: item.sampatti_sreni_list,
                  totalPlots: item.property_count || 0,
                }));
                setSchemes(mappedSchemes);
              } catch (err) {
                console.error("Error refreshing schemes:", err);
              }
            };
            fetchSchemes();
          }}
        />
      )}
    </DashboardLayout>
  );
}