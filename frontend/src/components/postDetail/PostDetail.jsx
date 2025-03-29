import React from "react";
import { useState,useEffect } from "react";
import { Favorite, Comment, Share,MoreVert } from "@mui/icons-material";
import "./postDetail.css";

export default function PostDetail({ onClose, likes, isHearted, handleHeart, postId}) {
  const commentsCount = 21;
  const sharesCount = 1;
  const [post,setPost] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/post/${postId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchPosts();
  }, [postId]);
  return (
    <div className="postDetailOverlay">
      <div className="postDetail">
        <div className="postDetailTitle">
          <span>Bài viết của {post?.user?.name}</span>
          <span className="closebutton" onClick={onClose}>×</span>
        </div>
        <div className="postDetailScrollable">
          <div className="postDetailHeader">
            <img className="postProfileImg" src={`/uploads/avatar/${post?.user?.profilePicture}`}alt="" />
            <div>
              <span className="postUsername">{post?.user?.name}</span>
              <span className="postDate">1 phút • 🌍</span>
            </div>
          </div>
          <div className="postDetailContent">
            <span className="postText">
              {post?.content}
            </span>
            {post?.mediaUrl && (
              <img
                className="postImg"
                src={`/uploads/post/${post?.mediaUrl}`}
                alt=""
              />
            )}
          </div>
          <hr />
          <div className="postStatsSummary">
            <div className="statsLeft">
              <span className="likesSummary">
                😅 {likes} {/* Thay Favorite icon bằng emoji giống mẫu */}
              </span>
            </div>
            <div className="statsRight">
              <span className="commentsSummary">{commentsCount} bình luận</span>
              <span className="sharesSummary"> • {sharesCount} lượt chia sẻ</span>
            </div>
          </div>
          <div className="postActions">
            <button className={`actionButton ${isHearted ? "active" : ""}`} onClick={handleHeart}>
              <Favorite className="actionIcon" /> Thích
            </button>
            <button className="actionButton">
              <Comment className="actionIcon" /> Bình luận
            </button>
            <button className="actionButton">
              <Share className="actionIcon" /> Chia sẻ
            </button>
          </div>
          <hr />
          <div className="postDetailComments">
            <div className="comment">
              <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
              <div className="commentBody">
                <div className="commentContent">
                  <span className="commentUsername">Khánh Hòa</span>
                  <p>LynhLynhcảo TuyềnNgọc Nhi hồng trách mình dc</p>
                </div>
                <MoreVert/>
              </div>
            </div>
            <div className="comment">
              <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
              <div className="commentBody">
                <div className="commentContent">
                  <span className="commentUsername">Angela Nguyen</span>
                  <p>đồ đần độn</p>
                </div>
                <MoreVert/>
              </div>
            </div>
            <div className="comment">
              <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
              <div className="commentBody">
                <div className="commentContent">
                  <span className="commentUsername">Angela Nguyen</span>
                  <p>đồ đần độn</p>
                </div>
                <MoreVert/>
              </div>
            </div>
            <div className="comment">
              <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
              <div className="commentBody">
                <div className="commentContent">
                  <span className="commentUsername">Angela Nguyen</span>
                  <p>đồ đần độn</p>
                </div>
                <MoreVert/>
              </div>
            </div>
            <div className="comment">
              <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
              <div className="commentBody">
                <div className="commentContent">
                  <span className="commentUsername">Angela Nguyen</span>
                  <p>đồ đần độn</p>
                </div>
                <MoreVert/>
              </div>
            </div>
            <div className="comment">
              <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
              <div className="commentBody">
                <div className="commentContent">
                  <span className="commentUsername">Van Tung</span>
                  <p>...</p>
                </div>
                <MoreVert/>
              </div>
            </div>
          </div>
        </div>
        <div className="commentInput">
          <img className="commentProfileImg" src={`/uploads/avatar/${post?.user?.profilePicture}`} alt="" />
          <input type="text" placeholder="Viết bình luận..." />
          <div className="commentIcons">
            <button>Bình luận</button>
          </div>
        </div>
      </div>
    </div>
  );
}