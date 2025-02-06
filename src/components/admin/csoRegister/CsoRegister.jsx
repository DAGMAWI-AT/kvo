import React, { useContext, useState } from "react";
import {
  FaEnvelope,
  FaHome,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaTypo3,
  FaUserAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const CsoRegister = () => {
  const [formData, setFormData] = useState({role: "cso", status:"active"});

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState();
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


  //   setError("");
  const handleSubmitStaff = async (e) => {
    e.preventDefault();
    // const registrationDate = new Date().toISOString();

    const formDataObje = new FormData();
    formDataObje.append("name", formData.name);
    formDataObje.append("email", formData.email);
    formDataObje.append("phone", formData.phone);
    formDataObje.append("status", formData.status);
    formDataObje.append("photo", formData.photo);
    formDataObje.append("role", formData.role);
    // formDataObje.append("registrationDate", registrationDate);

    try {
      const response = await fetch("http://localhost:5000/api/staff/register", {
      // const response = await fetch(
      //   "https://finance-office.onrender.com/staff/register",
      //   {
          method: "POST",
          body: formDataObje,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        // console.error("Backend error:", errorData.message);
        setError(errorData.message || "An unexpected error occurred.");
        return;
      }
      
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
        setError(result.message)
        setTimeout(() => setError(" "), 3000);


      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSubmitCSO = async (e) => {
    e.preventDefault();

    setError("");
    const formDataObj = new FormData();
    formDataObj.append("csoName", formData.csoName);
    formDataObj.append("repName", formData.repName);
    formDataObj.append("sector", formData.sector);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("location", formData.location);
    formDataObj.append("office", formData.office);
    formDataObj.append("status", formData.status);
    formDataObj.append("logo", formData.logo);
    formDataObj.append("tin_certificate", formData.tin_certificate);
    formDataObj.append("registration_certificate", formData.registration_certificate);
    formDataObj.append("role", formData.role);
    // formDataObj.append("registrationDate", registrationDate); // Automatically add registration date

    // console.log("FormData being sent: ", formDataObj); // Log the FormData

    try {
      const response = await fetch("http://localhost:5000/api/cso/register", {
        method: "POST",
        body: formDataObj,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData.message);
        setError(errorData.message || "An unexpected error occurred.");
        return;
      }
      
      const result = await response.json();
      console.log("Success:", result);
      // setSuccessMessage("CSO registered successfully!");
      
      console.log("Response: ", result); // Log the response
      if (result.success) {
        setSuccessMessage("CSO registered successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        // Clear form data
        setFormData({
          csoName: "",
          repName:"",
          sector: "",
          email: "",
          phone: "",
          location: "",
          office: "",
          status: "active",
          logo: null,
          tin_certificate: null,
          registration_certificate:null,
          role: "",
        });

        // Navigate after showing the message
        setTimeout(() => navigate("/admin/dashboard"), 3000);
      } else {
        console.error(result.message);
        console.log(result.message)
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      
    }
  };

  return (
    <div className="min-h-screen mx-auto p-8 bg-gray-100 rounded-lg shadow-md mt-2">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
        Register Civic Society Organization (CSO)
      </h2>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-600 rounded-lg">
          {successMessage}
        </div>
      )}
       {setError && (
        <div className="mb-4 p-4 bg-green-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-600 font-medium">Choose Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-36 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="cso">CSO</option>
          <option value="admin">Staff</option>
        </select>
      </div>

      {formData.role === "cso" && (
        <div className="overflow-x-auto">
          <form
            onSubmit={handleSubmitCSO}
            encType="multipart/form-data"
            className="min-w-[600px] px-4"
          >
            <div className="flex justify-between items-start mb-4 space-x-4">
              <div className="flex-1 relative">
                <label className="block text-gray-600 font-medium">
                  CSO Name
                </label>
                <FaUserAlt className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />
                <input
                  type="text"
                  name="csoName"
                  value={formData.csoName}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="cso name"
                  required
                />
              </div>
              <div className="flex-1 relative">
                <label className="block text-gray-600 font-medium">
                  Representative Name
                </label>
                <FaUserAlt className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />
                <input
                  type="text"
                  name="repName"
                  value={formData.repName}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Representative Name"
                  required
                />
              </div>
              <div className="flex-1 relative">
                <label className="block text-gray-600 font-medium">
                  Sector
                </label>
                <FaTypo3 className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />

                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Sector</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Environment">Environment</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4 space-x-4">
              <div className="relative flex-1">
                <label className="block text-gray-600 font-medium">Email</label>

                <FaEnvelope className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  placeholder="Enter email"
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  />
              </div>

              <div className="flex-1 relative">
                <label className="block text-gray-600 font-medium">Phone</label>
                <FaPhoneAlt className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Phone (e.g., +251 985187059 or 0985187059)"
                  pattern="^\+251 [0-9]{9}$|^0[0-9]{9}$"
                  required
                />
              </div>

              <div className="flex-1 relative">
                <label className="block text-gray-600 font-medium">
                  Office
                </label>
                <FaHome className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />

                <input
                  type="text"
                  name="office"
                  value={formData.office}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Office"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between items-start mb-4 space-x-4">
              <div className="flex-1 relative">
                <label className="block text-gray-600 font-medium">
                  Location
                </label>
                <FaMapMarkedAlt className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Location"
                  required
                />
              </div>

              <div className="flex-1 relative">
                <label className="block text-gray-600 font-medium">
                  Upload Licenses
                </label>
                <input
                  type="file"
                  name="tin_certificate"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  // required
                />
              </div>
              <div className="flex-1">
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
            </div>
            <div className="flex justify-between items-start mb-4 space-x-4">

            <div className="flex-1 relative">
                <label className="block text-gray-600 font-medium">
                  Upload registration_certificate
                </label>
                <input
                  type="file"
                  name="registration_certificate"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  // required
                />
              </div>
              </div>
            {error && <p className="text-red-600"> {error}</p>}
            <button
              type="submit"
              className="w-28 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Register
            </button>
          </form>
        </div>
      )}
      {(formData.role === "admin" || formData.role === "viewer") && (
        <div className="overflow-x-auto">
          <form
            onSubmit={handleSubmitStaff}
            encType="multipart/form-data"
            className="min-w-[800px]"
          >
            <>
              <div className="flex justify-between items-start mb-4 space-x-4">
                <div className="flex-1 relative p-1">
                  <label className="block text-gray-600 font-medium">
                    Staff Name
                  </label>
                  <FaUserAlt className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Name"
                    required
                  />
                </div>
                <div className="flex-1 relative p-1">
                  <label className="block text-gray-600 font-medium">
                    Email
                  </label>
                  <FaEnvelope className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Email"
                    formNoValidate="@"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-start mb-4 space-x-4">
                <div className="flex-1 relative p-1">
                  <label className="block text-gray-600 font-medium">
                    Phone
                  </label>
                  <FaPhoneAlt className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Phone"
                    required
                  />
                </div>
                <div className="flex-1 relative p-1">
                  <label className="block text-gray-600 font-medium">
                    Staff Role
                  </label>
                  <FaUserAlt className="absolute left-3 top-3/4 transform -translate-y-1/2 text-blue-800" />

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="reportViewer">Report Viewer</option>
                  </select>
                </div>
                <div className="flex-1 relative">
                  <label className="block text-gray-600 font-medium">
                    Photo
                  </label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </>
            <button
              type="submit"
              className="w-28 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CsoRegister;
