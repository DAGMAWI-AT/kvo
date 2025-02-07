// import React from "react";
// import { Navigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const PrivateRoute = ({ element, roleRequired }) => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     return <Navigate to="/user/login" />;
//   }

//   try {
//     const decoded = jwtDecode(token);
//     const expirationTime = decoded.exp * 1000; // Convert to milliseconds
//     if (Date.now() > expirationTime) {
//       localStorage.removeItem("token"); // Remove expired token
//       return <Navigate to="/user/login" />;
//     }

//     if (decoded.role !== roleRequired) {
//       return decoded.role === "admin" ? (
//         <Navigate to="/admin/dashboard" />
//       ) : (
//         <Navigate to="/user/dashboard" />
//       );
//     }

//     return element;
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     localStorage.removeItem("token"); // Remove malformed token
//     return <Navigate to="/user/login" />;
//   }
// };

// export default PrivateRoute;



import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const PrivateRoute = ({ element, roleRequired }) => {
  const [isLoading, setIsLoading] = useState(true); // State for loader
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null); // Path for redirection if needed

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setRedirectPath("/user/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds

        if (Date.now() > expirationTime) {
          localStorage.removeItem("token"); // Remove expired token
          setRedirectPath("/user/login");
          return;
        }

        if (decoded.role !== roleRequired) {
          setRedirectPath(
            decoded.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
          );
          return;
        }

        setIsAuthenticated(true); // Valid token and role
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // Remove malformed token
        setRedirectPath("/user/login");
      }
    };

    // Run token validation immediately
    checkToken();

    // Show loader for at least 10 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [roleRequired]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="loader mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
        <h1 className="text-2xl font-bold">Loading Your App...</h1>
      </div>
    );
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return isAuthenticated ? element : null;
};

export default PrivateRoute;
