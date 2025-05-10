import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

const AdminLogin = ({ setIsAdminAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Cắt bỏ khoảng trắng và kiểm tra
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedUsername || !trimmedPassword) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }
  
    try {
      console.log("Sending request with:", { username: trimmedUsername, password: trimmedPassword });
  
      const response = await axios.post(
        "http://localhost:8080/api/admin/login",
        {
          username: trimmedUsername,
          password: trimmedPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Response:", response);
  
      if (response.status === 200) {
        localStorage.setItem("admin", "true");
        setIsAdminAuthenticated(true);
        navigate("/admin/dashboard");
      } else {
        setError("Lỗi khi đăng nhập: " + (response.data.message || "Phản hồi không hợp lệ"));
      }
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err);
      setError(err.response?.data || "Lỗi kết nối đến server hoặc sai tên đăng nhập/mật khẩu");
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
          <button className="buttun-login-admin" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;