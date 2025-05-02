import React, { useState } from 'react';
import  { toast } from 'react-toastify';
import axios from "axios";


const CreateNews = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    read_time: '',
    tag: '',
    quotes: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
   
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/news/create`,
        data,
        { withCredentials: true }

      );

      if (response.data.success) {
        toast.success('News created successfully!');
        setFormData({
          title: '',
          description: '',
          read_time: '',
          tag: '',
          quotes: '',
          image: null
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create news');
      toast.error(err.response?.data?.error || 'Failed to create news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New News Article</h2>
      
      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
            <input
              type="text"
              name="read_time"
              value={formData.read_time}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5 min read"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quotes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quotes</label>
          <textarea
            name="quotes"
            value={formData.quotes}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create News'}
        </button>
      </form>
    </div>
  );
};

export default CreateNews;