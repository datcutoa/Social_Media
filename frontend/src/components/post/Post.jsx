import React, { useState,useEffect } from "react";
import { MoreVert, Favorite, Comment, Share, Public , People, Lock,} from "@mui/icons-material";
import PostDetail from "../postDetail/PostDetail";
import "./post.css";

export default function Post({ post }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showProfileImg, setShowProfileImg] = useState(false);
  const [showPostImg, setShowPostImg] = useState(false);
  const [likes, setLikes] = useState(11000);
  const [isHearted, setIsHearted] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [comments, setComments] = useState(352);
  const [shares, setShares] = useState(200);
  const [name, setName] = useState("");
  const [content, setcontent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const [postDate, setPostDate] = useState("");

  useEffect(() => {
    setName(post?.user?.name);
    setcontent(post?.content || "");
    setMediaUrl(post?.mediaUrl || "");
    setprofilePicture(post?.user?.profilePicture || "");
    setPostDate(post?.createdAt || "");
  }, [post]);


  const handleHeart = () => {
    setIsHearted(!isHearted);
    setLikes((prev) => (isHearted ? prev - 1 : prev + 1));
  };

  const handleDelete = () => {
    console.log("Xóa bài viết");
    setShowMoreOptions(false);
  };

  const handleShare = () => {
    setShares((prev) => prev + 1);
    console.log("Chia sẻ bài viết");
  };

  if (showDetail) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  const timeAgo = (dateString) => {
      const now = new Date();
      const past = new Date(dateString);
      const diffInSeconds = Math.floor((now - past) / 1000);

      if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} giờ trước`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return `Hôm qua`;
      if (diffInDays < 7) return `${diffInDays} ngày trước`;
      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) return `${diffInMonths} tháng trước`;
      const diffInYears = Math.floor(diffInDays / 365);
      return `${diffInYears} năm trước`;
  };

  
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <div className="avatarColumn">
              <img
                className="postProfileImg"
                src={`/uploads/avatar/${profilePicture}`}
                alt=""
              />
            </div>
            <div className="infoColumn">
              <span className="postUsername">{name}</span>
              <div className="infoColumnDetails">
                <span className="postdate">{timeAgo(postDate)}</span>
                <span className="postPrivacy">
                  {
                    post?.privacy === 'CONG_KHAI' && 
                    <Public className="postPrivacyIcon" style={{ fontSize: '1em' }} />
                  }
                  {
                    post?.privacy === 'BAN_BE' && 
                    <People className="postPrivacyIcon" style={{ fontSize: '1em' }} />
                  }
                  {
                    post?.privacy === 'RIENG_TU' && 
                    <Lock className="postPrivacyIcon" style={{ fontSize: '1em' }} />
                  }
                </span>
              </div>
            </div>

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
          <span className="postText">{content}</span>
          {mediaUrl && (
            <img
              className="postImg"
              src={`/uploads/post/${mediaUrl}`}
              alt=""
              onClick={() => setShowPostImg(true)}
            />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <span className="postLikeCounter">{likes} lượt thích</span>
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => setShowDetail(true)}
            >
              {comments} bình luận
            </span>
            <span className="postShareText" onClick={handleShare}>
              {shares} lượt chia sẻ
            </span>
          </div>
        </div>
        <div className="postActions">
          <div className="actionItem" onClick={handleHeart}>
            <Favorite className="actionIcon" />
            <span>Thích</span>
          </div>
          <div className="actionItem" onClick={() => setShowDetail(true)}>
            <Comment className="actionIcon" />
            <span>Bình luận</span>
          </div>
          <div className="actionItem" onClick={handleShare}>
            <Share className="actionIcon" />
            <span>Chia sẻ</span>
          </div>
        </div>
      </div>

      {showDetail && (
        <PostDetail
          onClose={() => setShowDetail(false)}
          likes={likes}
          isHearted={isHearted}
          handleHeart={handleHeart}
          postId={post?.id}
        />
      )}

      {showPostImg && (
        <div className="overlay" onClick={() => setShowPostImg(false)}>
          <img
            className="largeImg"
            src={`/uploads/post/${mediaUrl}`}
            alt=""
          />
        </div>
      )}
    </div>
  );
}