import "./sidebarprofile.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function SidebarProfile({ setActiveTab }) {
  const friends = [
    { name: "Bích Ngọc", img: "asset/person/1.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
    { name: "Bích Ngọc", img: "asset/person/2.jpeg" },
  ];

  const { id } = useParams();
  const [bio, setBio] = useState(""); // Khởi tạo rỗng, chờ API
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState(""); // Khởi tạo rỗng, chờ API

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/user/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setBio(data.bio || ""); // Lấy bio từ API, mặc định là rỗng nếu không có
        setTempBio(data.bio || "");
      } catch (error) {
        console.error("Error fetching bio:", error);
        setBio("");
        setTempBio("");
      }
    };

    fetchBio();
  }, [id]);

  // Bắt đầu chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
    setTempBio(bio); // Lưu giá trị hiện tại vào tempBio để chỉnh sửa
  };

  // Lưu bio lên API
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/${id}`, {
        method: "PUT", // hoặc PATCH tùy API của bạn
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio: tempBio }), // Gửi bio lên API
      });

      if (!response.ok) throw new Error("Failed to update bio");
      setBio(tempBio); // Cập nhật state sau khi API thành công
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving bio:", error);
    }
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
            <button className="editBioButton" onClick={handleEdit}>
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