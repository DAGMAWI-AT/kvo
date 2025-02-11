import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCSO = () => {
  const { id } = useParams(); // Get the CSO ID from the URL
  const navigate = useNavigate(); // For navigation after update
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
  const [tinCertificateFile, setTinCertificateFile] = useState(null); // For TIN Certificate file
  const [registrationCertificateFile, setRegistrationCertificateFile] = useState(null); // For Registration Certificate file
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error message
  const [successMessage, setSuccessMessage] = useState(''); // Success message

  // Fetch CSO data by ID
  useEffect(() => {
    const fetchCSOData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cso/${id}`);
        setFormData(response.data); // Set fetched data to form state
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CSO data:', err);
        setError('Failed to fetch CSO data');
        setLoading(false);
      }
    };

    fetchCSOData();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input changes
  const handleFileChange = (e, setFileFunction) => {
    if (e.target.files[0]) {
      setFileFunction(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    setSuccessMessage(''); // Reset success message

    const formDataToSend = new FormData();

    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append files if they exist
    if (tinCertificateFile) {
      formDataToSend.append('tin_certificate', tinCertificateFile);
    }
    if (registrationCertificateFile) {
      formDataToSend.append('registration_certificate', registrationCertificateFile);
    }

    try {
      // const response = await fetch(`http://localhost:5000/api/cso/update/${id}`,
      //   formDataToSend,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   }
      // );
      const response = await fetch(
        `http://localhost:5000/api/cso/update/${id}`,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );
      if (response.status === 200) {
        setSuccessMessage('CSO updated successfully!');
        setTimeout(() => {
          navigate('/admin/cso_list'); // Redirect after 2 seconds
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating CSO:', err);
      setError('Failed to update CSO. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit CSO</h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        {/* CSO Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">CSO Name</label>
          <input
            type="text"
            name="csoName"
            value={formData.csoName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Representative Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Representative Name</label>
          <input
            type="text"
            name="repName"
            value={formData.repName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Sector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Sector</label>
          <input
            type="text"
            name="sector"
            value={formData.sector}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Office */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Office</label>
          <input
            type="text"
            name="office"
            value={formData.office}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="cso">CSO</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* TIN Certificate */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">TIN Certificate</label>
          {formData.tin_certificate && (
            <a
              href={formData.tin_certificate}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline block mb-2"
            >
              View Current TIN Certificate
            </a>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, setTinCertificateFile)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Registration Certificate */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Registration Certificate</label>
          {formData.registration_certificate && (
            <a
              href={formData.registration_certificate}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline block mb-2"
            >
              View Current Registration Certificate
            </a>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, setRegistrationCertificateFile)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Update CSO
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCSO;