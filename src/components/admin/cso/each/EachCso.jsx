import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EachCso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cso, setCso] = useState({});
  const [report, setReport] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState({});
  const [imgError, setImgError] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Sorting state
  const location = useLocation();

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    approve: "bg-green-100 text-green-700",
    inprogress: "bg-orange-100 text-orange-700",
    pending: "bg-yellow-100 text-yellow-700",
    reject: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchCsoData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/report/${id}`);
        if (!response.ok) {
          console.error("Failed to fetch CSO data:", response.status);
          return;
        }
        const data = await response.json();
        setReport(data.data || []);

        const categoryIds = data.data.map((item) => item.category_id);
        const uniqueCategoryIds = [...new Set(categoryIds)];

        const categoryPromises = uniqueCategoryIds.map(async (categoryId) => {
          const categoryResponse = await fetch(
            `http://localhost:5000/api/reportCategory/${categoryId}`
          );
          if (!categoryResponse.ok) {
            console.error("Failed to fetch category data:", categoryResponse.status);
            return null;
          }
          const categoryData = await categoryResponse.json();
          return categoryData;
        });

        const categoryResults = await Promise.all(categoryPromises);
        const categoryMap = {};
        categoryResults.forEach((category) => {
          if (category) {
            categoryMap[category.id] = category.category_name;
          }
        });

        setCategories(categoryMap);
      } catch (error) {
        console.error("Error fetching CSO data:", error);
      }
    };
    fetchCsoData();
  }, [id]);

  useEffect(() => {
    const fetchCsoProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cso/res/${id}`);
        if (!response.ok) {
          console.error("Failed to fetch CSO profile:", response.status);
          return;
        }
        const data = await response.json();
        setCso(data || {});
      } catch (error) {
        console.error("Error fetching CSO profile:", error);
      }
    };
    fetchCsoProfile();
  }, [id]);

  // Sorting functionality
  const sortedReports = React.useMemo(() => {
    let sortableReports = [...report];
    if (sortConfig.key) {
      sortableReports.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableReports;
  }, [report, sortConfig]);

  // Handle sorting when a column header is clicked
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredReports = sortedReports.filter((item) => {
    // Category filter (if filter is not "all")
    const matchesCategory =
      filter === "all" ||
      (categories[item.category_id]?.toLowerCase() || "") === filter.toLowerCase();

    // Search filter on report name (partial match)
    const matchesSearch = (item.report_name?.toLowerCase() || "").includes(
      search.toLowerCase() 
    ) || item.status?.toLowerCase().includes(search.toLowerCase()|| "") || categories[item.category_id]?.toLowerCase().includes(search.toLowerCase()|| "");

    // Date filtering using created_at (convert to Date objects)
    const reportDate = new Date(item.created_at);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesDate =
      (!start || reportDate >= start) && (!end || reportDate <= end);

    return matchesCategory && matchesSearch && matchesDate;
  });


  // Pagination calculations
  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleView = (report) => {
    navigate(`/admin/show_report/${report.id}`);
  };

  const handleProfile = () => {
    navigate(`/admin/cso_profile/${cso.id}`);
  };

  return (
    <div className="bg-gray-100 p-2 lg:p-6 md:p-4">
      <div className="bg-white p-2 lg:p-6 md:p-4 rounded-lg shadow-lg">
        <div className="mb-4 flex justify-between">
          <div>
            {/* <img src={`http://localhost:5000/${cso.logo}`} alt="logo" className="w-16 h-16 rounded-full p-1" /> */}
            {!imgError && cso.logo ? (
                <img src={`http://localhost:5000/${cso.logo}`} onError={() => setImgError(true)} alt="Profile logo"
                className="w-16 h-16 rounded-full p-1" />
              ) : (
                <img src="/logo.png" className="w-16 h-16 rounded-full p-1" />
              )}
            <h2 className="text-xl font-serif md:text-2xl lg:text-2xl font-bold text-gray-500">
              {cso.csoName}
            </h2>
            <p className="text-gray-600 mb-4">ID: {cso.registrationId}</p>
          </div>
          <div>
            <button
              onClick={handleProfile}
              className="bg-blue-500 font-serif hover:bg-blue-800 py-1 px-2 text-white rounded-lg"
            >
              Profile
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-6 border-2 p-2">
          {["all", "yearly", "quarterly", "proposal", "projects", "other"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`py-2 px-4 rounded ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              } transition`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Search and Date Filters */}
        <div className="flex space-x-8 mb-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded w-1/3"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Show Entries Dropdown */}
        <div className="flex items-center gap-4 mb-4">
          <span>Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-1 border rounded"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th
                className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"

                  onClick={() => requestSort("report_name")}
                >
                  <div className="flex items-center gap-2">
                    Report Name{" "}
                    {sortConfig.key === "report_name" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </div>
                </th>
                <th
                className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("category_id")}
                >
                  <div className="flex items-center gap-2">
                    Type{" "}
                    {sortConfig.key === "category_id" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </div>
                </th>
                <th
                className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("created_at")}
                >
                  <div className="flex items-center gap-2">
                    Submitted Date{" "}
                    {sortConfig.key === "created_at" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </div>
                </th>
                <th
                className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("updated_at")}
                >
                  <div className="flex items-center gap-2">
                    Updated Date{" "}
                    {sortConfig.key === "updated_at" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                >File</th>
                <th
                className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("status")}
                >
                Status{sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
               
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                >Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.length > 0 ? (
                currentReports.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{item.report_name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {categories[item.category_id]}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(item.updated_at).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.report_file && item.report_file.endsWith(".pdf") ? (
                        <embed
                          src={`http://localhost:5000/cso_files/${item.category_name}/${item.report_file}`}
                          type="application/pdf"
                          className="max-h-10 max-w-10"
                          onError={(e) => {
                            console.error("Failed to load the file", e);
                            alert("The file could not be loaded. Please try again later.");
                          }}
                        />
                      ) : (
                        <img
                          className="max-h-10 max-w-10"
                          src={`http://localhost:5000/cso_files/${item.category_name}/${item.report_file}`}
                          alt={item.pdfFile}
                        />
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          statusColors[item.status.toLowerCase()] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>                    
                    <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleView(item)}
                          className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 cursor-pointer"
                        >
                          <FaEye />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center border border-gray-300 px-4 py-2">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`py-2 px-4 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`py-2 px-4 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EachCso;