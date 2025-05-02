import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Modal, Spin } from 'antd';
import { FiEye, FiTrash2 } from 'react-icons/fi';

const HeroSlideList = () => {
  const [slides, setSlides] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadSlides = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hero`);
      setSlides(res.data.data);
    } catch (err) {
      toast.error(err?.message || "Failed to load slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/hero/${deleteId}`);
      toast.success('Slide deleted');
      loadSlides();
    } catch (err) {
      toast.error('Failed to delete slide');
    } finally {
      setModalVisible(false);
      setDeleteId(null);
    }
  };

  const filtered = slides.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Hero Slides</h1>
        <button
          onClick={() => navigate('/admin/create_hero')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Hero Slide
        </button>
      </div>

      {/* Search */}
      <div className="relative flex items-center mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="w-52 p-2 pl-10 pr-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table */}
      <table className="w-full text-left border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-3">#</th>
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Subtitle</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-10">
                <Spin size="medium" />
              </td>
            </tr>
          ) : filtered.length > 0 ? (
            filtered.map((slide, index) => (
              <tr key={slide.id} className="border-t hover:bg-gray-50 text-gray-600">
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/hero/${slide.image_url}`}
                    alt="slide"
                    className="h-12 w-24 object-cover rounded"
                  />
                </td>
                <td className="p-3 font-medium">{slide.title}</td>
                <td className="p-3 truncate">{slide.subtitle}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/view_hero/${slide.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/edit_hero/${slide.id}`)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => confirmDelete(slide.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-gray-400 py-8">
                No hero slides found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <Modal
        title="Confirm Deletion"
        open={modalVisible}
        onOk={handleDelete}
        onCancel={() => setModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to permanently delete this slide?</p>
      </Modal>
    </div>
  );
};

export default HeroSlideList;
