import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiSave,
  FiArrowLeft,
  FiUpload,
  FiX,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiUsers,
  FiFile,
} from "react-icons/fi";
import { Spin } from "antd";
import { FaSpinner } from "react-icons/fa";

// Helper functions for date handling
const convertToInputFormat = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
};

const convertToBackendFormat = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString(); // Send as ISO string to backend
};

const formatDisplayDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const LetterEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State management
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [csoOptions, setCsoOptions] = useState([]);
  const [originalData, setOriginalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCsoList, setShowCsoList] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    type: "Announcement",
    date: "",
    attachmentPath: "",
    attachmentName: "",
    sendToAll: false,
    selectedCsos: [],
  });

  // Helper functions
  const getCsoDetails = useCallback(
    (csoId) => {
      return csoOptions.find((c) => c.id === csoId);
    },
    [csoOptions]
  );

  const filteredCsoOptions = csoOptions.filter((cso) => {
    return (
      searchTerm === "" ||
      (cso.csoName &&
        cso.csoName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cso.registrationId &&
        cso.registrationId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [letterResponse, csoResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/letters/get/${id}`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/cso/get`, {
            withCredentials: true,
          }),
        ]);

        const letterData = letterResponse.data.data;
        const csoData = csoResponse.data.data || csoResponse.data || [];

        if (!letterData) throw new Error("Letter data not found");

        setCsoOptions(csoData);

        // Process selected CSOs
        let selectedCsos = [];
        if (letterData.selectedCsos) {
          if (letterData.selectedCsos.items) {
            selectedCsos = letterData.selectedCsos.items.map((item) => item.id);
          } else if (Array.isArray(letterData.selectedCsos)) {
            selectedCsos = letterData.selectedCsos;
          } else {
            try {
              selectedCsos = JSON.parse(
                letterData.selectedCsos.replace(/'/g, '"')
              );
              if (!Array.isArray(selectedCsos)) selectedCsos = [selectedCsos];
            } catch (e) {
              selectedCsos = [letterData.selectedCsos];
            }
          }
        }

        const normalizedCsos = selectedCsos
          .map((cso) => (typeof cso === "object" ? cso.id : parseInt(cso, 10)))
          .filter((id) => !isNaN(id));

        const originalDate = letterData.date ? convertToInputFormat(letterData.date) : "";
  
        // Convert sendToAll to boolean
        const sendToAllBoolean = letterData.sendToAll === true || 
                               letterData.sendToAll === 1 || 
                               letterData.sendToAll === "1" || 
                               letterData.sendToAll === "true";

        setFormData({
          title: letterData.title || "",
          summary: letterData.summary || "",
          type: letterData.type || "Announcement",
          date: originalDate,
          attachmentPath: letterData.attachmentPath || "",
          attachmentName: letterData.attachmentName || "",
          sendToAll: sendToAllBoolean,
          selectedCsos: normalizedCsos,
        });

        setOriginalData({
          ...letterData,
          date: letterData.date, // Store original date string
          selectedCsos: normalizedCsos,
        });

        if (letterData.attachmentPath) {
          setPreviewUrl(
            `${process.env.REACT_APP_API_URL}/${letterData.attachmentPath}`
          );
        }
      } catch (error) {
        navigate(-1);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load data"
        );
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleCsoSelection = (csoId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedCsos.includes(csoId);
      const newSelection = isSelected
        ? prev.selectedCsos.filter((id) => id !== csoId)
        : [...prev.selectedCsos, csoId];
      return { ...prev, selectedCsos: newSelection };
    });
    if (errors.selectedCsos)
      setErrors((prev) => ({ ...prev, selectedCsos: "" }));
  };

  const toggleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      selectedCsos: selectAll
        ? []
        : [
            ...new Set([
              ...prev.selectedCsos,
              ...filteredCsoOptions.map((cso) => cso.id),
            ]),
          ],
    }));
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (filteredCsoOptions.length > 0) {
      setSelectAll(
        filteredCsoOptions.every((cso) =>
          formData.selectedCsos.includes(cso.id)
        )
      );
    }
  }, [formData.selectedCsos, filteredCsoOptions]);

  // File handling
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "File size should be less than 5MB",
      }));
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Only PDF, DOC, DOCX, JPG, and PNG files are allowed",
      }));
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, file: "" }));

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl("");
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({
      ...prev,
      attachmentPath: "",
      attachmentName: "",
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Form validation and submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length > 100)
      newErrors.title = "Title must be less than 100 characters";

    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    else if (formData.summary.length > 250)
      newErrors.summary = "Summary must be less than 250 characters";

    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.date) newErrors.date = "Date is required";

    if (!formData.sendToAll && formData.selectedCsos.length < 1)
      newErrors.selectedCsos = "Please select at least 1 CSO";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Fix validation errors");
      return;
    }

    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("summary", formData.summary);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("date", convertToBackendFormat(formData.date));
      formDataToSend.append("sendToAll", formData.sendToAll.toString());
      formDataToSend.append(
        "selectedCsos",
        JSON.stringify(formData.sendToAll ? [] : formData.selectedCsos)
      );
      if (file) formDataToSend.append("attachment", file);

      const updateResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/letters/${id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (updateResponse.data.success) {
        toast.success("Letter updated successfully");
        navigate("/admin/letter_list");
      } else {
        throw new Error(updateResponse.data.message || "Update failed");
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="medium" />
      </div>
    );
  }

  // UI Components
  const renderFilePreview = () => {
    if (!previewUrl || !file?.type.startsWith("image/")) return null;
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
        <img
          src={previewUrl}
          alt="Preview"
          className="max-w-full max-h-48 rounded-md border"
        />
      </div>
    );
  };

  const renderSelectedCsos = () => {
    if (formData.selectedCsos.length === 0) return null;
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selected Organizations ({formData.selectedCsos.length})
        </label>
        <div className="flex flex-wrap gap-2">
          {formData.selectedCsos.map((csoId) => {
            const cso = getCsoDetails(csoId);
            return (
              <span
                key={csoId}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {cso?.csoName || `CSO ${csoId}`}
                <button
                  type="button"
                  onClick={() => toggleCsoSelection(csoId)}
                  className="ml-1.5 text-red-500 hover:text-red-700"
                  disabled={formData.selectedCsos.length <= 1}
                >
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCsoList = () => {
    if (!showCsoList) return null;
    return (
      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-y-auto">
        <div className="sticky top-0 bg-white p-2 border-b">
          <input
            type="text"
            placeholder="Search CSOs..."
            className="w-full p-2 text-sm border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="p-2 border-b flex items-center">
          <input
            type="checkbox"
            id="selectAllCsos"
            checked={selectAll}
            onChange={toggleSelectAll}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="selectAllCsos"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            Select All ({filteredCsoOptions.length} CSOs)
          </label>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredCsoOptions.length > 0 ? (
            filteredCsoOptions.map((cso) => {
              const csoId = cso.id;
              const isSelected = formData.selectedCsos.includes(csoId);
              const isOriginal = originalData?.selectedCsos.includes(csoId);

              return (
                <div
                  key={csoId}
                  className={`p-2 hover:bg-gray-50 cursor-pointer flex items-center ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleCsoSelection(csoId)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-2">
                    <div className="text-sm font-medium text-gray-700">
                      {cso.csoName || `CSO ${csoId}`}
                      {isOriginal && (
                        <span className="ml-2 text-xs text-green-600">
                          (Originally selected)
                        </span>
                      )}
                    </div>
                    {cso.registrationId && (
                      <div className="text-xs text-gray-500">
                        Reg ID: {cso.registrationId}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-3 text-sm text-gray-500 text-center">
              No CSOs found matching your search
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/admin/letter_list"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-2" />
          <span className="font-medium">Back to Letters</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Communication</h1>
        <div className="w-8"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiInfo className="mr-2 text-blue-500" /> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter letter title"
                  maxLength={100}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Notice">Notice</option>
                  <option value="Memo">Memo</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={5}
                className={`w-full p-2 border rounded-md ${
                  errors.summary ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter letter summary"
                maxLength={1000}
              />
              {errors.summary && (
                <p className="text-red-500 text-xs mt-1">{errors.summary}</p>
              )}
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.summary.length}/250 characters
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
              {originalData?.date && (
                <p className="text-xs text-gray-500 mt-1">
                  Original Date: {formatDisplayDate(originalData.date)}
                </p>
              )}
            </div>
          </div>

          {/* Distribution Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUsers className="mr-2 text-blue-500" /> Distribution
            </h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="sendToAll"
                name="sendToAll"
                checked={formData.sendToAll}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    sendToAll: isChecked,
                    selectedCsos: isChecked ? [] : prev.selectedCsos
                  }));
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="sendToAll"
                className="ml-2 block text-sm text-gray-700"
              >
                Send to all CSOs
              </label>
            </div>
            {!formData.sendToAll && (
              <div className="space-y-4">
                {renderSelectedCsos()}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCsoList(!showCsoList)}
                    className="w-full flex justify-between items-center p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span>
                      Select CSOs ({formData.selectedCsos.length} selected)
                    </span>
                    {showCsoList ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {renderCsoList()}
                </div>
                {errors.selectedCsos && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.selectedCsos}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Attachment Section */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUpload className="mr-2 text-blue-500" /> Attachments
            </h2>
            <div className="space-y-4">
              {formData.attachmentPath && !file && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center">
                    <FiFile className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">
                        {formData.attachmentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.attachmentPath.split(".").pop().toUpperCase()}{" "}
                        File
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
                    >
                      <FiDownload className="mr-1" /> Download
                    </a>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50 flex items-center"
                    >
                      <FiX className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {file ? "New Attachment" : "Upload Attachment"}
                </label>
                {file ? (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="flex items-center">
                      <FiFile className="text-blue-500 mr-2" />
                      <p className="text-sm font-medium">{file.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
                {errors.file && (
                  <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                )}
              </div>
              {renderFilePreview()}
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/letter_list")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LetterEdit;