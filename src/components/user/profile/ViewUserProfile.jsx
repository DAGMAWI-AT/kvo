import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import EditUserProfile from "./EditUserProfile";

const ViewUserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        // Decode the token to extract user information
        const decodedToken = jwtDecode(token);
        const { registrationId } = decodedToken;

        if (!registrationId) {
          console.error("Invalid token: registrationId not found");
          return;
        }

        // Fetch user profile using registrationId
        const response = await fetch(`http://localhost:8000/cso/res/${registrationId}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileUpdate = (updatedData) => {
    setProfileData(updatedData);
    closeModal();
  };

  // Check if profileData is null before rendering
  if (!profileData) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          View Profile
        </h1>
        <div className="flex flex-col items-center mb-6">
          <img
            src={`http://localhost:8000/logos/${profileData.logo}`} // Use default image if logo is missing
            alt="Profile"
            className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
          />
          <p className="mt-4 font-semibold text-gray-700">{profileData.csoName}</p>
        </div>
        <div className="space-y-4">

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Name:</span>
            <span className="text-gray-800">{profileData.csoName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">ID:</span>
            <span className="text-gray-800">{profileData.registrationId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{profileData.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Sector:</span>
            <span className="text-gray-800">{profileData.sector}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Phone:</span>
            <span className="text-gray-800">{profileData.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Location:</span>
            <span className="text-gray-800">{profileData.location}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Office:</span>
            <span className="text-gray-800">{profileData.office}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Status:</span>
            <span className="text-gray-800">{profileData.status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Date:</span>
            <span className="text-gray-800">{profileData.registrationDate}</span>
            {new Date(profileData.registrationDate).toLocaleDateString()}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="text-gray-800">{profileData.role}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={openModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded btn-success"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 lg:w-1/3 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-blue-600 hover:text-gray-800 font-bold"
            >
              X
            </button>
            <EditUserProfile
              profileData={profileData}
              onUpdate={handleProfileUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUserProfile;
