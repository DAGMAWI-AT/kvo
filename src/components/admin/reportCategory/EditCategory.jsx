import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditCategory = () => {
  const { id } = useParams(); // Retrieve category ID from route parameters
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };
  // Fetch category details by ID
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reportCategory/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch category details.');
        }
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('Error fetching category:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch category details. Please try again later.',
          confirmButtonColor: '#d33',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Handle category update submission
  const handleEditCategory = async (e) => {
    e.preventDefault();

    // Validate if required fields are provided
    if (!category || !category.category_name || !category.expire_date) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill out all fields.',
        confirmButtonColor: '#fbbf24',
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reportCategory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: category.category_name,
          expire_date: category.expire_date,
        }),
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-500">Category not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
          <h1 className="text-2xl font-bold text-white text-center">Edit Report Category</h1>
        </div>
        <form onSubmit={handleEditCategory} className="p-6">
          <div className="mb-5">
            <label htmlFor="categoryName" className="block text-gray-700 font-medium mb-2">
              Report Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={category.category_name || ''}
              onChange={(e) =>
                setCategory((prev) => ({ ...prev, category_name: e.target.value }))
              }
              placeholder="e.g., Yearly, Quarterly, Project Proposal"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="expireDate" className="block text-gray-700 font-medium mb-2">
              Expire Date
            </label>
            <input
              type="date"
              id="expireDate"
              value={formatDate(category.expire_date)}
              onChange={(e) =>
                setCategory((prev) => ({ ...prev, expire_date: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
          >
            Update Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
