import React, { useState } from "react";

const UploadReports = () => {
  const [formData, setFormData] = useState({
    reportName: "",
    description: "",
    expireDate: "",
    file: null,
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
    });
    setSuccessMessage("Report uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
          Upload a New Report
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
            <div>
              <label
                htmlFor="expireDate"
                className="block text-gray-600 font-medium mb-2"
              >
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

          {/* Row 2: File Upload */}
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
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all"
          >
            Upload Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadReports;
