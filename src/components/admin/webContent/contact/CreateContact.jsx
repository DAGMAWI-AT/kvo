import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateContact = () => {
  // Initialize with default empty values
  const [formData, setFormData] = useState({
    page_title: '',
    description: '',
    email: [''],
    phone: [''],
    location: '',
    address: '',
    map_embed_url: '',
    image_url: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contact/contact`);
        
        // If data exists, use it, otherwise keep the empty defaults
        if (res.data) {
          setFormData({
            page_title: res.data.page_title || '',
            description: res.data.description || '',
            email: res.data.email?.length ? res.data.email : [''],
            phone: res.data.phone?.length ? res.data.phone : [''],
            location: res.data.location || '',
            address: res.data.address || '',
            map_embed_url: res.data.map_embed_url || '',
            image_url: res.data.image_url || ''
          });
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        // Don't set error state - just keep the empty form
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleListChange = (type, index, value) => {
    const updated = [...formData[type]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [type]: updated }));
  };

  const addField = (type) => {
    setFormData((prev) => ({ ...prev, [type]: [...prev[type], ''] }));
  };

  const removeField = (type, index) => {
    const updated = [...formData[type]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [type]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        'http://localhost:5000/api/contact/contentInfo',
        formData
      );
      alert('Contact Info Updated!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  if (loading) return <div>Loading...</div>;
  
  // Don't show error - just render the empty form
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {formData.page_title ? 'Edit Contact Info' : 'Create Contact Info'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Page Title */}
        <input
          name="page_title"
          value={formData.page_title}
          onChange={handleChange}
          placeholder="Page Title"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        {/* Email List */}
        <div>
          <label className="font-semibold text-gray-700">Emails</label>
          {formData.email.map((email, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => handleListChange('email', i, e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              {formData.email.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField('email', i)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField('email')}
            className="text-blue-600 text-sm mt-1"
          >
            + Add Email
          </button>
        </div>

        {/* Phone List */}
        <div>
          <label className="font-semibold text-gray-700">Phone Numbers</label>
          {formData.phone.map((phone, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => handleListChange('phone', i, e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              {formData.phone.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField('phone', i)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField('phone')}
            className="text-blue-600 text-sm mt-1"
          >
            + Add Phone
          </button>
        </div>

        {/* Location */}
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        {/* Address */}
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        {/* Google Maps Embed URL */}
        <input
          name="map_embed_url"
          value={formData.map_embed_url}
          onChange={handleChange}
          placeholder="Google Maps Embed URL"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        {/* Image URL */}
        <input
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateContact;