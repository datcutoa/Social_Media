import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    let tempErrors = {};

    if (!email) {
      tempErrors.email = "Email không được để trống";
    }
    if (!password) {
      tempErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async () => {
    setErrors({});

    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:8080/api/login", {
          username: email,
          password: password,
        });

        console.log("Login response:", response.data);

        // Kiểm tra response.data là object User hay chuỗi lỗi
        if (typeof response.data === "string") {
          setErrors({ api: response.data }); // "Sai tài khoản hoặc mật khẩu"
        } else if (response.data.id) {
          // Lưu thông tin user vào localStorage
          const userData = {
            id: response.data.id,
            name: response.data.username, // Dùng username làm name
          };
          localStorage.setItem("user", JSON.stringify(userData));
          setIsAuthenticated(true);
          navigate("/");
        } else {
          setErrors({ api: "Đăng nhập thất bại!" });
        }
      } catch (err) {
        console.error("Login error:", err);
        setErrors({ api: "Lỗi kết nối server!" });
      }
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">
            <span className="logoHighlight">Social</span>Media
          </h3>
          <span className="registerDesc">
            Kết nối với bạn bè và thế giới xung quanh bạn trên SocialMedia.
          </span>
        </div>
        <div className="registerRight">
          <form
            className="registerBox"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            noValidate
          >
            <h2 className="registerTitle">Đăng nhập</h2>
            <div className="inputGroup">
              <input
                ref={emailRef}
                placeholder="Email"
                className="registerInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="inputGroup">
              <input
                ref={passwordRef}
                type="password"
                placeholder="Mật khẩu"
                className="registerInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            {errors.api && <div className="error api-error">{errors.api}</div>}
            <div className="inputGroup">
              <button className="registerButton" type="submit">
                Đăng nhập
              </button>
            </div>
            <div className="loginOption">
              <span className="loginText">Bạn chưa có tài khoản?</span>
              <button
                className="loginButton"
                type="button"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}