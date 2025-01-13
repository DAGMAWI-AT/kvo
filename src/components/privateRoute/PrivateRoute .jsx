import React from "react";
import { Navigate, Route } from "react-router-dom";

// PrivateRoute component checks user role
const PrivateRoute = ({ element, roleRequired, ...rest }) => {
  const role = localStorage.getItem("role");
  
  if (!role) {
    return <Navigate to="/user/login" />; // Redirect to login if not logged in
  }

  if (role !== roleRequired) {
    return <Navigate to={{}} />; // Redirect to home if role does not match
  }

  return element;
};

export default PrivateRoute;
