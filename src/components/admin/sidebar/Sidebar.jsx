import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaClipboardList,
  FaTags,
  FaHome,
  FaBell,
  FaLayerGroup,
  FaRegNewspaper,
  FaUserEdit,
  FaFill,
  FaListAlt,
} from "react-icons/fa";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdListAlt,
  MdManageAccounts,
  MdOutlineAppRegistration,
} from "react-icons/md";

import "./Admin_Sidebar.css";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios"; // Add axios to fetch user role
import { FaLetterboxd, FaSquareLetterboxd } from "react-icons/fa6";

const Sidebar = ({ darkMode, toggleDarkMode, collapsed }) => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isCSOOpen, setIsCSOOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStaffOpen, setIsStaffOpen] = useState(false);

  const [isWebContentOpen, setIsWebContentOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); // Track user role
  const location = useLocation();
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/staff/me`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);
  const toggleReportsSubmenu = () => {
    setIsReportsOpen(!isReportsOpen);
  };
  const toggleStaffSubmenu = () => {
    setIsStaffOpen(!isStaffOpen);
  };
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  const toggleCsoSubmenu = () => {
    setIsCSOOpen(!isCSOOpen);
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

          {/* <li
            className={`menu-item ${isActive("/admin/forms") ? "active" : ""}`}
          >
            <Link to="/admin/forms" className="flex items-center">
              <FaListAlt />
              <span>{!collapsed && "Forms"}</span>
            </Link>
          </li> */}
           <li
                className={`menu-item ${
                  isActive("/admin/forms") ? "active" : ""
                }`}
              >
                <Link to="/admin/forms" className="flex items-center">
                  <FaListAlt />
                  <span>{!collapsed && "Forms"}</span>
                </Link>
              </li>
          {/* <li className="menu-item" onClick={toggleForm}>
            <MdManageAccounts />
            <span>{!collapsed && "Form"}</span>
            {!collapsed &&
              (isFormOpen ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />)}
          </li>
          {!collapsed && isFormOpen && (
            <ul className="submenu">
             

              <li
                className={`menu-item ${
                  isActive("/admin/create_form") ? "active" : ""
                }`}
              >
                <Link to="/admin/create_form" className="flex items-center">
                  <FaFill />
                  <span>{!collapsed && "Create Form"}</span>
                </Link>
              </li>
            </ul>
          )} */}

          <li
            className={`menu-item ${
              isActive("/admin/all_submission") ? "active" : ""
            }`}
          >
            <Link to="/admin/all_submission" className="flex items-center">
              <FaListAlt />
              <span>{!collapsed && "ALL Submission"}</span>
            </Link>
          </li>

          <li className="menu-item" onClick={toggleCsoSubmenu}>
            <MdManageAccounts />
            <span>{!collapsed && "CSO Management"}</span>
            {!collapsed &&
              (isCSOOpen ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />)}
          </li>
          {!collapsed && isCSOOpen && (
            <ul className="submenu">
              <li
                className={`menu-item ${
                  isActive("/admin/all_cso") ? "active" : ""
                }`}
              >
                <Link to="/admin/all_cso" className="flex items-center">
                  <MdListAlt />
                  <span>{!collapsed && "All CSOs"}</span>
                </Link>
              </li>
              <li
                className={`menu-item ${
                  isActive("/admin/cso_list") ? "active" : ""
                }`}
              >
                <Link to="/admin/cso_list" className="flex items-center">
                  <MdOutlineAppRegistration />
                  <span>{!collapsed && "Registered CSO"}</span>
                </Link>
              </li>
              <li
                className={`menu-item ${
                  isActive("/admin/user_register") ? "active" : ""
                }`}
              >
                <Link to="/admin/user_register" className="flex items-center">
                  <FaUsers />
                  <span>{!collapsed && "Register CSOs"}</span>
                </Link>
              </li>
            </ul>
          )}

          <li
            className={`menu-item ${
              isActive("/admin/letter_list") ? "active" : ""
            }`}
          >
            <Link to="/admin/letter_list" className="flex items-center">
              <FaSquareLetterboxd />
              <span>{!collapsed && "Letter"}</span>
            </Link>
          </li>
          {userRole === "sup_admin" && (
            <li
              className={`menu-item ${
                isActive("/admin/staffs") ? "active" : ""
              }`}
            >
              <Link to="/admin/staffs" className="flex items-center">
                <FaUsers />
                <span>{!collapsed && "Staff"}</span>
              </Link>
            </li>
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
                  isActive("/admin/web_content/hero_content") ? "active" : ""
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

          {/* <li
            className={`menu-item ${
              isActive("/admin/create_userAccount") ? "active" : ""
            }`}
          >
            <Link to="/admin/create_userAccount" className="flex items-center">
              <FaUserEdit />
              <span>{!collapsed && "Create Account"}</span>
            </Link>
          </li> */}

          <li
            className={`menu-item ${
              isActive("/admin/beneficiary_list") ? "active" : ""
            }`}
          >
            <Link to="/admin/beneficiary_list" className="flex items-center">
              <FaUsers />
              <span>{!collapsed && "Beneficiary"}</span>
            </Link>
          </li>

          <li
            className={`submenu-item ${
              isActive("/admin/notifications") ? "active" : ""
            }`}
          >
            <Link to="/admin/notifications" className="flex items-center">
              <FaBell />
              <span className="ml-2">Notifications</span>
            </Link>
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
