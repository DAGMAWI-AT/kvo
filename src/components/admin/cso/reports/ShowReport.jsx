import React, {useState } from "react";
import { useLoaderData, useNavigate,  } from "react-router-dom";
const ShowReport = () => {

  const navigate = useNavigate();
  const report = useLoaderData();
  const [showFile, setShowFile] = useState(false);
  
  const handleDownload = () => {
    const fileUrl = `http://localhost:8000/user_report/${report.pdfFile}`;
    console.log("Attempting to download:", fileUrl);
    console.log("Report:", report.pdfFile);

    console.log("Report object:", report);


    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.blob();
        
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = report.pdfFile; // Use file name from the report
        document.body.appendChild(link); // Append link to the body
        link.click(); // Trigger download
        document.body.removeChild(link); // Clean up
      })
      .catch((error) => {
        console.error("Download error:", error);
        alert("Failed to download the file. Please try again later.");
      });
  };
  
   

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Report not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(`/admin/each_cso/${report.registrationId}`)}

          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
        >
          Back
        </button>
        <h1 className="text-xl font-bold font-serif mr-10 text-gray-400">
          View Report:{" "}
          <span className="text-blue-500">{report.reportName}</span>
        </h1>
      </div>

      <div className="bg-slate-100 rounded-lg shadow-lg p-8 font-serif">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-md font-semibold text-gray-800">Report Name</h2>
            <p className="text-gray-600 mt-1">{report.reportName}</p>
          </div>
          <div>
            <h2 className="text-md font-semibold text-gray-800">Response</h2>
            <p
              className={`mt-1 ${report.response === "Approved"
                ? "text-green-600"
                : report.response === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
                }`}
            >
              {report.response}
            </p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="text-md font-semibold text-gray-800">Expire Date</h2>
            <p className="text-gray-600 mt-1">{report.expireDate}</p>
          </div>

          <div>
            <h2 className="text-md font-semibold text-gray-800">Report Type</h2>
            <p className="text-gray-600 mt-1">{report.reportType}</p>
          </div>

          <div>
            <h2 className="text-md font-semibold text-gray-800">Summery</h2>
            <p className="text-gray-600 mt-1 overflow-y-auto overflow-x-hidden max-h-32 p-2">
              {report.description}
            </p>
          </div>
          <div>
            <h2 className="text-md font-semibold text-gray-800">Comment</h2>
            <p
              className="text-gray-600 mt-1 overflow-y-auto overflow-x-hidden max-h-32 p-2"
              style={{
                wordWrap: "break-word", // Break long words to fit within the width
                whiteSpace: "normal", // Ensure the text wraps properly
              }}
            >
              {report.comment}{" "}
              lkhakguuydihsf,kjjddddddddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddddddddddddllllllllllllllllllllllllllllllllllllllllllllaaaaaaaaaaaaaaaaaaaaaallllllllnbbbbbbbbbbbbbe.
              kjlka,hndlk,hnlkhnlk,manklf,mvncm,nfkam,nm,gflkhakguuydihsf,kjjddddddddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddddddddddddllllllllllllllllllllllllllllllllllllllllllllaaaaaaaaaaaaaaaaaaaaaallllllllnbbbbbbbbbbbbbe.
              kjlka,hndlk,hnlkhnlk,manklf,mvncm,nfkam,nm,gf
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="text-md font-semibold text-gray-800">File</h2>
            <div>
              <button
                onClick={() => setShowFile(!showFile)}
                className="px-3 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
              >
                {showFile ? "Hide File" : "View File"}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 m-2 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
              >
                Download
              </button>

              <a
                href={`http://localhost:8000/user_report/${report.pdfFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
              >
                Open
              </a>

            </div>
          </div>
        </div>
        {showFile && (
          <div className="mt-4">
            <embed
              src={`http://localhost:8000/user_report/${report.pdfFile}`}
              type="application/pdf"
              width="100%"
              height="500px"
              onError={(e) => {
                console.error("Failed to load the file", e);
                alert("The file could not be loaded. Please try again later.");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};



export default ShowReport
