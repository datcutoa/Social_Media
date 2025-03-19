import "./sidebarprofile.css";
import { useState } from "react";

export default function SidebarProfile({ setActiveTab }) {
  const friends = [
    { name: "Bích Ngọc", img: "asset/person/1.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
  ];

  // State để quản lý bio và trạng thái chỉnh sửa
  const [bio, setBio] = useState(
    "Xin chào! Tôi là <strong>Quách</strong>, một người đam mê công nghệ và lập trình. Thích khám phá những điều mới mẻ và xây dựng những sản phẩm hữu ích."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState(bio);

  // Bắt đầu chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
    setTempBio(bio); // Lưu giá trị hiện tại vào tempBio để chỉnh sửa
  };

  // Lưu bio
  const handleSave = () => {
    setBio(tempBio);
    setIsEditing(false);
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(false);
    setTempBio(bio); // Khôi phục giá trị gốc
  };

  return (
    <div className="SidebarProfile">
      <div className="SidebarProfileTop">
        <h3>Giới thiệu</h3>
        {isEditing ? (
          <div className="bioEditContainer">
            <textarea
              className="bioTextarea"
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              placeholder="Nhập giới thiệu của bạn..."
            />
            <div className="bioButtons">
              <button className="saveButton" onClick={handleSave}>
                Lưu
              </button>
              <button className="cancelButton" onClick={handleCancel}>
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="bioDisplayContainer">
            {bio ? (
              <p
                className="SidebarProfileBio"
                dangerouslySetInnerHTML={{ __html: bio }}
              />
            ) : (
              <p className="SidebarProfileBio noBio"></p>
            )}
            <button
              className="editBioButton"
              onClick={handleEdit}
            >
              {bio ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        )}
      </div>
      <div className="SidebarProfileBottom">
        <div className="friendsHeader">
          <h4>Bạn bè</h4>
          <button
            className="seeAllFriends"
            onClick={() => setActiveTab("Bạn bè")}
          >
            Xem tất cả bạn bè
          </button>
        </div>
        <div className="friendsCount">437 người bạn</div>
        <div className="friendsList">
          {friends.map((friend, index) => (
            <div key={index} className="friendItem">
              <div className="friendImageWrapper">
                <img src={friend.img} alt={friend.name} className="friendImage" />
              </div>
              <div className="friendInfo">
                <span className="friendName">{friend.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}