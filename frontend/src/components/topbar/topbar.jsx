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
  const popupRef = useRef(null); // Cho các icon
  const friendRequestsRef = useRef(null); // Ref riêng cho FriendRequests
  const profileMenuRef = useRef(null);

  // const userId = localStorage.getItem("userId");
  const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

  useEffect(() => {
    setShowRequests(false);
    setShowMessages(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
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
      // Không đóng FriendRequests nếu nhấp trong friendRequestsRef
      if (friendRequestsRef.current && !friendRequestsRef.current.contains(event.target)) {
        setShowRequests(false);
      }
      // Không đóng các popup khác nếu nhấp trong popupRef hoặc friendRequestsRef
      if (popupRef.current && !popupRef.current.contains(event.target) && 
          (!friendRequestsRef.current || !friendRequestsRef.current.contains(event.target))) {
        setShowMessages(false);
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
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
  };
  const openMessages = () => {
    setShowMessages(true);
    setShowRequests(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
  };
  const openNotifications = () => {
    setShowNotifications(true);
    setShowRequests(false);
    setShowMessages(false);
    setShowProfileMenu(false);
  };
  const openProfileMenu = () => {
    setShowProfileMenu(true);
    setShowRequests(false);
    setShowMessages(false);
    setShowNotifications(false);
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
        <MessagesPopup isOpen={showMessages} onClose={() => setShowMessages(false)} />
        <NotificationsPopup isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      </div>
    </div>
  );
}