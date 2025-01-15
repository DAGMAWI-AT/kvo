import React from "react";
import { Navigate, Route } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie"; // To handle cookies

// PrivateRoute component checks user role
const PrivateRoute = ({ element, roleRequired, ...rest }) => {
  // const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  // const token = Cookies.get("token");

  
  if (!token) {
    return <Navigate to="/user/login" />; // Redirect to login if not logged in
  }
  const decoded = jwtDecode(token);
  if (decoded.role !== roleRequired) {
    return decoded.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />; 
  }

  return element;
};

export default PrivateRoute;

// import { Navigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";

// const PrivateRoute = ({ children, role }) => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   const decoded = jwtDecode(token);
//   if (decoded.role !== role) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// };

// export default PrivateRoute;
