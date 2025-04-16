import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiDownload,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { MdOutlineClear } from "react-icons/md";
import { toast } from "react-toastify";
import { Spin, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const LetterList = () => {
  const [letters, setLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/letters`
      );
      setLetters(response.data.data);
      setFilteredLetters(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching letters:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, selectedType, startDate, endDate);
  };

  const handleTypeFilter = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    applyFilters(searchTerm, type, startDate, endDate);
  };

  const handleDateFilter = (e, isStart) => {
    const date = e.target.value;
    if (isStart) {
      setStartDate(date);
      applyFilters(searchTerm, selectedType, date, endDate);
    } else {
      setEndDate(date);
      applyFilters(searchTerm, selectedType, startDate, date);
    }
  };

  const applyFilters = (term, type, start, end) => {
    let filtered = letters;

    if (term) {
      filtered = filtered.filter(
        (letter) =>
          letter.title.toLowerCase().includes(term) ||
          letter.summary.toLowerCase().includes(term) ||
          letter.type.toLowerCase().includes(term)
      );
    }

    if (type !== "all") {
      filtered = filtered.filter((letter) => letter.type === type);
    }

    if (start && end) {
      filtered = filtered.filter((letter) => {
        const letterDate = new Date(letter.createdAt);
        return letterDate >= new Date(start) && letterDate <= new Date(end);
      });
    }

    setFilteredLetters(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/letters/${id}`,
          { withCredentials: true }
        );
        toast.success("Deleted successfully");
        fetchLetters();
      } catch (error) {
        toast.error(error.message);
      }
    
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLetters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage);

  const typeColors = {
    Announcement: "bg-blue-100 text-blue-800",
    Meeting: "bg-green-100 text-green-800",
    Notice: "bg-yellow-100 text-yellow-800",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="medium" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-lg border border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-950">Letter Management</h2>
          <Link
            to="/admin/letter_form"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <PlusOutlined className="mr-2" />
            Create New
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search letters..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-4 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select
            value={selectedType}
            onChange={handleTypeFilter}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          >
            <option value="all">All Types</option>
            <option value="Announcement">Announcement</option>
            <option value="Meeting">Meeting</option>
            <option value="Notice">Notice</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateFilter(e, true)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span>-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateFilter(e, false)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setStartDate("");
              setEndDate("");
              setFilteredLetters(letters);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <MdOutlineClear />
            Clear
          </button>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attachment
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((letter, index) => (
                  <tr key={letter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {letter.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {letter.summary}
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          typeColors[letter.type] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {letter.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {letter.attachmentPath ? (
                        <a
                          href={`${process.env.REACT_APP_API_URL}/${letter.attachmentPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <FiDownload />
                          <span className="truncate max-w-xs">
                            {letter.attachmentName || "Attachment"}
                          </span>
                        </a>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(letter.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/admin/letter_view/${letter.id}`}
                          className="text-blue-600 hover:text-blue-900 p-2"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          to={`/admin/letter_edit/${letter.id}`}
                          className="text-blue-600 hover:text-blue-900 p-2"
                        >
                          <FiEdit2 />
                        </Link>
                        <Popconfirm
                          title="Are You Sure you want to delete this letter?"
                          onConfirm={() => handleDelete(letter.id)}
                          okText="Yes"
                          cancelText="No"
                          className="text-left"
                        >
                          <button className="text-red-600 hover:text-red-900 p-2">
                            <FiTrash2 />
                          </button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No letters found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredLetters.length)} of{" "}
              {filteredLetters.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`p-2 border rounded-l ${
                  currentPage === 1
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <FiChevronLeft className="inline" />
                <FiChevronLeft className="inline -ml-1" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 border ${
                  currentPage === 1
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <FiChevronLeft />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 border ${
                  currentPage === totalPages
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <FiChevronRight />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 border rounded-r ${
                  currentPage === totalPages
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <FiChevronRight className="inline" />
                <FiChevronRight className="inline -ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterList;
