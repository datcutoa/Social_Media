import "./messagesPopup.css";

export default function MessagesPopup({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="popupContainer">
      <div className="popupHeader">
        <h3>Tin nhắn</h3>
        <button onClick={onClose} className="closeButton">X</button>
      </div>
      <ul className="popupList">
        <li className="popupItem">
          <img src="/assets/person/2.jpeg" alt="User" className="popupAvatar" />
          <div className="popupText">
            <span className="popupUser">Người dùng A</span>
            <p className="popupMessage">Xin chào!</p>
          </div>
        </li>
        <li className="popupItem">
          <img src="/assets/person/3.jpeg" alt="User" className="popupAvatar" />
          <div className="popupText">
            <span className="popupUser">Người dùng B</span>
            <p className="popupMessage">Bạn đang làm gì?</p>
          </div>
        </li>
      </ul>
    </div>
  );
}