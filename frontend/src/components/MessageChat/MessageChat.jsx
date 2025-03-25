// MessageChat.jsx
import { useState, useEffect, useRef } from "react";
import "./messageChat.css";

export default function MessageChat({ user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Danh sách tin nhắn mẫu (có thể thay bằng API thực tế)
  const initialMessages = [
    { id: 1, text: "Hi there!", sender: "me", timestamp: new Date() },
    { id: 2, text: "Hello! How are you?", sender: user.id, timestamp: new Date() },
  ];

  // Scroll đến tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load tin nhắn ban đầu
    setMessages(initialMessages);
    scrollToBottom();
  }, [user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Giả lập reply từ user sau 1 giây
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        text: "Thanks for your message!",
        sender: user.id,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  return (
    <div className="messageChat">
      <div className="chatHeader">
        <div className="chatUserInfo">
          <span className="onlineDot"></span>
          <span className="chatUserName">{user.name}</span>
        </div>
        <button className="closeButton" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="chatMessages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === "me" ? "messageSent" : "messageReceived"
            }`}
          >
            <div className="messageContent">
              <p>{message.text}</p>
              <span className="messageTime">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatInput" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message ${user.name}...`}
          className="messageInputField"
        />
        <button type="submit" className="sendButton">
          Send
        </button>
      </form>
    </div>
  );
}