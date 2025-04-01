import React, { useState, useEffect } from "react";
import "./info.css";
import { Person, Email, Wc, Cake, Edit } from "@mui/icons-material";

export default function SidebarProfile({ setActiveTab }) {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const id = user.id;

  const [profileData, setProfileData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [errors, setErrors] = useState({}); // Thêm state để lưu lỗi

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:8080/api/user/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id]);

  // Extract data from profileData or use fallbacks
  const name = profileData.name || "Chưa cập nhật";
  const email = profileData.email || "Chưa cập nhật";
  const gender = profileData.gender
    ? profileData.gender === "NAM"
      ? "Nam"
      : profileData.gender === "NU"
      ? "Nữ"
      : "Khác"
    : "Chưa cập nhật";
  const birthdate = profileData.birthdate || "Chưa cập nhật";

  // Start editing a field
  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue === "Chưa cập nhật" ? "" : currentValue);
    setErrors({}); // Reset lỗi khi bắt đầu chỉnh sửa
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
    setErrors({});
  };

  // Check if email already exists
  const checkEmailExists = async (emailToCheck) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/check-email?email=${encodeURIComponent(emailToCheck)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const exists = await response.json();
      return exists; // Giả định backend trả về true nếu email tồn tại, false nếu không
    } catch (error) {
      console.error("Error checking email:", error);
      return false; // Nếu lỗi, coi như email không tồn tại để không chặn quá trình
    }
  };

  // Save the edited value to the backend
  const handleSave = async (field) => {
    if (!editValue.trim()) {
      setErrors({ [field]: "Giá trị không được để trống!" });
      return;
    }

    let valueToSave = editValue;
    if (field === "gender") {
      valueToSave = editValue === "Nam" ? "NAM" : editValue === "Nữ" ? "NU" : "KHAC";
    } else if (field === "dob") {
      valueToSave = editValue; // Đảm bảo định dạng ngày khớp với backend
    } else if (field === "email") {
      // Kiểm tra định dạng email
      if (!/^\S+@\S+\.\S+$/.test(editValue)) {
        setErrors({ email: "Email không hợp lệ" });
        return;
      }
      // Kiểm tra trùng email
      const emailExists = await checkEmailExists(editValue);
      if (emailExists && editValue !== profileData.email) {
        setErrors({ email: "Email này đã được sử dụng bởi người dùng khác!" });
        return;
      }
    }

    // Gộp dữ liệu mới với dữ liệu hiện tại
    const updatedData = {
      ...profileData,
      [field === "dob" ? "birthdate" : field]: valueToSave,
    };

    console.log("Sending updated data:", updatedData); // Log dữ liệu để kiểm tra

    try {
      const response = await fetch(`http://localhost:8080/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update profile");
      }

      // Cập nhật state với dữ liệu đã gửi lên server
      setProfileData(updatedData);
      setEditingField(null);
      setEditValue("");
      setErrors({});
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ api: "Lỗi khi cập nhật thông tin! " + error.message });
    }
  };

  // Render a field with an edit icon and optional edit form
  const renderField = (label, value, field, icon) => (
    <>
      <li className="sidebarProfileListItem">
        {icon}
        <span className="sidebarProfileText">{label}: {value}</span>
        <Edit
          className="sidebarProfileEditIcon"
          onClick={() => handleEditClick(field, value)}
        />
      </li>
      {editingField === field && (
        <div className="editForm">
          {field === "gender" ? (
            <div className="radioGroup">
              <label className="radioLabel">
                <input
                  type="radio"
                  value="Nam"
                  checked={editValue === "Nam"}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                Nam
              </label>
              <label className="radioLabel">
                <input
                  type="radio"
                  value="Nữ"
                  checked={editValue === "Nữ"}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                Nữ
              </label>
              <label className="radioLabel">
                <input
                  type="radio"
                  value="Khác"
                  checked={editValue === "Khác"}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                Khác
              </label>
            </div>
          ) : (
            <input
              type={field === "dob" ? "date" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="editInput"
              placeholder={`Nhập ${label.toLowerCase()}`}
            />
          )}
          {errors[field] && <span className="error">{errors[field]}</span>}
          {errors.api && <span className="error">{errors.api}</span>}
          <div className="editButtons">
            <button
              className="editButton saveButton"
              onClick={() => handleSave(field)}
            >
              Lưu
            </button>
            <button
              className="editButton cancelButton"
              onClick={handleCancel}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="sidebarProfile">
      <div className="sidebarProfileWrapper">
        <h3 className="sidebarProfileTitle">Giới thiệu</h3>
        <ul className="sidebarProfileList">
          {renderField("Tên", name, "name", <Person className="sidebarProfileIcon" />)}
          {renderField("Email", email, "email", <Email className="sidebarProfileIcon" />)}
          {renderField("Giới tính", gender, "gender", <Wc className="sidebarProfileIcon" />)}
          {renderField("Ngày sinh", birthdate, "dob", <Cake className="sidebarProfileIcon" />)}
        </ul>
      </div>
    </div>
  );
}