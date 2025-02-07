import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // SweetAlert2 for notifications

const EditCategory = () => {
  const { id } = useParams(); // Retrieve category ID from route parameters
  const [categoryName, setCategoryName] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const navigate = useNavigate();

  // Fetch category details by ID
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/reportCategory/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch category details.');
        }
        const category = await response.json();
        setCategoryName(category.name);
        setExpireDate(category.expireDate);
      } catch (error) {
        console.error('Error fetching category:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch category details. Please try again later.',
          confirmButtonColor: '#d33',
        });
      }
    };

    fetchCategory();
  }, [id]);

  // Handle category update submission
  const handleEditCategory = async (e) => {
    e.preventDefault();

    if (!categoryName || !expireDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill out all fields.',
        confirmButtonColor: '#fbbf24',
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName, expireDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category.');
      }

      Swal.fire({
        icon: 'success',
        title: 'Category Updated',
        text: 'The category has been updated successfully!',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate('/admin/report_category');
      });
    } catch (error) {
      console.error('Error updating category:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Could not update the category. Please try again later.',
        confirmButtonColor: '#d33',
      });
    }
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
