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
        <h2>{collapsed ? "CSO" : "CSOs"}</h2>
      </div>
      <div className="scrollable-menu">
        <ul className="menu">
          <li
            className={`menu-item ${
              isActive("/user/dashboard") ? "active" : ""
            }`}
          >
            <Link to="/user/dashboard" className="flex items-center">
              <FaTachometerAlt />
              <span>{!collapsed && "Dashboard"}</span>
            </Link>
          </li>
          <li>
            <FaBox />
            <span>{!collapsed && "Inventory"}</span>
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
                  isActive("/user/dashboard/work_report") ? "active" : ""
                }`}
              >
                <Link
                  to="/user/dashboard/work_report"
                  className="flex items-center"
                >
                  <FaClipboardList />
                  <span className="ml-2">Work Report</span>
                </Link>
              </li>{" "}
              <li className="submenu-item">
                <FaClipboardList />
                Leads Report
              </li>
              <li className="submenu-item">
                <FaClipboardList />
                Project Report
              </li>
              <li className="submenu-item">
                <FaClipboardList />
                Proposal Report
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
