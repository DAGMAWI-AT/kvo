import React, { useState } from "react";
import EditProfile from "./EditProfile"; // Ensure EditProfile.js is properly configured

const ViewProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    role: "Admin",
    image: "/kvo.png", // Path to profile image
  });

  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle profile updates
  const handleProfileUpdate = (updatedData) => {
    setProfileData(updatedData); // Update profile data
    closeModal(); // Close the modal
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
          {/* <div className="flex justify-center items-center bg-gray-100 min-h-screen"> */}

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          View Profile
        </h1>
        <div className="flex flex-col items-center mb-6">
          <img
            src={profileData.image}
            alt="Profile"
            className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
          />
          <p className="mt-4 font-semibold text-gray-700">{profileData.name}</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Name:</span>
            <span className="text-gray-800">{profileData.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{profileData.email}</span>
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

      {/* Modal: Edit Profile Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-blue-600 hover:text-gray-800 font-bold"
            >
              X
            </button>
            <EditProfile
              profileData={profileData}
              onUpdate={handleProfileUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
