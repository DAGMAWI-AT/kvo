import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FaEnvelope,
  FaHome,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaTypo3,
  FaUserAlt,
} from "react-icons/fa";

const CsoRegister = () => {
  const [formData, setFormData] = useState({ role: "cso", status: "active" });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [showCustomSector, setShowCustomSector] = useState(false); // State to track if "Other" is selected

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "sector" && value === "Other") {
      setShowCustomSector(true); // Show custom sector input when "Other" is selected
    } else if (name === "sector") {
      setShowCustomSector(false); // Hide custom sector input for other options
    }
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Store the file
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmitCSO = async (e) => {
    e.preventDefault();
    setError("");

    const formDataObj = new FormData();
    formDataObj.append("csoName", formData.csoName);
    formDataObj.append("repName", formData.repName);
    formDataObj.append("sector", showCustomSector ? formData.customSector : formData.sector); // Use custom sector if "Other" is selected
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("location", formData.location);
    formDataObj.append("office", formData.office);
    formDataObj.append("status", formData.status);
    formDataObj.append("logo", formData.logo);
    formDataObj.append("tin_certificate", formData.tin_certificate);
    formDataObj.append("registration_certificate", formData.registration_certificate);
    formDataObj.append("role", formData.role);
    try {
      const response = await fetch("http://localhost:5000/api/cso/register", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An unexpected error occurred.");
        return;
      }

      const result = await response.json();
      if (result.success) {
        setSuccessMessage("CSO registered successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        // Clear form data
        setFormData({
          csoName: "",
          repName: "",
          sector: "",
          email: "",
          phone: "",
          location: "",
          office: "",
          status: "active",
          logo: null,
          tin_certificate: null,
          registration_certificate: null,
          role: "cso",
        });

        // Navigate after showing the message
        setTimeout(() => navigate("/admin/cso_list"), 3000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    }
  };

  const handleSubmitStaff = async (e) => {
    e.preventDefault();
    setError("");

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("status", formData.status);
    formDataObj.append("photo", formData.photo);
    formDataObj.append("role", formData.role);

    try {
      const response = await fetch("http://localhost:5000/api/staff/register", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An unexpected error occurred.");
        return;
      }

      const result = await response.json();
      if (result.success) {
        setSuccessMessage("Staff registered successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        // Clear form data
        setFormData({
          name: "",
          email: "",
          phone: "",
          status: "active",
          photo: null,
          role: "",
        });

        // Navigate after showing the message
        setTimeout(() => navigate("/admin/dashboard"), 3000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:px-0">
      <div className="min-h-screen mx-auto bg-gray-50 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-8">
          Register Civic Society Organization (CSO)
        </h2>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-600 rounded-lg">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Role Selector */}
        {/* <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2">Choose Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="cso">CSO</option>
            <option value="admin">Staff</option>
          </select>
        </div> */}

        {formData.role === "cso" ? (
          <form onSubmit={handleSubmitCSO} encType="multipart/form-data" className="space-y-6">
            {/* CSO Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* CSO Name */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">CSO Name</label>
                <FaUserAlt className="absolute left-3 top-10 text-blue-800" />
                <input
                  type="text"
                  name="csoName"
                  value={formData.csoName}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Representative Name */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">Representative Name</label>
                <FaUserAlt className="absolute left-3 top-10 text-blue-800" />
                <input
                  type="text"
                  name="repName"
                  value={formData.repName}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Sector */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">Sector</label>
                <FaTypo3 className="absolute left-3 top-10 text-blue-800" />
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Sector</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Environment">Environment</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {showCustomSector && (
                <div className="relative">
                  <label className="block text-gray-600 font-medium mb-2">Custom Sector</label>
                  <input
                    type="text"
                    name="customSector"
                    value={formData.customSector}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              )}
              {/* Email */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">Email</label>
                <FaEnvelope className="absolute left-3 top-10 text-blue-800" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">Phone</label>
                <FaPhoneAlt className="absolute left-3 top-10 text-blue-800" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Location */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">Location</label>
                <FaMapMarkedAlt className="absolute left-3 top-10 text-blue-800" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 font-medium mb-2">Logo</label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-2">TIN Certificate</label>
                <input
                  type="file"
                  name="tin_certificate"
                  accept="image/*, application/pdf"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-2">Registration Certificate</label>
                <input
                  type="file"
                  name="registration_certificate"
                  accept="image/*, application/pdf"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Register CSO
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitStaff} encType="multipart/form-data" className="space-y-6">
            {/* Staff Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Staff Name */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">Staff Name</label>
                <FaUserAlt className="absolute left-3 top-10 text-blue-800" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">Email</label>
                <FaEnvelope className="absolute left-3 top-10 text-blue-800" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">Phone</label>
                <FaPhoneAlt className="absolute left-3 top-10 text-blue-800" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Role */}
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-2">Role</label>
                <FaUserAlt className="absolute left-3 top-10 text-blue-800" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="reportViewer">Report Viewer</option>
                </select>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-gray-600 font-medium mb-2">Photo</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Register Staff
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CsoRegister;