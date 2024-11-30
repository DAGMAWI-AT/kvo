import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./nav.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const navLinks = [
  { text: "Home", path: "/" },
  { text: "About", path: "/about" },
  { text: "Services", path: "/" },
  { text: "All CSAs", path: "/csas" },
  { text: "Terms and Policy", path: "/terms" },
  { text: "FAQ", path: "/faq" },
  { text: "Login", path: "/user/login" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <img
          src="/kvo.png"
          alt="Logo"
          className="logo"
          style={{ width: "40px", height: "40px" }}
        />
        <h2>KVO</h2>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
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
      </div>
    </nav>
  );
}

export default Header;
