import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Topbar from "./components/topbar/topbar";
import ChangePassword from "./components/changepassword/change_password";
import Findfriend from "./pages/find_friend/find_friend";

// Tạo component ProtectedRoute để xử lý route bảo vệ
const ProtectedRoute = ({ isAuthenticated, isLoading, children }) => {
  if (isLoading) {
    return <div>Đang kiểm tra đăng nhập...</div>; // Hiển thị loading trong khi kiểm tra
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Khởi tạo false ban đầu
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true); // Bắt đầu kiểm tra
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          // Nếu user tồn tại và hợp lệ (ví dụ: không rỗng), coi như đã đăng nhập
          if (parsedUser) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("user"); // Dữ liệu không hợp lệ, xóa
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user"); // Dữ liệu lỗi, xóa
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false); // Không có user trong localStorage
      }
      setIsLoading(false); // Kết thúc kiểm tra
    };

    checkAuth();
  }, []); // Chỉ chạy khi mount

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Topbar onLogout={handleLogout} isAuthenticated={isAuthenticated} />}
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated && !isLoading ? (
                <Login setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated && !isLoading ? (
                <Register setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find_friend"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <Findfriend />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;