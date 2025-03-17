import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUserAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaHome,
  FaTypo3,
  FaFilePdf,
  FaFileWord
} from 'react-icons/fa';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const EditCSO = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    csoName: '',
    repName: '',
    email: '',
    phone: '',
    sector: '',
    location: '',
    office: '',
    role: 'cso',
    status: 'active',
    tin_certificate: '',
    registration_certificate: '',
  });
  const [showCustomSector, setShowCustomSector] = useState(false);
  const [tinCertificateFile, setTinCertificateFile] = useState(null);
  const [registrationCertificateFile, setRegistrationCertificateFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCSOData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cso/${id}`);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CSO data:', err);
        setError('Failed to fetch CSO data');
        setLoading(false);
      }
    };

    fetchCSOData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "sector" && value === "Other") {
      setShowCustomSector(true);
    } else if (name === "sector") {
      setShowCustomSector(false);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFileFunction) => {
    if (e.target.files[0]) setFileFunction(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    
    if (tinCertificateFile) formDataToSend.append('tin_certificate', tinCertificateFile);
    if (registrationCertificateFile) formDataToSend.append('registration_certificate', registrationCertificateFile);

    try {
      const response = await fetch(`http://localhost:5000/api/cso/update/${id}`, {
        method: "PATCH",
        body: formDataToSend,
      });

      if (response.status === 200) {
        setSuccessMessage('CSO updated successfully!');
        setTimeout(() => navigate('/admin/cso_list'), 2000);
      } else {
        setError('Failed to update CSO');
      }
    } catch (err) {
      console.error('Error updating CSO:', err);
      setError('Failed to update CSO. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Edit Civic Society Organization (CSO)
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* CSO Name */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">CSO Name</label>
              <FaUserAlt className="absolute left-3 top-10 text-blue-800" />
              <input
                type="text"
                name="csoName"
                value={formData.csoName}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Representative Name */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">Representative</label>
              <FaUserAlt className="absolute left-3 top-10 text-blue-800" />
              <input
                type="text"
                name="repName"
                value={formData.repName}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
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
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Office */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">Office</label>
              <FaHome className="absolute left-3 top-10 text-blue-800" />
              <input
                type="text"
                name="office"
                value={formData.office}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Role */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="cso">CSO</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            {/* Status */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-600 font-medium mb-2">
                <FaFilePdf className="inline mr-2 text-red-500" />
                TIN Certificate
              </label>
              {formData.tin_certificate && (
                <a
                  href={`${API_BASE_URL}/${formData.tin_certificate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline block mb-2"
                >
                  View Current File
                </a>
              )}
              <input
                type="file"
                accept="image/*, application/pdf"
                onChange={(e) => handleFileChange(e, setTinCertificateFile)}
                className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-600 font-medium mb-2">
                <FaFileWord className="inline mr-2 text-blue-500" />
                Registration Certificate
              </label>
              {formData.registration_certificate && (
                <a
                  href={`${API_BASE_URL}/${formData.registration_certificate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline block mb-2"
                >
                  View Current File
                </a>
              )}
              <input
                type="file"
                accept="image/*, application/pdf"
                onChange={(e) => handleFileChange(e, setRegistrationCertificateFile)}
                className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Update CSO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCSO;