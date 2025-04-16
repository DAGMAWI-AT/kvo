import React, { useEffect, useState } from "react";
import {
  FaCog,
  
  FaClipboardList,
  FaHome,
  FaBell,
  FaCommentAlt,
  FaFolderMinus,
  FaUserAlt,
} from "react-icons/fa";
import { MdInbox, MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import "./Sidebar.css";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { History } from "@mui/icons-material";
import axios from "axios";

const Sidebar = ({ darkMode, toggleDarkMode, collapsed }) => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [, setLoading] = useState(true);

  const toggleReportsSubmenu = () => {
    setIsReportsOpen(!isReportsOpen);
  };

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      
      // 1. Get current user info
      const meResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/me`, 
        { withCredentials: true }
      );

      if (!meResponse.data?.success || !meResponse.data.userId) {
        throw new Error("Failed to get user details");
      }

      // 2. Get CSO info
      const csoResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cso/${meResponse.data.userId}`,
        { withCredentials: true }
      );

      if (!csoResponse.data?.id) {
        throw new Error("CSO information not found");
      }

      // 3. Get unread count for this CSO
      const countResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/letters/cso/${csoResponse.data.id}/unread-count`,
        { withCredentials: true }
      );

      if (countResponse.data?.success) {
        setUnreadCount(countResponse.data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchUnreadCount, 300000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`user_sidebar ${collapsed ? "collapsed" : ""} ${
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
              <FaHome />
              <span>{!collapsed && "Dashboard"}</span>
            </Link>
          </li>

          <li className="menu-item" onClick={toggleReportsSubmenu}>
            <FaFolderMinus />
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
                  isActive("/user/submitted") ? "active" : ""
                }`}
              >
                <Link to="/user/submitted" className="flex items-center">
                  <FaClipboardList />
                  <span className="ml-2">Reported</span>
                </Link>
              </li>
              <li className="submenu-item">
                <FaCommentAlt className="" />
                Comments
              </li>
            </ul>
          )}

<li className={`menu-item ${isActive("/user/letters_list") ? "active" : ""}`}>
  <Link 
    to="/user/letters_list" 
    className="inline-flex items-center hover:no-underline whitespace-nowrap"
  >
    
          <MdInbox className="text-lg" />
     
    <div className="relative inline-flex">
    {!collapsed && (
      <span className="inline-block">Letter</span>
    )}
      {unreadCount > 0 && (
        <span className="absolute -top-0 -right-5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
   
  </Link>
</li>


          <li className={`menu-item ${isActive("/user/form") ? "active" : ""}`}>
            <Link to="/user/form" className="flex items-center">
              <FaUserAlt />
              <span>{!collapsed && "Form"}</span>
            </Link>
          </li>

          <li className={`menu-item ${isActive("/user/submitted") ? "active" : ""}`}>
            <Link to="/user/submitted" className="flex items-center">
              <History />
              <span>{!collapsed && "History"}</span>
            </Link>
          </li>

          <li
            className={`menu-item ${isActive("/user/notifications") ? "active" : ""}`}
          >
            <Link to="/user/notifications" className="flex items-center">
              <FaBell />
              <span className="ml-2">{!collapsed && "Notifications"}</span>
              {/* {unreadCount > 0 && !collapsed && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )} */}
            </Link>
          </li>

          <li className="menu-item">
            <FaCog />
            <span>{!collapsed && "Settings"}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;