import React, { useState, useEffect } from "react";
import {
  FaUserAlt,
  FaSearch,
  FaThLarge,
  FaList,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaCalendarAlt,
  FaFilter,
  FaSync,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BarLoader } from "react-spinners";

const ITEMS_PER_PAGE = 8;

const OrganizationCard = ({ cso, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col border border-gray-200"
    >
      <div className="p-4 flex-grow flex flex-col items-center">
        <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          {cso.logo && !imageError ?(
            <img
              src={`${process.env.REACT_APP_API_URL}/${cso.logo}`}
              alt={cso.csoName}
              className="w-full h-full object-cover rounded-full "

              onError={() => setImageError(true)}

            />
          ) : (
            <FaUserAlt className="text-gray-400 text-xl" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-center text-blue-950 truncate w-full px-2">
          {cso.csoName}
        </h3>
        <p className="text-sm text-gray-500 text-center mt-1">
          ID: {cso.registrationId}
        </p>
        <p className="text-xs text-gray-400 text-center mt-2">
          Registered: {new Date(cso.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const OrganizationListItem = ({ cso, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 flex items-center hover:bg-gray-50 cursor-pointer border border-gray-200"
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center mr-4">
        {cso.logo && !imageError ? (
          <img
            src={`${process.env.REACT_APP_API_URL}/${cso.logo}`}
            alt={cso.csoName}
            className="w-full h-full object-cover rounded-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <FaUserAlt className="text-gray-400" />
        )}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800">{cso.csoName}</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {cso.registrationId}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Registered: {new Date(cso.date).toLocaleDateString()}
        </p>
      </div>
      <FiChevronRight className="text-gray-400 ml-2" />
    </div>
  );
};

const Csos = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOrder, setSortOrder] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cso/get`
      );
      setData(response.data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply all filters and sorting
  const getFilteredData = () => {
    let result = [...data];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (cso) =>
          cso.csoName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cso.registrationId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter.start || dateFilter.end) {
      const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
      const endDate = dateFilter.end ? new Date(dateFilter.end) : null;

      result = result.filter((cso) => {
        const csoDate = new Date(cso.date);
        return (
          (!startDate || csoDate >= startDate) &&
          (!endDate || csoDate <= endDate)
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === "asc") return a.csoName.localeCompare(b.csoName);
      return b.csoName.localeCompare(a.csoName);
    });

    return result;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset all filters and pagination
  const resetFilters = () => {
    setSearchQuery("");
    setDateFilter({ start: "", end: "" });
    setSortOrder("asc");
    setCurrentPage(1);
  };

  // Handle page navigation
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
        <BarLoader color="#4F46E5" size={50} />
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header Section */}
      <h1 className="text-2xl font-bold text-blue-950 m-4">
        Civic Organizations
      </h1>

      <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 justify-between">
        {/* Search Input - Takes available space */}
        <div className="w-full md:flex-1 md:max-w-64">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Control Buttons - Right-aligned */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto md:ml-auto">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg flex items-center ${
                viewMode === "grid"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaThLarge className="mr-1" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg flex items-center ${
                viewMode === "list"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaList className="mr-1" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className={`p-2 rounded-lg flex items-center ${
              sortOrder === "asc"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {sortOrder === "asc" ? (
              <FaSortAlphaDown className="mr-1" />
            ) : (
              <FaSortAlphaUp className="mr-1" />
            )}
            <span className="hidden sm:inline">Sort</span>
          </button>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg flex items-center ${
              showFilters
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FaFilter className="mr-1" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, start: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, end: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
            >
              <FaSync className="mr-2" /> Reset
            </button>
          </div>
        </div>
      )}

      {/* Results Count and Pagination Top */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{" "}
          {filteredData.length} organizations
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronLeft className="text-lg" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronRight className="text-lg" />
            </button>
          </div>
        )}
      </div>

      {/* Data Display */}
      {filteredData.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No organizations match your filters</p>
          <button
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Reset all filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedData.map((cso) => (
            <OrganizationCard
              key={cso.id}
              cso={cso}
              onClick={() => navigate(`/admin/cso_submission/${cso.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedData.map((cso) => (
            <OrganizationListItem
              key={cso.id}
              cso={cso}
              onClick={() => navigate(`/admin/cso_submission/${cso.id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination Bottom */}
      <div className="flex justify-end items-center mt-4">
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {/* First Page Button */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">First</span>
              <FiChevronLeft className="h-5 w-5" />
              <FiChevronLeft className="h-5 w-5 -ml-3" />
            </button>

            {/* Previous Page Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <FiChevronLeft className="h-5 w-5" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === pageNum
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Page Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <FiChevronRight className="h-5 w-5" />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Last</span>
              <FiChevronRight className="h-5 w-5" />
              <FiChevronRight className="h-5 w-5 -ml-3" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Csos;
