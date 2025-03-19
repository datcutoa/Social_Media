import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const popupRef = useRef(null);
  const profileMenuRef = useRef(null);
  
  
  // Đóng tất cả popup khi thay đổi location
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

  // Hàm xử lý mở FriendRequests
  const handleShowRequests = () => {
    setShowRequests(true);     // Mở FriendRequests
    setShowMessages(false);    // Đóng MessagesPopup
    setShowNotifications(false); // Đóng NotificationsPopup
    setShowProfileMenu(false); // Đóng ProfileMenu
  };

  // Hàm xử lý mở MessagesPopup
  const handleShowMessages = () => {
    setShowMessages(true);     // Mở MessagesPopup
    setShowRequests(false);    // Đóng FriendRequests
    setShowNotifications(false); // Đóng NotificationsPopup
    setShowProfileMenu(false); // Đóng ProfileMenu
  };

  // Hàm xử lý mở NotificationsPopup
  const handleShowNotifications = () => {
    setShowNotifications(true); // Mở NotificationsPopup
    setShowRequests(false);
    setShowMessages(false);
    setShowProfileMenu(false);
  };

  // Hàm xử lý mở ProfileMenu
  const handleShowProfileMenu = () => {
    setShowProfileMenu(true);  
    setShowRequests(false);
    setShowMessages(false); 
    setShowNotifications(false); 
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        
        <Link to="/" className="logo">
        Social Meidiả
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons" ref={popupRef}>
          <div className="topbarIconItem" onClick={handleShowRequests}>
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem" onClick={handleShowMessages}>
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem" onClick={handleShowNotifications}>
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>

        {/* Ảnh đại diện người dùng */}
        <div className="profileContainer" ref={profileMenuRef}>
          <img
            src="/asset/person/1.jpeg"
            alt="Profile"
            className="topbarImg"
            onClick={handleShowProfileMenu}
          />
          <AvatarMenu
            isOpen={showProfileMenu}
            onClose={() => setShowProfileMenu(false)}
            onLogout={onLogout}
          />
        </div>

        {/* Popup cửa sổ */}
        <FriendRequests
          isOpen={showRequests}
          onClose={() => setShowRequests(false)}
        />
        <MessagesPopup
          isOpen={showMessages}
          onClose={() => setShowMessages(false)}
        />
        <NotificationsPopup
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    </div>
  );
}