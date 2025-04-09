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
  Download,
} from "lucide-react";
import { getProperties, getYojnas } from "../../services/api";
import { dataLabels, dataKeys, formattedFields } from "../../data/dataLables";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

interface Yojna {
  yojna_id: string;
  yojna_name: string;
  sampatti_sreni_list: string[];
}

export const PropertyTable = ({ yojna_id }: { yojna_id: string }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [yojnas, setYojnas] = useState<Yojna[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    dataKeys.getResponse
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<string>("property_id");
  const [selectedYojna, setSelectedYojna] = useState<string>(yojna_id);
  const [selectedSampattiSreni, setSelectedSampattiSreni] =
    useState<string>("");

  const searchFields = [
    { value: "property_id", label: "Property ID" },
    { value: "mobile_no", label: "Mobile Number" },
    { value: "avanti_ka_naam", label: "Owner Name" },
    { value: "avanti_sampatti_sankhya", label: "Property Number" },
    { value: "property_floor_type", label: "Floor Type" },
  ];

  const exportToExcel = async () => {
    try {
      setLoading(true);
      const params: any = {
        transfer_type: "none",
        page: 1,
        limit: 1000, // Set limit to 1000 for export
      };

      if (searchQuery) {
        params[searchField] = searchQuery;
      }

      if (selectedYojna) {
        params.yojna_id = selectedYojna;
      }

      if (selectedSampattiSreni) {
        params.sampatti_sreni = selectedSampattiSreni;
      }

      const response = await getProperties(params);
      const exportData = response.data.map((item: any) => {
        const row: any = {};
        visibleColumns.forEach((field) => {
          const label =
            dataLabels.getResponse.find((l) => l.key === field)?.label || field;
          row[label] = formattedFields.includes(field)
            ? formatValue(item[field])
            : item[field];
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

      // Auto-size columns
      const colWidths = visibleColumns.map((field) => {
        const label =
          dataLabels.getResponse.find((l) => l.key === field)?.label || field;
        const maxLength = Math.max(
          label.length,
          ...exportData.map((row) => String(row[label] || "").length)
        );
        return { wch: Math.min(maxLength + 2, 50) }; // Add padding, max width 50
      });
      worksheet["!cols"] = colWidths;

      XLSX.writeFile(
        workbook,
        `properties_export_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Error exporting data");
      setLoading(false);
    }
  };

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
    setSelectedSampattiSreni("");
  }, [selectedYojna]);

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedYojna, selectedSampattiSreni, yojna_id]);

  const fetchYojnas = async () => {
    try {
      const response = await getYojnas();
      console.log(response);
      setYojnas(response.data);
    } catch (err) {
      console.error("Error fetching yojnas:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {
        transfer_type: "none",
        page: currentPage,
        limit: 10,
      };

      if (searchQuery) {
        params[searchField] = searchQuery;
      }

      if (selectedYojna) {
        params.yojna_id = selectedYojna;
      }

      if (selectedSampattiSreni) {
        params.sampatti_sreni = selectedSampattiSreni;
      }

      const response = await getProperties(params);
      console.log(response.data);
      setData(response.data);
      setTotalPages(response.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Error fetching data");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchData();
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string" && value.trim() === "") return "-";
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
    return <ChevronDown className="w-4 h-4 opacity-30" />;
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
        <div className="max-w-7xl mx-auto p-3">
          <div className="space-y-6 sm:space-y-0 sm:flex sm:items-start sm:gap-6">
            <div className="flex w-full gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Columns className="h-5 w-5" />
                  <span>Columns</span>
                </button>

                {showColumnSelector && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                      onClick={() => setShowColumnSelector(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-50">
                      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Customize Columns
                        </h3>
                        <button
                          onClick={() => setShowColumnSelector(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="p-6 bg-gray-50/50">
                        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-2">
                          {dataLabels.getResponse.map(({ key, label }) => (
                            <label
                              key={key}
                              className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={visibleColumns.includes(key)}
                                onChange={() => toggleColumn(key)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600"
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

              <div className="w-full flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search by ${
                      searchFields.find((f) => f.value === searchField)?.label
                    }...`}
                    className=" p-4 w-full py-2.5 text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg"
                    // className="pl-11 pr-4 "
                  />
                  {/* <Search className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" /> */}
                </div>
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Search className="h-5 w-5" />
                  {/* Search */}
                </button>
              </div>

              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="min-w-[140px] px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg"
              >
                {searchFields.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>

              <div className="relative">
                <select
                  value={selectedYojna}
                  onChange={(e) => setSelectedYojna(e.target.value)}
                  className="min-w-[160px] pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg"
                >
                  <option value="">All Yojnas</option>
                  {yojnas.map((yojna) => (
                    <option key={yojna.yojna_id} value={yojna.yojna_id}>
                      {yojna.yojna_name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>

              {selectedYojna && (
                <div className="relative">
                  <select
                    value={selectedSampattiSreni}
                    onChange={(e) => setSelectedSampattiSreni(e.target.value)}
                    className="min-w-[160px] pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg"
                  >
                    <option value="">All Sampatti Sreni</option>
                    {yojnas
                      .find((y) => y.yojna_id === selectedYojna)
                      ?.sampatti_sreni_list.map((sreni) => (
                        <option key={sreni} value={sreni}>
                          {sreni}
                        </option>
                      ))}
                  </select>
                  <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              )}

              <button
                onClick={exportToExcel}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700"
              >
                <Download className="h-5 w-5" />
                <span>Export</span>
              </button>
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
                  dataLabels.getResponse.find((l) => l.key === field)?.label ||
                  field;
                return (
                  <th
                    key={field}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                      <SortIcon field={field} />
                    </div>
                  </th>
                );
              })}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr
                key={item.property_id}
                className="hover:bg-gray-50 transition-colors"
              >
                {visibleColumns.map((field) => (
                  <td
                    key={field}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {formattedFields.includes(field)
                      ? formatValue(item[field])
                      : item[field]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <button
                    onClick={() => {
                      navigate(`/property/${item.property_id}`);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
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
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
