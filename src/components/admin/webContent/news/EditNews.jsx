import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    tag: '',
    quotes: '',
    image: null,
    created_at: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/news/${id}`);
        const newsItem = response.data.data;
        setFormData({
          title: newsItem.title,
          description: newsItem.description,
          author: newsItem.author,
          tag: newsItem.tag,
          quotes: newsItem.quotes,
          image: newsItem.image,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load news item');
        toast.error(err.response?.data?.message || 'Failed to load news item');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('tag', formData.tag);
      formPayload.append('quotes', formData.quotes);

      if (formData.image instanceof File) {
        formPayload.append('image', formData.image);
      }

      await axios.put(`${process.env.REACT_APP_API_URL}/api/news/${id}`, formPayload, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('News updated successfully');
      navigate('/admin/news_list');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update news');
      toast.error(err.response?.data?.message || 'Failed to update news');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="medium" />
      </div>
    );
  }
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Edit News</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              className="w-full p-2 border rounded-lg"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              name="author"
              className="w-full p-2 border rounded-lg"
              value={formData.author}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              name="description"
              className="w-full p-2 border rounded-lg h-32"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quotes</label>
            <textarea
              name="quotes"
              className="w-full p-2 border rounded-lg h-32"
              value={formData.quotes}
              onChange={handleChange}
              placeholder="Add notable quotes"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              onChange={handleImageChange}
              accept="image/*"
            />
            {formData.image && (
              <img
                src={typeof formData.image === 'string'
                  ? `${process.env.REACT_APP_API_URL}/${formData.image}`
                  : URL.createObjectURL(formData.image)}
                alt="Preview"
                className="mt-2 h-32 object-cover rounded-lg"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tag</label>
            <input
              type="text"
              name="tag"
              className="w-full p-2 border rounded-lg"
              value={formData.tag}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNews;
