import React, { useState } from "react";
import "./changePassword.css";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra các trường rỗng
    if (!oldPassword || !newPassword || !confirmPassword) {
        setError("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword !== confirmPassword) {
        setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
    }

    // Kiểm tra độ dài mật khẩu (tùy chọn, ví dụ: tối thiểu 6 ký tự)
    if (newPassword.length < 6) {
        setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
    }

    // Logic giả lập đổi mật khẩu (thay bằng API thực tế)
    console.log("Đổi mật khẩu:", { oldPassword, newPassword });
    setSuccess("Đổi mật khẩu thành công!");
    setError("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    };

    return (
    <div className="changePasswordContainer">
        <h2>Đổi Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
            <div className="formGroup">
            <label>Mật khẩu cũ:</label>
            <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
            />
            </div>
            <div className="formGroup">
            <label>Mật khẩu mới:</label>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
            />
            </div>
            <div className="formGroup">
            <label>Xác nhận mật khẩu mới:</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
            />
            </div>
            {error && <p className="errorMessage">{error}</p>}
            {success && <p className="successMessage">{success}</p>}
            <button type="submit">Lưu thay đổi</button>
        </form>
    </div>
    );
}