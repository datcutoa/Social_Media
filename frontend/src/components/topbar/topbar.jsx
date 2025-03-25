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

  const location = useLocation();
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Đóng các popup khi location thay đổi
  useEffect(() => {
    setShowRequests(false);
    setShowMessages(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [location]);

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
    // Chuyển hướng đến trang find_friend và gửi từ khóa qua query parameter
    navigate(`/find_friend?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery(""); // Xóa ô tìm kiếm sau khi tìm
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
            placeholder="Search for friend, post or video"
            className="searchInput"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons" ref={popupRef}>
          <div className="topbarIconItem" onClick={() => setShowRequests(true)}>
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem" onClick={() => setShowMessages(true)}>
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem" onClick={() => setShowNotifications(true)}>
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>

        <div className="profileContainer" ref={profileMenuRef}>
          <img
            src="/asset/person/1.jpeg"
            alt="Profile"
            className="topbarImg"
            onClick={() => setShowProfileMenu(true)}
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