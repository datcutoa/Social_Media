import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Thêm state để lưu lỗi
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.target === emailRef.current) {
        passwordRef.current.focus();
      } else if (event.target === passwordRef.current) {
        handleLogin();
      }
    }
  };

  const handleLogin = async () => {
    setError("");
  
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username: email,
        password: password,
      });
  
      console.log(response.data);
  
      if (response.data.id) {
        localStorage.setItem("user", JSON.stringify({ id: 2, name: "Linh" }));
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError("Sai tài khoản hoặc mật khẩu!");
      }
  
    } catch (err) {
      setError("Lỗi đăng nhập!");
    }
  };
  
  
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social Media</h3>
          <span className="loginDesc">Dùng một lần nhớ cả đời !!</span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <input
              ref={emailRef}
              placeholder="Email"
              className="loginInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <input
              ref={passwordRef}
              type="password"
              placeholder="Password"
              className="loginInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="loginButton" onClick={handleLogin}>
              Log In
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Hiển thị lỗi */}
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton" onClick={() => navigate("/register")}>
              Create a New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}