import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaArrowLeft, FaDownload, FaEye, FaExternalLinkAlt, FaComment } from "react-icons/fa";

const ViewWorkReport = () => {
  const navigate = useNavigate();
  const report = useLoaderData();
  const [showFile, setShowFile] = useState(false);
  const [categories, setCategories] = useState("");
  const [comments, setComments] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const visibleComments = showAll ? comments : comments.slice(0, 3);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reportCategory/${report.category_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [report.category_id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/comments/comment/${report.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [report.id]);

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/user/login");
        return;
      }
      try {
        const decodedToken = jwtDecode(token);
        const { registrationId } = decodedToken;
        if (report.registration_id !== registrationId) {
          setIsAuthorized(false);
          navigate("/user/unauthorized");
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/user/login");
      }
    };

    checkAuthorization();
  }, [report, navigate]);

  const handleDownload = () => {
    const fileUrl = `http://localhost:5000/user_report/${report.report_file}`;
    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = report.report_file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Download error:", error);
        alert("Failed to download the file. Please try again later.");
      });
  };

  if (!isAuthorized) return null;

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <p className="text-gray-600 text-lg">Report not found!</p>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/user/work_report")}
            className="flex items-center space-x-2 hover:text-gray-200 transition-colors"
          >
            <FaArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold">{report.report_name}</h1>
          <div></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Report Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Name */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Report Name</h2>
              <p className="text-gray-600 mt-2">{report.report_name}</p>
            </div>
            {/* Response Status */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Response</h2>
              <p
                className={`mt-2 text-xl font-medium ${
                  report.status === "approved"
                    ? "text-green-600"
                    : report.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {report.status}
              </p>
            </div>
            {/* Expire Date */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Expire Date</h2>
              <p className="text-gray-600 mt-2">{new Date(categories.expire_date).toLocaleString()}</p>
            </div>
            {/* Submitted Date */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Submitted Date</h2>
              <p className="text-gray-600 mt-2">{new Date(report.created_at).toLocaleString()}</p>
            </div>
            {/* Report Category */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Report Category</h2>
              <p className="text-gray-600 mt-2">{categories.category_name}</p>
            </div>
            {/* Updated Date */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Updated Date</h2>
              <p className="text-gray-600 mt-2">{new Date(report.updated_at).toLocaleString()}</p>
            </div>
          </div>
          {/* Summary */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
            <div className="mt-3 p-4 bg-gray-50 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
              <p className="text-gray-700">{report.description}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2 mb-4">
            <FaComment size={20} />
            <span>Comments ({comments.length})</span>
          </h2>
          <div className="space-y-4">
            {comments.length > 0 ? (
              <>
                {visibleComments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-indigo-500 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-semibold text-gray-800">{comment.author}</span>
                        <span className="text-gray-500 text-sm ml-2">
                          {new Date(comment.commented_time).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {expandedComments[comment.id]
                        ? comment.comment
                        : comment.comment.slice(0, 200)}
                      {comment.comment.length > 200 && (
                        <button
                          onClick={() => toggleExpand(comment.id)}
                          className="text-indigo-600 hover:underline ml-2"
                        >
                          {expandedComments[comment.id] ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </p>
                  </div>
                ))}
                {comments.length > 3 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-indigo-600 mt-2 hover:underline"
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500">No comments yet</p>
            )}
          </div>
        </div>

        {/* File Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">File</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowFile(!showFile)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaEye size={18} />
              <span>{showFile ? "Hide File" : "View File"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaDownload size={18} />
              <span>Download</span>
            </button>
            <a
              href={`http://localhost:5000/user_report/${report.report_file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <FaExternalLinkAlt size={18} />
              <span>Open in New Tab</span>
            </a>
          </div>

          {/* File Preview */}
          {showFile && (
            <div className="mt-6 border rounded-lg overflow-hidden shadow">
              <embed
                src={`http://localhost:5000/user_report/${report.report_file}`}
                type="application/pdf"
                width="100%"
                height="500px"
                onError={(e) => {
                  console.error("Failed to load the file", e);
                  alert("The file could not be loaded. Please try again later.");
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewWorkReport;
