import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiArrowRight,
  FiX,
  FiCalendar,
  FiFileText,
  FiClock
} from "react-icons/fi";
import { Spin } from "antd";
import bannerImage from '../../banner_bg.png';

const LetterPortal = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/letters`,
          { withCredentials: true }
        );
        const publicLetters = response.data.data.filter(letter => letter.sendToAll);
        setLetters(publicLetters);
      } catch (error) {
        toast.error("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    };
  };

  const getFileType = (fileName) => {
    if (!fileName) return 'File';
    const extension = fileName.split('.').pop().toLowerCase();
    const fileTypes = {
      pdf: 'PDF',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image'
    };
    return fileTypes[extension] || 'File';
  };

  const renderFilePreview = (filePath, isModal = false) => {
    if (!filePath) return null;
    
    const extension = filePath.split('.').pop().toLowerCase();
    const fileUrl = `${process.env.REACT_APP_API_URL}/${filePath}`;

    // Fixed dimensions for grid view
    const gridDimensions = "w-full h-48";
    // Larger dimensions for modal view
    const modalDimensions = "w-full h-[500px]";

    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return (
        <div className={`border rounded-lg overflow-hidden ${isModal ? modalDimensions : gridDimensions}`}>
          <img 
            src={fileUrl} 
            alt="Preview" 
            className="w-full h-full object-contain bg-gray-50"
          />
        </div>
      );
    } else if (extension === 'pdf') {
      return (
        <div className={`border rounded-lg overflow-hidden ${isModal ? modalDimensions : gridDimensions}`}>
          <iframe 
            src={fileUrl} 
            className="w-full h-full bg-gray-50"
            title="PDF Preview"
          />
        </div>
      );
    } else if (['doc', 'docx'].includes(extension)) {
      return (
        <div className={`border rounded-lg overflow-hidden ${isModal ? modalDimensions : gridDimensions} bg-gray-50 flex items-center justify-center`}>
          <div className="text-center p-4">
            <FiFileText className="mx-auto text-4xl text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Preview not available for Word documents
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const filteredLetters = letters
    .filter(letter => {
      const matchesSearch = letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          letter.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || letter.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => sortBy === "newest" 
      ? new Date(b.date) - new Date(a.date) 
      : new Date(a.date) - new Date(b.date));

  const getTypeStyle = (type) => {
    switch(type) {
      case "Announcement": return "bg-green-100 text-green-700";
      case "Notice": return "bg-yellow-100 text-yellow-700";
      case "Meeting": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const openModal = (letter) => {
    setSelectedLetter(letter);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header with banner */}
      <header 
        className="relative py-24 text-blue-900 text-center overflow-hidden"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-blue-200/70"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Letter Portal</h1>
          <p className="text-lg md:text-lg font-light">
            Stay informed with the latest updates and news
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Filters Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search announcements..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <FiFilter className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                <select
                  className="pl-12 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Announcement">Announcements</option>
                  <option value="Notice">warning</option>
                  <option value="Meeting">Meetings</option>
                </select>
              </div>

              <select
                className="pl-4 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </section>

        {/* Announcements Grid */}
        {filteredLetters.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No announcements found</h2>
            <p className="text-gray-600">
              {searchTerm 
                ? "Try adjusting your search criteria" 
                : "There are currently no public announcements"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLetters.map(letter => {
              const { date, time } = formatDateTime(letter.date);
              return (
                <div
                  key={letter.id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeStyle(letter.type)}`}>
                        {letter.type}
                      </span>
                      <div className="text-sm text-gray-500 flex flex-col items-end">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          {date}
                        </div>
                        <div className="flex items-center mt-1">
                          <FiClock className="mr-1" />
                          {time}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                      {letter.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {letter.summary}
                    </p>

                    {/* File Preview in Grid */}
                    {letter.attachmentPath && (
                      <div className="mb-4">
                        {renderFilePreview(letter.attachmentPath)}
                      </div>
                    )}

                    {/* Footer Section */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <button
                        onClick={() => openModal(letter)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        View Details <FiArrowRight className="ml-1" />
                      </button>

                      {letter.attachmentPath && (
                        <div className="flex items-center space-x-2">
                          <a
                            href={`${process.env.REACT_APP_API_URL}/${letter.attachmentPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 flex items-center"
                            download
                          >
                            <FiDownload className="mr-1" />
                            <span className="text-sm">
                              {getFileType(letter.attachmentPath)}
                            </span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            )}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {modalOpen && selectedLetter && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-900/75"></div>
            </div>

            {/* Modal Content */}
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4">
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedLetter.title}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                {/* Meta Information */}
                <div className="mt-4 flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeStyle(selectedLetter.type)}`}>
                    {selectedLetter.type}
                  </span>
                  <div className="text-gray-500 text-sm flex items-center space-x-2">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1" />
                      {formatDateTime(selectedLetter.date).date}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      {formatDateTime(selectedLetter.date).time}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <FiFileText className="text-gray-400 mr-2" />
                  <h4 className="font-medium text-gray-900">Summary</h4>
                </div>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedLetter.summary}
                </p>
              </div>

              {/* File Preview in Modal */}
              {selectedLetter.attachmentPath && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center mb-4">
                    <FiFileText className="text-gray-400 mr-2" />
                    <h4 className="font-medium text-gray-900">Attachment Preview</h4>
                  </div>
                  {renderFilePreview(selectedLetter.attachmentPath, true)}
                </div>
              )}

              {/* Download Section */}
              {selectedLetter.attachmentPath && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <FiDownload className="text-gray-400 mr-2" />
                    <h4 className="font-medium text-gray-900">Download Options</h4>
                  </div>
                  <div className="mt-2">
                    <a
                      href={`${process.env.REACT_APP_API_URL}/${selectedLetter.attachmentPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      download
                    >
                      <FiDownload className="mr-2" />
                      Download {getFileType(selectedLetter.attachmentPath)} File
                    </a>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterPortal;