import React, { useState, useEffect } from "react";
import "./ShareDetail.css";

const ShareDetail = ({ onClose, postContent, imagePreview, privacy, userId, setShares }) => {
  const [usersFriend, setUsersFriend] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userName = storedUser.name || "Người dùng";
  const profilePicture = storedUser.profilePicture || null;

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/friendship/friends/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }

        const data = await response.json();
        setUsersFriend(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError("Không thể tải danh sách bạn bè. Vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  const handleSelectFriend = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleShareNow = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Gửi tin nhắn cho các bạn bè được chọn (nếu có)
      if (selectedFriends.length > 0) {
        await Promise.all(
          selectedFriends.map(async (receiverId) => {
            const messagePayload = {
              sender: { id: userId },
              receiver: { id: receiverId },
              content: JSON.stringify({
                type: "post",
                post: {
                  content: postContent || "Cái này hay ác!",
                  image: imagePreview || null,
                  privacy: privacy || "CONG_KHAI",
                  userName: userName, // Thêm tên người đăng
                  profilePicture: profilePicture, // Thêm ảnh đại diện
                },
              }),
            };

            const response = await fetch("http://localhost:8080/api/message/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(messagePayload),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to send message");
            }
          })
        );
        console.log("Messages sent successfully to selected friends");
      }

      console.log("Share successful");
      if (setShares) {
        setShares((prev) => prev + (selectedFriends.length > 0 ? selectedFriends.length : 1));
      }
      onClose();
    } catch (error) {
      console.error("Error sharing:", error);
      setError(error.message || "Đã có lỗi xảy ra khi chia sẻ bài viết!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="share-detail-overlay">
      <div className="share-detail-container">
        <div className="share-detail-header">
          <h2>Chia sẻ bài viết</h2>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            ✕
          </button>
        </div>

        <div className="post-preview">
          <h3>Bài viết của bạn:</h3>
          <p>{postContent || "Không có nội dung"}</p>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="post-preview-image" />
          )}
          <p>
            Quyền riêng tư:{" "}
            <span className="privacy-text">
              {privacy === "public" || privacy === "CONG_KHAI"
                ? "Công khai"
                : privacy === "friends" || privacy === "BAN_BE"
                ? "Bạn bè"
                : "Riêng tư"}
            </span>
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="messenger-section">
          <h3>Gửi đến bạn bè qua Messenger</h3>
          {isLoading ? (
            <p>Đang tải danh sách bạn bè...</p>
          ) : usersFriend.length > 0 ? (
            <div className="messenger-users">
              {usersFriend.map((user) => (
                <div
                  key={user.id}
                  className={`messenger-user ${
                    selectedFriends.includes(user.id) ? "selected" : ""
                  }`}
                  onClick={() => !isLoading && handleSelectFriend(user.id)}
                >
                  <div
                    className="user-avatar"
                    style={{
                      backgroundImage: user.profilePicture
                        ? `url(uploads/avatar/${user.profilePicture})`
                        : "none",
                      backgroundColor: user.profilePicture ? "transparent" : "#ccc",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {selectedFriends.includes(user.id) && (
                      <div className="check-icon">✔</div>
                    )}
                  </div>
                  <span className="user-name">{user.userName || "Không có tên"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có bạn bè nào để gửi.</p>
          )}
        </div>

        <div className="share-options">
          <div className="share-option">
            <span className="icon">📌</span>
            <span>Đăng lên tường</span>
          </div>
          <div className="share-option">
            <span className="icon">📡</span>
            <span>Chia sẻ qua feed</span>
          </div>
          <div className="share-option">
            <span className="icon">👥</span>
            <span>Chia sẻ với nhóm</span>
          </div>
        </div>

        <button
          className="share-now-button"
          onClick={handleShareNow}
          disabled={isLoading}
        >
          {isLoading ? "Đang chia sẻ..." : "Chia sẻ ngay"}
        </button>
      </div>
    </div>
  );
};

export default ShareDetail;