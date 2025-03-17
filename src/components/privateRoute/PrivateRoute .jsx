// import React, { useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";

// const PrivateRoute = ({ element, roleRequired }) => {
//   const [loading, setLoading] = useState(true);
//   const [redirectPath, setRedirectPath] = useState(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/users/me", {
//           withCredentials: true,
//         });

//         if (response.data.success) {
//           const { role } = response.data;
//           // If the user's role doesn't match, redirect them to their dashboard
//           if (role !== roleRequired) {
//             setRedirectPath(role === "admin" || role ===  "sup_admin" ? "/admin/dashboard" : "/user/dashboard");
//           }
//         } else {
//           setRedirectPath("/user/login");
//         }
//       } catch (error) {
//         console.error("Authentication check error:", error);
//         setRedirectPath("/user/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [roleRequired]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-200">
//         <p className="text-xl font-bold">Loading...</p>
//       </div>
//     );
//   }

//   if (redirectPath) {
//     return <Navigate to={redirectPath} />;
//   }

//   return element;
// };

// export default PrivateRoute;

import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ element, roleRequired }) => {
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });

        if (response.data.success) {
          const { role } = response.data;

          if (role !== roleRequired) {
            // Redirect users to their respective dashboard
            if (role === "admin" || role === "sup_admin") {
              setRedirectPath("/admin/dashboard");
            } else if (role === "cso") {
              setRedirectPath("/user/dashboard");
            } else {
              setRedirectPath("/");
            }
          }
        } else {
          // If not authenticated, redirect to the correct login page
          handleLoginRedirect(roleRequired);
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        handleLoginRedirect(roleRequired);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [roleRequired]);

  // Function to handle login redirection for expired sessions
  const handleLoginRedirect = (role) => {
    if (role === "admin" || role === "sup_admin") {
      setRedirectPath("/login"); // Shared login for admin & sup_admin
    } else if (role === "cso") {
      setRedirectPath("/user/login"); // Default user login
    }else{
      setRedirectPath("/"); // Default user login
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return element;
};

export default PrivateRoute;

