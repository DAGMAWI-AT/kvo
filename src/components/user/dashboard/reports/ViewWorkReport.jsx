import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reports } from "./data";

const ViewWorkReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const singleReport = reports.find((p) => p.id === parseInt(id));

  if (!singleReport) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Report not found!</p>
      </div>
    );
  }

  const { reportName, respond, comment, remark, expireDate, pdfFileName } =
    singleReport;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/user/dashboard/work_report")}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
        >
          Back to Reports
        </button>
        <h1 className="text-3xl font-bold text-gray-700">
          View Report: <span className="text-blue-500">{reportName}</span>
        </h1>
      </div>

      {/* Report Details */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Report Name</h2>
            <p className="text-gray-600 mt-1">{reportName}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Response</h2>
            <p
              className={`mt-1 ${
                respond === "Approved"
                  ? "text-green-600"
                  : respond === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {respond}
            </p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Comment</h2>
            <p className="text-gray-600 mt-1">{comment}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Remark</h2>
            <p className="text-gray-600 mt-1">{remark}</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Expire Date</h2>
            <p className="text-gray-600 mt-1">{expireDate}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">PDF File</h2>
            <a
              href={`/path/to/pdf/files/${pdfFileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-1 inline-block"
            >
              Download {pdfFileName}
            </a>
          </div>
        </div>
      </div>

      {/* <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate("/user/dashboard/work_report")}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
        >
          Back to Dashboard
        </button>
      </div> */}
    </div>
  );
};

export default ViewWorkReport;
