import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

const UpdateHeroSlide = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', subtitle: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/hero/${id}`)
      .then((res) => {
        const { title, subtitle, image_url } = res.data.data;
        setForm({ title, subtitle });
        setPreview(`${process.env.REACT_APP_API_URL}/hero/${image_url}`);
      })
      .catch(() => {
        toast.error("Failed to load slide");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    if (image) formData.append("image", image);

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/hero/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Slide updated!");
      navigate("/admin/hero");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 mt-10 rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Update Slide</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
          />
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded shadow"
              />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Slide title"
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Subtitle</label>
          <input
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Slide subtitle"
            className="w-full border rounded p-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all"
          >
            Update Slide
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/hero')}
            className="border px-6 py-2 rounded hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateHeroSlide;
