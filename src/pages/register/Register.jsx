import { useNavigate } from "react-router-dom";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();

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
            <input placeholder="Username" className="loginInput" />
            <input placeholder="Email" className="loginInput" />
            <input placeholder="Password" type="password" className="loginInput" />
            <input placeholder="Password Again" type="password" className="loginInput" />
            <button className="loginButton">Sign Up</button>
            <button className="loginRegisterButton" onClick={() => navigate("/login")}>
              Log into Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
