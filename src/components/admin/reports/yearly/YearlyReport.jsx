import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { allreport } from "../../cso/each/EachCso"; // Adjust the path if needed

const YearlyReport = () => {
  const location = useLocation();
  const { id } = useParams(); // Get ID from URL
  const [comments, setComments] = useState(""); // Initialize with existing comments
  const [newComment, setNewComment] = useState(""); // State for the new comment

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const yearly_report = allreport.find((report) => report.id === parseInt(id)); // Find the matching report

  useEffect(() => {
    if (yearly_report) {
      setComments(yearly_report.comment); // Initialize with existing comments
    }
  }, [yearly_report]);

  if (!yearly_report) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Report Not Found
          </h1>
          <p className="text-gray-600">
            No report found with ID: {id}. Please check the URL or contact
            support.
          </p>
        </div>
      </div>
    );
  }

  // Construct the file URLs
  const viewUrl = `https://drive.google.com/viewerng/viewer?url=${encodeURIComponent(
    `https://yourserver.com/reports/${yearly_report.reportFile}`
  )}`;
  const downloadUrl = `https://yourserver.com/reports/${yearly_report.reportFile}`;

  // Handle comment submission
  const handleAddComment = () => {
    if (newComment.trim() === "") return; // Prevent empty comments
    const updatedComments = comments
      ? `${comments}, ${newComment.trim()}`
      : newComment.trim(); // Append the new comment
    setComments(updatedComments); // Update the state
    setNewComment(""); // Clear the input field
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="ml-4">
          <h1 className="text-3xl font-bold font-serif text-gray-400 mb-4">
            Yearly Report Details
          </h1>
          <p className="text-gray-600">
            <b>Report ID:</b> {yearly_report.id}
          </p>
          <p className="text-gray-600 mt-2">
            <b>Name:</b> {yearly_report.name}
          </p>
          <p className="text-gray-600 mt-2">
            <b>Type:</b> {yearly_report.type}
          </p>
          <p className="text-gray-600 mt-2">
            <b>Date:</b> {yearly_report.date}
          </p>
          <p className="text-gray-600 mt-4">
            Additional details can be displayed here, like:
          </p>
          <p className="text-gray-600 mt-2">
            <b>Status :</b> {yearly_report.status}
          </p>
          <p className="text-gray-600 mt-2">
            <b>Comments:</b> {comments || "No comments yet."}
          </p>
          <div className="text-gray-600 mt-4">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mr-4"
            >
              View Report File
            </a>
            <a
              href={downloadUrl}
              download
              className="text-blue-500 underline"
            >
              Download Report File
            </a>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-2xl font-bold text-gray-500">Add a Comment</h2>
          <div className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            ></textarea>
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Submit Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyReport;
