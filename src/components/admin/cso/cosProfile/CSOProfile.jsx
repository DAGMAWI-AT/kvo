import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const CSOProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/cso/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
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

  if (loading) {
    return <div className="text-center mt-4">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">CSO Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold">Name:</span>
            <span className="text-lg">{profileData.csoName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold">Registration Number:</span>
            <span className="text-lg">{profileData.registrationId}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold">Contact Email:</span>
            <span className="text-lg">{profileData.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold">Phone:</span>
            <span className="text-lg">{profileData.phone}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold">Address:</span>
            <span className="text-lg">{profileData.address}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold">Date of Establishment:</span>
            <span className="text-lg">{profileData.establishmentDate}</span>
          </div>

          {/* Additional Information */}
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold">Tax Number:</span>
            <span className="text-lg">{profileData.taxNumber || 'Not available'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold">Licenses:</span>
            <span className="text-lg">
              {profileData.licenses && profileData.licenses.length > 0
                ? profileData.licenses.join(', ')
                : 'No licenses provided.'}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Additional Information</h2>
          <p className="mt-2 text-gray-700">{profileData.additionalInfo || 'No additional information provided.'}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Associated Documents</h2>
          <ul className="mt-2 text-gray-700 list-disc list-inside">
            {profileData.documents && profileData.documents.length > 0 ? (
              profileData.documents.map((doc, index) => (
                <li key={index}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {doc.name}
                  </a>
                </li>
              ))
            ) : (
              <p>No documents provided.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CSOProfile;
