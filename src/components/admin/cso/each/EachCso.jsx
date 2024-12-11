import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { allcsos } from "../Csos"; // Import the CSO data

export const allreport = [
  {
    id: 1,
    name: "bishofftu high school",
    type: "yearly",
    date: "2025-10-10",
    status: "active",  // Active status
    reportFile: "0001Bisoftu.pdf",
    comment: "",
  },
  {
    id: 2,
    name: "bishofftu high school",
    type: "quarterly",
    date: "2025-10-20",
    status: "inactive",  // Inactive status
    reportFile: "0001Bisoftu.pdf",
    comment: "",
  },
  {
    id: 3,
    name: "bishofftu health care",
    type: "proposal",
    date: "2025-10-20",
    status: "active",  // Active status
    reportFile: "0001Bisoftu.pdf",
    comment: "",
  },
  // Add more reports as needed
];

const EachCso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cso = allcsos.find((p) => p.id === parseInt(id));

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5; // Number of reports per page
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (!cso) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">CSO Not Found</h2>
          <p className="text-gray-600">
            The requested CSO with ID {id} does not exist.
          </p>
        </div>
      </div>
    );
  }

  const reports = allreport; // Example allreport data
  const filteredReports = reports.filter((allreport) => {
    const matchesFilter =
      filter === "all" || allreport.type.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      allreport.name.toLowerCase().includes(search.toLowerCase());
    const matchesDate = date ? allreport.date.includes(date) : true;
    return matchesFilter && matchesSearch && matchesDate;
  });

  // Pagination calculations
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleComment = (allreport) => {
    const comment = prompt(`Add a comment for: ${allreport.name}`);
    if (comment) {
      alert(`Comment added: ${comment}`);
    }
  };

  const handleStatusToggle = (allreport) => {
    // Toggle status between active and inactive
    const newStatus = allreport.status === "active" ? "inactive" : "active";
    alert(`Status updated to: ${newStatus}`);
    // Update the status in the data (this can be done by setting the new status to the state if needed)
  };

  const handleView = (allreport) => {
    if (allreport.type === "yearly") {
      navigate(`/admin/yearly_Report/${allreport.id}`);
    }
    if (allreport.type === "quarterly") {
      navigate(`/admin/quarterly_report/${allreport.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">{cso.name}</h2>
        <p className="text-gray-600 mb-4">ID: {cso.id}</p>

        {/* Filter Buttons */}
        <div className="grid border-2 p-4 grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border w-40 border-gray-300 rounded"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border w-32 border-gray-300 rounded"
          />
        </div>

        {/* Reports Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((allreport, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {allreport.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {allreport.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {allreport.date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {allreport.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(allreport)}
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleStatusToggle(allreport)}
                        className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => handleComment(allreport)}
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
                  colSpan="5"
                  className="text-center border border-gray-300 px-4 py-2"
                >
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`py-2 px-4 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`py-2 px-4 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EachCso;
