import React, { useState, useEffect } from "react";
import { Favorite, Comment, Share, MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./postDetail.css";
import ShareDetail from "../ShareDetail/ShareDetail";

export default function PostDetail({ onClose, likes, isHearted, handleHeart, postId }) {
  const [post, setPost] = useState(null);
  const [listComment, setListComment] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isShareDetailOpen, setIsShareDetailOpen] = useState(false); 
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const currentUserId = user.id;

  const loadPostData = async () => {
    try {
      const postResponse = await fetch(`http://localhost:8080/api/post/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (postResponse.ok) {
        const postData = await postResponse.json();
        setPost(postData);
      }

      const commentsResponse = await fetch(`http://localhost:8080/api/comment/post/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        const commentsWithUsers = await Promise.all(
          commentsData.map(async (comment) => {
            const userResponse = await fetch(`http://localhost:8080/api/user/${comment.userId}`);
            if (userResponse.ok) {
              const user = await userResponse.json();
              return { ...comment, user };
            }
            return comment;
          })
        );
        setListComment(commentsWithUsers);
      }

      const countResponse = await fetch(`http://localhost:8080/api/count/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (countResponse.ok) {
        const countData = await countResponse.json();
        setCommentsCount(countData);
      }
    } catch (error) {
      console.error("Error loading post data:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !post?.id) return;

    try {
      console.log("Token:", localStorage.getItem("token"));
      console.log("Request body:", { postId: post.id, userId: currentUserId, content: newComment });

      const response = await fetch("http://localhost:8080/api/comment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.id,
          userId: currentUserId,
          content: newComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error(errorData.message || "Failed to create comment");
      }

      await loadPostData();
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("An error occurred while posting your comment: " + error.message);
    }
  };


  const handleShare = () => {
    setIsShareDetailOpen(true);
  };

  const handleVisitProfile = (userId) => {
    userId === currentUserId ? navigate(`/profile/${userId}`) : navigate(`/visitfriend/${userId}`);
  };

  useEffect(() => {
    loadPostData();
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="postDetailOverlay">
      <div className="postDetail">
        <div className="postDetailTitle">
          <span>Bài viết của {post.user?.name || "Unknown"}</span>
          <span className="closebutton" onClick={onClose}>
            ×
          </span>
        </div>
        <div className="postDetailScrollable">
          <div className="postDetailHeader">
            <img
              className="postProfileImg"
              src={`/uploads/avatar/${post.user?.profilePicture || "default.jpg"}`}
              alt="User avatar"
              onClick={() => handleVisitProfile(post.user?.id)}
              style={{ cursor: "pointer" }}
            />
            <div>
              <span
                className="postUsername"
                onClick={() => handleVisitProfile(post.user?.id)}
                style={{ cursor: "pointer" }}
              >
                {post.user?.name || "Unknown"}
              </span>
              <span className="postDate">1 phút • 🌍</span>
            </div>
          </div>
          <div className="postDetailContent">
            <span className="postText">{post.content}</span>
            {post.mediaUrl && (
              <img className="postImg" src={`/uploads/post/${post.mediaUrl}`} alt="Post media" />
            )}
          </div>
          <hr />
          <div className="postStatsSummary">
            <div className="statsLeft">
              <span className="likesSummary">{likes} lượt thích</span>
            </div>
            <div className="statsRight">
              <span className="commentsSummary">{commentsCount} bình luận</span>
              {/* <span className="sharesSummary">1 lượt chia sẻ</span> */}
            </div>
          </div>
          <div className="postdetailActions">
            <button
              className={`actiondetailButton ${isHearted ? "active" : ""}`}
              onClick={handleHeart}
            >
              <Favorite className="actiondetailIcon" /> Thích
            </button>
            <button className="actiondetailButton">
              <Comment className="actiondetailIcon" /> Bình luận
            </button>
            <button className="actiondetailButton" onClick={handleShare}>
              <Share className="actiondetailIcon" /> Chia sẻ
            </button>
          </div>
          <hr />
          <div className="postDetailComments">
            {listComment.length > 0 ? (
              listComment.map((comment) => (
                <div key={comment.id} className="comment">
                  <img
                    className="commentProfileImg"
                    src={`/uploads/avatar/${comment.user?.profilePicture || "default.jpg"}`}
                    alt="Commenter avatar"
                    onClick={() => handleVisitProfile(comment.user?.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="commentBody">
                    <div className="commentContent">
                      <span
                        className="commentUsername"
                        onClick={() => handleVisitProfile(comment.user?.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {comment.user?.name || "Unknown"}
                      </span>
                      <p>{comment.content}</p>
                    </div>
                    <MoreVert />
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}
          </div>
        </div>
        <div className="commentInput">
          <img
            className="commentProfileImg"
            src={`/uploads/avatar/${post.user?.profilePicture || "default.jpg"}`}
            alt="Your avatar"
            onClick={() => handleVisitProfile(post.user?.id)}
            style={{ cursor: "pointer" }}
          />
          <input
            type="text"
            placeholder="Viết bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
          />
          <button onClick={handleCommentSubmit}>Bình luận</button>
        </div>
      </div>

      {/* Hiển thị ShareDetail khi isShareDetailOpen là true */}
      {isShareDetailOpen && (
        <ShareDetail
          onClose={() => setIsShareDetailOpen(false)}
          postContent={post.content}
          imagePreview={post.mediaUrl ? `/uploads/post/${post.mediaUrl}` : null}
          privacy={post.privacy} // Quyền riêng tư của bài viết
          userId={currentUserId}
        />
      )}
    </div>
  );
}