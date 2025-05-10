import React, { useState } from "react";
import axios from "axios";
import "./changePassword.css";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const userId = user.id;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
            return;
        }

        const passwordData = { oldPassword, newPassword };

        try {
            setLoading(true);
            const response = await axios.put(
                `http://localhost:8080/api/user/${userId}/password`,
                passwordData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setSuccess(response.data.message || "Đổi mật khẩu thành công!");
            setError("");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Đã có lỗi xảy ra khi đổi mật khẩu!");
            setSuccess("");
        } finally {
            setLoading(false);
        }
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
                        disabled={loading}
                    />
                </div>
                <div className="formGroup">
                    <label>Mật khẩu mới:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        disabled={loading}
                    />
                </div>
                <div className="formGroup">
                    <label>Xác nhận mật khẩu mới:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        disabled={loading}
                    />
                </div>
                {error && <p className="errorMessage">{error}</p>}
                {success && <p className="successMessage">{success}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                </button>
            </form>
        </div>
    );
}