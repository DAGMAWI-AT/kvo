import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Reports = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([
    { id: 1, item: "Quarterly", date: "12/2/2024" },
    { id: 2, item: "Yearly", date: "12/2/2024" },
  ]);

  const handleEdit = (id) => {
    navigate("/admin/report_category/edit_category");
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The report category has been deleted.',
          confirmButtonColor: '#3085d6',
        });
      }
    });
  };

  const handleAddReportCategory = () => {
    navigate("/admin/report_category/category");
  };

  return (
    <div className="p-2 lg:p-8 mx-auto max-w-7xl font-serif">
      <div className="flex justify-between items-center mb-6">
        <h2 className=" text-xl lg:text-2xl font-bold font-serif text-gray-400">Report Category</h2>
        <button
          className="px-4 py-2 lg:px-6 lg:py-3 text-base text-white bg-green-600 rounded hover:bg-green-700"
          onClick={handleAddReportCategory}
        >
          + Upload
        </button>
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
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-center">{row.id}</td>
              <td className="px-4 py-2 border-b text-center">{row.item}</td>
              <td className="px-4 py-2 border-b text-center">{row.date}</td>
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
                  <FaTrashAlt className="mr-1"/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Reports;
