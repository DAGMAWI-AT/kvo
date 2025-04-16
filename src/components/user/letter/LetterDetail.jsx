import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LetterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 1. Get user details to verify CSO
        const meResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          withCredentials: true,
        });
        
        if (!meResponse.data?.success || !meResponse.data.userId) {
          throw new Error("Authentication required");
        }

        // 2. Get CSO info
        const csoResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/cso/${meResponse.data.userId}`,
          { withCredentials: true }
        );

        if (!csoResponse.data?.id) {
          throw new Error("CSO information not found");
        }

        const csoId = csoResponse.data.id;

        // 3. Fetch letter details
        const letterResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/letters/get/${id}`,
          { withCredentials: true }
        );

        // 4. Mark as read if not already
        if (!letterResponse.data.isRead) {
          await axios.put(
            `${process.env.REACT_APP_API_URL}/api/letters/${id}/mark-read/${csoId}`,
            {},
            { withCredentials: true }
          );
          setIsRead(true);
        }

        setLetter(letterResponse.data.data);
        // console.log(letter.title)
      } catch (error) {
        toast.error(error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetter();
  }, [id]);

  const getFileIcon = (fileName) => {
    if (!fileName) return '📁';
    if (fileName.endsWith('.pdf')) return '📄';
    if (fileName.match(/\.(jpg|jpeg|png)$/i)) return '🖼️';
    return '📁';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{letter.title}</h1>
            <div className="flex items-center mt-2">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isRead ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">
                {isRead  ? 'Read' : 'Unread'}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
          >
            Back to Letters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium text-gray-700">Sender</h3>
            <p className="mt-1">{letter.createdBy || 'System'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium text-gray-700">Type</h3>
            <p className="mt-1 capitalize">{letter.type}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium text-gray-700">Date</h3>
            <p className="mt-1">{new Date(letter.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Summary</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {letter.summary || 'No summary provided'}
          </p>
        </div>

        {letter.attachmentPath && (
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-700 mb-3">Attachment</h3>
            <a
              href={`${process.env.REACT_APP_API_URL}/${letter.attachmentPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <span className="mr-2 text-lg">{getFileIcon(letter.attachmentName)}</span>
              {letter.attachmentName || 'Download Attachment'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LetterDetail;