import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // Thay error thành errors dạng object để quản lý nhiều lỗi
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
    // else if (!/^\S+@\S+\.\S+$/.test(email)) {
    //   tempErrors.email = "Email không hợp lệ";
    // }

    if (!password) {
      tempErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleLogin = async () => {
    setErrors({}); // Reset lỗi trước khi validate

    if (validateForm()) {
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
          setErrors({ api: "Sai tài khoản hoặc mật khẩu!" });
        }
      } catch (err) {
        setErrors({ api: "Lỗi đăng nhập!" });
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
              <span className="loginText"> bạn chưa có tài khoản?</span>
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