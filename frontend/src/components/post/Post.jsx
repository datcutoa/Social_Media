import React, { useState, useEffect, useRef } from "react";
import { MoreVert, Favorite, Comment, Share, Public, People, Lock } from "@mui/icons-material";
import PostDetail from "../postDetail/PostDetail";
import FriendEmotion from "../friend_emotion/FriendEmotion";
import "./post.css";

export default function Post({ post }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showPostImg, setShowPostImg] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isHearted, setIsHearted] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [shares, setShares] = useState(200);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [postDate, setPostDate] = useState("");
  const [privacy, setPrivacy] = useState(post?.privacy || "CONG_KHAI");
  const [showPrivacyOptions, setShowPrivacyOptions] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [commentsCount, setCommentsCount] = useState(0);
  const userId = storedUser?.id;
  const [showFriendEmotion, setShowFriendEmotion] = useState(false);
  const privacyPopupRef = useRef(null);

  useEffect(() => {
    setName(post?.user?.name || "");
    setContent(post?.content || "");
    setMediaUrl(post?.mediaUrl || "");
    setProfilePicture(post?.user?.profilePicture || "");
    setPostDate(post?.createdAt || "");
    setPrivacy(post?.privacy || "CONG_KHAI");

    const fetchLikes = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${post?.user?.id}/posts/${post?.id}/likes/count`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setLikes(data);
      } catch (error) {
        console.error("Lỗi khi lấy số lượt likes:", error);
        setLikes(0);
      }
    };

    const checkIfLiked = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/likes/check?userId=${userId}&postId=${post?.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsHearted(data);
        }
      } catch (error) {
        setIsHearted(false);
      }
    };

    const fetchCommentsCount = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/count/${post?.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch comments count");
        const data = await response.json();
        setCommentsCount(data);
      } catch (error) {
        console.error("Error fetching comments count:", error);
      }
    };

    if (post?.user?.id && post?.id) {
      fetchCommentsCount();
      fetchLikes();
      checkIfLiked();
    }
  }, [post, userId]);

  // Đóng popup khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (privacyPopupRef.current && !privacyPopupRef.current.contains(event.target)) {
        setShowPrivacyOptions(false);
      }
    };

    if (showPrivacyOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPrivacyOptions]);

  const handleHeart = async () => {
    const postId = post?.id;
    try {
      const findResponse = await fetch(
        `http://localhost:8080/api/like/find?userId=${userId}&postId=${postId}`
      );

      if (findResponse.ok) {
        const likeId = await findResponse.json();
        const deleteResponse = await fetch(`http://localhost:8080/api/like/${likeId}`, {
          method: "DELETE",
        });

        if (deleteResponse.ok) {
          setIsHearted(false);
          setLikes((prev) => prev - 1);
        } else {
          console.error("Lỗi khi bỏ like:", deleteResponse.status);
        }
      } else if (findResponse.status === 404) {
        const addResponse = await fetch(
          `http://localhost:8080/api/likes?userId=${userId}&postId=${postId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (addResponse.ok) {
          setIsHearted(true);
          setLikes((prev) => prev + 1);
        } else {
          console.error("Lỗi khi like:", addResponse.status);
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý like/unlike:", error);
    }
  };

  const handleDelete = () => {
    console.log("Xóa bài viết");
    setShowMoreOptions(false);
  };

  const handleShare = () => {
    setShares((prev) => prev + 1);
    console.log("Chia sẻ bài viết");
  };

  const handleChangePrivacy = async (newPrivacy) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/post/${post?.id}/privacy?privacy=${newPrivacy}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          }, // Bỏ "Authorization"
        }
      );
      if (!response.ok) throw new Error("Failed to update privacy");
      setPrivacy(newPrivacy);
      setShowPrivacyOptions(false);
    } catch (error) {
      console.error("Lỗi khi thay đổi quyền riêng tư:", error);
    }
  };

  if (showDetail || showFriendEmotion) {
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

  const isAuthor = post?.user?.id === userId; // Chỉ chủ bài viết mới thay đổi được quyền

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
                <span
                  className="postPrivacy"
                  onClick={() => isAuthor && setShowPrivacyOptions(!showPrivacyOptions)} // Chỉ tác giả mới nhấp được
                >
                  {privacy === "CONG_KHAI" && <Public className="postPrivacyIcon" style={{ fontSize: "1em" }} />}
                  {privacy === "BAN_BE" && <People className="postPrivacyIcon" style={{ fontSize: "1em" }} />}
                  {privacy === "RIENG_TU" && <Lock className="postPrivacyIcon" style={{ fontSize: "1em" }} />}
                </span>
                {showPrivacyOptions && isAuthor && ( // Chỉ hiển thị cho tác giả
                  <div className="privacyOptionsPopup" ref={privacyPopupRef}>
                    <button
                      className={privacy === "CONG_KHAI" ? "activePrivacy" : ""}
                      onClick={() => handleChangePrivacy("CONG_KHAI")}
                    >
                      <Public className="privacyIcon" /> Công khai
                    </button>
                    <button
                      className={privacy === "BAN_BE" ? "activePrivacy" : ""}
                      onClick={() => handleChangePrivacy("BAN_BE")}
                    >
                      <People className="privacyIcon" /> Bạn bè
                    </button>
                    <button
                      className={privacy === "RIENG_TU" ? "activePrivacy" : ""}
                      onClick={() => handleChangePrivacy("RIENG_TU")}
                    >
                      <Lock className="privacyIcon" /> Riêng tư
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="postTopRight">
            <MoreVert
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              style={{ cursor: "pointer" }}
            />
            {showMoreOptions && isAuthor && (
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
            <span className="postLikeCounter" onClick={() => setShowFriendEmotion(true)}>
              {likes} lượt thích
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={() => setShowDetail(true)}>
              {commentsCount} bình luận
            </span>
            <span className="postShareText" onClick={handleShare}>
              {shares} lượt chia sẻ
            </span>
          </div>
        </div>
        <div className="postActions">
          <div className="actionItem" onClick={handleHeart}>
            <Favorite
              className="actionIcon"
              style={{ color: isHearted ? "red" : "inherit" }}
            />
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
          <img className="largeImg" src={`/uploads/post/${mediaUrl}`} alt="" />
        </div>
      )}

      {showFriendEmotion && (
        <FriendEmotion
          onClose={() => setShowFriendEmotion(false)}
          postId={post?.id}
        />
      )}
    </div>
  );
}