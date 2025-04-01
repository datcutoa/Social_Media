import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    mobileOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(formData.year);
    const birthMonth = parseInt(formData.month);
    const birthDay = parseInt(formData.day);
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const age = today.getFullYear() - birthDate.getFullYear() - 
                (today < new Date(today.getFullYear(), birthMonth - 1, birthDay) ? 1 : 0);

    if (!formData.fullName) {
      tempErrors.fullName = "Họ và tên không được để trống";
    } else if (formData.fullName.length > 50) {
      tempErrors.fullName = "Họ và tên không được dài quá 50 ký tự";
    }

    if (!formData.day || !formData.month || !formData.year) {
      tempErrors.dateOfBirth = "Vui lòng chọn ngày sinh hợp lệ";
    } else if (
      birthYear > currentYear ||
      birthYear < 1900 ||
      birthMonth < 1 || birthMonth > 12 ||
      birthDay < 1 || birthDay > 31 ||
      isNaN(birthDate.getTime())
    ) {
      tempErrors.dateOfBirth = "Ngày sinh không hợp lệ";
    } else if (age < 13) {
      tempErrors.dateOfBirth = "Bạn phải ít nhất 13 tuổi để đăng ký";
    }

    if (!formData.gender) {
      tempErrors.gender = "Vui lòng chọn giới tính";
    } else if (!["NAM", "NU", "KHAC"].includes(formData.gender)) {
      tempErrors.gender = "Giới tính không hợp lệ";
    }

    if (!formData.mobileOrEmail) {
      tempErrors.mobileOrEmail = "Email không được để trống";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.mobileOrEmail)) {
      tempErrors.mobileOrEmail = "Email không hợp lệ";
    }

    if (!formData.password) {
      tempErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (formData.password.length > 50) {
      tempErrors.password = "Mật khẩu không được dài quá 50 ký tự";
    } else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      tempErrors.password = "Mật khẩu phải chứa ít nhất 1 chữ cái in hoa và 1 số";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
  
    if (validateForm()) {
      try {
        const userData = {
          name: formData.fullName,
          username: formData.mobileOrEmail.split('@')[0].substring(0, 50),
          email: formData.mobileOrEmail,
          password: formData.password,
          birthdate: `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`,
          gender: formData.gender,
          bio: "",
          cover_photo: "default_avt.jpg",
          profile_picture: "default_avt.jpg",
          createdAt: new Date().toISOString(),
        };
        const response = await fetch("http://localhost:8080/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
  
        const contentType = response.headers.get("Content-Type");
        const responseBody = await response.text();
  
        let responseData;
        if (contentType && contentType.includes("application/json")) {
          responseData = JSON.parse(responseBody);
        } else {
          responseData = { message: responseBody };
        }
  
        if (!response.ok) {
          let errorMessage = "Đăng ký thất bại. Vui lòng thử lại!";
          if (response.status === 400) {
            errorMessage = responseData.message || "Email hoặc username đã được sử dụng!";
          } else if (response.status === 500) {
            errorMessage = responseData.message || "Email hoặc username đã được sử dụng!";
          }
          throw new Error(errorMessage);
        }
  
        console.log("Đăng ký thành công:", responseData);
        navigate("/login");
      } catch (error) {
        console.error("Lỗi đăng ký:", error.message);
        setErrors({ api: error.message });
      }
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

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
          <form className="registerBox" onSubmit={handleSubmit} noValidate>
            <h2 className="registerTitle">Tạo tài khoản mới</h2>
            <div className="inputGroup">
              <input
                placeholder="Họ và tên"
                name="fullName"
                className="registerInput"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>
            <div className="inputGroup">
              <label>Ngày sinh</label>
              <div className="dateOfBirth">
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="registerSelect"
                >
                  <option value="">Ngày</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="registerSelect"
                >
                  <option value="">Tháng</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="registerSelect"
                >
                  <option value="">Năm</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
            </div>
            <div className="inputGroup">
              <label>Giới tính</label>
              <div className="genderOptions">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="NU"
                    checked={formData.gender === "NU"}
                    onChange={handleChange}
                  />
                  Nữ
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="NAM"
                    checked={formData.gender === "NAM"}
                    onChange={handleChange}
                  />
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="KHÁC"
                    checked={formData.gender === "KHÁC"}
                    onChange={handleChange}
                  />
                  Khác
                </label>
              </div>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>
            <div className="inputGroup">
              <input
                placeholder="Email"
                name="mobileOrEmail"
                className="registerInput"
                value={formData.mobileOrEmail}
                onChange={handleChange}
              />
              {errors.mobileOrEmail && <span className="error">{errors.mobileOrEmail}</span>}
            </div>
            <div className="inputGroup">
              <input
                placeholder="Mật khẩu mới"
                type="password"
                name="password"
                className="registerInput"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            {errors.api && <div className="error api-error">{errors.api}</div>}
            <div className="inputGroup">
              <button className="registerButton" type="submit">
                Đăng ký
              </button>
            </div>
            <div className="loginOption">
              <span className="loginText">Bạn đã có tài khoản?</span>
              <button
                className="loginButton"
                type="button"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}