import React, { useState } from "react";
import { useNavigate } from "react-router";
import {reports} from "./data"
  
const WorkReport = () => {
    const navigate= useNavigate();
   
  const itemsPerPage = 5; // Number of rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Get current date for expiration comparison
  const currentDate = new Date();

  // Filter reports based on search term
  const filteredReports = reports.filter((report) =>
    report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // Get current page data
  const currentData = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Check if the report is expired
  const isExpired = (expireDate) => {
    if (!expireDate) return false; // If no expire date, assume not expired
    return new Date(expireDate) < currentDate;
  };
  const handleViewReport = (id) => {
    navigate(`/user/dashboard/work_report/viewworkreport/${id}`);
  };
  const handleUploadReport = ()=>{
    navigate(`/user/dashboard/upload_report`);
  }
  const handleUpdateReport =(id)=>{
    navigate(`/user/dashboard/update_report/${id}`);
  }
  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-400 font-serif ">Work Report</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleUploadReport}
        >
          + Add Report
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded px-2 py-2 w-60 focus:outline-none focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <table className="w-full font-serif table-auto border-collapse border border-gray-300 bg-white box-decoration-slice shadow-2xl shadow-blue-gray-900">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">REPORT NAME</th>
            <th className="border border-gray-300 p-2">RESPOND</th>
            <th className="border border-gray-300 p-2">COMMENT</th>
            <th className="border border-gray-300 p-2">PDF FILE NAME</th>
            <th className="border border-gray-300 p-2">REMARK</th>
            <th className="border border-gray-300 p-2">EXPIRE DATE</th>
            <th className="border border-gray-300 p-2">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((report) => (
              <tr key={report.id}>
                <td className="border-b border-gray-300 p-2 text-center">{report.id}</td>
                <td className="border-b border-gray-300 p-2">{report.reportName}</td>
                <td className="border-b border-gray-300 p-2 text-center">{report.respond}</td>
                <td className="border-b border-gray-300 p-2">{report.comment}</td>
                <td className="border-b border-gray-300 p-2">{report.pdfFileName}</td>

                <td className="border-b border-gray-300 p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded ${
                      report.remark === "Approved"
                        ? "bg-green-100 text-green-800"
                        : report.remark === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : report.remark === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {report.remark}
                  </span>
                </td>
                <td className="border-b border-gray-300 p-2 text-center">{report.expireDate}</td>

                <td className="border-b border-gray-300 p-2 flex justify-around">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleViewReport(report.id)}
                  >
                    View
                  </button>
                  <button
                    className={`${
                      isExpired(report.expireDate)
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                    }`}
                    onClick={() => !isExpired(report.expireDate) && handleUpdateReport(report.id)}
                    disabled={isExpired(report.expireDate)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${
                      isExpired(report.expireDate)
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    }`}
                    onClick={() => !isExpired(report.expireDate) && alert(`Deleting ${report.reportName}`)}
                    disabled={isExpired(report.expireDate)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WorkReport;
