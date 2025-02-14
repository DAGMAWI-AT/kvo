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
const StaffRegister = () => {
      const [formData, setFormData] = useState({ role: "cso", status: "active" });
      const [successMessage, setSuccessMessage] = useState("");
      const [error, setError] = useState("");
      const navigate = useNavigate();
      const handleChange = (e) => {
        const { name, value, type, files } = e.target;
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
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Register Staff of Finance Office
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
      </div>
    </div>
  );
}

export default StaffRegister
