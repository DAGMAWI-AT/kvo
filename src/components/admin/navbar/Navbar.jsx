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
import { Link } from "react-router-dom";

const Navbar = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };
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
          <FaSearch className="text-gray-400 text-lg m-2 " />

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
        <div className="profile-menu">
          {/* Profile Icon */}
          <FaUserCircle className="icon user-icon" onClick={toggleProfileMenu} />
          {isProfileMenuOpen && (
            <div className="dropdown-menu" onMouseLeave={closeProfileMenu}>
              <ul>
                {/* <li onClick={closeProfileMenu}>
                  <Link to="/admin/edit_profile"> Profile</Link>
                </li> */}
                <li onClick={closeProfileMenu}>
                  <Link to="/admin/view_profile">Profile</Link>
                </li>
                <li onClick={closeProfileMenu}>
                  <Link to="/admin/update_password">Update Password</Link>
                </li>
                <li onClick={closeProfileMenu}>
                  <Link to="/admin/update_password">Log Out</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* <div className="navbar-right">
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <FaBell className="icon" />
        <FaUserCircle className="icon user-icon" />
      </div> */}
    </nav>
  );
};

export default Navbar;
