import React from "react";
import { Favorite } from "@mui/icons-material";
import "./postDetail.css";

export default function PostDetail({ onClose, likes, isHearted, handleHeart }) {
  return (
    <div className="postDetailOverlay">
      <div className="postDetail">
        <span className="closeButton" onClick={onClose}>×</span>
        <div className="postDetailHeader">
          <img className="postProfileImg" src="asset/person/1.jpeg" alt="" />
          <div>
            <span className="postUsername">Nhà Văn Cục Súc</span>
            <span className="postDate">1 giờ • 🌍</span>
          </div>
        </div>
        <div className="postDetailContent">
          <span className="postText">
            Cố đần về nhà phải chủ động ơn lại bài. Nhưng mình là con gái mà sao phải chủ động trước? Lẽ ra bài phải chủ động ơn mình chứ nhỉ?
          </span>
          <img className="postImg" src="asset/post/1.jpeg" alt="" />
        </div>
        <div className="postDetailStats">
          <div className="postDetailLikes">  
                        <Favorite
                          className={`heartIcon ${isHearted ? "active" : ""}`}
                          onClick={handleHeart}
                        />
                        <span className="postLikeCounter">{likes} people like it</span>
          </div>
        </div>
        <div className="postDetailComments">
          <div className="comment">
            <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
            <div className="commentBody">
              <div className="commentContent">
                <span className="commentUsername">Khánh Hòa</span>
                <p>LynhLynhcảo TuyềnNgọc Nhi hồng trách mình dc</p>
              </div>
            </div>
          </div>
          <div className="comment">
            <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
            <div className="commentBody">
              <div className="commentContent">
                <span className="commentUsername">Angela Nguyen</span>
                <p>đồ đần độn</p>
              </div>
            </div>
          </div>
          <div className="comment">
            <img className="commentProfileImg" src="asset/person/2.jpeg" alt="" />
            <div className="commentBody">
              <div className="commentContent">
                <span className="commentUsername">Van Tung</span>
                <p>...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="commentInput">
          <img className="commentProfileImg" src="asset/person/1.jpeg" alt="" />
          <input type="text" placeholder="Viết bình luận..." />
          <div className="commentIcons">
            <button>Bình luận</button>
          </div>
        </div>
      </div>
    </div>
  );
}