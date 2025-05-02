// src/components/Service.jsx

import React from 'react';
import { FaMoneyCheckAlt, FaLandmark, FaFileInvoiceDollar, FaUsers } from 'react-icons/fa';

const services = [
  {
    title: "Budget Planning",
    description: "Comprehensive financial budgeting and forecasting for public projects and services.",
    icon: <FaMoneyCheckAlt className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: "Revenue Collection",
    description: "Efficient and transparent revenue collection services supporting community development.",
    icon: <FaLandmark className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: "Financial Auditing",
    description: "Ensuring financial transparency through detailed audits and public reporting.",
    icon: <FaFileInvoiceDollar className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: "Public Consultations",
    description: "Engaging citizens through consultations for better financial decision-making.",
    icon: <FaUsers className="text-blue-600 text-4xl mb-4" />,
  },
];

const Service = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-800 mb-4">Our Services</h2>
        <p className="text-gray-600 mb-12">
          Dedicated to financial transparency, efficiency, and community service.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-8 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-center">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        {/* <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Get In Touch</h3>
          <p className="text-gray-600">
            Have questions? Contact Bishoftu Finance Office today for more information.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Service;
