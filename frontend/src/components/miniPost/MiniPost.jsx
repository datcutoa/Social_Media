import React from "react";
import { Public, People, Lock } from "@mui/icons-material";
import "./MiniPost.css";

const MiniPost = ({ postData }) => {
  const { content, image, privacy, userName, profilePicture } = postData;

  // Kiểm tra profilePicture và tạo URL hợp lệ
  const avatarUrl =
    profilePicture && typeof profilePicture === "string" && profilePicture.trim() !== ""
      ? `/uploads/avatar/${profilePicture}`
      : "https://via.placeholder.com/40";

  return (
    <div className="mini-post">
      <div className="mini-post-header">
        <div className="mini-post-user">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="mini-post-avatar"
            onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
          />
          <span className="mini-post-username">{userName || "Người dùng"}</span>
        </div>
        <span className="mini-post-privacy">
          {privacy === "CONG_KHAI" && <Public className="privacy-icon" />}
          {privacy === "BAN_BE" && <People className="privacy-icon" />}
          {privacy === "RIENG_TU" && <Lock className="privacy-icon" />}
          <span className="privacy-text">
            {privacy === "CONG_KHAI" ? "Công khai" : privacy === "BAN_BE" ? "Bạn bè" : "Riêng tư"}
          </span>
        </span>
      </div>
      <div className="mini-post-content">
        <p>{content || "Không có nội dung"}</p>
        {image && <img src={image} alt="Post Image" className="mini-post-image" />}
      </div>
    </div>
  );
};

export default MiniPost;