import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import FriendRequests from "../friendrequests/FriendRequests";
import NotificationsPopup from "../notifications/NotificationsPopup";
import MessagesPopup from "../messagepopup/MessagesPopup";
import AvatarMenu from "../AvatarMenu/AvatarMenu";

export default function Topbar({ onLogout }) { // Nhận hàm logout từ App.js
  const [showRequests, setShowRequests] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  const popupRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    setShowRequests(false);
    setShowMessages(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [location]);

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

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" className="logo">Social</Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input placeholder="Search for friend, post or video" className="searchInput" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons" ref={popupRef}>
          <div className="topbarIconItem" onClick={() => setShowRequests(!showRequests)}>
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem" onClick={() => setShowMessages(!showMessages)}>
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem" onClick={() => setShowNotifications(!showNotifications)}>
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
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          />
          <AvatarMenu isOpen={showProfileMenu} onClose={() => setShowProfileMenu(false)} onLogout={onLogout} />
        </div>

        {/* Popup cửa sổ */}
        <FriendRequests isOpen={showRequests} onClose={() => setShowRequests(false)} />
        <MessagesPopup isOpen={showMessages} onClose={() => setShowMessages(false)} />
        <NotificationsPopup isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      </div>
    </div>
  );
}