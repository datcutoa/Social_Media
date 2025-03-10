import React from "react";
import { Favorite, ThumbUp } from "@mui/icons-material";
import "./postDetail.css";

export default function PostDetail({ onClose, likes, isLiked, isHearted, handleLike, handleHeart }) {
  return (
    <div className="postDetailOverlay">
      <div className="postDetail">
        <span className="closeButton" onClick={onClose}>×</span>
        <div className="postDetailTop">
          <img className="postProfileImg" src="asset/person/1.jpeg" alt="" />
          <div>
            <span className="postUsername">Linh</span>
            <span className="postDate">5 min ago</span>
          </div>
        </div>
        <div className="postDetailContent">
          <span className="postText">Hey! Have a good day</span>
          <img className="postImg" src="asset/post/1.jpeg" alt="" />
        </div>
        <div className="postDetailLikes">
          <ThumbUp
            className={`likeIcon ${isLiked ? "active" : ""}`}
            onClick={handleLike}
          />
          <Favorite
            className={`heartIcon ${isHearted ? "active" : ""}`}
            onClick={handleHeart}
          />
          <span>{likes} people like it</span>
        </div>
        <div className="postDetailComments">
          <h3>Comments</h3>
          <div className="comment">
            <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
            <div className="commentContent">
              <span className="commentUsername">John</span>
              <p>Great post!</p>
            </div>
          </div>
        </div>
        <div className="commentInput">
          <input type="text" placeholder="Write a comment..." />
          <button>Post</button>
        </div>
      </div>
    </div>
  );
}
