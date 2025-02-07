import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./nav.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaMoon, FaSun } from "react-icons/fa";

export const navLinks = [
  { text: "Home", path: "/" },
  { text: "About", path: "/about" },
  { text: "Services", path: "/service" },
  { text: "News", path: "/news" },

  { text: "All CSAs", path: "/csas" },
  { text: "Contact", path: "/contact" },

  { text: "Login", path: "/user/login" },
];

function Header() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Apply theme changes and store the preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".nav-bar");
      if (window.scrollY > 100) {
        header.classList.add("header_scroll");
      } else {
        header.classList.remove("header_scroll");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <nav
      className={`nav-bar ${isScrolled ? "scrolled" : "transparent"} ${
        darkMode ? "dark" : "light"
      }`}
    >
      <div className="nav-logo mt-4 pr-0 pl-0 lg:pr-10 lg:pl-10">
        <img
          src="/logo3.png"
          alt="Logo"
          className="logo"
          style={{ width: "40px", height: "40px" }}
        />
        <h2 className="mb-4 text-sm lg:text-2xl md:text-xl">Bissoftu Finance Office</h2>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? (
          <i
            className="fa fa-times"
            style={{ zIndex: 20, cursor: "pointer", fontSize: "24px" }}
          ></i>
        ) : (
          <i
            className="fa fa-bars"
            style={{ cursor: "pointer", fontSize: "24px" }}
          ></i>
        )}
      </div>

      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}

      <div className={`nav-links ${isMenuOpen ? "show" : ""}`}>
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="nav-link"
            onClick={toggleMenu}
          >
            {link.text}
          </Link>
        ))}
        <div className="mode">
          <button onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
