// src/components/UserManagement.js
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "./UserManagement.css";

const UserManagement = () => {
  const { theme } = useTheme();

  const users = [
    { id: 1, name: "Jeong Jin Ho", email: "joho@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User" },
  ];

  return (
    <div className={`user-management ${theme}`}>
      <h2>User Management</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;