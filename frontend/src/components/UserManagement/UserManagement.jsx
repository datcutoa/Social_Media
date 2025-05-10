import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import "./UserManagement.css";

const UserManagement = () => {
  const { theme } = useTheme();
  const [listUsers, setListUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const getUserCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user");
        if (response.ok) {
          const data = await response.json();
          const users = data.map((user) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            status: user.status,
            createdAt: user.createdAt,
          }));
          setListUsers(users);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    getUserCount();
  }, []);

  const filteredUsers = listUsers.filter((user) => {
    if (filterStatus === "active") return user.status === 1;
    if (filterStatus === "inactive") return user.status !== 1;
    return true;
  });

  // Hàm gọi API để đảo ngược trạng thái người dùng
  const toggleUserStatus = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        // Cập nhật danh sách người dùng mà không cần tải lại trang
        setListUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, status: user.status === 1 ? 0 : 1 } // Đảo ngược trạng thái
              : user
          )
        );
      } else {
        const error = await response.json();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className={`user-management ${theme}`}>
      <h2 className="management-title">Quản lý người dùng</h2>

      <div className="filter-container">
        <label htmlFor="statusFilter">Lọc theo trạng thái:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Tạm khóa</option>
        </select>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5">Không có người dùng nào.</td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.status === 1 ? (
                      <span className="status-active">Hoạt động</span>
                    ) : (
                      <span className="status-inactive">Tạm khóa</span>
                    )}
                  </td>
                  <td>
                    {user.status === 1 ? (
                      <button
                        className="status-active"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        Khóa
                      </button>
                    ) : (
                      <button
                        className="status-inactive"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        Mở khóa
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;