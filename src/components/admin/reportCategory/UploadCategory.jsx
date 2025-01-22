import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const UploadCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleAddCategory = async (e) => {
    e.preventDefault();

   const token =  localStorage.getItem("token");
   if (!token) {
    setError("No token found. Please log in.");
    return;
  }
    try {
      // Make a POST request to the backend
      const response = await axios.post('http://localhost:8000/reportCategory/category', {
        name: categoryName,
        expireDate: expireDate,
      },{
      headers: {
        "Authorization": `Bearer ${token}`, // Include token in Authorization header
        "Content-Type": "application/json", // Ensure proper content type
      },
    });
       console.log(response)
      if (response.data.success) {
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Category Added Successfully',
          text: `Name: ${categoryName}\nExpire Date: ${expireDate}`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#4CAF50',
        }).then(() => {
          // Redirect to /admin/report_category
          navigate('/admin/report_category');
        });

        setCategoryName('');
        setExpireDate('');
      } else {
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to add category',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while adding the category.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl lg:text-2xl font-bold font-serif text-gray-400 mb-4">Add Report Category</h1>
      
      <form onSubmit={handleAddCategory} className="bg-white p-2 lg:p-4 md:p-4 rounded shadow-lg shadow-gray-400">
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-gray-700 mb-2">
            Report Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g., Yearly, Quarterly, Project Proposal"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="expireDate" className="block text-gray-700 mb-2">
            Expire Date
          </label>
          <input
            type="date"
            id="expireDate"
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default UploadCategory;
