import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from "react-spinners"; // Import a spinner library
import Swal from "sweetalert2";

const WorkReport = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [dataLoaded, setDataLoaded] = useState(false); // State to track if data is fully loaded
  const [categoryMap, setCategoryMap] = useState(new Map()); // Map to store category details
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const currentDate = new Date();

  const filteredReports = Array.isArray(report)
    ? report.filter((item) =>
        item.report_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentData = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const isExpired = (expireDate) => {
    if (!expireDate) return false; // If no expiry date, assume not expired
    return new Date(expireDate) < currentDate;
  };

  const handleViewReport = (id) => {
    navigate(`/user/viewworkreport/${id}`);
  };

  const handleUploadReport = () => {
    navigate(`/user/upload_report`);
  };

  const handleUpdateReport = (id) => {
    navigate(`/user/update_report/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/report/${id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          Swal.fire("Deleted!", "Your report has been deleted.", "success");
          setReport((prevReports) => prevReports.filter((item) => item.id !== id));
        } else {
          Swal.fire("Error!", "Failed to delete the report.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };
  
  // Fetch category details for a given category_id
  const fetchCategoryDetails = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reportCategory/${categoryId}`
      );
      if (response.ok) {
        const jsonData = await response.json();
        return jsonData; // Return category details
      } else {
        console.error("Failed to fetch category data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
      return null;
    }
  };

  // Fetch all reports and their category details
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false); // Stop loading if no token
        return;
      }

      const decodedToken = jwtDecode(token);
      const { registrationId } = decodedToken;

      if (!registrationId) {
        console.error("Invalid token: registrationId not found");
        setLoading(false); // Stop loading if registrationId is missing
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/report/${registrationId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          setReport(data.data);

          // Fetch category details for each report
          const categoryDetailsMap = new Map();
          for (const item of data.data) {
            const categoryId = item.category_id;
            if (categoryId && !categoryDetailsMap.has(categoryId)) {
              const categoryDetails = await fetchCategoryDetails(categoryId);
              if (categoryDetails) {
                categoryDetailsMap.set(categoryId, categoryDetails);
              }
            }
          }

          setCategoryMap(categoryDetailsMap); // Store category details in a Map
        } else {
          console.error("Unexpected profile response format:", data);
        }
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
      setDataLoaded(true); // Mark data as fully loaded
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="p-2">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-400 font-serif">
          Work Report
        </h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleUploadReport}
        >
          + Add Report
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded px-2 py-2 lg:w-60 md:w-40 w-40 focus:outline-none focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 bg-white box-decoration-slice shadow-2xl shadow-blue-gray-900">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Report name</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Comment</th>
              <th className="border border-gray-300 p-2">File</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Expire date</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? ( // Show loader if data is being fetched
              <tr>
                <td colSpan="8" className="text-center p-4">
                  <div className="flex justify-center items-center">
                    <ClipLoader color="#4A90E2" size={30} /> {/* Circular loader */}
                  </div>
                </td>
              </tr>
            ) : currentData.length > 0 ? ( // Show data if available
              currentData.map((item, i) => {
                const categoryDetails = categoryMap.get(item.category_id);
                return (
                  <tr key={item.id}>
                    <td className="border-b border-gray-300 p-2 text-center">
                      {i + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="border-b border-gray-300 p-2">
                      {item.report_name}
                    </td>
                    <td className="border-b border-gray-300 p-2 text-center">
                      {categoryDetails?.category_name || "N/A"}
                    </td>
                    <td className="border-b border-gray-300 p-2">
                      {item.comment}
                    </td>
                    <td className="border-b border-gray-300 p-2">
                      {item.report_file && item.report_file.endsWith(".pdf") ? (
                        <embed
                          src={`http://localhost:5000/user_report/${item.report_file}`}
                          type="application/pdf"
                          className="max-h-10 max-w-10"
                          onError={(e) => {
                            console.error("Failed to load the file", e);
                            alert("The file could not be loaded. Please try again later.");
                          }}
                        />
                      ) : (
                        <img
                          className="max-h-10 max-w-10"
                          src={`http://localhost:5000/user_report/${item.report_file}`}
                          alt={item.report_file}
                        />
                      )}
                    </td>
                    <td className="border-b border-gray-300 p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded ${
                          item.remark === "Approved"
                            ? "bg-green-100 text-green-800"
                            : item.remark === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.remark === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="border-b border-gray-300 p-2 text-center">
                      {new Date(categoryDetails?.expire_date).toLocaleString()
                      }
                    </td>
                    <td className="border-b border-gray-300 p-2 flex justify-around">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleViewReport(item.id)}
                      >
                        <FaEye />
                      </button>
                      {dataLoaded && ( // Only show Edit and Delete buttons after data is fully loaded
                        <>
                          <button
                            className={`${
                              isExpired(categoryDetails?.expire_date)
                                ? "bg-gray-300 text-gray-600 px-2 py-1 rounded cursor-not-allowed"
                                : "bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                            }`}
                            onClick={() =>
                              !isExpired(categoryDetails?.expire_date) &&
                              handleUpdateReport(item.id)
                            }
                            disabled={isExpired(categoryDetails?.expire_date)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={`${
                              isExpired(categoryDetails?.expire_date)
                                ? "bg-gray-300 text-gray-600 px-2 py-1 rounded cursor-not-allowed"
                                : "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                            }`}
                            onClick={() =>
                              !isExpired(categoryDetails?.expire_date) &&
                              (handleDelete(item.id))
                            }
                            disabled={isExpired(categoryDetails?.expire_date)}
                          >
                            <FaTrashAlt />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : ( // Show "No reports found" if no data is available
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WorkReport;