// import React from "react";
// import { Navigate, Route } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";
// import Cookies from "js-cookie"; // To handle cookies

// // PrivateRoute component checks user role
// const PrivateRoute = ({ element, roleRequired, ...rest }) => {
//   // const role = localStorage.getItem("role");
//   const token = localStorage.getItem("token");
//   // const token = Cookies.get("token");

  
//   if (!token) {
//     return <Navigate to="/user/login" />; // Redirect to login if not logged in
//   }
//   const decoded = jwtDecode(token);
//   if (decoded.role !== roleRequired) {
//     return decoded.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />; 
//   }

//   return element;
// };

// export default PrivateRoute;

// // import { Navigate } from "react-router-dom";
// // import {jwtDecode} from "jwt-decode";

// // const PrivateRoute = ({ children, role }) => {
// //   const token = localStorage.getItem("token");
// //   if (!token) {
// //     return <Navigate to="/login" />;
// //   }

// //   const decoded = jwtDecode(token);
// //   if (decoded.role !== role) {
// //     return <Navigate to="/unauthorized" />;
// //   }

// //   return children;
// // };

// // export default PrivateRoute;



import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const PrivateRoute = ({ element, roleRequired }) => {
  const token = localStorage.getItem("token");

  // Redirect to login if no token is found
  if (!token) {
    return <Navigate to="/user/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if the token is expired
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    if (Date.now() > expirationTime) {
      localStorage.removeItem("token"); // Remove expired token
      return <Navigate to="/user/login" />;
    }

    // Check user role
    if (decoded.role !== roleRequired) {
      // Redirect based on user's role
      return decoded.role === "admin" ? (
        <Navigate to="/admin/dashboard" />
      ) : (
        <Navigate to="/user/dashboard" />
      );
    }

    // Render the protected element
    return element;

  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token"); // Remove malformed token
    return <Navigate to="/user/login" />;
  }
};

export default PrivateRoute;
