import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import "./SidebarAdmin.css";

const SidebarAdmin = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    if (onLogout) onLogout();
    navigate("/admin/login");
  };

  const menuItems = [
    { label: "Dashboard", active: true },
    { label: "Orders" },
    { label: "Customers" },
    { label: "Analytics" },
    { label: "Marketing" },
    { label: "Sales Channel" },
    { label: "Integration" },
    { label: "My Store" },
    { label: "Discounts" },
  ];

  return (
    <div className={`sidebarAdmin ${theme}`}>
      <div className="logoAdmin">SocialMedia</div>
      <ul className="menuAdmin">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={item.active ? "active" : ""}
            onClick={() => console.log(`${item.label} clicked`)}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="theme-toggle">
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;