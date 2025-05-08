import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [contactInfo, setContactInfo] = useState({
    email: [],
    phone: [],
    location: "",
    address: "",
    map_embed_url: "",
  });
  const [isFetching, setIsFetching] = useState(true);

  // Fetch contact data from the API
  const fetchContactInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/contact/contact`
      );
      const data = await response.json();

      setContactInfo({
        email: Array.isArray(data?.email) ? data.email : [],
        phone: Array.isArray(data?.phone) ? data.phone : [],
        location: data?.location || "",
        address: data?.address || "",
        map_embed_url: data?.map_embed_url || "",
      });
    } catch (err) {
      console.error("Error fetching contact data:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/contact/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert(result.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
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
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 text-center px-4 bg-gradient-to-r from-[#46b8ec] to-[#6c757d] text-white">
        <div className="absolute inset-0 bg-[url('./banner_bg.png')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 container mx-auto">
          <motion.h1
            className="text-4xl font-bold mb-4 text-blue-900"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-lg max-w-2xl mx-auto text-gray-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            We'd love to hear from you. Reach out for inquiries, support, or
            just to say hello.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
              {/* Email Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-4 hover:bg-blue-50 rounded-lg transition-all"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaEnvelope className="text-xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Email Us
                  </h3>
                  {contactInfo.email.length > 0 ? (
                    contactInfo.email.map((email, index) => (
                      <a
                        key={index}
                        href={`mailto:${email}`}
                        className="block text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {email}
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-500">No email provided</p>
                  )}
                </div>
              </motion.div>

              {/* Location Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-4 hover:bg-blue-50 rounded-lg transition-all"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaMapMarkedAlt className="text-xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Visit Us
                  </h3>
                  {contactInfo.location ? (
                    <p className="text-gray-600">{contactInfo.location}</p>
                  ) : (
                    <p className="text-gray-500">No location provided</p>
                  )}
                </div>
              </motion.div>

              {/* Phone Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-4 hover:bg-blue-50 rounded-lg transition-all"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaPhoneAlt className="text-xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Call Us
                  </h3>
                  {contactInfo.phone.length > 0 ? (
                    contactInfo.phone.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone}`}
                        className="block text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {phone}
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-500">No phone number provided</p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center"
              >
                <FaCheckCircle className="mr-2" />
                {successMessage}
              </motion.div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-2xl font-bold mb-2 text-gray-800"
              >
                Send Us a Message
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-gray-600 mb-6"
              >
                Have questions or feedback? Fill out the form below and we'll
                get back to you promptly.
              </motion.p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <label className="block mb-2 font-medium text-gray-700">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <label className="block mb-2 font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <label className="block mb-2 font-medium text-gray-700">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    required
                    placeholder="Type your message here..."
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  ></textarea>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 w-5 h-5 border border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: 0.8 }}
                  viewport={{ once: true }}
                  type="submit"
                  disabled={loading}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all w-full ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      Sending...
                      <FaSpinner className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <FaPaperPlane />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-[450px] w-full"
      >
        {contactInfo.map_embed_url ? (
          <div className="overflow-hidden rounded-lg shadow-lg h-full">
            <iframe
              src={contactInfo.map_embed_url}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
              aria-hidden="false"
              tabIndex="0"
              loading="lazy"
              title="Location Map"
            ></iframe>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.8571860535044!2d38.97399971020746!3d8.74871099126558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b7320e6e16963%3A0xf65a8cd917f28fd5!2sBishoftu%20City%20Administration!5e1!3m2!1sen!2set!4v1734346050229!5m2!1sen!2set"
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default Contact;
