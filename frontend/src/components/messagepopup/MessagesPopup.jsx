import "./messagesPopup.css";

export default function MessagesPopup({ isOpen, conversations, onClose, onOpenChat }) {
  if (!isOpen) return null;

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const handleOpenChat = (conv) => {
    const user = {
      id: conv.otherUserId,
      fullName: conv.otherUserName,
      profilePicture: conv.avatarUrl,
    };
    onOpenChat(user); // Gọi hàm từ Topbar để mở Chat
    onClose(); // Đóng popup
  };

  return (
    <div className="popupContainer">
      <div className="popupHeader">
        <h3>Tin nhắn</h3>
      </div>
      <ul className="popupList">
        {conversations.length > 0 ? (
          conversations.map((conv, index) => (
            <li
              key={index}
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
              {/* <div className="popupText">
                <span className="popupUser">{conv.otherUserName}</span>
                <p className="popupMessage">
                  {conv.lastSenderId === userId ? `Bạn: ${conv.lastMessage}` : `${conv.otherUserName}: ${conv.lastMessage}`}
                </p>
              </div> */}
             <div className="popupText">
            <span className="popupUser">{conv.otherUserName}</span>
            <p className="popupMessage">
              {(() => {
                let messageText = "Chưa có tin nhắn";
                try {
                  const msg = JSON.parse(conv.lastMessage);
                  if (msg.type === "post") {
                    messageText = "Tin nhắn chia sẻ";
                  } else {
                    messageText = msg.content || "Chưa có tin nhắn";
                  }
                } catch {
                  messageText = conv.lastMessage || "Chưa có tin nhắn";
                }

                return conv.senderId === userId ? (
                  `Bạn: ${messageText}`
                ) : (
                  <><strong className="popupMessageBold">{messageText}</strong></>
                );
              })()}
            </p>
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