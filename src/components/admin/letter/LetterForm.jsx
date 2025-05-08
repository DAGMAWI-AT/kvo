import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiSave,
  FiArrowLeft,
  FiUpload,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
  FiFile,
  FiInfo,
} from "react-icons/fi";
import { Spin } from "antd";

const LetterForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [csoOptions, setCsoOptions] = useState([]);
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

  const fileInputRef = useRef(null);

  // Fetch CSO data on component mount
  useEffect(() => {
    const fetchCsos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/cso/get`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setCsoOptions(data.data || data);
      } catch (error) {
        console.error("Error fetching CSOs:", error);
        toast.error("Failed to load CSO data");
      } finally {
        setLoading(false);
      }
    };

    fetchCsos();
  }, []);

  // Filter CSOs based on search term
  const filteredCsoOptions = csoOptions.filter((cso) => {
    const matchesSearch =
      searchTerm === "" ||
      (cso.csoName &&
        cso.csoName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cso.registrationId && cso.registrationId.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Get CSO details by ID
  const getCsoDetails = (csoId) => {
    return csoOptions.find((c) => (c.id) === csoId);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Toggle CSO selection
  const toggleCsoSelection = (csoId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedCsos.includes(csoId);
      let newSelection;

      if (isSelected) {
        newSelection = prev.selectedCsos.filter((id) => id !== csoId);
      } else {
        newSelection = [...prev.selectedCsos, csoId];
      }

      return { ...prev, selectedCsos: newSelection };
    });

    if (errors.selectedCsos) {
      setErrors((prev) => ({ ...prev, selectedCsos: "" }));
    }
  };

  // Toggle select all CSOs
  const toggleSelectAll = () => {
    setFormData((prev) => {
      const allCsoIds = filteredCsoOptions.map((cso) => cso.id);
      const newSelectedCsos = selectAll
        ? prev.selectedCsos.filter((id) => !allCsoIds.includes(id))
        : [...new Set([...prev.selectedCsos, ...allCsoIds])];

      return { ...prev, selectedCsos: newSelectedCsos };
    });

    setSelectAll(!selectAll);
    if (errors.selectedCsos)
      setErrors((prev) => ({ ...prev, selectedCsos: "" }));
  };

  // Update selectAll state when selectedCsos or filtered options change
  useEffect(() => {
    if (filteredCsoOptions.length > 0) {
      const allSelected = filteredCsoOptions.every((cso) =>
        formData.selectedCsos.includes(cso.id)
      );
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [formData.selectedCsos, filteredCsoOptions]);

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "File size should be less than 5MB",
      }));
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Only PDF, DOC, DOCX, JPG, and PNG files are allowed",
      }));
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, file: "" }));

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl("");
    }
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    } else if (formData.summary.length > 250) {
      newErrors.summary = "Summary must be less than 250 characters";
    }

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    if (!formData.sendToAll && formData.selectedCsos.length < 1) {
      newErrors.selectedCsos = "Please select at least 1 CSO";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("summary", formData.summary);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("sendToAll", formData.sendToAll);
      formDataToSend.append(
        "selectedCsos",
        JSON.stringify(formData.sendToAll ? [] : formData.selectedCsos)
      );

      if (file) {
        formDataToSend.append("attachment", file);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/letters/submit`,
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include",
        }
      );

      const result = await response.json();
      if (!response.ok) {
        const error = new Error(result.message || "Failed to create letter");
        error.status = response.status;
        throw error;
      }

      toast.success("Letter created successfully!");
      navigate("/admin/letter_list");
    } catch (error) {
      console.error("Error creating letter:", error);
      if (error.status === 401) {
        navigate("/login");
      }
      toast.error(error.message || "Failed to create letter");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-800">
          Create New Letter
        </h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiInfo className="mr-2 text-blue-500" />
              Basic Information
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
                maxLength={250}
              />
              {errors.summary && (
                <p className="text-red-500 text-xs mt-1">{errors.summary}</p>
              )}
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.summary.length}/250 characters
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary <span className="text-red-500">*</span>
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
              <div className="text-xs text-gray-500 mt-1 text-right">
              </div>
            </div>
          </div>

          {/* Distribution Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUsers className="mr-2 text-blue-500" />
              Distribution
            </h2>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="sendToAll"
                name="sendToAll"
                checked={formData.sendToAll}
                onChange={handleChange}
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="selectAllCsos"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="selectAllCsos"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Select all {filteredCsoOptions.length} CSOs
                  </label>
                </div>

                {/* Selected CSOs Chips */}
                {formData.selectedCsos.length > 0 && (
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
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CSO Selection Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCsoList(!showCsoList)}
                    className="w-full flex justify-between items-center p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span>Select CSOs (minimum 1 required)</span>
                    {showCsoList ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {showCsoList && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-y-auto">
                      {/* Search Input */}
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
                      {/* CSO List */}
                      <div className="divide-y divide-gray-200">
                        {filteredCsoOptions.length > 0 ? (
                          filteredCsoOptions.map((cso) => {
                            const csoId = cso.id;
                            const isSelected =
                              formData.selectedCsos.includes(csoId);

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
                                  onChange={() => {}}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="ml-2">
                                  <div className="text-sm font-medium text-gray-700">
                                    {cso.csoName ||
                                      `CSO ${cso.registrationId || csoId}`}
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
                  )}
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
              <FiUpload className="mr-2 text-blue-500" />
              Attachments
            </h2>

            <div className="space-y-4">
              {/* File Upload */}
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

              {/* File Preview */}
              {previewUrl && file?.type.startsWith("image/") && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </h3>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-48 rounded-md border"
                  />
                </div>
              )}
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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Create Letter
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LetterForm;
