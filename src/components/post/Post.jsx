import React, { useState } from "react";
import { MoreVert, Favorite, ThumbUp } from "@mui/icons-material";
import PostDetail from "../postDetail/PostDetail";
import "./post.css";

export default function Post() {
  const [showDetail, setShowDetail] = useState(false);
  const [showProfileImg, setShowProfileImg] = useState(false);
  const [showPostImg, setShowPostImg] = useState(false);
  const [likes, setLikes] = useState(32);
  const [isLiked, setIsLiked] = useState(false);
  const [isHearted, setIsHearted] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleHeart = () => {
    setIsHearted(!isHearted);
    setLikes((prev) => (isHearted ? prev - 1 : prev + 1));
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src="asset/person/1.jpeg"
              alt=""
              onClick={() => setShowProfileImg(true)} // Mở ảnh đại diện
            />
            <span className="postUsername">Linh</span>
            <span className="postDate">5 min ago</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">Hey! Have a good day</span>
          <img
            className="postImg"
            src="asset/post/1.jpeg"
            alt=""
            onClick={() => setShowPostImg(true)} // Mở ảnh bài post
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <ThumbUp
              className={`likeIcon ${isLiked ? "active" : ""}`}
              onClick={handleLike}
            />
            <Favorite
              className={`heartIcon ${isHearted ? "active" : ""}`}
              onClick={handleHeart}
            />
            <span className="postLikeCounter">{likes} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={() => setShowDetail(true)}>
              9 comments
            </span>
          </div>
        </div>
      </div>

      {/* Hiển thị chi tiết bài viết khi nhấn vào comments */}
      {showDetail && (
        <PostDetail
          onClose={() => setShowDetail(false)}
          likes={likes}
          isLiked={isLiked}
          isHearted={isHearted}
          handleLike={handleLike}
          handleHeart={handleHeart}
        />
      )}

      {/* Hiển thị ảnh đại diện khi nhấn vào */}
      {showProfileImg && (
        <div className="overlay" onClick={() => setShowProfileImg(false)}>
          <img className="largeImg" src="asset/person/1.jpeg" alt="" />
        </div>
      )}

      {/* Hiển thị ảnh bài post khi nhấn vào */}
      {showPostImg && (
        <div className="overlay" onClick={() => setShowPostImg(false)}>
          <img className="largeImg" src="asset/post/1.jpeg" alt="" />
        </div>
      )}
    </div>
  );
}
