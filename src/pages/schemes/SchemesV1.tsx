import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Search, Grid, List, Filter, Building2, Users } from "lucide-react";
import { cn } from "../../utils/cn";
import { useTranslation } from "../../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../data/endpoint";

export function SchemesV1() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [schemes, setSchemes] = useState([]); // State to hold API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { t } = useTranslation();

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch(BASE_URL+"/api/yojnas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch schemes");
        }
        const result = await response.json();
        // Map API data to match the expected structure
        const mappedSchemes = result.data.map((item) => ({
          id: item.yojna_id,
          name: item.yojna_name,
          nameHindi: item.yojna_name, // Assuming no Hindi name in API, adjust if available
          type: "COMMERCIAL", // API doesn't provide type, set a default or extend API
          totalPlots: item.property_count,
          occupiedPlots: 0, // API doesn't provide this, adjust if available
          status: "ACTIVE", // API doesn't provide this, adjust if available
        }));
        setSchemes(mappedSchemes);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const filteredSchemes =
    activeFilter === "all"
      ? schemes
      : schemes.filter(
          (scheme) => scheme.type.toLowerCase() === activeFilter.toLowerCase()
        );

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

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder={t("searchSchemes")}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <Filter className="h-5 w-5" />
              <span>{t("filter")}</span>
            </button>
            <div className="flex gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded",
                  viewMode === "grid"
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                <Grid className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded",
                  viewMode === "list"
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                <List className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {viewMode === "grid" ? (
            <div>
              {/* <div className="flex gap-4 mb-8 overflow-x-auto">
                {[
                  { id: "all", label: t("all") },
                  { id: "residential", label: t("residential") },
                  { id: "commercial", label: t("commercial") },
                  { id: "industrial", label: t("industrial") },
                  { id: "mixed", label: t("mixed") },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg whitespace-nowrap",
                      activeFilter === tab.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div> */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSchemes.map((scheme) => (
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
                          {scheme.nameHindi}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          scheme.type === "RESIDENTIAL"
                            ? "bg-blue-50 text-blue-700"
                            : scheme.type === "COMMERCIAL"
                            ? "bg-green-50 text-green-700"
                            : scheme.type === "INDUSTRIAL"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-purple-50 text-purple-700"
                        )}
                      >
                        {scheme.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("totalPlots")}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {scheme.totalPlots}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("occupied")}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {scheme.occupiedPlots}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate(`/yojna/${scheme.id}`);
                        console.log(scheme.id);
                      }}
                      className="w-full py-2 bg-gray-50 dark:bg-gray-700/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 text-gray-600 dark:text-gray-400 rounded-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      {t("viewDetails")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Scheme Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Plots
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Occupied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSchemes.map((scheme) => (
                    <tr
                      key={scheme.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {scheme.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {scheme.nameHindi}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-block px-2 py-1 rounded text-xs font-medium",
                            scheme.type === "RESIDENTIAL"
                              ? "bg-blue-50 text-blue-700"
                              : scheme.type === "COMMERCIAL"
                              ? "bg-green-50 text-green-700"
                              : scheme.type === "INDUSTRIAL"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-purple-50 text-purple-700"
                          )}
                        >
                          {scheme.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {scheme.totalPlots}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {scheme.occupiedPlots}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-block px-2 py-1 rounded text-xs font-medium",
                            scheme.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : scheme.status === "UPCOMING"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-50 text-gray-700"
                          )}
                        >
                          {scheme.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            navigate(`/yojna/${scheme.id}`);
                            // console.log(scheme.id);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
