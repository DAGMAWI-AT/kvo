import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// import jwt_decode from "jwt-decode";

const Signin = () => {
  const [registrationId, setRegistrationId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For displaying messages
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post("http://localhost:8000/user/login", 
  //       // const response = await axios.post("https://finance-office.onrender.com/user/login",
  //         {
  //       registrationId,
  //       password,
  //     });

  //     // Log full server response for debugging
  //     // console.log("Server response:", response.data);

  //     if (response.data.success) {
  //       const { token } = response.data;

  //       // Save the token in localStorage
  //       localStorage.setItem("token", token);

  //       // Decode token to extract role
  //       const decoded = jwtDecode(token);

  //       if (!decoded || !decoded.role) {
  //         setMessage("Failed to retrieve role from the token.");
  //         return;
  //       }

  //       const { role } = decoded;

  //       // Navigate based on role
  //       if (role === "admin") {
  //         navigate("/admin/dashboard");
  //       } else if (role === "cso") {
  //         navigate("/user/dashboard");
  //       } else {
  //         setMessage("Unknown role: " + role);
  //       }
  //     } else {
  //       setMessage(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //     setMessage(
  //       error.response?.data?.message || "An unexpected error occurred."
  //     );
  //   }
  // };
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/user/login", {
        registrationId,
        password,
      });

      if (response.data.success) {
        const { token } = response.data;

        // Save token and expiration time in localStorage
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        localStorage.setItem("token", token);
        // localStorage.setItem("tokenExpiry", expirationTime);

        // Set auto logout timer
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("expirationTime");
          navigate("/user/login");
        }, expirationTime - Date.now());

        // Redirect based on role
        const { role } = decoded;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "cso") {
          navigate("/user/dashboard");
        } else {
          setMessage("Unknown role: " + role);
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="registrationId">Registration ID</label>
          <input
            type="text"
            id="registrationId"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            placeholder="Enter your registration ID"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login</button>
        {message && <p className="message">{message}</p>} {/* Display any error or info messages */}
      </form>
    </div>
  );
};

export default Signin;
