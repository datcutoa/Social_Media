import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import "./SidebarAdmin.css";

const SidebarAdmin = ({ onLogout, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const handleLogout = () => {
    localStorage.removeItem("admin");
    if (onLogout) onLogout();
    navigate("/admin/login");
  };

  const menuItems = [
    "Dashboard",
    "Users",
    // "Customers",
    // "Analytics",
    // "Marketing",
    // "Sales Channel",
    // "Integration",
    // "My Store",
    // "Discounts",
  ];

  return (
    <div className={`sidebarAdmin ${theme}`}>
      <div className="logoAdmin">SocialMedia</div>
      <ul className="menuAdmin">
        {menuItems.map((label, index) => (
          <li
            key={index}
            className={label === activeItem ? "active" : ""}
            onClick={() => {
              setActiveItem(label);
              if (onNavigate) onNavigate(label);
            }}
          >
            {label}
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="theme-toggle">
          Giao diện {theme === "light" ? "Tối" : "Sáng"}
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;