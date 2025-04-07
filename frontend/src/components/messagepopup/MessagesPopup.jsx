import { useState, useEffect } from "react";
import axios from "axios";
import "./messagesPopup.css";

export default function MessagesPopup({ isOpen, onClose, currentUserId, onOpenChat }) {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);

  // Hàm gọi API để lấy danh sách các cuộc hội thoại
  const fetchConversations = async () => {
    if (!currentUserId) {
      setError("Không tìm thấy ID người dùng.");
      return;
    }

    try {
      console.log(`Fetching conversations for userId: ${currentUserId}`);
      const response = await axios.get("http://localhost:8080/api/message/conversations", {
        params: {
          userId: currentUserId,
        },
      });
      console.log("API response:", response.data);
      setConversations(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      if (error.response && error.response.status === 204) {
        setConversations([]);
        setError(null);
      } else {
        setConversations([]);
        setError("Không thể tải danh sách hội thoại.");
      }
    }
  };

  // Gọi API khi popup mở
  useEffect(() => {
    console.log(`isOpen: ${isOpen}, currentUserId: ${currentUserId}`);
    if (isOpen && currentUserId) {
      fetchConversations();
    }
  }, [isOpen, currentUserId]);

  // Log để kiểm tra state conversations
  useEffect(() => {
    console.log("Conversations state:", conversations);
  }, [conversations]);

  const handleOpenChat = (conv) => {
    const user = {
      id: conv.otherUserId,
      fullName: conv.otherUserName,
      profilePicture: conv.avatarUrl,
    };
    onOpenChat(user); // Gọi hàm từ Topbar để mở Chat
    onClose(); // Đóng popup
  };

  if (!isOpen) return null;

  return (
    <div className="popupContainer">
      <div className="popupHeader">
        <h3>Tin nhắn</h3>
      </div>

      {error && <p className="errorMessage">{error}</p>}
      <ul className="popupList">
        {conversations.length > 0 ? (
          conversations.map((conv, index) => (
            <li
              key={index} // Chỉ cần một key duy nhất
              className="popupItem"
              onClick={() => handleOpenChat(conv)}
            >
              <img
                src={`/uploads/avatar/${conv.avatarUrl}`}
                alt="User"
                className="popupAvatar"
                onError={(e) => {
                  e.target.src = "/assets/person/default.jpeg";
                }}
              />
              <div className="popupText">
                <span className="popupUser">{conv.otherUserName}</span>
                <p className="popupMessage">{conv.lastMessage}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="noConversations">Chưa có cuộc hội thoại nào</li>
        )}
      </ul>
    </div>
  );
}