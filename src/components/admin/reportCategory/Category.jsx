import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const Category = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token is missing");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/reportCategory", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result); // Assuming result is an array
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/report_category/edit_category/${id}`);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to remove this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/categories/${id}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            throw new Error("Failed to delete category");
          }
          setData((prevData) => prevData.filter((item) => item.id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The report category has been deleted.",
            confirmButtonColor: "#3085d6",
          });
        } catch (error) {
          console.error("Error deleting category:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to delete the category.",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  const handleAddReportCategory = () => {
    navigate("/admin/report_category/category");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return data;

    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.expireDate.includes(searchQuery)
    );
  };

  const filteredData = handleSearch();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-2 lg:p-8 mx-auto max-w-7xl font-serif">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl lg:text-2xl font-bold font-serif text-gray-400">
          Report Category
        </h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by name or date"
            className="px-3 py-2 border rounded mr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="px-4 py-2 lg:px-6 lg:py-3 text-base text-white bg-green-600 rounded hover:bg-green-700"
            onClick={handleAddReportCategory}
          >
            + Upload
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border shadow-2xl border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Report Category</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="px-4 py-2 border-b text-center">{row.name}</td>
                <td className="px-4 py-2 border-b text-center">
                  {row.expireDate}
                </td>
                <td className="px-4 py-2 border-b text-center flex">
                  <button
                    className="mr-4 px-1 py-1 lg:px-4 lg:py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(row.id)}
                  >
                    <FaEdit className="mr-1" />
                  </button>
                  <button
                    className="px-1 py-1 lg:px-4 lg:py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => handleDelete(row.id)}
                  >
                    <FaTrashAlt className="mr-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <p>
            Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
          </p>
          <button
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Category;
