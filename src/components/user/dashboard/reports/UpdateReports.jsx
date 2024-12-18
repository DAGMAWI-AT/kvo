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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, pdfFileName: file.name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
    const selectedDate = new Date(formData.expireDate);

    if (selectedDate < today) {
      alert("Expiration date cannot be in the past.");
      return;
    }

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
    <div className="min-h-screen bg-gray-100 p-2 md:p-4 lg:p-6 font-serif">
      <div className="bg-white p-3 md:p-4 lg:p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
          Update Report
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Report Name */}
          <div className="flex flex-wrap lg:flex-nowrap items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="mr-4 flex flex-col w-full lg:w-1/2">
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
            <div className="mr-4 flex flex-col w-full lg:w-1/2">
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
          </div>

          {/* PDF File Name */}
          <div className="mb-4">
            <label htmlFor="pdfFileName" className="block text-gray-600 font-medium mb-2">
              PDF File
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="pdfFileName"
                name="pdfFileName"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {formData.pdfFileName && (
                <span className="text-gray-500 text-sm">{formData.pdfFileName}</span>
              )}
            </div>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-40 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all"
          >
            Update Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateReports;
