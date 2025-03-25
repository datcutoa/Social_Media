import React, { useState } from "react";
import { MoreVert, Favorite, ThumbUp } from "@mui/icons-material";
import PostDetail from "../postDetail/PostDetail";
import "./post.css";

export default function Post() {
  const [showDetail, setShowDetail] = useState(false);
  const [showProfileImg, setShowProfileImg] = useState(false);
  const [showPostImg, setShowPostImg] = useState(false);
  const [likes, setLikes] = useState(32);
  const [isHearted, setIsHearted] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleHeart = () => {
    setIsHearted(!isHearted);
    setLikes((prev) => (isHearted ? prev - 1 : prev + 1));
  };

  const handleDelete = () => {
    console.log("Xóa bài viết");
    setShowMoreOptions(false);
  };

  if (showDetail) {
    document.body.style.overflow = "hidden"; // Ngăn cuộn trang
  } else {
    document.body.style.overflow = "auto"; // Khôi phục cuộn trang
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src="asset/person/1.jpeg"
              alt=""
              onClick={() => setShowProfileImg(true)}
            />
            <span className="postUsername">Linh</span>
            <span className="postDate">5 min ago</span>
          </div>
          <div className="postTopRight">
            <MoreVert
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              style={{ cursor: "pointer" }}
            />
            {showMoreOptions && (
              <div className="moreOptionsPopup">
                <button className="deleteButton" onClick={handleDelete}>
                  Xóa bài viết
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">Hey! Have a good day</span>
          <img
            className="postImg"
            src="asset/post/1.jpeg"
            alt=""
            onClick={() => setShowPostImg(true)}
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
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

      {showDetail && (
        <PostDetail
          onClose={() => setShowDetail(false)}
          likes={likes}
          isHearted={isHearted}
          handleHeart={handleHeart}
        />
      )}

      {showProfileImg && (
        <div className="overlay" onClick={() => setShowProfileImg(false)}>
          <img className="largeImg" src="asset/person/1.jpeg" alt="" />
        </div>
      )}

      {showPostImg && (
        <div className="overlay" onClick={() => setShowPostImg(false)}>
          <img className="largeImg" src="asset/post/1.jpeg" alt="" />
        </div>
      )}
    </div>
  );
}