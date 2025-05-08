import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusOutlined, EditOutlined, DeleteOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';

const { confirm } = Modal;

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({ title: '', summary: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/services`);
    setServices(res.data);
  };

  const handleInputChange = (e, field, id = null) => {
    const value = e.target.value;
    if (id !== null) {
      setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    } else {
      setNewService({ ...newService, [field]: value });
    }
  };

  const saveEdit = async (id) => {
    const service = services.find(s => s.id === id);
    await axios.put(`${process.env.REACT_APP_API_URL}/api/services/${id}`, {
      title: service.title,
      summary: service.summary,
    });
    setEditingId(null);
    message.success('Service updated successfully');
  };

  const addService = async () => {
    if (!newService.title || !newService.summary) return;
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/services`, newService);
    setServices([...services, res.data]);
    setNewService({ title: '', summary: '' });
    setIsAdding(false);
    message.success('Service added successfully');
  };

  const confirmDelete = (id) => {
    confirm({
      title: 'Delete Service',
      content: 'Are you sure you want to delete this service?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/services/${id}`);
        setServices(services.filter(s => s.id !== id));
        message.success('Service deleted');
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Service Management
        </h1>
        <p className="text-gray-500">Manage your organization's services and offerings</p>
      </motion.div>

      <div className="flex justify-end mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          onClick={() => setIsAdding(!isAdding)}
        >
          <PlusOutlined className="text-lg" />
          {isAdding ? 'Cancel' : 'Add Service'}
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Create New Service</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  placeholder="Service Title"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newService.title}
                  onChange={(e) => handleInputChange(e, 'title')}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Summary</label>
                <textarea
                  placeholder="Service Description"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  value={newService.summary}
                  onChange={(e) => handleInputChange(e, 'summary')}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={addService}
                >
                  <SaveOutlined className="mr-2" />
                  Save Service
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        <AnimatePresence>
          {services.map(service => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              {editingId === service.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={service.title}
                    className="w-full px-4 py-3 text-xl font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleInputChange(e, 'title', service.id)}
                  />
                  <textarea
                    value={service.summary}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                    onChange={(e) => handleInputChange(e, 'summary', service.id)}
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                      onClick={() => setEditingId(null)}
                    >
                      <CloseOutlined className="mr-2" />
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => saveEdit(service.id)}
                    >
                      <SaveOutlined className="mr-2" />
                      Save Changes
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.summary}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      onClick={() => setEditingId(service.id)}
                    >
                      <EditOutlined className="mr-2" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      onClick={() => confirmDelete(service.id)}
                    >
                      <DeleteOutlined className="mr-2" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServiceManager;