import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import "./UserLayout.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { Spin } from 'antd';

const UserLayout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        withCredentials: true,
      });

      // Check if response is valid and user is authenticated
      if (!response.data?.success) {
        throw new Error("Authentication failed");
      }

      // Check user role if needed (example)
      // if (response.data.role !== 'user') {
      //   throw new Error("Unauthorized access");
      // }

    } catch (err) {
      console.error("Authentication error:", err);
      
      // Redirect to login if unauthorized or any error occurs
      if (err.response?.status === 401 || err.status === 401) {
        navigate("/user/login", { replace: true });
      } else {
        // For other errors, you might want to show an error message
        navigate("/user/login", { replace: true });
      }
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    
    // Optional: Set up an interval to check authentication periodically
    const authCheckInterval = setInterval(fetchUser, 15 * 60 * 1000); // Check every 15 minutes
    
    return () => clearInterval(authCheckInterval);
  }, [navigate]);

  const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);
  const toggleSidebar = () => setSidebarCollapsed((prevState) => !prevState);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className='user-layout'>
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} collapsed={sidebarCollapsed} />

      {/* Navbar and Main Content */}
      <div className={`layout-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          toggleSidebar={toggleSidebar}
        />
        <main className="main-content">
          <ToastContainer 
            position="top-right" 
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Outlet context={{ darkMode }} />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;


















// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../sidebar/Sidebar";
// import Navbar from "../navbar/Navbar";
// import "./UserLayout.css";
// // import Footer from "../footer/Footer";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const UserLayout = () => {
//   const [darkMode, setDarkMode] = useState(false); // Dark mode state
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Sidebar collapse state

//   const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);
//   const toggleSidebar = () => setSidebarCollapsed((prevState) => !prevState);

//   return (
//     // <div className={`user-layout ${darkMode ? "dark" : "light"}`}>
//      <div className='user-layout' >
 
//     {/* Sidebar */}
//       <Sidebar darkMode={darkMode} collapsed={sidebarCollapsed} />

//       {/* Navbar and Main Content */}
//       <div className={`layout-content ${sidebarCollapsed ? "collapsed" : ""}`}>
//         <Navbar
//           darkMode={darkMode}
//           toggleDarkMode={toggleDarkMode}
//           toggleSidebar={toggleSidebar} // Pass toggleSidebar to Navbar
//         />
//         <main className="main-content">
//         <ToastContainer position="top-right" autoClose={5000} />

//           <Outlet context={{ darkMode }} />
//         </main>
//         {/* <Footer/> */}

//       </div>
//     </div>
//   );
// };

// export default UserLayout;
