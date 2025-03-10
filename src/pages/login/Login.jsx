import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "admin@gmail.com" && password === "123") {
      localStorage.setItem("user", email);
      setIsAuthenticated(true);
      navigate("/");
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <input 
              placeholder="Email" 
              className="loginInput" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password"
              placeholder="Password" 
              className="loginInput" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
