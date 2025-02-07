import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const UploadReports = () => {
  const [formData, setFormData] = useState({});
  const [reportCategories, setReportCategories] = useState([]); // For fetched report types
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        // const response = await fetch(`http://localhost:8000/reportCategory`, {
        const response = await fetch(
          `http://localhost:5000/api/reportCategory`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the Authorization header
            },
          }
        );

        const result = await response.json();
        console.log(result);
        if (response.ok) {
          setReportCategories(result); // Assuming the API returns an array of categories
        } else {
          console.error("Failed to fetch report categories:", result.message);
        }
      } catch (error) {
        console.error("Error fetching report categories:", error);
      }
    };

    fetchReportCategories();
  }, []); // Fetch categories on component mount

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "report_file") {
      setFormData({ ...formData, report_file: files[0] });
    } else if (name === "category_id") {
      setFormData({ ...formData, category_id: value }); // Store the correct category ID
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    console.log("Decoded Token:", decodedToken);

    const { registrationId, id } = decodedToken;

    if (!registrationId) {
      console.error("User ID not found.");
      return;
    }

    // if (
    //   !formData.report_name ||
    //   !formData.description ||
    //   !formData.category_id
    // ) {
    //   console.error("Please fill in all required fields.");
    //   return;
    // }

    const formDataObj = new FormData();
    formDataObj.append("registration_id", registrationId);
    formDataObj.append("report_name", formData.report_name);
    formDataObj.append("description", formData.description);
    formDataObj.append("category_id", formData.category_id);
    formDataObj.append("user_id", id);

    if (formData.report_file) {
      formDataObj.append("report_file", formData.report_file);
    } else {
      console.error("No file selected");
      return;
    }

    console.log("Submitting Form Data:", {
      registration_id: registrationId,
      report_name: formData.report_name,
      description: formData.description,
      category_id: formData.category_id,
      user_id: id,
      report_file: formData.report_file.name, // Ensure file is recognized
    });

    try {
      const response = await fetch("http://localhost:5000/api/report/upload", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Report uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        setFormData({
          report_name: "",
          description: "",
          category_id: "",
          report_file: null,
        });

        setTimeout(() => navigate("/user/work_report"), 3000);
      } else {
        console.error("Upload failed:", result.message);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="max-h-screen bg-gray-100 p-2 font-serif">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-600 rounded-lg">
          {successMessage}
        </div>
      )}
      <div className="bg-white p-3 md:p-4 lg:p-10 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-gray-500 mb-10 text-center font-serif">
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
                id="report_name"
                name="report_name"
                value={formData.report_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter report name"
                required
              />
            </div>

            <div>
              <label htmlFor="reportType" className="block text-gray-700">
                Report Type
              </label>
              <select
                id="category_id"
                name="category_id" // Ensure it matches formData key
                value={formData.category_id || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="" disabled>
                  Select Report Type
                </option>
                {reportCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label
                htmlFor="file"
                className="block text-gray-600 font-medium mb-2"
              >
                Upload File
              </label>
              <input
                type="file"
                id="report_file"
                name="report_file"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                required
              />
            </div>

            <div>
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
