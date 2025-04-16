import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiDownload,
  FiArrowLeft,
  FiEdit2,
  FiUsers,
  FiCalendar,
  FiUser,
  FiFile,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { Spin } from "antd";

const LetterView = () => {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState([]);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const [maxVisibleRecipients] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/letters/get/${id}`,
          { withCredentials: true }
        );

        const letterData = response.data.data;
        let selectedCsos = [];

        if (letterData.sendToAll === 0 && letterData.selectedCsos?.items) {
          // Map over the selectedCsos.items and check the read and read_at values
          selectedCsos = letterData.selectedCsos.items.map(item => {
            return {
              id: item.id,
              read: item.read,
              readAt: item.read_at,
            };
          });
        }

        setLetter({
          ...letterData,
          selectedCsos,
        });
        console.log("Selected CSOs: ", selectedCsos);

        if (selectedCsos.length > 0 && !letterData.sendToAll) {
          fetchRecipients(selectedCsos);
        }

        setLoading(false);
      } catch (error) {
        // toast.error(error.message);
        setLoading(false);
      }
    };

    const fetchRecipients = async (selectedCsos) => {
      try {
        setRecipientsLoading(true);
    
        // Extract the `id` values from selectedCsos
        const csoIds = selectedCsos.map(item => item.id);
    
        const responses = await Promise.all(
          csoIds.map(id =>
            axios.get(`${process.env.REACT_APP_API_URL}/api/cso/res/${id}`, {
              withCredentials: true,
            }).catch(e => null) // Handle errors gracefully
          )
        );
    
        // Filter valid responses and merge with read status
        const validRecipients = responses
          .filter(res => res?.data) // Check if response has data
          .map(res => {
            const csoData = res.data.data || res.data;
            // Find the matching selectedCso to get read status
            const selectedCso = selectedCsos.find(cso => cso.id === csoData?.id);
    
            return {
              id: csoData?.id,
              csoName: csoData?.csoName || csoData?.name || `CSO ${csoData?.id}`,
              registrationId: csoData?.registrationId,
              read: selectedCso?.read || 0, // Default to unread if not found
              readAt: selectedCso?.readAt || null
            };
          });
    
        // Set the valid recipients
        setRecipients(validRecipients);
      } catch (error) {
        // toast.error("Failed to load recipient details");
      } finally {
        setRecipientsLoading(false);
      }
    };

    fetchLetter();
  }, [id]);
  

  const typeColors = {
    Announcement: "bg-blue-100 text-blue-800 border-blue-200",
    Meeting: "bg-green-100 text-green-800 border-green-200",
    Notice: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const renderFilePreview = (fileUrl) => {
    if (!fileUrl) return null;

    const fileExtension = fileUrl.split(".").pop().toLowerCase();
    const fullFileUrl = `${process.env.REACT_APP_API_URL}/${fileUrl}`;

    if (fileExtension === "pdf") {
      return (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <iframe
            src={fullFileUrl}
            className="w-full h-96"
            title="Document Preview"
          />
        </div>
      );
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      return (
        <div className="mt-4 flex justify-center">
          <img
            src={fullFileUrl}
            alt="Document Preview"
            className="max-w-full max-h-96 rounded-lg shadow-sm border"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          />
        </div>
      );
    }
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <p className="text-gray-600">
          <FiDownload className="inline mr-2" />
          Unsupported file type. Please download to view.
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">
          Letter Not Found
        </h1>
        <Link
          to="/admin/letter_list"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiArrowLeft /> Back to Letters
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <Link
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="h-5 w-5" />
          <span className="font-medium">All Communications</span>
        </Link>
        <Link
          to={`/admin/letter_edit/${letter.id}`}
          className="flex items-center gap-2 px-4 py-2 border text-gray-300 bg-blue-700 rounded-lg hover:bg-gray-50"
        >
          <FiEdit2 className="h-5 w-5" /> Edit
        </Link>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Document Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {letter.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    typeColors[letter.type]
                  }`}
                >
                  {letter.type}
                </span>
                <span className="text-xs text-gray-500">
                  Updated:{" "}
                  {new Date(letter.updatedAt).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <FiUser className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Author</p>
                  <p className="text-sm font-medium">
                    {letter.createdBy || "System Admin"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <FiCalendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(letter.createdAt).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution Section */}
        <div className="p-6 border-b border-gray-200">
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-blue-50 rounded-lg">
      <FiUsers className="h-5 w-5 text-blue-600" />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Sent to
      </h2>
      <p className="text-xs text-gray-500">
        {letter.sendToAll
          ? "All partner organizations"
          : "Selected organizations"}
      </p>
    </div>
  </div>

  {letter.sendToAll ? (
    <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700">
      Sent to all registered partner organizations
    </div>
  ) : recipientsLoading ? (
    <div className="flex justify-center py-4">
      <Spin size="small" />
    </div>
  ) : recipients.length > 0 ? (
    <div>
      {/* Horizontal list for recipients */}
      <div className="flex flex-wrap gap-2 mb-2">
  {recipients
    .slice(0, showAllRecipients ? recipients.length : maxVisibleRecipients)
    .map((cso) => {
      // console.log(cso); // Debugging: Check the recipient data
      return (
        <div
          key={cso.id}
          className="flex-shrink-0 p-2 bg-white border border-gray-200 rounded-lg hover:border-blue-200"
        >
          <div className="flex items-center gap-2">
            <FiUsers className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium">
              {cso.csoName}
            </span>
            {cso.registrationId && (
              <span className="text-xs text-gray-500">
                ({cso.registrationId})
              </span>
            )}
          </div>

          {/* Read/Unread status */}
          <div className="text-xs text-gray-500 mt-1">
            {cso.read === 1 ? (
              <span className="text-green-500">Read</span>
            ) : (
              <span className="text-red-500">Unread</span>
            )}

            {/* If read, show readAt timestamp */}
            {cso.read === 1 && cso.readAt && (
              <span className="text-xs text-gray-400 ml-2">
                (Read at: {new Date(cso.readAt).toLocaleString()})
              </span>
            )}
          </div>
        </div>
      );
    })}
</div>


      {/* Show More/Less toggle */}
      {recipients.length > maxVisibleRecipients && (
        <button
          onClick={() => setShowAllRecipients(!showAllRecipients)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
        >
          {showAllRecipients ? (
            <>
              <FiChevronUp className="h-3 w-3" />
              Show Less
            </>
          ) : (
            <>
              <FiChevronDown className="h-3 w-3" />
              Show All ({recipients.length})
            </>
          )}
        </button>
      )}

      {/* Detailed view (original layout) when expanded */}
    </div>
  ) : (
    <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-700">
      {letter.selectedCsos.length > 0
        ? `Recipient details unavailable for organization IDs: ${letter.selectedCsos.join(
            ", "
          )}`
        : "No specific organizations selected"}
    </div>
  )}
</div>

        {/* Document Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Summary
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                {letter.summary || (
                  <p className="text-gray-400 italic">No summary provided</p>
                )}
              </div>
            </div>

            {letter.attachmentPath && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FiDownload className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Attachments
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-white rounded border">
                      <FiFile className="h-4 w-4 text-gray-500" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        {letter.attachmentName}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`${process.env.REACT_APP_API_URL}/${letter.attachmentPath}`}
                    className="px-3 py-1.5 bg-white border text-gray-700 rounded hover:bg-gray-50 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>

                {renderFilePreview(letter.attachmentPath)}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 text-xs text-gray-500">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div>
              <p>Document ID: {letter.id}</p>
            </div>
            <div className="text-right">
              <p>
                {new Date().toLocaleDateString("en-US", {
                  dateStyle: "medium",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterView;
