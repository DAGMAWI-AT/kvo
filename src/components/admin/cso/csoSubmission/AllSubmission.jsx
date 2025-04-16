import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiTrash2,
  FiEye,
  FiFilter,
  FiType,
  FiCheck,
  FiX,
  FiFile,
} from "react-icons/fi";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { BarLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AllSubmission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formNameFilter, setFormNameFilter] = useState("all");
  const [availableForms, setAvailableForms] = useState([]);
  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "descending",
  });

  // Text size
  const [textSize, setTextSize] = useState("medium");
  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/form/all/submission`,
        {
          withCredentials: true,
        }
      );
      setSubmissions(response.data);
      const uniqueForms = [
        ...new Set(response.data.map((submission) => submission.form_name)),
      ];
      setAvailableForms(uniqueForms);
      setLoading(false);
    } catch (err) {
      // setError(err.response?.data?.error || err.message);
      if (err.response?.status === 401) {
        navigate("/login");
      } else{
        setError(err.response?.data?.error || err.message);
      }
      setLoading(false);
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.form_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.report_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const subDate = new Date(sub.created_at);
    const matchesDate =
      (!startDate || subDate >= new Date(startDate)) &&
      (!endDate || subDate <= new Date(endDate));

    const matchesStatus =
      statusFilter === "all" || sub.status.toLowerCase() === statusFilter;
    const matchesFormName =
      formNameFilter === "all" ||
      sub.form_name.toLowerCase() === formNameFilter;

    return matchesSearch && matchesDate && matchesStatus && matchesFormName;
  });

  // Sort submissions
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedSubmissions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approve":
      case "approved":
        return "bg-green-100 text-green-800";
      case "reject":
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "new":
        return "bg-blue-100 text-blue-800";
      case "inprogress":
        return "bg-yellow-200 text-yellow-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (id) => {
    // if (window.confirm('Are you sure you want to delete this submission?')) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/form/application/${id}`,
          {
            withCredentials: true,
          }
        );
        toast.success("Submission deleted successfully");
        fetchSubmissions();
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to delete submission");
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/form/application/${id}/status`,
        { status: newStatus },
        {
          withCredentials: true,
        }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchSubmissions();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleView = (id) => {
    navigate(`/admin/view_submission/${id}`);
  };

  const getDisplayId = (index) => {
    return indexOfFirstItem + index + 1;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BarLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <div className="flex justify-between gap-2">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">All Submissions</h1>
 {/* Text Size Selector */}
 <div className="w-full sm:w-auto flex items-center text-xs">
          <FiType className="mr-2 text-gray-500 hidden sm:block" />
          <select
            className="border rounded-lg px-3 py-2 text-blue-900 text-xs sm:text-xs w-full"
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
          >
            <option value="small">Small Text</option>
            <option value="medium">Medium Text</option>
            <option value="large">Large Text</option>
          </select>
        </div>
        </div>
      {/* Filters and Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      
      {/* Search Input */}
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search submissions..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters Container */}
      <div className="flex flex-wrap gap-2 sm:gap-4 w-full md:w-auto">
        
        {/* Date Range Filter */}
        <div className="flex items-center text-sm sm:text-base">
          <FiFilter className="mr-2 text-gray-500 hidden sm:block" />
          <input
            type="date"
            className="border rounded-lg px-2 py-1 text-gray-600 w-full sm:w-auto"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="mx-2 text-blue-950">to</span>
          <input
            type="date"
            className="border rounded-lg px-2 py-1 text-gray-700 w-full sm:w-auto"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <select
            className="border rounded-lg px-3 py-2 text-blue-900 text-sm sm:text-base w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option className="text-blue-500" value="new">New</option>
            <option className="text-yellow-500" value="pending">Pending</option>
            <option className="text-orange-500" value="inprogress">In Progress</option>
            <option className="text-green-500" value="approve">Approved</option>
            <option className="text-red-500" value="reject">Rejected</option>
          </select>
        </div>

        {/* Form Name Filter */}
        <div className="w-full sm:w-auto flex items-center">
          <FiFile className="mr-2 text-gray-500 hidden sm:block" />
          <select
            className="border rounded-lg px-3 py-2 text-blue-900 text-sm sm:text-base w-full"
            value={formNameFilter}
            onChange={(e) => setFormNameFilter(e.target.value)}
          >
            <option value="all">All Forms</option>
            {availableForms.map((form) => (
              <option key={form} value={form.toLowerCase()}>{form}</option>
            ))}
          </select>
        </div>

       
      </div>
    </div>
  </div>

      {/* Items per page selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="mr-2 text-gray-400">Show</span>
          <select
            className="border rounded-lg px-3 py-1"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="ml-2 text-gray-400">entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 border-b border-gray-200 whitespace-nowrap uppercase">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors group">
                  #
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-medium whitespace-nowrap text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("form_name")}
                >
                  <div className="flex items-center">
                    Form Name
                    {sortConfig.key === "form_name" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaSortUp className="ml-1" />
                      ) : (
                        <FaSortDown className="ml-1" />
                      )
                    ) : (
                      <FaSort className="ml-1 text-gray-400" />
                    )}
                  </div>
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th> */}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("created_at")}
                >
                  <div className="flex items-center">
                    Submitted
                    {sortConfig.key === "created_at" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaSortUp className="ml-1" />
                      ) : (
                        <FaSortDown className="ml-1" />
                      )
                    ) : (
                      <FaSort className="ml-1 text-gray-400" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`bg-white divide-y divide-gray-200 ${textSizes[textSize]}`}
            >
              {currentItems.length > 0 ? (
                currentItems.map((sub, index) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {getDisplayId(index)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                      {sub.form_name || "N/A"}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {sub.report_name}
                    </td> */}
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {sub.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(sub.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          sub.status
                        )}`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(sub.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(sub.id, "approve")}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Approve"
                          disabled={sub.status.toLowerCase() === "approve"}
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(sub.id, "reject")}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Reject"
                          disabled={sub.status.toLowerCase() === "reject"}
                        >
                          <FiX />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {error ? (
                      <div className="text-red-500">{error}</div>
                    ) : (
                      "No submissions found"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, sortedSubmissions.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{sortedSubmissions.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">First</span>
                  <FiChevronLeft className="h-5 w-5" />
                  <FiChevronLeft className="h-5 w-5 -ml-3" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Last</span>
                  <FiChevronRight className="h-5 w-5" />
                  <FiChevronRight className="h-5 w-5 -ml-3" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSubmission;
