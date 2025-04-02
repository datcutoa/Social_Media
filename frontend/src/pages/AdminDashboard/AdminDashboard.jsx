import React from "react";
import SidebarAdmin from "../../components/SidebarAdmin/SidebarAdmin";
import UserManagement from "../../components/UserManagement/UserManagement";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
  return (
    <div className="admin-dashboard">
      <SidebarAdmin onLogout={onLogout} />
      <div className="main-content">
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;