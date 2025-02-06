import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ViewWorkReport = () => {
  const navigate = useNavigate();
  const report = useLoaderData(); // Load the report data
  const [showFile, setShowFile] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // Track authorization status

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/user/login"); // Redirect to login if no token
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const { registrationId } = decodedToken;

        // Check if the report belongs to the authenticated user
        if (report.registration_id !== registrationId) {
          setIsAuthorized(false); // Not authorized
          navigate("/user/unauthorized"); 
          // navigate("/user/unauthorized"); 

        } else {
          setIsAuthorized(true); // Authorized
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/user/login"); // Redirect to login on error
      }
    };

    checkAuthorization();
  }, [report, navigate]);

  const handleDownload = () => {
    const fileUrl = `http://localhost:5000/user_report/${report.report_file}`;

    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = report.report_file; // Use file name from the report
        document.body.appendChild(link); // Append link to the body
        link.click(); // Trigger download
        document.body.removeChild(link); // Clean up
      })
      .catch((error) => {
        console.error("Download error:", error);
        alert("Failed to download the file. Please try again later.");
      });
  };

  if (!isAuthorized) {
    return null; // Do not render anything if not authorized
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Report not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/user/work_report")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold font-serif text-gray-700">
          View Report:{" "}
          <span className="text-blue-500">{report.report_name}</span>
        </h1>
      </div>

      {/* Report Details Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        {/* Grid Layout for Report Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Name */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Report Name</h2>
            <p className="text-gray-600 mt-1">{report.report_name}</p>
          </div>

          {/* Response Status */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Response</h2>
            <p
              className={`mt-1 text-lg font-medium ${
                report.response === "Approved"
                  ? "text-green-600"
                  : report.response === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {report.response}
            </p>
          </div>

          {/* Expire Date */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Expire Date</h2>
            <p className="text-gray-600 mt-1">{report.expireDate}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Submitted Date</h2>
            <p className="text-gray-600 mt-1">{report.created_at}</p>
          </div>
          {/* Report Type */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Report Type</h2>
            <p className="text-gray-600 mt-1">{report.reportType}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Updated Date</h2>
            <p className="text-gray-600 mt-1">{report.updated_at}</p>
          </div>
          {/* Summary */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800">Summary</h2>
            <p className="text-gray-600 mt-1 overflow-y-auto max-h-32 p-2 bg-gray-50 rounded-lg">
              {report.description}
            </p>
          </div>

          {/* Comment */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800">Comment</h2>
            <p className="text-gray-600 mt-1 overflow-y-auto max-h-32 p-2 bg-gray-50 rounded-lg">
              {report.comment}
            </p>
          </div>
        </div>

        {/* File Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">File</h2>
          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={() => setShowFile(!showFile)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
            >
              {showFile ? "Hide File" : "View File"}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
            >
              Download
            </button>
            <a
              href={`http://localhost:5000/user_report/${report.report_file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-all"
            >
              Open in New Tab
            </a>
          </div>

          {/* File Preview */}
          {showFile && (
            <div className="mt-4">
              <embed
                src={`http://localhost:5000/user_report/${report.report_file}`}
                type="application/pdf"
                width="100%"
                height="500px"
                className="rounded-lg shadow"
                onError={(e) => {
                  console.error("Failed to load the file", e);
                  alert("The file could not be loaded. Please try again later.");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewWorkReport;