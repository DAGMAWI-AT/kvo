import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reports } from "./data";

const UpdateReports = () => {
  const { id } = useParams(); // Get the report ID from the URL
  const navigate = useNavigate();
  const reportId = parseInt(id); // Convert ID to a number
  const [formData, setFormData] = useState({
    reportName: "",
    description: "",
    expireDate: "",
    pdfFileName: "",
  });

  useEffect(() => {
    // Find the report by ID
    const reportToEdit = reports.find((report) => report.id === reportId);
    if (reportToEdit) {
      setFormData(reportToEdit);
    }
  }, [reportId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Find the index of the report to update
    const reportIndex = reports.findIndex((report) => report.id === reportId);
    if (reportIndex !== -1) {
      // Update the report in the reports array
      reports[reportIndex] = { ...reports[reportIndex], ...formData };

      alert("Report updated successfully!");
      navigate("/user/dashboard/work_report"); // Navigate back to the reports list
    } else {
      alert("Report not found!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
          Update Report
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Report Name */}
          <div className="mb-4">
            <label htmlFor="reportName" className="block text-gray-600 font-medium mb-2">
              Report Name
            </label>
            <input
              type="text"
              id="reportName"
              name="reportName"
              value={formData.reportName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-600 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Expiration Date */}
          <div className="mb-4">
            <label htmlFor="expireDate" className="block text-gray-600 font-medium mb-2">
              Expiration Date
            </label>
            <input
              type="date"
              id="expireDate"
              name="expireDate"
              value={formData.expireDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* PDF File Name */}
          <div className="mb-4">
            <label htmlFor="pdfFileName" className="block text-gray-600 font-medium mb-2">
              PDF File Name
            </label>
            <input
              type="text"
              id="pdfFileName"
              name="pdfFileName"
              value={formData.pdfFileName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter file name"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all"
          >
            Update Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateReports;
