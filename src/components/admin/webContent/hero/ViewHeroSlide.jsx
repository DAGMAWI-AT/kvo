import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

const ViewHeroSlide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/hero/${id}`)
      .then(res => {
        setSlide(res.data.data);
      })
      .catch(() => {
        navigate("/admin/hero");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!slide) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={`${process.env.REACT_APP_API_URL}/hero/${slide.image_url}`}
          alt={slide.title}
          className="w-full h-72 object-cover"
        />
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{slide.title}</h2>
          <p className="text-lg text-gray-600 mb-4">{slide.subtitle}</p>

          <div className="flex items-center justify-between pt-4 border-t">
            <Link
              to="/admin/hero"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition"
            >
              <FaArrowLeft className="mr-2" /> Back to Hero
            </Link>
            <span className="text-sm text-gray-400">
              ID: <span className="text-gray-600 font-medium">{slide.id}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHeroSlide;
