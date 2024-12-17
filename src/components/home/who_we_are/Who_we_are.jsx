import React, { useState } from 'react';
import YouTube from 'react-youtube';

const WhoWeAre = () => {
  const [isVideoPlaying, setVideoPlaying] = useState(false);
  const [hideVideoPoster, setHideVideoPoster] = useState(false);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const handleButtonClick = () => {
    setVideoPlaying(true);
    setHideVideoPoster(true);
  };

  const onVideoReady = (event) => {
    // Add additional logic here if needed
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full pt-20 bg-gray-900 text-white">
      {/* Left Section */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-lg bg-white text-gray-800 p-8 rounded shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-center">Who We Are</h2>
          <p className="text-lg mb-6 leading-relaxed">
            Bishoftu Finance office serves as a model for ensuring effective public financial
            management...
          </p>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            onClick={handleButtonClick}
          >
            Watch A Video
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full aspect-video bg-gray-700">
          {isVideoPlaying && (
            <YouTube
              className="absolute inset-0 w-full h-full"
              videoId="KmXlYV3orfU"
              opts={opts}
              onReady={onVideoReady}
            />
          )}
          {!hideVideoPoster && (
            <button
              className="absolute inset-0 w-full h-full bg-cover bg-center cursor-pointer"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(https://via.placeholder.com/1920x1080)',
              }}
              onClick={handleButtonClick}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-1.926A1 1 0 0010 10.134v3.732a1 1 0 001.555.832l3.197-1.926a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
