import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import "./Footer.css"
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { FaX } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <a href="/" className="inline-flex items-center space-x-2">
              <img src="/logo3.png" alt="Logo" className="h-10" />
              <span className="text-xl font-semibold text-gray-800">Finance Office</span>
            </a>
            <p className="mt-4 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about/" className="hover:text-gray-800">About Us</a>
              </li>
              <li>
                <a href="/services/" className="hover:text-gray-800">Services</a>
              </li>
              <li>
                <a href="/features/" className="hover:text-gray-800">Features</a>
              </li>
              <li>
                <a href="/csos/" className="hover:text-gray-800">All CSAs</a>
              </li>
              <li>
                <a href="/blog/" className="hover:text-gray-800">Latest News</a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq/" className="hover:text-gray-800">FAQ's</a>
              </li>
              <li>
                <a href="/privacy-policy/" className="hover:text-gray-800">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms-conditions/" className="hover:text-gray-800">Terms & Conditions</a>
              </li>
              <li>
                <a href="/team/" className="hover:text-gray-800">Team</a>
              </li>
              <li>
                <a href="/contact/" className="hover:text-gray-800">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Address and Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <HiOutlineLocationMarker className="text-gray-500 mr-2" />
                Bishoftu, Oromia, Ethiopia
              </li>
              <li className="flex items-center">
                <HiOutlineMail className="text-gray-500 mr-2" />
                <a href="mailto:startp@gmail.com" className="hover:text-gray-800">
                  csos@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <HiOutlinePhone className="text-gray-500 mr-2" />
                <a href="tel:+321984754" className="hover:text-gray-800">
                  + (251) 000 0000
                </a>
              </li>
            </ul>
            <div className="flex mt-4 space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-500"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://X.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-900 hover:text-black"
              >
                <FaX />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-pink-500"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 text-gray-600 text-center py-4">
        <p>
          © 2024 CSOs. All rights reserved. Powered by{" "}
          <a href="https://dagmawiamare.netlify.app" target="_blank" rel="noreferrer" className="hover:text-gray-800">
            KVO
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
