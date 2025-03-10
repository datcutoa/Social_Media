import "./sidebar.css"
import {RssFeed, Chat, SmartDisplay, Groups, Bookmark, Help, Work, Event,School} from "@mui/icons-material"
import CloseFriend from "../closeFriend/CloseFriend"
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <Link to="/profile" className="sidebarProfileLink">
                <img src="/asset/person/1.jpeg" alt="User" className="sidebarProfileImg" />
                <span className="sidebarUsername">Nguyễn Văn A</span>
              </Link>
            </li>

            <li className="sidebarListItem">
              <RssFeed className="sidebarIcon"/>
              <span className="sidebarIconText">Feed</span>
            </li>
            <li className="sidebarListItem">
              <Chat className="sidebarIcon"/>
              <span className="sidebarIconText">Chats</span>
            </li>
            <li className="sidebarListItem">
              <SmartDisplay className="sidebarIcon"/>
              <span className="sidebarIconText">Videos</span>
            </li>
            <li className="sidebarListItem">
              <Groups className="sidebarIcon"/>
              <span className="sidebarIconText">Group</span>
            </li>
            <li className="sidebarListItem">
              <Bookmark className="sidebarIcon"/>
              <span className="sidebarIconText">Bookmarks</span>
            </li>
            <li className="sidebarListItem">
              <Help className="sidebarIcon"/>
            <span className="sidebarIconText">Questions</span>
            </li>
            <li className="sidebarListItem">
              <Work className="sidebarIcon"/>
              <span className="sidebarIconText">Jobs</span>
            </li>
            <li className="sidebarListItem">
              <Event className="sidebarIcon"/>
              <span className="sidebarIconText">Events</span>
            </li>
            <li className="sidebarListItem">
              <School className="sidebarIcon"/>
              <span className="sidebarIconText">Courses</span>
            </li>
          </ul>
          <button className="sidebarButton">Show more</button>
          <hr className="sidebarHr"/>
          <ul className="sidebarFriendList">
            <CloseFriend/>
            <CloseFriend/>
            <CloseFriend/>
            <CloseFriend/>
          </ul>
      </div>
    </div>
  )
}
