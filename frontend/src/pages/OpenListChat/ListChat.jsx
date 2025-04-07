import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ListChat.css";
import { Search, Phone, Videocam, Info, Image, Gif, EmojiEmotions, ThumbUp } from "@mui/icons-material";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const currentUserId = 10; // Giả sử userId hiện tại là 10, bạn có thể lấy từ localStorage

  // Hàm gọi API để lấy danh sách các cuộc hội thoại
  const fetchConversations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/message/conversations", {
        params: { userId: currentUserId },
      });
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

  // Hàm gọi API để lấy chi tiết tin nhắn
  const fetchMessagesBetweenUsers = async (otherUserId) => {
    try {
      const response = await axios.get("http://localhost:8080/api/message/between", {
        params: { userId1: currentUserId, userId2: otherUserId },
      });
      setMessages(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
      setError("Không thể tải tin nhắn.");
    }
  };

  // Hàm gửi tin nhắn mới
  const sendMessage = async (receiverId) => {
    if (!newMessage.trim()) return;

    try {
      const message = {
        content: newMessage,
        senderId: currentUserId,
        receiverId: receiverId,
        createdAt: new Date().toISOString(),
        readStatus: 0,
      };
      await axios.post("http://localhost:8080/api/message/send", message);
      setNewMessage("");
      fetchMessagesBetweenUsers(receiverId);
      fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Không thể gửi tin nhắn.");
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Xử lý khi nhấp vào một cuộc hội thoại
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    fetchMessagesBetweenUsers(conv.otherUserId);
  };

  return (
    <div className="chatContainer">
      {/* Danh sách hội thoại (bên trái) */}
      <div className="chatSidebar">
        <div className="chatHeader">
          <h2>Đoạn chat</h2>
          <div className="chatOptions">
            <span className="chatOptionIcon">...</span>
          </div>
        </div>
        <div className="chatSearch">
          <Search className="searchIcon" />
          <input type="text" placeholder="Tìm kiếm trên Messenger" />
        </div>
        <div className="chatTabs">
          <span className="chatTab active">Hộp thư</span>
          <span className="chatTab">Cộng đồng</span>
        </div>
        <ul className="conversationList">
          {conversations.length > 0 ? (
            conversations.map((conv, index) => (
              <li
                key={index}
                className={`conversationItem ${selectedConversation?.otherUserId === conv.otherUserId ? "active" : ""}`}
                onClick={() => handleSelectConversation(conv)}
              >
                <img
                  src={`/uploads/avatar/${conv.avatarUrl}`}
                  alt="User"
                  className="conversationAvatar"
                  onError={(e) => (e.target.src = "/assets/person/default.jpeg")}
                />
                <div className="conversationText">
                  <span className="conversationUser">{conv.otherUserName || "Người dùng"}</span>
                  <p className="conversationMessage">{conv.lastMessage || "Chưa có tin nhắn"}</p>
                </div>
                <span className="conversationTime">{new Date().toLocaleTimeString()}</span>
              </li>
            ))
          ) : (
            <li className="noConversations">Chưa có cuộc hội thoại nào</li>
          )}
        </ul>
      </div>

      {/* Chi tiết hội thoại (bên phải) */}
      <div className="chatMain">
        {selectedConversation ? (
          <>
            <div className="chatMainHeader">
              <div className="chatMainUserInfo">
                <img
                  src={`/uploads/avatar/${selectedConversation.avatarUrl}`}
                  alt="User"
                  className="chatMainAvatar"
                  onError={(e) => (e.target.src = "/assets/person/default.jpeg")}
                />
                <div>
                  <h3>{selectedConversation.otherUserName}</h3>
                  <span className="chatMainStatus">Hoạt động 5 phút trước</span>
                </div>
              </div>
              <div className="chatMainIcons">
                <Phone className="chatMainIcon" />
                <Videocam className="chatMainIcon" />
                <Info className="chatMainIcon" />
              </div>
            </div>
            <div className="chatMessages">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.senderId === currentUserId ? "sent" : "received"}`}
                  >
                    {msg.senderId !== currentUserId && (
                      <img
                        src={`/uploads/avatar/${selectedConversation.avatarUrl}`}
                        alt="User"
                        className="messageAvatar"
                        onError={(e) => (e.target.src = "/assets/person/default.jpeg")}
                      />
                    )}
                    <div className="messageContent">
                      <p>{msg.content}</p>
                      <span className="messageTime">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có tin nhắn nào</p>
              )}
            </div>
            <div className="chatInput">
              <div className="chatInputIcons">
                <Image className="chatInputIcon" />
                <Gif className="chatInputIcon" />
                <EmojiEmotions className="chatInputIcon" />
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Aa"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(selectedConversation.otherUserId);
                }}
              />
              <ThumbUp className="chatInputIcon sendIcon" onClick={() => sendMessage(selectedConversation.otherUserId)} />
            </div>
          </>
        ) : (
          <div className="chatEmpty">
            <p>Chọn một cuộc hội thoại để bắt đầu trò chuyện</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;