import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.target === emailRef.current) {
        passwordRef.current.focus(); // Chuyển focus sang ô password
      } else if (event.target === passwordRef.current) {
        handleLogin(); // Gọi hàm login khi nhấn Enter ở password
      }
    }
  };

  const handleLogin = () => {
    // if (email === "admin@gmail.com" && password === "123") {
    //   localStorage.setItem("user", email);
    //   setIsAuthenticated(true);
    //   navigate("/");
    // } else {
    //   alert("Sai tài khoản hoặc mật khẩu!");
    // }
    setIsAuthenticated(true);
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
