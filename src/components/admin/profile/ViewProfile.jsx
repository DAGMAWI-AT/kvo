import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import EditProfile from "./EditProfile";
import { FaCalendarAlt, FaCalendarTimes, FaCircle, FaEnvelope, FaFileAlt, FaIdCard, FaKey, FaMobileAlt, FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import { BarLoader } from "react-spinners";

const ViewUserProfile = () => {
  // ... [keep existing state and logic the same] ...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const fetchProfileData = async () => {
    try {
      const meResponse = await axios.get("http://localhost:5000/api/users/me", {
        withCredentials: true,
      });
  
      if (!meResponse.data.success) {
        throw new Error("Failed to get user details");
      }
      const { id } = meResponse.data;
  
      const response = await fetch(`http://localhost:5000/api/staff/staff/${id}`);
  
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
  
  useEffect(() => {
    fetchProfileData();
  }, []);
  

  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileUpdate = async (updatedData) => {
    setProfileData(updatedData);
    closeModal();
    await fetchProfileData();
  };




  // if (!profileData) {
  //   return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  // }
  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
        <BarLoader color="#4F46E5" size={50} />
      </div>
    );
  }
  // if (!profileData) {
  //   return (
  //     <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
  //       <div className="animate-pulse flex space-x-4">
  //         <div className="rounded-full bg-blue-200 h-12 w-12"></div>
  //         <div className="flex-1 space-y-4 py-1">
  //           <div className="h-4 bg-blue-200 rounded w-3/4"></div>
  //           <div className="space-y-2">
  //             <div className="h-4 bg-blue-200 rounded"></div>
  //             <div className="h-4 bg-blue-200 rounded w-5/6"></div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-800 to-indigo-600 p-8 text-center">
            <div className="relative inline-block group">
              <img
                src={`http://localhost:5000/staff/${profileData.photo}` || ""}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white/80 shadow-xl transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-white/30 transition-all duration-300" />
            </div>
            <h1 className="mt-6 text-4xl font-bold text-white tracking-tight">
              {profileData.name}
            </h1>
            <p className="mt-2 text-lg text-blue-100">{profileData.sector}</p>
          </div>
           
          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-6">
              {[
                { label: "Registration ID", value: profileData.registrationId, icon: <FaIdCard/> },
                { label: "Contact Email", value: profileData.email, icon: <FaEnvelope/> },
                // { label: "Representative", value: profileData.repName, icon: <FaPerson/> },
                // { label: "Office Location", value: profileData.office, icon: <FaLocationPin/> },
                { label: "Updated Date", value: new Date(profileData.updated_at).toLocaleString(), icon: <FaCalendarTimes/> },

              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{item.label}</p>
                    <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[
                { label: "Contact Number", value: profileData.phone, icon: <FaMobileAlt/> },
                { label: "Status", value: profileData.status, icon: <FaCircle/> },
                { label: "Registration Date", value: new Date(profileData.created_at).toLocaleDateString(), icon: <FaCalendarAlt/> },
                { label: "User Role", value: profileData.role, icon: <FaKey/> },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{item.label}</p>
                    <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          {/* <div className="px-8 pb-8">
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2"><FaFileAlt/></span> Organization Documents
              </h3>
              
              <div className="space-y-6">
                <div className="relative">
                  <select 
                    onChange={handleFileSelection}
                    className="w-full appearance-none bg-white border-2 border-gray-300 rounded-xl py-3 px-4 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select a document to view</option>
                    <option value={profileData.tin_certificate}>Tax Identification Certificate</option>
                    <option value={profileData.registration_certificate}>Registration Certificate</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {selectedFile && (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
                    {renderFile(selectedFile)}
                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                      <a 
                        href={selectedFile}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Document
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div> */}

          {/* Action Bar */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
            <div className="flex justify-end space-x-4">
              <button
                onClick={openModal}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-8 h-8 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </h2>
              <EditProfile
                profileData={profileData}
                onUpdate={handleProfileUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUserProfile;