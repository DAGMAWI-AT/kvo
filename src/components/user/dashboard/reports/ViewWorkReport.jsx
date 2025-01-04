import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

const ViewWorkReport = () => {
  const navigate = useNavigate();
  const report = useLoaderData();
  const [showFile, setShowFile] = useState(false);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Report not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/user/dashboard/work_report")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold font-serif mr-10 text-gray-400">
          View Report:{" "}
          <span className="text-blue-500">{report.reportName}</span>
        </h1>
      </div>

      {/* Report Details */}
      <div className="bg-slate-100 rounded-lg shadow-lg p-8 font-serif">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Report Name</h2>
            <p className="text-gray-600 mt-1">{report.reportName}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Response</h2>
            <p
              className={`mt-1 ${
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
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Description</h2>
            <p className="text-gray-600 mt-1">{report.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Comment</h2>
            <p className="text-gray-600 mt-1">{report.comment}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Remark</h2>
            <p className="text-gray-600 mt-1">{report.reportType}</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Expire Date</h2>
            <p className="text-gray-600 mt-1">{report.expireDate}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">PDF File</h2>
            <div>
              <button
                onClick={() => setShowFile(!showFile)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
              >
                {showFile ? "Hide File" : "View File"}
              </button>
              {showFile && (
                <div className="mt-4">
                  <embed
                    src={`http://localhost:8000/getUserReport/${report._id}/${report.pdfFile}`}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    onError={(e) => {
                      console.error("Failed to load the file", e);
                      alert(
                        "The file could not be loaded. Please try again later."
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewWorkReport;
