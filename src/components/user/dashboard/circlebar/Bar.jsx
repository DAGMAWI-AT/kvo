import React from "react";
import { FaEnvelopeSquare, FaReply, FaRProject, FaTasks, FaTruckLoading } from "react-icons/fa";
import { FaReact } from "react-icons/fa6";
import "./Bar.css"; // Ensure your CSS file is imported

const Bar = ({ darkMode }) => {
  // Data for the report bars
  const reports = [
    { title: "Approval Report", progress: "10/50", icons: <FaRProject /> },
    { title: "Pending Approvals", progress: "5/20", icons: <FaTruckLoading /> },
    { title: "Completed Tasks", progress: "25/25", icons: <FaEnvelopeSquare /> },
    { title: "Open Tasks", progress: "15/40", icons: <FaTasks /> },
  ];

  return (
    <div
      className={`flex flex-col justify-between md:flex-row lg:flex-row gap-4 mx-auto p-2`}
    >
      {reports.map((report, index) => (
        <div
          key={index}
          className={`flex flex-col justify-between items-start p-5 w-64 h-40 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 ${
            darkMode ? "dark" : "light"
          }`}
        >
          {/* Icon */}
          <div className="text-blue-500 text-2xl mb-3">{report.icons}</div>

          {/* Title */}
          <h1 className="text-lg font-extrabold mb-2">{report.title}</h1>

          {/* Progress */}
          <span className="text-2xl font-bold text-blue-600">
            {report.progress}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Bar;
