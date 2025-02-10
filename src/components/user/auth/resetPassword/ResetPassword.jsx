import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/user/login");
        }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      {message && <div className="mb-4">{message}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
