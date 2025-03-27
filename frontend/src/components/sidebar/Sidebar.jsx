import "./sidebar.css";
import { RssFeed, Chat, SmartDisplay, Groups, Bookmark, Help, Work, Event, School } from "@mui/icons-material";
import CloseFriend from "../closeFriend/CloseFriend";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"; // Added useState and useEffect imports

export default function Sidebar() {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const id = user.id; // Extract the id from the user object

  const [profileData, setProfileData] = useState({}); // State to store fetched profile data
  const baseUrl = "/uploads/avatar/"; // Base URL for images

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
  const userId = id || "default-id";
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
            <RssFeed className="sidebarIcon" />
            <span className="sidebarIconText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarIconText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <SmartDisplay className="sidebarIcon" />
            <span className="sidebarIconText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Groups className="sidebarIcon" />
            <span className="sidebarIconText">Group</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarIconText">Bookmarks</span>
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
        <button className="sidebarButton">Show more</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          <CloseFriend />
          <CloseFriend />
          <CloseFriend />
          <CloseFriend />
        </ul>
      </div>
    </div>
  );
}