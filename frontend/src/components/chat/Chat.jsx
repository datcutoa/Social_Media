import React, { useState, useEffect, useRef } from "react";
import "./chat.css";
import { FaTimes } from "react-icons/fa";
import { RiSubtractLine } from "react-icons/ri";
import { Image, SentimentSatisfied, Send } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Chat = ({ userId, fullName, profilePic, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const currentUser = user.id;
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Gọi API để lấy danh sách tin nhắn khi component được mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/message/between?userId1=${currentUser}&userId2=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender === currentUser ? "sent" : "received",
          timestamp: new Date(msg.createdAt),
        }));
        setMessages(formattedMessages);
        setUnreadCount(0);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentUser, userId]);

  const handleSendMessage = async () => {
    if (inputText.trim() === "" && !selectedImage) return;

    const messagePayload = {
      sender: { id: currentUser },
      receiver: { id: userId },
      content: inputText,
    };

    try {
      const response = await fetch("http://localhost:8080/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const sentMessage = await response.json();
      setMessages([
        ...messages,
        {
          id: sentMessage.id,
          text: sentMessage.content,
          sender: "sent",
          timestamp: new Date(sentMessage.createdAt),
        },
      ]);
      setInputText("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEmojiSelect = () => {
    const emoji = "😊";
    setInputText(inputText + emoji);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1)
      return `Hôm qua, ${timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    if (diffInDays < 7)
      return `${diffInDays} ngày trước, ${timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    return timestamp.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      {isMinimized ? (
        <div className="minimized-chat-icon" onClick={handleMaximize}>
          <img
            src={`/uploads/avatar/${profilePic}`}
            alt="Profile Picture"
            className="minimized-pic"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/40";
            }}
          />
          <span className="online-dot"></span>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
          <span
            className="minimized-close-icon"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <FaTimes />
          </span>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <div className="header-info">
              <Link to={`/visitfriend/${userId}`}>
                <img
                  src={`/uploads/avatar/${profilePic}`}
                  alt="Profile Picture"
                  className="profile-pic"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
              </Link>
              <div>
                <h3>{fullName || "Người dùng"}</h3>
                <p>Đang hoạt động</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                title="Thu nhỏ đoạn chat"
                className="minimize-btn"
                onClick={() => setIsMinimized(true)}
              >
                <RiSubtractLine />
              </button>
              <button
                title="Đóng đoạn chat"
                className="close-btn"
                onClick={onClose}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="chat-body" ref={chatBodyRef}>
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={message.id}>
                  {(index === 0 ||
                    new Date(messages[index - 1].timestamp).getDate() !==
                      new Date(message.timestamp).getDate()) && (
                    <div className="message-timestamp">
                      {formatTimestamp(message.timestamp).includes("Vừa xong")
                        ? "Hôm nay"
                        : formatTimestamp(message.timestamp).split(",")[0]}
                    </div>
                  )}
                  <div className={`message ${message.sender}`}>
                    {message.sender === "received" && (
                      <Link to={`/visitfriend/${userId}`}>
                        <img
                          src={`/uploads/avatar/${profilePic}`}
                          alt="Avatar"
                          className="message-pic"
                          onError={(e) => {
                            e.target.src = "/uploads/avatar/${profilePic}";
                          }}
                        />
                      </Link>
                    )}
                    <div className={`message-content ${message.sender}`}>
                      <p>{message.text}</p>
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Sent Image"
                          className="message-image"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="chat-input">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
            <Image
              className="chat-input-icon"
              onClick={() => fileInputRef.current.click()}
            />
            <SentimentSatisfied
              className="chat-input-icon"
              onClick={handleEmojiSelect}
            />
            <div className="input-wrapper">
              <div
                className={`message-input-container ${
                  selectedImage ? "has-image" : ""
                }`}
              >
                {selectedImage && (
                  <div className="image-preview">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="preview-image"
                    />
                    <span className="remove-image" onClick={handleRemoveImage}>
                      <FaTimes />
                    </span>
                  </div>
                )}
                <input
                  type="text"
                  className="message-input"
                  placeholder="Aa"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <button className="send-btn" onClick={handleSendMessage}>
              <Send className="chat-input-icon" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;