import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const EditCategory = () => {
  const { id } = useParams(); // Get category ID from route params
  const [categoryName, setCategoryName] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const navigate = useNavigate();

  // Simulate fetching category details by ID
  useEffect(() => {
    const fetchCategory = async () => {
      // Replace with actual API call
      const category = {
        id,
        name: 'Quarterly Report',
        expireDate: '2024-12-31',
      };
      setCategoryName(category.name);
      setExpireDate(category.expireDate);
    };
    fetchCategory();
  }, [id]);

  const handleEditCategory = (e) => {
    e.preventDefault();

    if (!categoryName || !expireDate) {
      alert('Please fill out all fields.');
      return;
    }

    // Show SweetAlert2 success message
    Swal.fire({
      icon: 'success',
      title: 'Category Updated',
      text: 'The category has been updated successfully!',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
    }).then(() => {
      // Redirect to report category list after alert is closed
      navigate('/admin/report_category');
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Report Category</h1>

      <form onSubmit={handleEditCategory} className="bg-white p-4 rounded shadow-md">
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
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
