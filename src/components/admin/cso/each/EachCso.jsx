import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { allcsos } from "../Csos"; // Import the CSO data

const EachCso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cso = allcsos.find((p) => p.id === parseInt(id));

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  if (!cso) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">CSO Not Found</h2>
          <p className="text-gray-600">The requested CSO with ID {id} does not exist.</p>
        </div>
      </div>
    );
  }

  const reports = cso.reports || []; // Assuming each CSO has a `reports` property
  const filteredReports = reports.filter((report) => {
    const matchesFilter =
      filter === "all" || report.type.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      report.name.toLowerCase().includes(search.toLowerCase());
    const matchesDate = date ? report.date.includes(date) : true;
    return matchesFilter && matchesSearch && matchesDate;
  });

  const handleView = (report) => {
    alert(`Viewing details for: ${report.name}`);
    // You can implement navigation or modal view here
  };

  const handleComment = (report) => {
    const comment = prompt(`Add a comment for: ${report.name}`);
    if (comment) {
      alert(`Comment added: ${comment}`);
    }
  };

  const handleStatus = (report) => {
    alert(`Current status: ${report.status || "Pending"}`);
    // Logic for updating status can be added
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">{cso.name}</h2>
        <p className="text-gray-600 mb-4">ID: {cso.id}</p>

        {/* Filter Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {["all", "yearly", "quarterly", "proposal", "projects", "other"].map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`w-full py-2 px-4 rounded ${
                  filter === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                } transition`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Search and Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Reports Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{report.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.type}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.date}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(report)}
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleStatus(report)}
                        className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => handleComment(report)}
                        className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                      >
                        Comment
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center border border-gray-300 px-4 py-2"
                >
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EachCso;
