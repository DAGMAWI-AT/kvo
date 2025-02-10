import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AllCsoReports = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allReport, setAllReport] = useState([]);
  const [csoNames, setCsoNames] = useState({}); // Maps registration_id to csoName
  const [categories, setCategories] = useState({}); // Maps category_id to category_name
  const reportsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch reports
        const response = await fetch("http://localhost:5000/api/report");
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        const reportsArray = Array.isArray(data) ? data : data.reports || [];
        setAllReport(reportsArray);

        // Fetch categories
        const uniqueCategoryIds = [...new Set(reportsArray.map((report) => report.category_id))];
        const categoryData = {};
        await Promise.all(
          uniqueCategoryIds.map(async (catId) => {
            try {
              const resultCat = await fetch(`http://localhost:5000/api/reportCategory/${catId}`);
              if (resultCat.ok) {
                const catData = await resultCat.json();
                categoryData[catId] = catData.category_name || catData[0]?.category_name;
              }
            } catch (error) {
              console.error("Error fetching category for id", catId, error);
            }
          })
        );
        setCategories(categoryData);

        // Fetch CSO names
        const uniqueRegIds = [...new Set(reportsArray.map((report) => report.registration_id))];
        const csoData = {};
        await Promise.all(
          uniqueRegIds.map(async (regId) => {
            try {
              const csoResult = await fetch(`http://localhost:5000/api/cso/res/${regId}`);
              if (csoResult.ok) {
                const csoDataResponse = await csoResult.json();
                // Adjust based on API response structure:
                csoData[regId] = csoDataResponse[0]?.csoName || csoDataResponse.csoName;
              }
            } catch (error) {
              console.error("Error fetching CSO for registration ID:", regId, error);
            }
          })
        );
        setCsoNames(csoData);

      } catch (error) {
        console.error("Error fetching reports:", error.message);
        // Swal.fire({
        //   icon: "error",
        //   title: "Error",
        //   text: "Failed to fetch reports. Please try again later.",
        //   confirmButtonColor: "#d33",
        // });
      }
    };

    fetchReports();
  }, []);

  // Filter reports by search query
  const filteredReports = allReport.filter((item) => {
    const csoName = csoNames[item.registration_id] || "";
    const reportName = item.report_name || "";
    return (
      csoName.toLowerCase().includes(search.toLowerCase()) ||
      reportName.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleView = (report) => {
    navigate(`/admin/show_report/${report.id}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">All CSO Reports</h2>

        <input
          type="text"
          placeholder="Search by CSO or Report Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 w-64 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase">CSO Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase">Report_Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase">Category</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase">Submitted_Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase">Updated_Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase">File</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 border-b border-gray-200">{csoNames[report.registration_id]}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{report.report_name}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{categories[report.category_id]}</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {new Date(report.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {new Date(report.updated_at).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                      {report.report_file && report.report_file.endsWith(".pdf") ? (
                        <embed
                          src={`http://localhost:5000/user_report/${report.report_file}`}
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
                          src={`http://localhost:5000/user_report/${report.report_file}`}
                          alt={report.pdfFile}
                        />
                      )}
                    </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <span className={`px-2 py-1 text-sm rounded-full ${report.status === "Approved" ? "bg-green-100 text-green-700" : report.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <button
                      onClick={() => handleView(report)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium text-white ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} rounded-lg`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium text-white ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} rounded-lg`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCsoReports;