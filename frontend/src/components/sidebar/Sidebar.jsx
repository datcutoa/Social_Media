import "./sidebar.css";
import { People,History, SmartDisplay, Groups, 
  Bookmark, Help, Work, Event, School } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"; // Added useState and useEffect imports

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const id = user.id;

  const [profileData, setProfileData] = useState({});
  const baseUrl = "/uploads/avatar/";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return; // Skip fetching if id is not available
      try {
        const response = await fetch(`http://localhost:8080/api/user/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
  }, [id]);

  // Use fetched profile data or fallback to defaults
  const username = profileData.name;
  const userId = id;
  const profilePicture = `${baseUrl}${profileData.profilePicture}`;

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link to={`/profile/${userId}`} className="sidebarProfileLink">
              <img src={profilePicture} alt="User" className="sidebarProfileImg" />
              <span className="sidebarUsername">{username}</span>
            </Link>
          </li>

          <li className="sidebarListItem">
            <People className="sidebarIcon peopleIcon" />
            <span className="sidebarIconText">Bạn bè</span>
          </li>
          <li className="sidebarListItem">
            <History className="sidebarIcon historyIcon" />
            <span className="sidebarIconText">Kỷ niệm</span>
          </li>
          <li className="sidebarListItem">
            <SmartDisplay className="sidebarIcon" />
            <span className="sidebarIconText">Đã lưu</span>
          </li>
          <li className="sidebarListItem">
            <Groups className="sidebarIcon" />
            <span className="sidebarIconText">Nhóm</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarIconText">Video</span>
          </li>
          <li className="sidebarListItem">
            <Help className="sidebarIcon" />
            <span className="sidebarIconText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <Work className="sidebarIcon" />
            <span className="sidebarIconText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarIconText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarIconText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Xem thêm</button>
        <hr className="sidebarHr" />
        <li className="footerList">
          <span>🔒 Bảo mật như pass WiFi nhà hàng xóm</span><br/>
          <span>🍪 Cookie: Không giòn, chỉ bám dai</span><br/>
          <span>📢 Quảng cáo: Xuất hiện đúng lúc bạn không cần</span>  
        </li>
      </div>
    </div>
  );
}