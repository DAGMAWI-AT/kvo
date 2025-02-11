import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaCog,
  FaClipboardList,
  FaTags,
  FaExpeditedssl,
  FaHome,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

import "./Admin_Sidebar.css";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

const Sidebar = ({ darkMode, toggleDarkMode, collapsed }) => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isWebContentOpen, setIsWebContentOpen] = useState(false); // Added state for Web Content submenu
  const location = useLocation();

  const toggleReportsSubmenu = () => {
    setIsReportsOpen(!isReportsOpen);
  };

  const toggleWebContentSubmenu = () => {
    setIsWebContentOpen(!isWebContentOpen); // Toggle for Web Content submenu
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`admin_sidebar ${collapsed ? "collapsed" : ""} ${
        darkMode ? "dark" : "light"
      }`}
    >
      <div className="logo">
        <h2>{collapsed ? "FO" : "Finance Office"}</h2>
      </div>
      <div className="scrollable-menu">
        <ul className="menu">
          <li
            className={`menu-item ${
              isActive("/admin/dashboard") ? "active" : ""
            }`}
          >
            <Link to="/admin/dashboard" className="flex items-center">
              <FaTachometerAlt />
              <span>{!collapsed && "Dashboard"}</span>
            </Link>
          </li>
          <li
            className={`menu-item ${
              isActive("/admin/all_cso") ? "active" : ""
            }`}
          >
            <Link to="/admin/all_cso" className="flex items-center">
              <FaBox />
              <span>{!collapsed && "All CSOs"}</span>
            </Link>
          </li>
          <li className="menu-item" onClick={toggleReportsSubmenu}>
            <FaClipboardList />
            <span>{!collapsed && "Reports"}</span>
            {!collapsed &&
              (isReportsOpen ? (
                <MdKeyboardArrowDown />
              ) : (
                <MdKeyboardArrowRight />
              ))}
          </li>
          {!collapsed && isReportsOpen && (
            <ul className="submenu">
              <li
                className={`submenu-item ${
                  isActive("/admin/report_category") ? "active" : ""
                }`}
              >
                <Link to="/admin/report_category" className="flex items-center">
                  <FaTags />
                  <span>Category</span>
                </Link>
              </li>{" "}
              <li
                className={`submenu-item ${
                  isActive("/admin/expire_date") ? "active" : ""
                }`}
              >
                <Link to={"/admin/expire_date"} className="flex items-center">
                  <FaExpeditedssl />
                  Expire Date
                </Link>
              </li>
              <li
                className={`submenu-item ${
                  isActive("/admin/report_category/all_cso_reports")
                    ? "active"
                    : ""
                }`}
              >
                <Link
                  to={"/admin/report_category/all_cso_reports"}
                  className="flex items-center"
                >
                  <FaClipboardList />
                  All Reports
                </Link>
              </li>
            </ul>
          )}
          <li className="menu-item" onClick={toggleWebContentSubmenu}>
            <FaHome />
            <span>{!collapsed && "Web Content"}</span>
            {!collapsed &&
              (isWebContentOpen ? (
                <MdKeyboardArrowDown />
              ) : (
                <MdKeyboardArrowRight />
              ))}
          </li>
          {!collapsed && isWebContentOpen && (
            <ul className="submenu">
              <li
                className={`submenu-item ${
                  isActive("/admin/web_content/hero_content")
                    ? "active"
                    : ""
                }`}
              >
                <Link
                  to="/admin/web_content/hero_content"
                  className="flex items-center"
                >
                  <FaClipboardList />
                  Hero Content
                </Link>
              </li>
              <li
                className={`submenu-item ${
                  isActive("/admin/web_content/meeting_content") ? "active" : ""
                }`}
              >
                <Link
                  to="/admin/web_content/meeting_content"
                  className="flex items-center"
                >
                  <FaTags />
                  Meeting Content
                </Link>
              </li>
              <li
                className={`submenu-item ${
                  isActive("/admin/web_content/seo") ? "active" : ""
                }`}
              >
                <Link to="/admin/web_content/seo" className="flex items-center">
                  <FaTags />
                  SEO Settings
                </Link>
              </li>
            </ul>
          )}
          <li
            className={`menu-item ${isActive("/admin/users") ? "active" : ""}`}
          >
            <Link to="/admin/users" className="flex items-center">
              <FaUsers />
              <span>{!collapsed && "Users"}</span>
            </Link>
          </li>
          <li
            className={`menu-item ${
              isActive("/admin/cso_list") ? "active" : ""
            }`}
          >
            <Link to="/admin/cso_list" className="flex items-center">
              <FaBox />
              <span>{!collapsed && "Registered CSO"}</span>
            </Link>
          </li>
          <li
            className={`menu-item ${isActive("/admin/create_userAccount") ? "active" : ""}`}
          >
            <Link to="/admin/create_userAccount" className="flex items-center">
              <FaUsers />
              <span>{!collapsed && "Create Account Users"}</span>
            </Link>
          </li>

          <li
            className={`menu-item ${isActive("/admin/user_register") ? "active" : ""}`}
          >
            <Link to="/admin/user_register" className="flex items-center">
              <FaUsers />
              <span>{!collapsed && "Register CSOs"}</span>
            </Link>
          </li>
          {/* <li>
            <FaMoneyBill />
            <span>{!collapsed && "Expenses"}</span>
          </li> */}


          <li>
            <FaCog />
            <span>{!collapsed && "Settings"}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
