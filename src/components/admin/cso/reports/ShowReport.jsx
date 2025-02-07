import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ShowReport = () => {
  const navigate = useNavigate();
  const report = useLoaderData();
  const [showFile, setShowFile] = useState(false);
  const [comments, setComment] = useState({ comment_file: null });
  const [commentData, setCommentData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [authors, setAuthorName] = useState([]);
  useEffect(() => {
    if (report?.id) {
      const fetchComments = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/comments/comment/${report.id}`
          );
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const data = await response.json();
          // Access the comments array from the response object
          setCommentData(data.comments || []);
        } catch (error) {
          console.error("Error fetching comments:", error);
          setError("Failed to fetch comments. Please try again later.");
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
      // Fetch staff name
      const staffResponse = await fetch(`http://localhost:5000/api/staff/byid/${registrationId}`);
      if (!staffResponse.ok) throw new Error(`Error: ${staffResponse.status}`);
      const staffData = await staffResponse.json();
      
      // Assuming staffData is an object with name property
      const name = staffData.name || staffData[0]?.name;
      if (!name) throw new Error("Staff name not found");
      setAuthorName(name);
      console.log(name)
      const formData = new FormData();
      formData.append("comment", comments.comment);
      formData.append("comment_file", comments.comment_file);
      formData.append("report_id", report.id);
      formData.append("registration_id", report.registration_id);
      formData.append("author", name);
      formData.append("author_id", registrationId);

      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit comment");
      }

      // Refresh comments after successful submission
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
        alert("Failed to download file");
      });
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Report not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(`/admin/each_cso/${report.registration_id}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-700">
            View Report: {report.report_name}
          </h1>
        </div>

        {/* Report Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
              <p
                className={`text-lg ${
                  report.response === "Approved"
                    ? "text-green-600"
                    : report.response === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {report.response}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Due Date</h3>
              <p className="text-gray-600">
                {new Date(report.expireDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Report Type</h3>
              <p className="text-gray-600">{report.reportType}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
              <p className="text-gray-600">{report.description}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}


        {/* File Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowFile(!showFile)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showFile ? "Hide File" : "View File"}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Download File
            </button>
          </div>

          {showFile && (
            <div className="mt-4">
              <embed
                src={`http://localhost:5000/user_report/${report.report_file}`}
                type="application/pdf"
                className="w-full min-h-96"
              />
            </div>
          )}
        </div>


        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Comments ({commentData.length})</h2>
          
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <div className="space-y-4 mb-8">
            {commentData.length > 0 ? (
              commentData.map((comment) => (
                <div key={comment.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(comment.commented_time).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                  {comment.comment_file && comment.comment_file !== "null" && (
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
              ))
            ) : (
              <p className="text-gray-500">No comments yet</p>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="border-t pt-4">
            <div className="mb-4">
              <textarea
                name="comment"
                value={comments.comment}
                onChange={handleChange}
                placeholder="Write your comment..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="file"
                name="comment_file"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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