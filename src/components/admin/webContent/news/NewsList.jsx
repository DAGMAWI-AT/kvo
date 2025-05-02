import { PlusOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NewsList = () => {
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    tag: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10;
  const navigate = useNavigate();

  // Fetch all news data once
  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/news`
      );
      
      setAllNews(response.data.data);
      setTotalItems(response.data.data.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch news');
      toast.error(err.response?.data?.message || 'Failed to fetch news');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Client-side filtering, sorting and pagination
  useEffect(() => {
    let processedData = [...allNews];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      processedData = processedData.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        (item.author && item.author.toLowerCase().includes(searchLower))
      );
    }

    // Apply tag filter
    if (filters.tag) {
      processedData = processedData.filter(item => item.tag === filters.tag);
    }

    // Apply date filter
    if (filters.dateFrom || filters.dateTo) {
      const startDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const endDate = filters.dateTo ? new Date(filters.dateTo) : null;
      
      processedData = processedData.filter(item => {
        const itemDate = new Date(item.created_at);
        return (!startDate || itemDate >= startDate) && 
               (!endDate || itemDate <= endDate);
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      processedData.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Update pagination info
    const total = processedData.length;
    setTotalItems(total);
    setTotalPages(Math.ceil(total / limit));

    // Apply pagination
    const startIndex = (currentPage - 1) * limit;
    const paginatedData = processedData.slice(startIndex, startIndex + limit);
    setFilteredNews(paginatedData);
  }, [allNews, currentPage, searchTerm, filters, sortConfig]);

  // Rest of the handlers remain the same
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' 
      ? 'desc' 
      : 'asc';
    setSortConfig({ key, direction });
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ tag: '', dateFrom: '', dateTo: '' });
    setSearchTerm('');
    setCurrentPage(1);
    setSortConfig({ key: '', direction: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/news/${id}`);
        toast.success("News deleted successfully");
        fetchNews();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete news');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <Spin size="medium" />
  //     </div>
  //   );
  // }


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">News Management</h1>
        <button 
          onClick={() => navigate('/admin/news')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
        >
          <PlusOutlined />Add News
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
       

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search news by title, description, or author..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={filters.dateFrom}
              onChange={(e) => handleFilter('dateFrom', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={filters.dateTo}
              onChange={(e) => handleFilter('dateTo', e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 w-full"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* News Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Title {getSortIndicator('title')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('tag')}
                >
                  <div className="flex items-center">
                    Tag {getSortIndicator('tag')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Date {getSortIndicator('created_at')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('author')}
                >
                  <div className="flex items-center">
                    Author {getSortIndicator('author')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredNews.length > 0 ? filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.tag === 'politics' ? 'bg-purple-100 text-purple-800' :
                      item.tag === 'technology' ? 'bg-blue-100 text-blue-800' :
                      item.tag === 'sports' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                    <button
                        onClick={() => navigate(`/admin/view_news/${item.id}`)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/edit_news/${item.id}`)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (<>
                {!isLoading && filteredNews.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No news found matching your criteria.
                    </td>
                  </tr>
                )}
                
                </>
              )}
              
            </tbody>
           
          </table>
         
          {isLoading && filteredNews.length === 0 && (
  <div className="flex justify-center items-center h-64 mt-2">
    <Spin size="medium" />
  </div>
)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} results
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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
                    onClick={() => setCurrentPage(currentPage - 1)}
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
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
        )}
      </div>
      
    </div>
  );
};

export default NewsList;