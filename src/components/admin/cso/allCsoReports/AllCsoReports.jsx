import React, { useState } from "react";
import { useNavigate } from "react-router";

// Example CSO reports data with multiple CSOs
const allreport = [
  {
    id: 1,
    csoName: "Bishofftu High School",
    name: "Annual Report",
    type: "Yearly",
    date: "2025-10-10",
    status: "active",
    reportFile: "0001Bisoftu.pdf",
    comment: "",
  },
  {
    id: 2,
    csoName: "Bishofftu High School",
    name: "Quarterly Report",
    type: "Quarterly",
    date: "2025-10-20",
    status: "inactive",
    reportFile: "0001Bisoftu.pdf",
    comment: "",
  },
  {
    id: 3,
    csoName: "KVO NGO",
    name: "Project Update Report",
    type: "Monthly",
    date: "2025-11-01",
    status: "active",
    reportFile: "KVOReport.pdf",
    comment: "",
  },
  {
    id: 4,
    csoName: "KVO NGO",
    name: "Financial Statement",
    type: "Annual",
    date: "2025-11-05",
    status: "inactive",
    reportFile: "KVONGO_Statement.pdf",
    comment: "",
  },
  {
    id: 5,
    csoName: "Health for All",
    name: "Healthcare Progress Report",
    type: "Quarterly",
    date: "2025-09-15",
    status: "active",
    reportFile: "HealthForAll_Report.pdf",
    comment: "",
  },
  {
    id: 6,
    csoName: "CSO Global",
    name: "Global Health Initiatives",
    type: "Yearly",
    date: "2025-12-01",
    status: "active",
    reportFile: "CSO_GlobalHealth.pdf",
    comment: "",
  },
  // Add more reports here to simulate a large dataset...
];

const AllCsoReports = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;
  const navigate = useNavigate();

  // Filter reports by name or other criteria
  const filteredReports = allreport.filter((report) =>
    report.csoName.toLowerCase().includes(search.toLowerCase()) ||
    report.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleView = (report) => {
    if (report.type.toLowerCase() === "yearly") {
      navigate(`/admin/yearly_Report/${report.id}`);
    } else if (report.type.toLowerCase() === "quarterly") {
      navigate(`/admin/quarterly_report/${report.id}`);
    }
  };

  // Handle pagination buttons
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold font-serif text-gray-400 mb-4">All CSO Reports</h2>

        {/* Search Filter */}
        <input
          type="text"
          placeholder="Search by CSO or Report Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 w-48 border border-gray-300 rounded mb-4"
        />

        {/* Reports Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">CSO Name</th>
              <th className="border border-gray-300 px-4 py-2">Report Name</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{report.csoName}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.type}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.status}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleView(report)} // Pass the specific report to the handleView function
                      className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
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

        {/* Pagination Buttons */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCsoReports;
