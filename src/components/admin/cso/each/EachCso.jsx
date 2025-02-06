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
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState({}); // To store category_id to category_name mapping
  const reportsPerPage = 5; // Number of reports per page
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchCsoData = async () => {
      try {
        // Fetch report data
        const response = await fetch(`http://localhost:5000/api/report/${id}`);
        if (!response.ok) {
          console.error("Failed to fetch CSO data:", response.status);
          return;
        }
        const data = await response.json();
        setReport(data.data || []);

        // Fetch category data for all reports
        const categoryIds = data.data.map((item) => item.category_id);
        const uniqueCategoryIds = [...new Set(categoryIds)]; // Remove duplicates

        // Fetch category names for all unique category IDs
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

        // Wait for all category fetches to complete
        const categoryResults = await Promise.all(categoryPromises);

        // Create a mapping of category_id to category_name
        const categoryMap = {};
        categoryResults.forEach((category) => {
          if (category) {
            categoryMap[category.id] = category.category_name;
          }
        });

        // Set the category mapping in state
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
        setCso(data || {}); // Ensure cso is an object
      } catch (error) {
        console.error("Error fetching CSO profile:", error);
      }
    };
    fetchCsoProfile();
  }, [id]);

  // Filter reports based on search, date, and category
  const filteredReports = Array.isArray(report)
    ? report.filter((item) => {
        const matchesFilter =
          filter === "all" ||
          (categories[item.category_id]?.toLowerCase() || "") === filter.toLowerCase();
        const matchesSearch = (item.report_name?.toLowerCase() || "").includes(
          search.toLowerCase()
        );
        const matchesDate = date ? item.date?.includes(date) : true;
        return matchesFilter && matchesSearch && matchesDate;
      })
    : [];

  // Pagination calculations
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

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
            <img
              src={cso.logo}
              alt="logo"
              className="w-16 h-16 rounded-full p-1"
            />
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
          {["all", "yearly", "quarterly", "proposal", "projects", "other"].map(
            (type) => (
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
            )
          )}
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Report Name</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">File</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.length > 0 ? (
                currentReports.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {item.report_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {categories[item.category_id] || "Unknown"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.created_at}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.report_file && item.report_file.endsWith(".pdf") ? (
                        <embed
                          src={item.report_file}
                          type="application/pdf"
                          className="max-h-10 max-w-10"
                          onError={(e) => {
                            console.error("Failed to load the file", e);
                            alert(
                              "The file could not be loaded. Please try again later."
                            );
                          }}
                        />
                      ) : (
                        <img
                          className="max-h-10 max-w-10"
                          src={`http://localhost:8000/user_report/${item.report_file}`}
                          alt={item.pdfFile}
                        />
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(item)}
                          className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center border border-gray-300 px-4 py-2"
                  >
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