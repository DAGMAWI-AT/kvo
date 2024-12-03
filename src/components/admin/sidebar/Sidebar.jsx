import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaCog,
  FaMoneyBill,
  FaHistory,
  FaDochub,
  FaClipboardList,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

import "./Sidebar.css";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

const Sidebar = ({ darkMode, toggleDarkMode, collapsed }) => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const location = useLocation();

  const toggleReportsSubmenu = () => {
    setIsReportsOpen(!isReportsOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
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
          <li className={`menu-item ${isActive("/admin/all_cso")?"active":""}`}>
          <Link to="/admin/all_cso" className="flex items-center">
            <FaBox />
            <span>{!collapsed && "All CSOs"}</span>
            </Link>
          </li>
          <li className="menu-item" onClick={toggleReportsSubmenu}>
            <FaDochub />
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
                  <FaClipboardList />
                  <span>Category</span>
                </Link>
              </li>{" "}
              <li
                className={`submenu-item ${
                  isActive("/admin/expire_date") ? "active" : ""
                }`}
              >
                <Link to={"/admin/expire_date"} className="flex items-center">
                  <FaClipboardList />
                  Expire Date
                </Link>
              </li>
              <li className="submenu-item">
                <FaClipboardList />
                All Reports
              </li>
            </ul>
          )}

          <li>
            <FaUsers />
            <span>{!collapsed && "Users"}</span>
          </li>
          <li>
            <FaMoneyBill />
            <span>{!collapsed && "Expenses"}</span>
          </li>

          <li>
            <FaHistory />
            <span>{!collapsed && "History"}</span>
          </li>
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
