import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminLogin from "./pages/adminLogin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import { ThemeProvider } from "./context/ThemeContext";

const AdminApp = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setIsAdminAuthenticated(true);
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    setIsAdminAuthenticated(false);
    navigate("/admin/login");
  };

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />} />
        <Route path="/admin/dashboard" element={isAdminAuthenticated ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/admin/login" />} />
      </Routes>
    </ThemeProvider>
  );
};

export default AdminApp;
