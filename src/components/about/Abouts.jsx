import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaBullseye,
  FaEye,
  FaHandshake,
  FaUsers,
  FaBalanceScale,
  FaRegCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import ScrollToTop from "../scrollToTop/ScrollToTop";

const iconMap = {
  integrity: <FaBalanceScale />,
  excellence: <FaRegCheckCircle />,
  inclusiveness: <FaUsers />,
  collaboration: <FaHandshake />,
  serving: <FaUsers />,
  transparency: <FaEye />,
};

const About = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/about`);
        const data = res.data.data;
        if (data) {
          data.core_values = JSON.parse(data.core_values || "[]");
          setAbout(data);
        }
      } catch (err) {
        console.error("Error fetching About info", err);
      }
    };

    fetchAbout();
  }, []);

  if (!about) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4 p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            Bishoftu Finance Office
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <div className="bg-gray-50 text-gray-800">
        {/* Hero Section */}
        <section className="bg-blue-100 py-20 text-center px-4">
          <motion.h2
            className="text-4xl font-bold text-blue-800 mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About Bishoftu Finance Office
          </motion.h2>
          <motion.p
            className="text-lg max-w-2xl mx-auto text-gray-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {about.introduction}
          </motion.p>
        </section>

        {/* Mission & Vision */}
        <section className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="flex items-center text-2xl font-bold text-blue-700 mb-4">
              <FaBullseye className="mr-2" /> Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">{about.mission}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="flex items-center text-2xl font-bold text-blue-700 mb-4">
              <FaEye className="mr-2" /> Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">{about.vision}</p>
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h3
              className="text-3xl font-bold text-blue-800 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Core Values
            </motion.h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {about.core_values.map((label, index) => {
                const lowerLabel = label.toLowerCase();
                const icon =
                  iconMap[lowerLabel] ||
                  <FaRegCheckCircle />; // fallback icon
                return (
                  <motion.div
                    key={index}
                    className="flex items-center justify-center space-x-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-blue-700 text-2xl">{icon}</div>
                    <span>{label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Purpose */}
        <section className="bg-blue-50 py-16 px-4 text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-blue-800 mb-6">Our Purpose</h3>
            <p className="text-lg text-gray-700">{about.purpose}</p>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default About;
