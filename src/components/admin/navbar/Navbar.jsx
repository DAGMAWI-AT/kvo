import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa";
import "./Navbar.css"; // Custom CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios to make HTTP requests

const Navbar = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // To store unread notifications count
  const navigate = useNavigate();
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  // Fetch notifications from the server
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // const response = await axios.get("http://localhost:8000/notifications");
        const response = await axios.get("https://finance-office.onrender.com/notifications");

        const notificationsData = response.data;
        setNotifications(notificationsData);

        // Calculate the number of unread notifications
        const unread = notificationsData.filter((notif) => !notif.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Toggle the notification dropdown
  const toggleNotificationDropdown = () => {
    setShowNotifications(!showNotifications);
  };

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      // await axios.patch(`http://localhost:8000/notifications/${id}`);
      await axios.patch(`https://finance-office.onrender.com/notifications/${id}`);
      // Update the notifications state to mark as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prevCount) => prevCount - 1); // Decrease the unread count
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };


  const handleLogout = async () => {
    try {
      // Call the logout endpoint on the backend
      await axios.post("https://finance-office.onrender.com/user/logout");
  
      // Remove token and role from localStorage (if you're storing it there)
      localStorage.removeItem("token");
      localStorage.removeItem("role");
  
      // Optionally clear any other data in localStorage
      // localStorage.removeItem("user"); // If you store user data
  
      // Redirect the user to the login page
      window.location.href = "/user/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars className="hamburger-icon" />
        </button>
      </div>
      <div className="navbar-center">
        <div className="search-bar p-7 flex items-center border rounded-full px-1 py-1 w-full max-w-md border-gray-300 focus-within:border-blue-500">
          <FaSearch className="text-gray-400 text-lg m-2" />
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
        <div className="notification-wrapper">
          <FaBell
            className="icon"
            onClick={toggleNotificationDropdown}
            title="View Notifications"
          />
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount}</span> // Show unread notification count
          )}
          {showNotifications && (
            <div className="notifications-dropdown">
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notif) => (
                    <li
                      key={notif._id}
                      onClick={() => markAsRead(notif._id)} // Mark notification as read when clicked
                      className={notif.read ? "read" : "unread"}
                    >
                      {notif.message}
                      {notif.csoUser} {/* //which cso user sebmit */}
                      {notif.reportName}
                      {notif.reportType}
                      <p className="p-0 m-0 ">
                      {notif.timestamp}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}
        </div>
        <div className="profile-menu">
          <FaUserCircle className="icon user-icon" onClick={toggleProfileMenu} />
          {isProfileMenuOpen && (
            <div className="dropdown-menu" onMouseLeave={closeProfileMenu}>
              <ul>
                <li onClick={closeProfileMenu}>
                  <Link to="/admin/view_profile">Profile</Link>
                </li>
                <li onClick={closeProfileMenu}>
                  <Link to="/admin/update_password">Update Password</Link>
                </li>
                <li onClick={handleLogout}>Log Out</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
