// src/components/LetterCard.jsx
import React from 'react';

const LetterCard = ({ letter }) => {
  const { title, summary, type, date, attachmentPath, attachmentName } = letter;
  const fileUrl = attachmentPath ? `${process.env.REACT_APP_API_URL}/${attachmentPath}` : null;

  return (
    <div className="bg-white rounded-md shadow p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
      <p className="text-gray-600 mb-2">{summary}</p>
      <div className="text-sm text-gray-500 mb-2">
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">{type}</span>
        <span className="ml-4">{new Date(date).toLocaleDateString()}</span>
      </div>
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          📎 {attachmentName}
        </a>
      )}
    </div>
  );
};

export default LetterCard;
