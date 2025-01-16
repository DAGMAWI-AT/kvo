import React, { useState } from "react";
import { useNavigate } from "react-router";

const CsoRegister = () => {
  const [formData, setFormData] = useState({
    csoName: "",
    sector: "",
    email: "",
    phone: "",
    location: "",
    office: "",
    status: "active",
    logo: null, // File upload for logo
    role: "cso", // New state for the selected CSO role
  });

  
  
  const [successMessage, setSuccessMessage] = useState("");
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
    const registrationDate = new Date().toISOString();

    const formDataObje = new FormData();
    formDataObje.append("name", formData.name);
    formDataObje.append("email", formData.email);
    formDataObje.append("phone", formData.phone);
    formDataObje.append("status", formData.status);
    formDataObje.append("photo", formData.photo);
    formDataObje.append("role", formData.role);
    formDataObje.append("registrationDate", registrationDate);

    try {
      // const response = await fetch("http://localhost:8000/registerStaff", {
        const response = await fetch("https://finance-office.onrender.com/staff/register", {

        method: "POST",
        body: formDataObje,
      });

      const result = await response.json();
      if (result.success) {
        setSuccessMessage("Staff registered successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        setFormData({
          name: "",
          email: "",
          phone: "",
          status: "active",
          photo: null,
          role: "",
        });

        setTimeout(() => navigate("/admin/dashboard"), 3000);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const registrationDate = new Date().toISOString(); // Converts to ISO format (e.g., 2025-01-08T10:00:00.000Z)

    const formDataObj = new FormData();
    formDataObj.append("csoName", formData.csoName);
    formDataObj.append("sector", formData.sector);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("location", formData.location);
    formDataObj.append("office", formData.office);
    formDataObj.append("status", formData.status);
    formDataObj.append("logo", formData.logo);
    formDataObj.append("role", formData.role);
    formDataObj.append("registrationDate", registrationDate); // Automatically add registration date


    console.log("FormData being sent: ", formDataObj); // Log the FormData

    try {
      // const response = await fetch("http://localhost:8000/registerCSO", {
        const response = await fetch("https://finance-office.onrender.com/cso/register", {

        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();
      console.log("Response: ", result); // Log the response
      if (result.success) {
        setSuccessMessage("CSO registered successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        // Clear form data
        setFormData({
          csoName: "",
          sector: "",
          email: "",
          phone: "",
          location: "",
          office: "",
          status: "active",
          logo: null,
          role: "",
        });

        // Navigate after showing the message
        setTimeout(() => navigate("/admin/dashboard"), 3000);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-100 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
        Register Civic Society Organization (CSO)
      </h2>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-600 rounded-lg">
          {successMessage}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-600 font-medium">Choose Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="cso user">cso</option>
          <option value="admin">Staff</option>
        </select>
      </div>

      {formData.role === "cso" && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">CSO Name</label>
            <input
              type="text"
              name="csoName"
              value={formData.csoName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Sector</label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Sector</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Environment">Environment</option>
              <option value="Agriculture">Agriculture</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Office</label>
            <input
              type="text"
              name="office"
              value={formData.office}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Upload Logo
            </label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
        </form>
      )}
      {(formData.role === "admin" || formData.role ==="reportViewer") && (
    <form onSubmit={handleSubmitStaff} encType="multipart/form-data">

        <>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Photo</label>
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Staff Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
        <label className="block text-gray-600 font-medium">Staff Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="admin">Admin</option>
          <option value="reportViewer">Report Viewer</option>
        </select>
      </div>

        </>
        <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default CsoRegister;
