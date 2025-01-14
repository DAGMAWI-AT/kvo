import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import axios from "axios";

const Signin = () => {
  const [registrationId, setRegistrationId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For displaying messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:8000/user/login", {
        registrationId,
        password,
      });
  
      console.log("Full server response:", response.data); // Log full response
  
      if (response.data.success) {
        // const { user } = response.data; // Extract the user object
        // const { role } = user; // Extract the role from the user object
        const { token, role } = response.data; // Directly extract token and role

        // console.log("Role from server:", role); 
  
        localStorage.setItem("token",token); // Save token if provided
        localStorage.setItem("role", role);
  
        // Navigate based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "cso") {
          navigate("/user/dashboard");
        } else {
          setMessage("Invalid role: " + role);
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage(error.response?.data?.message || "An error occurred.");
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
