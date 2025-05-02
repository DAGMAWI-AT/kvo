import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const CreateHeroSlide = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: '',
    subtitle: ''
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/hero/${id}`).then(res => {
        const data = res.data.data;
        setForm({ title: data.title, subtitle: data.subtitle });
        setPreview(`${process.env.REACT_APP_API_URL}/hero/${data.image_url}`);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    if (image) {
      formData.append("image", image);
    }

    try {
      if (id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/hero/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Slide updated!");
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/hero`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Slide created!");
      }
      navigate('/admin/hero');
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">{id ? 'Edit Slide' : 'Create New Hero Slide'}</h2>
      <form onSubmit={submitForm} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
            {...(!id && { required: true })}
          />
          {preview && (
            <div className="mt-3">
              <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded shadow" />
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

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all">
          {id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreateHeroSlide;
