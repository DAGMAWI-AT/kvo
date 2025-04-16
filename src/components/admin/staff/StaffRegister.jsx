import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaUserAlt,
  FaLock,
  FaBriefcase,
  FaCamera,
  FaUserTag,
  FaKey,
  FaLockOpen,
  FaUnlock,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

const StaffRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    status: "active",
    position: "",
    photo: null,
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  
  // const [successMessage, setSuccessMessage] = useState("");
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
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
    setSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/staff/register`, {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "An unexpected error occurred.");
        return;
      }

      const result = await response.json();
      if (result.success) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "admin",
          status: "active",
          position: "",
          photo: null,
          password: "",
          confirmPassword: "",
        });
        toast.success("Staff Register Successfully")
        navigate("/admin/staffs");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message+ "submitting error");
    }finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Register Staff of Finance Office
        </h2>

        <form onSubmit={handleSubmitStaff} encType="multipart/form-data" className="space-y-6">
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

            {/* Phone Number */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">Phone Number</label>
              <FaPhoneAlt className="absolute left-3 top-10 text-blue-800" />
              <input
                type="tel"
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
              <FaUserTag className="absolute left-3 top-10 text-blue-800" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="admin">Admin</option>
                <option value="sup_admin">Super Admin</option>
              </select>
            </div>

            {/* Status */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Position */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">Position</label>
              <FaBriefcase className="absolute left-3 top-10 text-blue-800" />
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">password</label>
              <FaKey className="absolute left-3 top-10 text-blue-800" />
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">confirmPassword</label>
              <FaUnlock className="absolute left-3 top-10 text-blue-800" />
              <input
                type="text"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {/* Photo */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">Photo</label>
              <FaCamera className="absolute left-3 top-10 text-blue-800" />
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Submit Button */}
        

                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => navigate("/admin/staffs")}
                          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-32"
                        >
                          {submitting ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Registering...
                            </>
                          ) : (
                            <>
                              <FaSave className="mr-2" />
                              Register Staff
                            </>
                          )}
                        </button>
                      </div>
        </form>
      </div>
    </div>
  );
};

export default StaffRegister;
