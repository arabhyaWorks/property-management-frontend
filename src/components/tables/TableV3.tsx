import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useTableState } from "./hooks/useTableState";
import TableHeader from "./components/TableHeader";
import TableControls from "./components/TableControls";
import ColumnSelector from "./components/ColumnSelector";
import { getProperties, getYojnas } from "../../services/api";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Share2,
  Database,
  Building2,
  Home,
  CheckSquare,
  Search,
  SlidersHorizontal,
  Filter,
} from "lucide-react";
import { PropertyDetailsModal } from "../PropertyDetailsModal";
import classNames from "classnames";
import EditPropertyForm from "../EditPropertyDetailsModal";

export default function TableV3() {
  const [data, setData] = useState<any[]>([]);
  const [yojnas, setYojnas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedYojna, setSelectedYojna] = useState("all");
  const [totalPages, setTotalPages] = useState(1);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    showColumnSelector,
    setShowColumnSelector,
    showFilters,
    setShowFilters,
    columns,
    sortConfig,
    toggleColumnVisibility,
    handleSort,
  } = useTableState();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchId) params.id = searchId;
      if (searchName) params.avanti_ka_naam = searchName;
      if (selectedYojna !== "all") params.yojna_id = selectedYojna;

      const response = await getProperties(params);
      console.log("Response")
      console.log(response.data)
      setData(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchId, searchName, selectedYojna]);

  const fetchYojnas = useCallback(async () => {
    try {
      const yojnaData = await getYojnas();
      setYojnas(yojnaData);
    } catch (err) {
      console.error("Error fetching yojnas:", err);
    }
  }, []);

  useEffect(() => {
    fetchYojnas();
    fetchData();
  }, [fetchData]);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [actionType, setActionType] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const tableRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (isSelectAll) {
      setSelectedRows(currentItems.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  }, [isSelectAll]);

  const filteredData = useMemo(() => {
    // console.log("Filtering data, current data length:", data?.length);
    if (!Array.isArray(data) || data.length === 0) {
      console.log("Data is not an array, returning empty array");
      return [];
    }
    return data.filter(
      (record) =>
        (categoryFilter === "all" ||
          String(record?.property_category).toLowerCase() ===
            categoryFilter.toLowerCase()) &&
        Object.values(record).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [data, categoryFilter, searchTerm]);



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div className="bg-white dark:bg-[#1C2537] rounded-lg shadow-md overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading properties...
          </p>
        </div>
      ) : error ? (
        <div className="text-center p-8 space-y-2">
          <p className="text-red-600 dark:text-red-400">
            Error loading properties: {error}
          </p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by Property ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by Name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedYojna}
                onChange={(e) => setSelectedYojna(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">All Yojnas</option>
                {yojnas.map((yojna) => (
                  <option key={yojna.yojna_id} value={yojna.yojna_id}>
                    {yojna.yojna_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="flex items-center space-x-2 px-4 py-2 dark:bg-[#1C2537] border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2D3748] dark:text-gray-200"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Columns</span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 dark:bg-[#1C2537] border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2D3748] dark:text-gray-200"
                // onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <ColumnSelector
            columns={columns}
            onToggleColumn={toggleColumnVisibility}
            show={showColumnSelector}
          />

          <div className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                // onClick={exportToCSV}
                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                // onClick={handlePrint}
                className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200"
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </button>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors duration-200">
                <Share2 className="h-4 w-5 mr-1" />
                Share
              </button>
            </div>
          </div>

          <div
            ref={tableRef}
            className="relative overflow-x-auto min-w-[1024px]"
          >

          </div>

          <div className="px-4 py-3 border-t dark:border-gray-700 bg-white dark:bg-[#1C2537] overflow-x-auto">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredData.length)}
                </span>{" "}
                of <span className="font-medium">{filteredData.length}</span>{" "}
                results
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-[#0F1729] text-sm font-medium text-gray-400 hover:bg-[#2D3748] disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? "z-10 bg-blue-600 border-blue-600 text-white"
                        : "border-gray-700 bg-[#0F1729] text-gray-400 hover:bg-[#2D3748]"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-[#0F1729] text-sm font-medium text-gray-400 hover:bg-[#2D3748] disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

   
        </>
      )}
    </div>
  );
}