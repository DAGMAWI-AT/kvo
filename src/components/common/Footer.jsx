import React from "react";
import { AddLocationAltOutlined, EmailOutlined, PhoneIphone } from "@mui/icons-material";
import "./Footer.css";
import { Link } from "react-router-dom";

export const navLinks = [
  { text: "Home", path: "/" },
  { text: "About", path: "/about" },
  { text: "Services", path: "/" },
  { text: "All CSAs", path: "/csas" },
  { text: "Terms and Policy", path: "/terms" },
  { text: "FAQ", path: "/faq" },
  { text: "Login", path: "/login" },
];
function Footer() {
  return (
    <>
      <footer>
        <div>
          {navLinks.map((link, index) => (
            <Link key={index} to={link.path}>
              <p>{link.text}</p>
            </Link>
          ))}
        </div>
        <div>
          <h3>Contact Us</h3>
          <p>
            <PhoneIphone />
            +251985187059
          </p>
          <p>
            <EmailOutlined />
            example@gmail.com
          </p>
          <p>
            <AddLocationAltOutlined />
             Bishoftu Oromia, Ethiopia
          </p>
        </div>
      </footer>
      <p className="right">@ All rights reserved</p>
    </>
  );
}

export default Footer;
