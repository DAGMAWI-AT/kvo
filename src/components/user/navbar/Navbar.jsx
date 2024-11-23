import React from "react";
import { FaSearch, FaBell, FaUserCircle, FaMoon, FaSun, FaBars } from "react-icons/fa";
import "./Navbar.css"; // Custom CSS file for styling

const Navbar = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  return (
    // <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
    <nav className='navbar'>

     <div className="navbar-left">
        {/* Hamburger Menu */}
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars className="hamburger-icon" />
        </button>
      </div>
      <div className="navbar-center">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Type to Search for groups"
            className="search-input"
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
