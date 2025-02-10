import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FaFileAlt, FaDownload, FaChevronDown } from "react-icons/fa";

const CSOProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cso/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleFileSelection = (event) => {
    const fileUrl = event.target.value;
    setSelectedFile(fileUrl);
  };

  const renderFile = (fileUrl) => {
    if (!fileUrl) return null;

    const fileType = fileUrl.split(".").pop().toLowerCase();

    if (fileType === "pdf") {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-96 rounded-lg shadow-md"
          title="Document Viewer"
        />
      );
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
      return (
        <img
          src={fileUrl}
          alt="Document"
          className="w-full h-auto rounded-lg shadow-md"
        />
      );
    } else {
      return (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">
            Unsupported file type. Please download the file to view it.
          </p>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        CSO Profile
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={profileData.logo}
            alt="logo"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {profileData.csoName}
            </h2>
            <p className="text-gray-600">{profileData.sector}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem label="Registration Number" value={profileData.registrationId} />
          <DetailItem label="Contact Email" value={profileData.email} />
          <DetailItem label="Phone" value={profileData.phone} />
          <DetailItem label="Representative" value={profileData.repName} />
          <DetailItem label="Location" value={profileData.location} />
          <DetailItem label="Office" value={profileData.office} />
          <DetailItem label="Role" value={profileData.role} />
          <DetailItem label="Status" value={profileData.status} />
          <DetailItem
            label="Date of Registration"
            value={new Date(profileData.date).toLocaleString()}
          />
          <DetailItem
            label="Date of Updated"
            value={new Date(profileData.updated_at).toLocaleString()}
          />
        </div>

        {/* Document Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaFileAlt className="mr-2 text-blue-500" />
            Organization Documents
          </h3>

          <div className="space-y-6">
            <div className="relative">
              <select
                onChange={handleFileSelection}
                className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a document to view</option>
                <option value={profileData.tin_certificate}>
                  Tax Identification Certificate
                </option>
                <option value={profileData.registration_certificate}>
                  Registration Certificate
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <FaChevronDown />
              </div>
            </div>

            {selectedFile && (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
                {renderFile(selectedFile)}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                  <a
                    href={selectedFile}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaDownload className="w-5 h-5 mr-2" />
                    Download Document
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Additional Information
          </h2>
          <p className="text-gray-700">
            {profileData.additionalInfo ||
              "No additional information provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable DetailItem Component
const DetailItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className="text-lg font-semibold text-gray-800">{value}</p>
  </div>
);

export default CSOProfile;