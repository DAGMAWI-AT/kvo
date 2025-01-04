import React, { useState } from "react";
import { useNavigate } from "react-router";

const UploadReports = () => {
  const [formData, setFormData] = useState({
    reportName: "",
    description: "",
    file: null,
    reportType: "monthly",
  });
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("reportName", formData.reportName);
    formDataObj.append("description", formData.description);
    formDataObj.append("reportType", formData.reportType);
    formDataObj.append("pdfFile", formData.file);

    try {
      const response = await fetch("http://localhost:8000/userReports", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();
      if (result.success) {
        setSuccessMessage("Report uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        
        // Clear form data
        setFormData({
          reportName: "",
          description: "",
          file: null,
          reportType: "yearly",
        });

        // Navigate after showing the message
        setTimeout(() => navigate("/user/dashboard/work_report"), 3000);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-4 lg:p-6 font-serif">
         {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-600 rounded-lg">
            {successMessage}
          </div>
        )}
      <div className="bg-white p-3 md:p-4 lg:p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-500 mb-6 text-center font-serif">
          Upload New Report
        </h1>

     

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
          </div>

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
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="proposal">Proposal</option>
              </select>
            </div>
          </div>

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
