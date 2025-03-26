import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Columns,
  X,
  Eye,
} from "lucide-react";
import { getProperties, getYojnas } from "../../services/api";
import dataLabels from "../../data/dataLables";
import { dataKeys } from "../../data/dataLables";

interface Yojna {
  yojna_id: string;
  yojna_name: string;
}

export const PropertyTable = ({ yojna_id }) => {
  const [data, setData] = useState<any[]>([]);
  const [yojnas, setYojnas] = useState<Yojna[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(dataKeys);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<
    "property_unique_id" | "avanti_ka_naam"
  >("property_unique_id");
  const [selectedYojna, setSelectedYojna] = useState<string>(yojna_id);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const toggleColumn = (key: string) => {
    setVisibleColumns((current) => {
      if (current.includes(key)) {
        if (current.length === 1) return current;
        return current.filter((k) => k !== key);
      }
      return [...current, key];
    });
  };

  useEffect(() => {
    fetchYojnas();
  }, []);

  useEffect(() => {
    fetchData();
  }, [
    currentPage,
    sortConfig,
    searchQuery,
    searchField,
    selectedYojna,
    yojna_id,
  ]);

  const fetchYojnas = async () => {
    try {
      const response = await getYojnas();
      setYojnas(response);
    } catch (err) {
      console.error("Error fetching yojnas:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (searchQuery) {
        params[searchField] = searchQuery;
      }

      if (selectedYojna) {
        params.yojna_id = selectedYojna;
      }

      const response = await getProperties(params);
      setData(response.data);
      setTotalPages(response.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching data");
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (
      value instanceof Date ||
      (typeof value === "string" && value.includes("T"))
    ) {
      const date = new Date(value);
      const istDate = new Date(
        date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const day = String(istDate.getDate()).padStart(2, "0");
      const month = String(istDate.getMonth() + 1).padStart(2, "0");
      const year = istDate.getFullYear();
      return `${day}-${month}-${year}`;
    }
    if (
      typeof value === "number" ||
      (typeof value === "string" && !isNaN(Number(value)))
    ) {
      const num = Number(value);
      return num
        .toLocaleString("en-IN", {
          maximumFractionDigits: 2,
          style: "currency",
          currency: "INR",
        })
        .replace("INR", "₹");
    }
    return String(value);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (!sortConfig || sortConfig.key !== field) {
      return <ChevronDown className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto p-6">
          <div className="space-y-6 sm:space-y-0 sm:flex sm:items-start sm:gap-6">
            {/* Search and Columns Section */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <Columns className="h-5 w-5" />
                  <span>Columns</span>
                </button>

                {/* Column Selector Modal */}
                {showColumnSelector && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                      onClick={() => setShowColumnSelector(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-50 ring-1 ring-black/5">
                      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Customize Columns
                        </h3>
                        <button
                          onClick={() => setShowColumnSelector(false)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="p-6 bg-gray-50/50">
                        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-2">
                          {dataLabels.property.map(({ key, label }) => (
                            <label
                              key={key}
                              className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={visibleColumns.includes(key)}
                                onChange={() => toggleColumn(key)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              />
                              <span className="text-sm text-gray-700 font-medium">
                                {label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchField === "property_unique_id"
                      ? "Search by Property ID..."
                      : "Search by Owner Name..."
                  }
                  className="w-full pl-11 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <Search className="absolute left-3.5 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Filters Section */}
            <div className="flex items-center gap-3">
              <select
                value={searchField}
                onChange={(e) =>
                  setSearchField(
                    e.target.value as "property_unique_id" | "avanti_ka_naam"
                  )
                }
                className="min-w-[140px] px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                <option value="property_unique_id">Property ID</option>
                <option value="avanti_ka_naam">Owner Name</option>
              </select>

              <div className="relative">
                <select
                  value={selectedYojna}
                  onChange={(e) => setSelectedYojna(e.target.value)}
                  className="min-w-[160px] pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <option value="">All Yojnas</option>
                  {yojnas.map((yojna) => (
                    <option key={yojna.yojna_id} value={yojna.yojna_id}>
                      {yojna.yojna_name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.map((field) => {
                const label =
                  dataLabels.property.find((l) => l.key === field)?.label ||
                  field;
                return (
                  <th
                    key={field}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(field)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                      <SortIcon field={field} />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr
                key={item.propertyRecord.property_unique_id}
                className="hover:bg-gray-50 transition-colors"
              >
                {visibleColumns.map((field) => (
                  <td
                    key={field}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {field === "property_unique_id" || field === "yojna_id"
                      ? item.propertyRecord[field]
                      : formatValue(item.propertyRecord[field])}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <button
                    onClick={() => setSelectedProperty(item)}
                    className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4 mr-1.5" />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {selectedProperty && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setSelectedProperty(null)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl z-50">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Property Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {selectedProperty.propertyRecord.property_unique_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    General Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          आवंटी का नाम
                        </h5>
                        <p className="text-base text-gray-700">
                          {selectedProperty.propertyRecord.avanti_ka_naam}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          पिता/पति का नाम
                        </h5>
                        <p className="text-base text-gray-700">
                          {selectedProperty.propertyRecord.pita_pati_ka_naam}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          मोबाइल नंबर
                        </h5>
                        <p className="text-base text-gray-700">
                          {selectedProperty.propertyRecord.mobile_no}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          स्थायी पता
                        </h5>
                        <p className="text-base text-gray-700">
                          {
                            selectedProperty.propertyRecord
                              .avanti_ka_sthayi_pata
                          }
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          वर्तमान पता
                        </h5>
                        <p className="text-base text-gray-700">
                          {
                            selectedProperty.propertyRecord
                              .avanti_ka_vartaman_pata
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Property Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">
                      संपत्ति श्रेणी
                    </h5>
                    <p className="text-base font-medium text-gray-900">
                      {selectedProperty.propertyRecord.sampatti_sreni}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">
                      संपत्ति संख्या
                    </h5>
                    <p className="text-base font-medium text-gray-900">
                      {selectedProperty.propertyRecord.avanti_sampatti_sankhya}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">
                      Floor Type
                    </h5>
                    <p className="text-base font-medium text-gray-900">
                      {selectedProperty.propertyRecord.property_floor_type}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Financial Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">
                        पंजीकरण धनराशि
                      </h5>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatValue(
                          selectedProperty.propertyRecord.panjikaran_dhanrashi
                        )}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatValue(
                          selectedProperty.propertyRecord.panjikaran_dinank
                        )}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">
                        आवंटन धनराशि
                      </h5>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatValue(
                          selectedProperty.propertyRecord.avantan_dhanrashi
                        )}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatValue(
                          selectedProperty.propertyRecord.avantan_dinank
                        )}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">
                        विक्रय मूल्य
                      </h5>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatValue(
                          selectedProperty.propertyRecord.vikray_mulya
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Installment Plan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">
                        अवशेष धनराशि
                      </h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatValue(
                          selectedProperty.installmentPlan.avshesh_dhanrashi
                        )}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">
                        ब्याज दर
                      </h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedProperty.installmentPlan.interest_rate}%
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">
                        किश्तों की संख्या
                      </h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {
                          selectedProperty.installmentPlan
                            .ideal_number_of_installments
                        }
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">
                        अगली किश्त की तिथि
                      </h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatValue(
                          selectedProperty.installmentPlan.next_due_date
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Installment Payments
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            No.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            मूल
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ब्याज
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedProperty.installments.map(
                          (installment: any) => (
                            <tr
                              key={installment.payment_number}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {installment.payment_number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatValue(installment.payment_amount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatValue(installment.kisht_mool_paid)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatValue(installment.kisht_byaj_paid)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatValue(installment.payment_due_date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatValue(installment.payment_date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    installment.number_of_days_delayed > 0
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {installment.number_of_days_delayed > 0
                                    ? `${installment.number_of_days_delayed} days late`
                                    : "On time"}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Service Charges
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Financial Year
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Late Fee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedProperty.serviceCharges.map(
                          (charge: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {charge.service_charge_financial_year}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatValue(charge.service_charge_amount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatValue(charge.service_charge_late_fee)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatValue(
                                  charge.service_charge_payment_date
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
