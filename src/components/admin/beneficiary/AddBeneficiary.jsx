import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkedAlt,
  FaHome,
  FaFilePdf,
  FaFileWord,
  FaBirthdayCake,
  FaSchool,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AddBeneficiary = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    kebele: "",
    location: "",
    wereda: "",
    age: "",
    gender: "",
    school: "",
    kfleketema: "",
    houseNo: "",
  });

  const [files, setFiles] = useState({
    idFile: null,
    photo: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();

    // Append form fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Append files if available
    Object.entries(files).forEach(([key, file]) => {
      if (file) data.append(key, file);
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/beneficiaries`,
        {
          method: "POST",
          body: data,
          credentials: "include",
        }
      );

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Beneficiary registered successfully!");
        navigate("/admin/beneficiary_list");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Array for text fields with icons (excluding gender, which is handled separately)
  const textFields = [
    { label: "Full Name", name: "fullName", type: "text", icon: FaUserAlt },
    { label: "Phone", name: "phone", type: "tel", icon: FaPhoneAlt },
    {
      label: "Email",
      name: "email",
      type: "email",
      icon: FaEnvelope,
      optional: true,
    },
    { label: "Kebele", name: "kebele", type: "text", icon: FaHome },
    { label: "Location", name: "location", type: "text", icon: FaMapMarkedAlt },
    { label: "Wereda", name: "wereda", type: "text", icon: FaMapMarkedAlt },
    { label: "Age", name: "age", type: "number", icon: FaBirthdayCake, min: 0 },
    {
      label: "School",
      name: "school",
      type: "text",
      icon: FaSchool,
      optional: true,
    },
    {
      label: "Kfleketema",
      name: "kfleketema",
      type: "text",
      icon: FaMapMarkedAlt,
    },
    { label: "House No", name: "houseNo", type: "text", icon: FaHome },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Add Beneficiary
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-gray-600 font-medium">
                <FaFileWord className="inline mr-2 text-blue-500" />
                Photo
              </label>
              {files.photo && (
                <span className="text-blue-500 underline block mb-2">
                  {files.photo.name}
                </span>
              )}
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-600 font-medium">
                <FaFilePdf className="inline mr-2 text-red-500" />
                ID File
              </label>
              {files.idFile && (
                <span className="text-blue-500 underline block mb-2">
                  {files.idFile.name}
                </span>
              )}
              <input
                type="file"
                name="idFile"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Text Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textFields.map(
              ({ label, name, type, icon: Icon, min, optional }) => (
                <div className="relative" key={name}>
                  <label className="block text-gray-600 font-medium mb-2">
                    {label}
                    {!optional && <span className="text-red-500">*</span>}
                  </label>
                  <Icon className="absolute left-3 top-10 text-blue-800" />
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!optional}
                    {...(min !== undefined ? { min } : {})}
                  />
                </div>
              )
            )}
            {/* Gender Select Field */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="pl-3 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/beneficiary_list")}
              className="flex items-center justify-center w-32 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center w-44 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Add Beneficiary"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBeneficiary;
