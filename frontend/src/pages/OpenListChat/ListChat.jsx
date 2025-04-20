import React, { useState, useEffect, useRef } from "react";
import "./ListChat.css";
import { Search, Info, Image, SentimentSatisfied, Send } from "@mui/icons-material";
import { Link } from "react-router-dom";
import MiniPost from "../../components/miniPost/MiniPost";
import { Client } from "@stomp/stompjs"; // Import STOMP client
import SockJS from "sockjs-client"; // Import SockJS

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [IdFriend, setIdFriend] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?.id;
  const currentUserProfilePic = storedUser?.profilePicture || null; // Avatar của người gửi
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stompClient, setStompClient] = useState(null); // State for WebSocket client

  // Scroll to the bottom of the message list when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/message/conversations?userId=${currentUserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      if (error.status === 204) {
        setConversations([]);
        setError(null);
      } else {
        setConversations([]);
        setError("Không thể tải danh sách hội thoại.");
      }
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (otherUserId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/message/between?userId1=${currentUserId}&userId2=${otherUserId}`,
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
      const formattedMessages = data.map((msg) => {
        let messageContent;
        try {
          messageContent = JSON.parse(msg.content);
        } catch (e) {
          messageContent = { type: "text", content: msg.content || "Tin nhắn không hợp lệ" };
        }

        return {
          id: msg.id,
          content: messageContent,
          sender: msg.sender === currentUserId ? "sent" : "received", // Adjusted to match reference
          timestamp: new Date(msg.createdAt),
        };
      });
      setMessages(formattedMessages);
      setError(null);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
      setError("Không thể tải tin nhắn.");
    }
  };

  // Initialize WebSocket connection when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const sock = new SockJS("http://localhost:8080/chat");
    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log("✅ Connected to WebSocket");

      const chatRoom = `/topic/messages/${Math.min(currentUserId, selectedConversation.otherUserId)}-${Math.max(currentUserId, selectedConversation.otherUserId)}`;

      client.subscribe(chatRoom, (message) => {
        const receivedMessage = JSON.parse(message.body);
        let messageContent;
        try {
          messageContent = JSON.parse(receivedMessage.content);
        } catch (e) {
          messageContent = { type: "text", content: receivedMessage.content || "Tin nhắn không hợp lệ" };
        }

        setMessages((prev) => [
          ...prev,
          {
            id: receivedMessage.id,
            content: messageContent,
            sender: receivedMessage.sender === currentUserId ? "sent" : "received",
            timestamp: new Date(receivedMessage.createdAt),
          },
        ]);
      });

      setStompClient(client);
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame);
      setError("Lỗi kết nối WebSocket.");
    };

    client.activate();

    // Cleanup WebSocket connection on unmount or conversation change
    return () => {
      client.deactivate();
      setStompClient(null);
    };
  }, [selectedConversation, currentUserId]);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, [currentUserId]);

  // Send a new message via WebSocket
  const handleSendMessage = async (receiverId) => {
    if (inputText.trim() === "" && !selectedImage) return;

    const messagePayload = {
      sender: { id: currentUserId },
      receiver: { id: receiverId },
      content: JSON.stringify({
        type: "text",
        content: inputText,
      }),
      readStatus: false,
      createdAt: new Date().toISOString(),
    };

    try {
      if (stompClient && stompClient.connected) {
        // Send via WebSocket
        stompClient.publish({
          destination: "/app/sendMessage",
          body: JSON.stringify(messagePayload),
        });
        setInputText("");
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchConversations(); // Update conversation list
      } else {
        throw new Error("WebSocket not connected");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Không thể gửi tin nhắn.");
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e, receiverId) => {
    if (e.key === "Enter") {
      handleSendMessage(receiverId);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    fetchMessages(conv.otherUserId);
    setIdFriend(conv.otherUserId);
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add emoji to input
  const handleEmojiSelect = () => {
    const emoji = "😊";
    setInputText(inputText + emoji);
  };

  // Format timestamp
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
    <div className="chatContainer">
      {/* Conversation list (left sidebar) */}
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
                  <p className="conversationMessage">
                    {(() => {
                      try {
                        const msg = JSON.parse(conv.lastMessage);
                        if (msg.type === "post") return "Tin nhắn chia sẻ";
                        return msg.content || "Chưa có tin nhắn";
                      } catch {
                        return conv.lastMessage || "Chưa có tin nhắn";
                      }
                    })()}
                  </p>
                </div>
                <span className="conversationTime">{formatTimestamp(new Date())}</span>
              </li>
            ))
          ) : (
            <li className="noConversations">Chưa có cuộc hội thoại nào</li>
          )}
        </ul>
      </div>

      {/* Conversation details (right panel) */}
      <div className="chatMain">
        {selectedConversation ? (
          <>
            <div className="chatMainHeader">
              <div className="chatMainUserInfo">
                <Link to={`/visitfriend/${IdFriend}`} className="sidebarProfilePost">
                  <img
                    src={`/uploads/avatar/${selectedConversation.avatarUrl}`}
                    alt="User"
                    className="chatMainAvatar"
                    onError={(e) => (e.target.src = "/assets/person/default.jpeg")}
                  />
                </Link>
                <div>
                  <h3>{selectedConversation.otherUserName}</h3>
                  <span className="chatMainStatus">Hoạt động 5 phút trước</span>
                </div>
              </div>
              <div className="chatMainIcons">
                <Info className="chatMainIcon" />
              </div>
            </div>
            <div className="chatMessages" ref={chatBodyRef}>
              {messages.length > 0 ? (
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
                      {/* Avatar of the receiver (received) */}
                      {message.sender === "received" && (
                        <img
                          src={`/uploads/avatar/${selectedConversation.avatarUrl}`}
                          alt="User"
                          className="messageAvatar"
                          onError={(e) => (e.target.src = "/assets/person/default.jpeg")}
                        />
                      )}
                      {/* Message content */}
                      <div className={`messageContent ${message.sender}`}>
                        {message.content && message.content.type === "post" ? (
                          <MiniPost postData={message.content.post} />
                        ) : (
                          <>
                            <p>{message.content?.content || "Tin nhắn không hợp lệ"}</p>
                            <span className="messageTime">{formatTimestamp(message.timestamp)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có tin nhắn nào</p>
              )}
            </div>
            <div className="chatInput">
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              <Image
                className="chatInputIcon"
                onClick={() => fileInputRef.current.click()}
              />
              <SentimentSatisfied
                className="chatInputIcon"
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
                        ×
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    className="message-input"
                    placeholder="Aa"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, selectedConversation.otherUserId)}
                  />
                </div>
              </div>
              <Send
                className="chatInputIcon sendIcon"
                onClick={() => handleSendMessage(selectedConversation.otherUserId)}
              />
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