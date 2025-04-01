    import React, { useState, useEffect, useRef } from 'react';
    import './chat.css';
    import { FaTimes } from "react-icons/fa";
    import { RiSubtractLine } from "react-icons/ri";

    const Chat = ({ userName, profilePic, onClose }) => {
    const [messages, setMessages] = useState([
        {
        id: 1,
        text: 'nhắn vô icn mess\nnữa',
        type: 'received',
        time: 'Đã gửi',
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [unreadCount, setUnreadCount] = useState(5);
    const chatBodyRef = useRef(null);

    useEffect(() => {
        if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage = {
        id: messages.length + 1,
        text: inputText,
        type: 'sent',
        time: 'Đã gửi',
        };

        setMessages([...messages, newMessage]);
        setInputText('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
        handleSendMessage();
        }
    };

    const handleMaximize = () => {
        setIsMinimized(false);
        setUnreadCount(0);
    };

    return (
        <>
        {isMinimized ? (
            <div className="minimized-chat-icon" onClick={handleMaximize}>
            <img
                src={profilePic || 'https://via.placeholder.com/40'}
                alt="Profile Picture"
                className="minimized-pic"
            />
            <span className="online-dot"></span>
            {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
            )}
            </div>
        ) : (
            <div className="chat-container">
            <div className="chat-header">
                <div className="header-info">
                <img
                    src={profilePic || 'https://via.placeholder.com/40'}
                    alt="Profile Picture"
                    className="profile-pic"
                />
                <div>
                    <h3>{userName || ''}</h3>
                    <p>Đang hoạt động</p>
                </div>
                </div>
                <div className="header-actions">
                <button title="Thu nhỏ đoạn chat" className="minimize-btn" onClick={() => setIsMinimized(true)}>
                    <RiSubtractLine />
                </button>
                <button title="Đóng đoạn chat" className="close-btn" onClick={onClose}>
                    <FaTimes />
                </button>
                </div>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
                {messages.map((message) => (
                <div key={message.id} className={`message ${message.type}`}>
                    {message.type === 'received' && (
                    <img
                        src={profilePic || 'https://via.placeholder.com/24'}
                        alt="Profile Picture"
                        className="message-pic"
                    />
                    )}
                    <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">{message.time}</span>
                    </div>
                </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                type="text"
                className="message-input"
                placeholder="Aa"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                />
                <button className="send-btn" onClick={handleSendMessage}>
                Gửi
                </button>
            </div>
            </div>
            )}
        </>
        );
    };

    export default Chat;