import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = `${process.env.REACT_APP_API_URL}/api/services`;

const ServiceOverview = () => {
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        setOverview(res.data);
        setFilteredServices(res.data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = overview.filter(service =>
      service.title.toLowerCase().includes(query) ||
      service.summary.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
  };

  const ServiceCard = ({ item, index }) => {
    const Icon = FaIcons[item.icon] || FaIcons.FaCheckCircle;

    return (
      <motion.div
        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="text-2xl text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.summary}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Service {index + 1}
              </span>
              {item.cover && (
                <span className="text-xs text-gray-500 flex items-center">
                  <FaIcons.FaImage className="mr-1" />
                  Has image
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 p-6 rounded-lg shadow-md bg-gray-100"
        >
          <FaIcons.FaSpinner className="animate-spin text-4xl text-blue-800" />
          <h2 className="text-xl font-semibold text-blue-900">
            Bishoftu Finance Office
          </h2>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Hero Section */}
      <section className="relative h-72 md:h-[250px] bg-blue-100 flex items-center justify-center text-blue-900 text-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/banner_bg.png')" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl px-6"
        >
          <h1 className="text-lg md:text-2xl font-bold mb-3">
            Discover Our Financial Services
          </h1>
          <p className="text-md md:text-lg text-gray-500">
            Transparent. Accountable. Community-focused.
          </p>
        </motion.div>
      </section>

      {/* ✅ Main Section */}
      <section className="bg-white py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Services
            </h2>
            <div className="w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <FaIcons.FaSearch className="absolute right-4 top-3.5 text-gray-400 text-xl" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              {filteredServices.length} services found
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredServices.map((item, i) => (
                <ServiceCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {filteredServices.length === 0 && !loading && (
            <div className="text-center py-12">
              <FaIcons.FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No services found
              </h3>
              <p className="text-gray-500">
                Try different search terms or check back later
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ServiceOverview;
