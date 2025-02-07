import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signin.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// import jwt_decode from "jwt-decode";

const Signin = () => {
  const [registrationId, setRegistrationId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
      // const response = await axios.post("http://localhost:8000/user/login", {
        const response = await axios.post("http://localhost:5000/api/users/login", {
        registrationId,
        email,
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
<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-blue-300 to-blue-500">
<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="registrationId"
            className="block text-gray-600 font-medium mb-1"
          >
            Registration ID
          </label>
          <input
            type="text"
            id="registrationId"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            placeholder="Enter your registration ID"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label
            htmlFor="registrationId"
            className="block text-gray-600 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registration ID"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-gray-600 font-medium mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Login
        </button>

<Link to="/forgot_password">Forgot Password?</Link>
        {message && (
          <p className="text-center text-red-500 font-medium mt-4">{message}</p>
        )}
      </form>
    </div>
  </div>
);
};

export default Signin;