import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaEye, FaTrash, FaUserAlt } from "react-icons/fa";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { Button, Popconfirm, Select, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { BarLoader } from "react-spinners";
const { Option } = Select;

const BeneficiaryList = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState({});

  const navigate = useNavigate();

  // Add axios response interceptor for 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.", {
            duration: 3000,
            position: "top-right",
          });
          setTimeout(() => navigate("/login"), 1500);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/beneficiaries`
        );
        setBeneficiaries(response.data.data);
        setFilteredBeneficiaries(response.data.data);
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        if (error.status === 401 || error.response?.status === 401) {
          navigate("/login");
        }
        toast.error(error.message || error || "Failed to fetch beneficiaries");
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  // Filter beneficiaries when searchTerm, startDate, or endDate changes
  useEffect(() => {
    handleSearch();
  }, [searchTerm, startDate, endDate, beneficiaries]);

  const handleSearch = () => {
    let filtered = beneficiaries.filter((beneficiary) => {
      const matchName = beneficiary.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchDate =
        (!startDate ||
          new Date(beneficiary.createdAt) >= new Date(startDate)) &&
        (!endDate || new Date(beneficiary.createdAt) <= new Date(endDate));
      return matchName && matchDate;
    });
    setFilteredBeneficiaries(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/beneficiaries/${id}`
      );
      setBeneficiaries(beneficiaries.filter((b) => b.id !== id));
      setFilteredBeneficiaries(
        filteredBeneficiaries.filter((b) => b.id !== id)
      );
      toast.success("Beneficiary deleted successfully");
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
      if (error.status === 401 || error.response?.status === 401) {
        navigate("/login");
      }
      toast.error(
        error.message ||
          error ||
          "Please try again an able to delete beneficiary"
      );
    }
  };

  const handleView = (id) => navigate(`/admin/view_beneficiary/${id}`);
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredBeneficiaries].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredBeneficiaries(sorted);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBeneficiaries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - leftOffset);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const exportToPDF = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one beneficiary to export");
      return;
    }

    toast.promise(
      new Promise((resolve) => {
        const selectedBeneficiaries = beneficiaries
          .filter((b) => selectedRows.includes(b.id))
          .map((b) => ({
            ...b,
            createdAt: new Date(b.createdAt).toLocaleString(),
            updatedAt: new Date(b.updatedAt).toLocaleString(),
            photo: b.photo ? "Photo Available" : "No Photo",
            idFile: b.idFile ? "ID File Available" : "No ID File",
          }));

        const doc = new jsPDF({ orientation: "landscape" });

        doc.autoTable({
          head: [
            [
              "ID",
              "Beneficiary ID",
              "Full Name",
              "Phone",
              "Email",
              "Kebele",
              "Location",
              "Wereda",
              "Kfleketema",
              "House No",
              "Gender",
              "Age",
              "School",
              "ID File",
              "Photo",
              "Created At",
              "Updated At",
            ],
          ],
          body: selectedBeneficiaries.map((b, index) => [
            index + 1,
            b.beneficiary_id || "N/A",
            b.fullName,
            b.phone,
            b.email || "N/A",
            b.kebele,
            b.location,
            b.wereda,
            b.kfleketema,
            b.houseNo,
            b.gender,
            b.age,
            b.school || "N/A",
            b.idFile,
            b.photo,
            b.createdAt,
            b.updatedAt,
          ]),
          styles: { fontSize: 7, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 20 },
            2: { cellWidth: 30 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 },
            5: { cellWidth: 15 },
            6: { cellWidth: 15 },
            7: { cellWidth: 15 },
            8: { cellWidth: 20 },
            9: { cellWidth: 20 },
            10: { cellWidth: 20 },
            11: { cellWidth: 15 },
            12: { cellWidth: 15 },
            13: { cellWidth: 15 },
            14: { cellWidth: 15 },
            15: { cellWidth: 20 },
            16: { cellWidth: 20 },
          },
          margin: { left: 1, right: 8 },
        });

        doc.save("beneficiaries_full_data.pdf");
        resolve();
      }),
      {
        loading: "Generating PDF...",
        success: "PDF exported successfully!",
        error: "Failed to generate PDF",
      }
    );
  };

  const exportToExcel = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one beneficiary to export");
      return;
    }

    toast.promise(
      new Promise((resolve) => {
        const selectedBeneficiaries = beneficiaries
          .filter((b) => selectedRows.includes(b.id))
          .map((b) => ({
            ...b,
            createdAt: new Date(b.createdAt).toLocaleString(),
            updatedAt: new Date(b.updatedAt).toLocaleString(),
            photo: b.photo ? "Photo Available" : "No Photo",
            idFile: b.idFile ? "ID File Available" : "No ID File",
          }));

        const worksheet = XLSX.utils.json_to_sheet(selectedBeneficiaries);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Beneficiaries");

        worksheet["!cols"] = [
          { width: 5 },
          { width: 20 },
          { width: 30 },
          { width: 15 },
          { width: 20 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 20 },
          { width: 20 },
          { width: 20 },
          { width: 10 },
          { width: 30 },
          { width: 15 },
          { width: 15 },
          { width: 20 },
          { width: 20 },
        ];

        XLSX.writeFile(workbook, "beneficiaries_full_data.xlsx");
        resolve();
      }),
      {
        loading: "Generating Excel...",
        success: "Excel exported successfully!",
        error: "Failed to generate Excel",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
        <BarLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Beneficiary Management
          </h1>
          <p className="text-gray-600">Manage all registered beneficiaries</p>
        </div>
        <Link
          to="/admin/add_beneficiary"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <IoMdAdd className="text-lg" />
          Add Beneficiary
        </Link>
      </div>

      {/* Filters and Actions Section */}
      {/* <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <div className="flex gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
          <button
            onClick={exportToPDF}
            disabled={selectedRows.length === 0}
            className={`px-3 py-1 border border-red-500 text-red-600 rounded-md hover:bg-red-50 ${
              selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <DownloadOutlined /> PDF
          </button>
          <button
            onClick={exportToExcel}
            disabled={selectedRows.length === 0}
            className={`px-3 py-1 border border-green-500 text-green-600 hover:bg-green-50 rounded-md ${
              selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
           <DownloadOutlined /> Excel
          </button>
          </div>
        </div>
      </div> */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <div className="flex gap-2 my-1 p-1">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex gap-3 m-2">
          <button
            onClick={exportToPDF}
            disabled={selectedRows.length === 0}
            className={`px-3 py-1 border border-red-500 text-red-600 rounded-md hover:bg-red-50 ${
              selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <DownloadOutlined /> PDF
          </button>
          <button
            icon={<DownloadOutlined />}
            onClick={exportToExcel}
            disabled={selectedRows.length === 0}
            className={`px-3 py-1 border border-green-500 text-green-600 hover:bg-green-50 rounded-md ${
              selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <DownloadOutlined /> Excel
          </button>
        </div>
      </div>
      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === filteredBeneficiaries.length &&
                      filteredBeneficiaries.length > 0
                    }
                    onChange={() => {
                      if (
                        selectedRows.length === filteredBeneficiaries.length
                      ) {
                        setSelectedRows([]);
                      } else {
                        setSelectedRows(filteredBeneficiaries.map((b) => b.id));
                      }
                    }}
                    disabled={filteredBeneficiaries.length === 0}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photo
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("fullName")}
                >
                  <div className="flex items-center">
                    Full Name
                    {sortConfig.key === "fullName" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("phone")}
                >
                  <div className="flex items-center">
                    Phone
                    {sortConfig.key === "phone" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("beneficiary_id")}
                >
                  <div className="flex items-center">
                    {/* BenFi ID */}
                    Lakkoofsa Abdii
                    {sortConfig.key === "beneficiary_id" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Registration Date
                    {sortConfig.key === "createdAt" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((beneficiary) => (
                  <tr key={beneficiary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(beneficiary.id)}
                        onChange={() => handleRowSelect(beneficiary.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!imgError[beneficiary.id] && beneficiary.photo ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/beneficiary/${beneficiary.photo}`}
                          alt="Beneficiary"
                          onError={() =>
                            setImgError((prev) => ({
                              ...prev,
                              [beneficiary.id]: true,
                            }))
                          }
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <FaUserAlt className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {beneficiary.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beneficiary.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beneficiary.beneficiary_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(beneficiary.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(beneficiary.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          // to={`/admin/edit_beneficiary/${beneficiary.id}`}
                          onClick={() =>
                            navigate(
                              `/admin/edit_beneficiary/${beneficiary.id}`
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        {/* <button
                          onClick={() => handleDelete(beneficiary.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button> */}
                        <Popconfirm
                          title="Are you sure to delete this beneficiary ?"
                          onConfirm={() => handleDelete(beneficiary.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Tooltip title="Delete">
                            <Button
                              type="text"
                              icon={<FaTrash />}
                              danger
                              // onClick={() => showDeleteConfirm(record.id)}
                            />
                          </Tooltip>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No beneficiaries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-4 flex-col md:flex-row gap-4">
        <div className="text-sm text-gray-700">
          Show:
          <Select
            value={itemsPerPage}
            onChange={(value) => setItemsPerPage(value)}
            className="ml-2 w-20"
          >
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
            <Option value={100}>100</Option>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredBeneficiaries.length)}{" "}
            of {filteredBeneficiaries.length} entries
          </div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">First</span>
              <FiChevronLeft className="h-5 w-5" />
              <FiChevronLeft className="h-5 w-5 -ml-3" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <FiChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Last</span>
              <FiChevronRight className="h-5 w-5" />
              <FiChevronRight className="h-5 w-5 -ml-3" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryList;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { FaEdit, FaEye, FaTrash, FaUserAlt } from "react-icons/fa";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { Spin } from "antd";
// import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";

// const BeneficiaryList = () => {
//   const [beneficiaries, setBeneficiaries] = useState([]);
//   const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [endDate, setEndDate] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [imgError, setImgError] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBeneficiaries = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/beneficiaries`
//         );
//         setBeneficiaries(response.data.data);
//         setFilteredBeneficiaries(response.data.data);
//       } catch (error) {
//         console.error("Error fetching beneficiaries:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBeneficiaries();
//   }, []);

//   // Automatically filter beneficiaries when searchTerm, startDate, or endDate changes
//   useEffect(() => {
//     handleSearch();
//   }, [searchTerm, startDate, endDate]);

//   const handleSearch = () => {
//     let filtered = beneficiaries.filter((beneficiary) => {
//       const matchName = beneficiary.fullName
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());
//       const matchDate =
//         (!startDate ||
//           new Date(beneficiary.createdAt) >= new Date(startDate)) &&
//         (!endDate || new Date(beneficiary.createdAt) <= new Date(endDate));
//       return matchName && matchDate;
//     });
//     setFilteredBeneficiaries(filtered);
//   };

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (result.isConfirmed) {
//       try {
//         await axios.delete(`${process.env.REACT_APP_API_URL}/api/beneficiaries/${id}`);
//         setBeneficiaries(
//           beneficiaries.filter((beneficiary) => beneficiary.id !== id)
//         );
//         setFilteredBeneficiaries(
//           filteredBeneficiaries.filter((beneficiary) => beneficiary.id !== id)
//         );
//         Swal.fire("Deleted!", "The beneficiary has been deleted.", "success");
//       } catch (error) {
//         console.error("Error deleting beneficiary:", error);
//         Swal.fire("Error!", "Failed to delete beneficiary.", "error");
//       }
//     }
//   };

//   const handleView = (id) => {
//     navigate(`/admin/view_beneficiary/${id}`);
//   };

//   const handleRowSelect = (id) => {
//     if (selectedRows.includes(id)) {
//       setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
//     } else {
//       setSelectedRows([...selectedRows, id]);
//     }
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });

//     const sorted = [...filteredBeneficiaries].sort((a, b) => {
//       if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
//       if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
//       return 0;
//     });
//     setFilteredBeneficiaries(sorted);
//   };

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredBeneficiaries.slice(
//     indexOfFirstRow,
//     indexOfLastRow
//   );

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const handleRowsPerPageChange = (e) => {
//     setRowsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const exportToPDF = () => {
//     const selectedBeneficiaries = beneficiaries
//       .filter((beneficiary) => selectedRows.includes(beneficiary.id))
//       .map((beneficiary) => ({
//         ...beneficiary,
//         createdAt: new Date(beneficiary.createdAt).toLocaleString(),
//         updatedAt: new Date(beneficiary.updatedAt).toLocaleString(),
//         photo: beneficiary.photo ? 'Photo Available' : 'No Photo',
//         idFile: beneficiary.idFile ? 'ID File Available' : 'No ID File'
//       }));

//     const doc = new jsPDF({
//       orientation: 'landscape'
//     });

//     doc.autoTable({
//       head: [
//         ["ID", "Beneficiary ID", "Full Name", "Phone", "Email", "Kebele",
//          "Location", "Wereda", "Kfleketema", "House No", "Gender", "Age",
//          "School", "ID File", "Photo", "Created At", "Updated At"]
//       ],
//       body: selectedBeneficiaries.map((beneficiary, index) => [
//         index + 1,
//         beneficiary.beneficiary_id || 'N/A',
//         beneficiary.fullName,
//         beneficiary.phone,
//         beneficiary.email || 'N/A',
//         beneficiary.kebele,
//         beneficiary.location,
//         beneficiary.wereda,
//         beneficiary.kfleketema,
//         beneficiary.houseNo,
//         beneficiary.gender,
//         beneficiary.age,
//         beneficiary.school || 'N/A',
//         beneficiary.idFile,
//         beneficiary.photo,
//         beneficiary.createdAt,
//         beneficiary.updatedAt
//       ]),
//       styles: {
//         fontSize: 7,
//         cellPadding: 2
//       },
//       // margin: { top: 10 },
//       columnStyles: {
//         0: { cellWidth: 8 },
//         1: { cellWidth: 20 },
//         2: { cellWidth: 30 },
//         3: { cellWidth: 20 },
//         4: { cellWidth: 20 },
//         5: { cellWidth: 15 },
//         6: { cellWidth: 15 },
//         7: { cellWidth: 15 },
//         8: { cellWidth: 20 },
//         9: { cellWidth: 20 },
//         10: { cellWidth: 20 },
//         11: { cellWidth: 15 },
//         12: { cellWidth: 15 },
//         13: { cellWidth: 15 },
//         14: { cellWidth: 15 },
//         15: { cellWidth: 20 },
//         16: { cellWidth: 20 }
//       },
//       margin: { left: 1, right: 8 },
//       pageBreak: 'auto',
//       tableWidth: 'wrap'
//     });

//     doc.save("beneficiaries_full_data.pdf");
//   };

//   const exportToExcel = () => {
//     const selectedBeneficiaries = beneficiaries
//       .filter((beneficiary) => selectedRows.includes(beneficiary.id))
//       .map((beneficiary) => ({
//         ...beneficiary,
//         createdAt: new Date(beneficiary.createdAt).toLocaleString(),
//         updatedAt: new Date(beneficiary.updatedAt).toLocaleString(),
//         photo: beneficiary.photo ? 'Photo Available' : 'No Photo',
//         idFile: beneficiary.idFile ? 'ID File Available' : 'No ID File'
//       }));

//     const worksheet = XLSX.utils.json_to_sheet(selectedBeneficiaries);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Beneficiaries");

//     worksheet["!cols"] = [
//       { width: 5 },   // id
//       { width: 20 },  // beneficiary_id
//       { width: 30 },  // fullName
//       { width: 15 },  // phone
//       { width: 20 },  // email
//       { width: 15 },  // kebele
//       { width: 15 },  // location
//       { width: 15 },  // wereda
//       { width: 20 },  // kfleketema
//       { width: 20 },  // houseNo
//       { width: 20 },  // gender
//       { width: 10 },  // age
//       { width: 30 },  // school
//       { width: 15 },  // idFile
//       { width: 15 },  // photo
//       { width: 20 },  // createdAt
//       { width: 20 }   // updatedAt
//     ];

//     XLSX.writeFile(workbook, "beneficiaries_full_data.xlsx");
//   };
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="medium" />
//       </div>
//     );
//   }
//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Beneficiary List</h2>
//         <Link
//           to="/admin/add_beneficiary"
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           <PlusOutlined />Add Beneficiary
//         </Link>
//       </div>

//       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
//         <div className="flex gap-2 my-1 p-1">
//           <input
//             type="text"
//             placeholder="Search by Name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="px-4 py-2 border rounded-lg"
//           />
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="px-4 py-2 border rounded-lg"
//           />
//         </div>
//         <div className="flex gap-3 m-2">
//           <button
//             onClick={exportToPDF}
//             disabled={selectedRows.length === 0}
//             className={`px-3 py-1 border border-red-500 text-red-600 rounded-md hover:bg-red-50 ${
//               selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <DownloadOutlined /> PDF
//           </button>
//           <button
//           icon={<DownloadOutlined />}
//             onClick={exportToExcel}
//             disabled={selectedRows.length === 0}
//             className={`px-3 border border-green-500 text-green-600 hover:bg-green-50 rounded-md ${
//               selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//            <DownloadOutlined /> Excel
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr className="whitespace-nowrap">
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <input
//                   type="checkbox"
//                   checked={selectedRows.length === filteredBeneficiaries.length}
//                   onChange={() => {
//                     if (selectedRows.length === filteredBeneficiaries.length) {
//                       setSelectedRows([]);
//                     } else {
//                       setSelectedRows(
//                         filteredBeneficiaries.map(
//                           (beneficiary) => beneficiary.id
//                         )
//                       );
//                     }
//                   }}
//                 />
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Photo
//               </th>
//               <th
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("fullName")}
//               >
//                 Full Name{" "}
//                 {sortConfig.key === "fullName" &&
//                   (sortConfig.direction === "asc" ? "▲" : "▼")}
//               </th>
//               <th
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("phone")}
//               >
//                 Phone{" "}
//                 {sortConfig.key === "phone" &&
//                   (sortConfig.direction === "asc" ? "▲" : "▼")}
//               </th>
//               <th
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("email")}
//               >
//                 BenFi ID{" "}
//                 {sortConfig.key === "email" &&
//                   (sortConfig.direction === "asc" ? "▲" : "▼")}
//               </th>
//               <th
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("createdAt")}
//               >
//                 Registration Date{" "}
//                 {sortConfig.key === "createdAt" &&
//                   (sortConfig.direction === "asc" ? "▲" : "▼")}
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentRows.map((beneficiary) => (
//               <tr key={beneficiary.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <input
//                     type="checkbox"
//                     checked={selectedRows.includes(beneficiary.id)}
//                     onChange={() => handleRowSelect(beneficiary.id)}
//                   />
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {" "}
//                   {!imgError[beneficiary.id] && beneficiary.photo ? (
//                     <img
//                       src={`${process.env.REACT_APP_API_URL}/beneficiary/${beneficiary.photo}`}
//                       alt=""
//                       onError={() =>
//                         setImgError((prev) => ({
//                           ...prev,
//                           [beneficiary.id]: true,
//                         }))
//                       }
//                       className="w-12 h-12 object-cover rounded-full"
//                     />
//                   ) : (
//                     <FaUserAlt className="w-12 h-12 text-blue-400 p-2 rounded-full bg-gray-100" />
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {beneficiary.fullName}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {beneficiary.phone}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {beneficiary.beneficiary_id}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {new Date(beneficiary.createdAt).toLocaleString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap flex gap-2">
//                   <Link
//                     to={`/admin/edit_beneficiary/${beneficiary.id}`}
//                     className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                   >
//                     <FaEdit />
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(beneficiary.id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     <FaTrash />
//                   </button>
//                   <button
//                     onClick={() => handleView(beneficiary.id)}
//                     className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                   >
//                     <FaEye />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="p-4 flex justify-between items-center">
//         <div className="flex gap-2">
//           <button
//             onClick={() => paginate(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => paginate(currentPage + 1)}
//             disabled={indexOfLastRow >= filteredBeneficiaries.length}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
//           >
//             Next
//           </button>
//         </div>
//         <select
//           value={rowsPerPage}
//           onChange={handleRowsPerPageChange}
//           className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value={10}>10 per page</option>
//           <option value={20}>20 per page</option>
//           <option value={50}>50 per page</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default BeneficiaryList;
