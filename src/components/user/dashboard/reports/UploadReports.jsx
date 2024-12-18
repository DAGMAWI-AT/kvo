import React, { useState } from "react";

const UploadReports = () => {
  const [formData, setFormData] = useState({
    reportName: "",
    description: "",
    expireDate: "",
    file: null,
    reportType: "active", // Add a field to track report type
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock submission logic
    console.log("Submitted data:", formData);

    // Reset form and show success message
    setFormData({
      reportName: "",
      description: "",
      expireDate: "",
      file: null,
      reportType: "active", // Reset report type
    });
    setSuccessMessage("Report uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-4 lg:p-6 font-serif">
      <div className="bg-white p-3 md:p-4 lg:p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-500 mb-6 text-center font-serif">
          Upload New Report
        </h1>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-600 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Row 1: Report Name and Expiration Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Report Name */}
            <div>
              <label
                htmlFor="reportName"
                className="block text-gray-600 font-medium mb-2"
              >
                Report Name
              </label>
              <input
                type="text"
                id="reportName"
                name="reportName"
                value={formData.reportName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter report name"
                required
              />
            </div>

            {/* Expiration Date */}
            <div className="cursor-default">
              <label
                htmlFor="expireDate"
                className="block text-gray-600 font-medium mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="expireDate"
                name="expireDate"
                value={formData.expireDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Row 2: File Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="mb-4">
              <label
                htmlFor="file"
                className="block text-gray-600 font-medium mb-2"
              >
                Upload File
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                required
              />
            </div>

            {/* Report Type Dropdown */}
            <div className="mb-4 mt-4">
              <label htmlFor="reportType" className="block text-gray-700">
                Report Type
              </label>
              <select
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="active">Yearly</option>
                <option value="inactive">Monthly</option>
                <option value="expire">Quarterly</option>
                <option value="denied">Proposal</option>
              </select>
            </div>
          </div>

          {/* Row 3: Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-600 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter a brief description"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-40 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all"
          >
            Upload Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadReports;
