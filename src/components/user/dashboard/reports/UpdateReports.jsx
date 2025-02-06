import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const UpdateReports = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [defaultFileName, setDefaultFileName] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const { registrationId } = decodedToken;

        const response = await fetch(
          `http://localhost:5000/api/report/byId/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();

        setFormData({
          report_name: data.report_name || "",
          report_file: null,
          description: data.description || "",
          user_id: data.user_id,
        });

        setDefaultFileName(data.report_file || "");
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, report_file: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("report_name", formData.report_name);
    formDataToSend.append("description", formData.description);

    if (formData.report_file) {
      formDataToSend.append("report_file", formData.report_file);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/report/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to update report");
      }

      setSuccessMessage("Report updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/user/work_report");
      }, 2000);
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Failed to update report. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-serif">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
          Update Report
        </h1>
        {successMessage && (
          <div className="mb-4 text-green-700 bg-green-200 p-3 rounded-lg">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Report Name</label>
            <input
              type="text"
              name="report_name"
              value={formData.report_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">PDF File</label>
            <input
              type="file"
              name="report_file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {formData.report_file ? (
              <p className="text-gray-500 text-sm mt-1">{formData.report_file.name}</p>
            ) : (
              defaultFileName && (
                <p className="text-gray-500 text-sm mt-1">Existing File: {defaultFileName}</p>
              )
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows="4"
              required
            ></textarea>
          </div>

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
