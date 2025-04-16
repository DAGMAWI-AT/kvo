import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import { Select, Spin, Empty } from 'antd';

const { Option } = Select;

const CSOLettersView = () => {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [csoInfo, setCsoInfo] = useState(null);
  
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [readStatusFilter, setReadStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'descending'
  });

  // Error handling
  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      navigate('/user/login');
      return;
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(errorMessage);
  };

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get user details
        const meResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          withCredentials: true,
        });
        
        if (!meResponse.data?.success) {
          throw new Error(meResponse.data?.message || 'Failed to fetch user details');
        }

        const { userId } = meResponse.data;
        if (!userId) throw new Error("User ID not found");

        // Fetch CSO info
        const csoResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/cso/${userId}`,
          { withCredentials: true }
        );
        
        if (!csoResponse.data) throw new Error("CSO data not found");
        
        setCsoInfo(csoResponse.data);

        // Fetch letters
        const lettersResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/letters/cso/${csoResponse.data.id}`,
          { withCredentials: true }
        );
        
        setLetters(lettersResponse.data?.data || []);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  // Filter and sort letters
  const filteredData = useMemo(() => {
    let result = [...letters];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(letter => 
        letter.title.toLowerCase().includes(term) || 
        (letter.summary && letter.summary.toLowerCase().includes(term)) ||
        letter.type.toLowerCase().includes(term) ||
        (letter.createdBy && letter.createdBy.toLowerCase().includes(term))
      );
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(letter => letter.type === typeFilter);
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter(letter => {
        const letterDate = new Date(letter.createdAt);
        switch (dateFilter) {
          case 'today':
            return letterDate.toDateString() === now.toDateString();
          case 'week':
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return letterDate >= oneWeekAgo;
          case 'month':
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return letterDate >= oneMonthAgo;
          case 'year':
            const oneYearAgo = new Date(now);
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            return letterDate >= oneYearAgo;
          default:
            return true;
        }
      });
    }
    
    // Read status filter
    if (readStatusFilter !== 'all') {
      result = result.filter(letter => 
        readStatusFilter === 'read' ? letter.isRead : !letter.isRead
      );
    }
    
    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [letters, searchTerm, typeFilter, dateFilter, readStatusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📁';
    if (fileName.endsWith('.pdf')) return '📄';
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return '🖼️';
    if (fileName.match(/\.(doc|docx)$/i)) return '📝';
    if (fileName.match(/\.(xls|xlsx)$/i)) return '📊';
    return '📁';
  };

  const handleViewLetter = async (letterId) => {
    try {
      if (csoInfo?.id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/letters/${letterId}/mark-read/${csoInfo.id}`,
          {},
          { withCredentials: true }
        );
      }
      navigate(`/user/letters_detail/${letterId}`);
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="medium" tip="Loading letters..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Correspondence for {csoInfo?.csoName || 'CSO'}
        </h1>
        <p className="text-gray-600">
          CSO ID: {csoInfo?.registrationId || 'N/A'}
        </p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search letters..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div>
          <Select
            className="w-full"
            value={typeFilter}
            onChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <Option value="all">All Types</Option>
            <Option value="Announcement">Announcement</Option>
            <Option value="Meeting">Meeting</Option>
            <Option value="Notice">Notice</Option>
            <Option value="warning">Warning</Option>
          </Select>
        </div>
        
        <div>
          <Select
            className="w-full"
            value={dateFilter}
            onChange={(value) => {
              setDateFilter(value);
              setCurrentPage(1);
            }}
          >
            <Option value="all">All Dates</Option>
            <Option value="today">Today</Option>
            <Option value="week">Last Week</Option>
            <Option value="month">Last Month</Option>
            <Option value="year">Last Year</Option>
          </Select>
        </div>
        
        <div>
          <Select
            className="w-full"
            value={readStatusFilter}
            onChange={(value) => {
              setReadStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <Option value="all">All Statuses</Option>
            <Option value="read">Read</Option>
            <Option value="unread">Unread</Option>
          </Select>
        </div>
      </div>

      {/* Content */}
      {filteredData.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <Empty 
            description={
              <span className="text-gray-500">
                No letters found matching your criteria
              </span>
            }
          />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('title')}
                  >
                    Title {sortConfig.key === 'title' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('type')}
                  >
                    Type {sortConfig.key === 'type' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attachment
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('createdAt')}
                  >
                    Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((letter) => (
                  <tr 
                    key={letter.id} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${!letter.isRead ? 'font-semibold bg-blue-50' : ''}`}
                    onClick={() => handleViewLetter(letter.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-block w-3 h-3 rounded-full ${letter.isRead ? 'bg-green-500' : 'bg-red-500'}`}
                        title={letter.isRead ? 'Read' : 'Unread'}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{letter.title}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {letter.summary || 'No summary'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {letter.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {letter.createdBy || 'System'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {letter.attachmentPath ? (
                        <a 
                          href={`${process.env.REACT_APP_API_URL}/${letter.attachmentPath}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center hover:text-blue-600 transition-colors"
                          title={letter.attachmentName}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="mr-1 text-lg">
                            {getFileIcon(letter.attachmentName)}
                          </span>
                          <span className="truncate max-w-xs">
                            {letter.attachmentName || 'Attachment'}
                          </span>
                        </a>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(letter.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {letter.readAt && (
                        <div className="text-xs text-gray-400">
                          Read: {new Date(letter.readAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 flex-col md:flex-row gap-4">
            <div className="text-sm text-gray-700">
              Show:
              <Select
                value={itemsPerPage}
                onChange={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
                className="ml-2 w-20"
              >
                <Option value={5}>5</Option>
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
                <Option value={50}>50</Option>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">First</span>
                  <FiChevronLeft className="h-5 w-5" />
                  <FiChevronLeft className="h-5 w-5 -ml-3" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Last</span>
                  <FiChevronRight className="h-5 w-5" />
                  <FiChevronRight className="h-5 w-5 -ml-3" />
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CSOLettersView;