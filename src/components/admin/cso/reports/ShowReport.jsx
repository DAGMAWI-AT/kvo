import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaDownload,
  FaExternalLinkAlt,
  FaEye,
  FaCommentDots,
  FaArrowLeft,
} from "react-icons/fa";

const ShowReport = () => {
  const navigate = useNavigate();
  const report = useLoaderData();
  const [showFile, setShowFile] = useState(false);
  const [comments, setComment] = useState({ comment: "", comment_file: null });
  const [commentData, setCommentData] = useState([]);
  const [categories, setCategories] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [authors, setAuthorName] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});

  const visibleComments = showAll ? commentData : commentData.slice(0, 3);

  useEffect(() => {
    if (report?.id) {
      const fetchComments = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/comments/comment/${report.id}`
          );
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const data = await response.json();
          setCommentData(data.comments || []);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
      fetchComments();
    }
  }, [report?.id]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setComment((prev) => ({
      ...prev,
      [name]: name === "comment_file" ? files[0] : value,
    }));
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reportCategory/${report.category_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch category");
        const data = await response.json();
        setCategories(data.category_name);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchCategory();
  }, [report.category_id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    try {
      const decodedToken = jwtDecode(token);
      const { registrationId } = decodedToken;

      if (!registrationId) {
        setError("Author information missing in token");
        return;
      }

      const staffResponse = await fetch(
        `http://localhost:5000/api/staff/byid/${registrationId}`
      );
      if (!staffResponse.ok) throw new Error(`Error: ${staffResponse.status}`);
      const staffData = await staffResponse.json();

      const name = staffData.name || staffData[0]?.name;
      if (!name) throw new Error("Staff name not found");
      setAuthorName(name);

      const formData = new FormData();
      formData.append("comment", comments.comment);
      formData.append("comment_file", comments.comment_file);
      formData.append("report_id", report.id);
      formData.append("registration_id", report.registration_id);
      formData.append("author", name);
      formData.append("author_id", registrationId);

      const response = await fetch(`http://localhost:5000/api/comments`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit comment");
      }

      const newResponse = await fetch(
        `http://localhost:5000/api/comments/comment/${report.id}`
      );
      const newData = await newResponse.json();
      setCommentData(newData.comments || []);

      setSuccessMessage("Comment submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setComment({ comment: "", comment_file: null });
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "Failed to submit comment");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleDownload = () => {
    const fileUrl = `http://localhost:5000/user_report/${report.report_file}`;
    fetch(fileUrl)
      .then((response) => response.blob())
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
        setError("Failed to download file");
      });
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Report not found!</p>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() =>
              navigate(`/admin/each_cso/${report.registration_id}`)
            }
            className="flex items-center space-x-2 lg:px-6 lg:py-3 px-3 py-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-md border border-gray-200 hover:shadow-lg"
            aria-label="Back to CSO"
          >
            <FaArrowLeft size={20} className="text-blue-600" />
            <span className="font-medium">Back to Organization</span>
          </button>
          <h1 className="text-xl lg:text-4xl p-4 font-bold font-[Poppins] text-gray-900 tracking-tight">
            {report.report_name}
          </h1>
        </div>

        {/* Report Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Status
              </h3>
              <p
                className={`text-lg font-medium ${
                  report.response === "Approved"
                    ? "text-emerald-600"
                    : report.response === "Pending"
                    ? "text-amber-500"
                    : "text-rose-600"
                }`}
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50/50 text-emerald-700">
                  {report.response}
                </span>
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Submitted
              </h3>
              <p className="text-gray-900 font-medium">
                {new Date(report.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Last Updated
              </h3>
              <p className="text-gray-900 font-medium">
                {new Date(report.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Category
              </h3>
              <p className="text-gray-900 font-medium">{categories}</p>
            </div>

            <div className="md:col-span-2 xl:col-span-4 pt-6">
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Summary
                </h3>
                <p className="text-gray-700 leading-relaxed font-[Inter] text-lg">
                  {report.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* File Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              onClick={() => setShowFile(!showFile)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
              aria-label={showFile ? "Hide File" : "View File"}
            >
              <FaEye size={18} />
              <span>{showFile ? "Hide File" : "View File"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
              aria-label="Download File"
            >
              <FaDownload size={18} />
              <span>Download File</span>
            </button>
            <a
              href={`http://localhost:5000/user_report/${report.report_file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
              aria-label="Open in New Tab"
            >
              <FaExternalLinkAlt size={18} />
              <span>Open in New Tab</span>
            </a>
          </div>

          {showFile && (
            <div className="mt-6">
              <embed
                src={`http://localhost:5000/user_report/${report.report_file}`}
                type="application/pdf"
                className="w-full min-h-[500px] rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <FaCommentDots size={24} />
            <span>Comments ({commentData.length})</span>
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="space-y-6 mb-8">
            {commentData.length > 0 ? (
              <>
                {visibleComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-semibold text-gray-800">
                          {comment.author}
                        </span>
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
                          {expandedComments[comment.id]
                            ? "Read Less"
                            : "Read More"}
                        </button>
                      )}
                    </p>
                    {comment.comment_file &&
                      comment.comment_file !== "null" && (
                        <a
                          href={`http://localhost:5000/comment/${comment.comment_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline mt-2 inline-block"
                        >
                          View attached file
                        </a>
                      )}
                  </div>
                ))}
                {commentData.length > 3 && (
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

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="border-t pt-6">
            <div className="mb-6">
              <textarea
                name="comment"
                value={comments.comment}
                onChange={handleChange}
                placeholder="Write your comment..."
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="4"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="file"
                name="comment_file"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShowReport;
