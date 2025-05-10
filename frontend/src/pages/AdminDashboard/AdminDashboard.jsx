import React, { useState } from "react";
import SidebarAdmin from "../../components/SidebarAdmin/SidebarAdmin";
import UserManagement from "../../components/UserManagement/UserManagement";
import AdminStats from "../../components/AdminStats/AdminStats";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderMainContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <AdminStats />;
      case "Users":
        return <UserManagement />;
      default:
        return <div>Chưa có nội dung cho mục: {activePage}</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <SidebarAdmin onLogout={onLogout} onNavigate={setActivePage} />
      <div className="main-content">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;