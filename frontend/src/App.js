import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Topbar from "./components/topbar/topbar";
import ChangePassword from "./components/changepassword/change_password";
import FindFriend from "./pages/findfriend/FindFriend";
import VisitFriend from "./pages/visitfriend/VisitFriend";
import ListChat from "./pages/OpenListChat/ListChat";

const ProtectedRoute = ({ isAuthenticated, isLoading, children }) => {
  if (isLoading) {
    return <div>Đang kiểm tra đăng nhập...</div>; // Hiển thị loading trong khi kiểm tra
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          setIsAuthenticated(!!parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <div className="app">
      {isAuthenticated && <Topbar onLogout={handleLogout} isAuthenticated={isAuthenticated} />}
      <Routes>
        <Route path="/login" element={!isAuthenticated && !isLoading ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuthenticated && !isLoading ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" replace />} />
        <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}><Home /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}><Profile /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}><ChangePassword /></ProtectedRoute>} />
        <Route path="/find_friend" element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}><FindFriend /></ProtectedRoute>} />
        <Route path="/listchat" element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}><ListChat/></ProtectedRoute>} />
        <Route path="/visitfriend/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}><VisitFriend /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
export default App;