import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import FriendRequests from "../friendrequests/FriendRequests";
import NotificationsPopup from "../notifications/NotificationsPopup";
import MessagesPopup from "../messagepopup/MessagesPopup";
import AvatarMenu from "../AvatarMenu/AvatarMenu";

export default function Topbar({ onLogout, isAuthenticated }) {
  const [showRequests, setShowRequests] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Lấy userId từ localStorage
  const userId = localStorage.getItem("userId");

  // Đóng các popup khi location thay đổi
  useEffect(() => {
    setShowRequests(false);
    setShowMessages(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [location]);

  // Gọi API để lấy thông tin người dùng
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return; // Skip fetching nếu không có userId
      try {
        const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  // Xử lý click ngoài để đóng popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowRequests(false);
        setShowMessages(false);
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Xử lý thay đổi input tìm kiếm
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Hàm chuyển hướng và gửi từ khóa tìm kiếm
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/find_friend?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  // Xử lý khi nhấn Enter
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Xử lý khi click vào biểu tượng tìm kiếm
  const handleSearchClick = () => {
    handleSearch();
  };

  // Hàm mở popup và đóng các popup khác
  const openRequests = () => {
    setShowRequests(true);
    setShowMessages(false); // Đóng popup tin nhắn
    setShowNotifications(false); // Đóng popup thông báo
    setShowProfileMenu(false); // Đóng menu profile
  };

  const openMessages = () => {
    setShowMessages(true);
    setShowRequests(false); // Đóng popup lời mời bạn bè
    setShowNotifications(false); // Đóng popup thông báo
    setShowProfileMenu(false); // Đóng menu profile
  };

  const openNotifications = () => {
    setShowNotifications(true);
    setShowRequests(false); // Đóng popup lời mời bạn bè
    setShowMessages(false); // Đóng popup tin nhắn
    setShowProfileMenu(false); // Đóng menu profile
  };

  const openProfileMenu = () => {
    setShowProfileMenu(true);
    setShowRequests(false); // Đóng popup lời mời bạn bè
    setShowMessages(false); // Đóng popup tin nhắn
    setShowNotifications(false); // Đóng popup thông báo
  };

  // Đường dẫn ảnh đại diện
  const profilePicture = profileData.profilePicture
    ? `/uploads/avatar/${profileData.profilePicture}`
    : "/uploads/avatar/default_avt.jpg";

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" className="logo">
          Social Media
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" onClick={handleSearchClick} />
          <input
            type="text"
            placeholder="Tìm kiếm thông tin trên Social Media"
            className="searchInput"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons" ref={popupRef}>
          <div className="topbarIconItem" onClick={openRequests}>
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem" onClick={openMessages}>
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem" onClick={openNotifications}>
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>

        <div className="profileContainer" ref={profileMenuRef}>
          <img
            src={profilePicture}
            alt="Profile"
            className="topbarImg"
            onClick={openProfileMenu}
          />
          <AvatarMenu
            isOpen={showProfileMenu}
            onClose={() => setShowProfileMenu(false)}
            onLogout={onLogout}
          />
        </div>

        <FriendRequests isOpen={showRequests} onClose={() => setShowRequests(false)} />
        <MessagesPopup isOpen={showMessages} onClose={() => setShowMessages(false)} />
        <NotificationsPopup isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      </div>
    </div>
  );
}