import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Chỉ import useNavigate
import "./AdminLogin.css";

const AdminLogin = ({ setIsAdminAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Gọi hook useNavigate

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      localStorage.setItem("admin", "true");
      setIsAdminAuthenticated(true);
      navigate("/admin/dashboard"); // Điều hướng sau khi đăng nhập
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container-admin">
      <div className="login-box-admin">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group-admin">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group-admin">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="buttun-login-admin" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;