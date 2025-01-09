import React, { useState } from "react";
import axios from "axios";

const CreateAccount = () => {
  const [registrationId, setRegistrationId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/createAccount_users", {
        registrationId,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating account.");
    }
  };

  return (
    <div>
      <h2>Create User Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Registration ID:</label>
          <input
            type="text"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateAccount;
