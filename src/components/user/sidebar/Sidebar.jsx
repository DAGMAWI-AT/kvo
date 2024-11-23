import React from "react";
import { FaTachometerAlt, FaBox, FaUsers, FaCog, FaMoneyBill, FaMoon, FaSun, FaHistory, FaDochub } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ darkMode, toggleDarkMode, collapsed }) => {
    return (
      <div className={`sidebar ${collapsed ? "collapsed" : ""} ${darkMode ? "dark" : "light"}`}>
     
      <div className="logo">
        <h2>{collapsed ? "Inv" : "CSOs"}</h2>
      </div>
      <ul className="menu">
        <li>
          <FaTachometerAlt />
          <span>{!collapsed && "Dashboard"}</span>
        </li>
        <li>
          <FaBox />
          <span>{!collapsed && "Inventory"}</span>
        </li>
        <li>
          <FaDochub />
          <span>{!collapsed && "Reports"}</span>
        </li>
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
  );
};

export default Sidebar;
