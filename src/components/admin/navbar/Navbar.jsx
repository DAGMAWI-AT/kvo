import React, { useState } from "react";
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa";
import "./Navbar.css"; // Custom CSS file for styling

const Navbar = ({ darkMode, toggleDarkMode, toggleSidebar }) => {

  return (
    // <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
    <nav className="navbar">
      <div className="navbar-left">
        {/* Hamburger Menu */}
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars className="hamburger-icon" />
        </button>
      </div>
      <div className="navbar-center">
  <div className="search-bar p-7 flex items-center border rounded-full px-1 py-1 w-full max-w-md border-gray-300 focus-within:border-blue-500">
    {/* Search Icon */}
    <FaSearch className="text-gray-400 text-lg m-2 " />
    
    {/* Input Field */}
    <input
      type="text"
      placeholder="Search"
      className="px-2 py-1 mr-1 mb-1 rounded-full border text-black border-gray-300 focus:outline-none focus:border-none text-sm w-full"
    />
  </div>
</div>

      <div className="navbar-right">
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <FaBell className="icon" />
        <FaUserCircle className="icon user-icon" />
      </div>
    </nav>
  );
};

export default Navbar;
