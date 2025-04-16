import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiDownload,
  FiEdit,
  FiEye,
  FiSearch,
  FiArrowUp,
  FiArrowDown,
  FiArrowRight,
  FiChevronRight,
  FiFileText,
  FiUser,
} from "react-icons/fi";
import { BarLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUserAlt } from "react-icons/fa";
import { DatePicker } from "antd";

const CsoSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [csoLoading, setCsoLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formFilter, setFormFilter] = useState("all");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  const [cso, setCso] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [availableForms, setAvailableForms] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CSO data first
        const csoResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/cso/res/${id}`,
          { withCredentials: true }
        );
        setCso(csoResponse.data || {});
        setCsoLoading(false);

        // Then fetch submissions
        const appsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/form/cso/application/${id}`,
          { withCredentials: true }
        );
        setSubmissions(appsResponse.data);
        
        const forms = [...new Set(appsResponse.data.map((item) => item.form_name))];
        setAvailableForms(forms.filter(Boolean));
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }
        // toast.error(err.response?.data?.message || err.message);
        setLoading(false);
        setCsoLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const sortedSubmissions = React.useMemo(() => {
    let sortableItems = [...submissions];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [submissions, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredSubmissions = sortedSubmissions.filter((sub) => {
    const matchesSearch =
      sub.report_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.form_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      sub.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesForm = formFilter === "all" || sub.form_name === formFilter;

  

      const submissionDate = new Date(sub.created_at);
      const filterStart = startDate ? startDate.toDate() : null;
      const filterEnd = endDate ? endDate.toDate() : null;
      
      const matchesDate =
        (!filterStart || submissionDate >= filterStart) && 
        (!filterEnd || submissionDate <= filterEnd);
  

    return matchesSearch && matchesStatus && matchesForm && matchesDate;
  });
  const handleDateChange = (dates) => {
    // Handle null case by setting to empty array
    setDateRange(dates || []);
  };
  const handleViewSubmission = (submission) => {
    navigate(`/admin/view_submission/${submission.id}`);
  };

  const handleEdit = (submission) => {
    if (submission.update_permission === "open") {
      navigate(`/edit-submission/${submission.id}`);
    }
  };

  const handleBackToCsoList = () => {
    navigate("/admin/all_cso");
  };

  const handleProfile = () => {
    navigate(`/admin/cso_profile/${cso.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const statusBadge = (status) => {
    const statusClasses = {
      new: "bg-blue-100 text-blue-800",
      approve: "bg-green-100 text-green-800",
      reject: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      default: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusClasses[status.toLowerCase()] || statusClasses.default
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading || csoLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={handleBackToCsoList}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FiChevronLeft className="mr-1" />
          </button>
          <div className="flex items-center">
            {cso.logo && !imageError ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/${cso.logo}`}
                alt={cso.csoName}
                className="w-12 h-12 rounded-full object-cover mr-3"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <FaUserAlt className="text-gray-400 text-xl" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {cso.csoName || `CSO ${id}`}
              </h1>
              <p className="text-gray-600 text-sm">
                Registration ID: {cso.registrationId || "N/A"}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleProfile}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiUser className="mr-2" /> View Profile
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reports or forms..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Form Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form Type
            </label>
            <select
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Forms</option>
              {availableForms.map((form) => (
                <option key={form} value={form}>
                  {form}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Date Range
    </label>
    <div className="flex space-x-2">
      <DatePicker.RangePicker
        onChange={handleDateChange}
        value={dateRange}
        className="w-full"
      />
    </div>
  </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: "report_name", label: "Report Name" },
                  { key: "form_name", label: "Form Type" },
                  { key: "status", label: "Status" },
                  { key: "created_at", label: "Submitted Date" },
                  { key: null, label: "Actions" },
                ].map((header) => (
                  <th
                    key={header.key || header.label}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => header.key && requestSort(header.key)}
                  >
                    <div className="flex items-center">
                      {header.label}
                      {header.key && (
                        <span className="ml-1">
                          {sortConfig.key === header.key ? (
                            sortConfig.direction === "asc" ? (
                              <FiArrowUp className="w-3 h-3 text-gray-400" />
                            ) : (
                              <FiArrowDown className="w-3 h-3 text-gray-400" />
                            )
                          ) : (
                            <FiArrowRight className="w-3 h-3 text-gray-400 transform rotate-90" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {submission.report_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {submission.form_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(submission.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewSubmission(submission)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="View Details"
                        >
                          <FiEye className="mr-1" /> View
                        </button>
                        {submission.update_permission === "open" && (
                          <button
                            onClick={() => handleEdit(submission)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                            title="Edit Submission"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FiFileText className="h-12 w-12 mb-3 text-gray-400" />
                      <p className="text-lg font-medium">
                        No submissions found for {cso.csoName || "this CSO"}
                      </p>
                      <p className="text-sm mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
              <div className="mb-2 md:mb-0">
                Showing {filteredSubmissions.length} of {submissions.length}{" "}
                submissions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={true}
                  className="px-3 py-1 rounded text-gray-400 cursor-not-allowed"
                >
                  <FiChevronLeft />
                </button>
                <span>Page 1 of 1</span>
                <button
                  disabled={true}
                  className="px-3 py-1 rounded text-gray-400 cursor-not-allowed"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsoSubmission;