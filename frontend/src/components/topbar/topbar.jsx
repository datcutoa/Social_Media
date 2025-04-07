import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import FriendRequests from "../friendrequests/FriendRequests";
import NotificationsPopup from "../notifications/NotificationsPopup";
import MessagesPopup from "../messagepopup/MessagesPopup";
import AvatarMenu from "../AvatarMenu/AvatarMenu";
import ChatComponent from "../chat/Chat"; // Đổi tên để tránh xung đột tên

export default function Topbar({ onLogout, isAuthenticated }) {
  const [showRequests, setShowRequests] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Thêm trạng thái cho Chat
  const [selectedUser, setSelectedUser] = useState(null); // Lưu thông tin user được chọn
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const friendRequestsRef = useRef(null);
  const messagesPopupRef = useRef(null);
  const notificationsPopupRef = useRef(null);
  const profileMenuRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    setShowRequests(false);
    setShowMessages(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
    setIsChatOpen(false); // Đóng Chat khi thay đổi location
  }, [location]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        (!friendRequestsRef.current || !friendRequestsRef.current.contains(event.target)) &&
        (!messagesPopupRef.current || !messagesPopupRef.current.contains(event.target)) &&
        (!notificationsPopupRef.current || !notificationsPopupRef.current.contains(event.target)) &&
        (!profileMenuRef.current || !profileMenuRef.current.contains(event.target))
      ) {
        setShowRequests(false);
        setShowMessages(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
        setIsChatOpen(false); // Đóng Chat khi click ngoài
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/find_friend?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") handleSearch();
  };
  const handleSearchClick = () => handleSearch();

  const openRequests = () => {
    setShowRequests(true);
    setShowMessages(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
    setIsChatOpen(false);
  };
  const openMessages = () => {
    setShowMessages(true);
    setShowRequests(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
    setIsChatOpen(false);
  };
  const openNotifications = () => {
    setShowNotifications(true);
    setShowRequests(false);
    setShowMessages(false);
    setShowProfileMenu(false);
    setIsChatOpen(false);
  };
  const openProfileMenu = () => {
    setShowProfileMenu(true);
    setShowRequests(false);
    setShowMessages(false);
    setShowNotifications(false);
    setIsChatOpen(false);
  };

  const handleOpenChat = (user) => {
    setSelectedUser(user);
    setIsChatOpen(true);
    setShowMessages(false); // Đóng MessagesPopup khi mở Chat
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedUser(null);
  };

  const profilePicture = profileData.profilePicture
    ? `/uploads/avatar/${profileData.profilePicture}`
    : "/uploads/avatar/default_avt.jpg";

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" className="logo">Social Media</Link>
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
          <img src={profilePicture} alt="Profile" className="topbarImg" onClick={openProfileMenu} />
          <AvatarMenu isOpen={showProfileMenu} onClose={() => setShowProfileMenu(false)} onLogout={onLogout} />
        </div>
        <div ref={friendRequestsRef}>
          <FriendRequests isOpen={showRequests} userId={userId} onClose={() => setShowRequests(false)} />
        </div>
        <div ref={messagesPopupRef}>
          <MessagesPopup
            isOpen={showMessages}
            onClose={() => setShowMessages(false)}
            currentUserId={userId}
            onOpenChat={handleOpenChat} // Truyền hàm để mở Chat
          />
        </div>
        <div ref={notificationsPopupRef}>
          <NotificationsPopup isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
        {isChatOpen && selectedUser && (
          <ChatComponent
            userId={selectedUser.id}
            fullName={selectedUser.fullName}
            profilePic={selectedUser.profilePicture}
            onClose={handleCloseChat}
          />
        )}
      </div>
    </div>
  );
}