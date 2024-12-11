import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';

const AdminLayout = () => {
  const location = useLocation();


    const [darkMode, setDarkMode] = useState(false); // Dark mode state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Sidebar collapse state
  
    const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);
    const toggleSidebar = () => setSidebarCollapsed((prevState) => !prevState);
    
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);
    return (
      // <div className={`user-layout ${darkMode ? "dark" : "light"}`}>
      <div className='user-layout' >
   
      {/* Sidebar */}
        <Sidebar darkMode={darkMode} collapsed={sidebarCollapsed} />
  
        {/* Navbar and Main Content */}
        <div className={`layout-content ${sidebarCollapsed ? "collapsed" : ""}`}>
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            toggleSidebar={toggleSidebar} // Pass toggleSidebar to Navbar
          />
          <main className="main-content">
            <Outlet />
          </main>
          {/* <Footer/> */}
  
        </div>
      </div>
    );
  };
  
  

export default AdminLayout
